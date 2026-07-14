/**
 * onboard.mjs — 站点接入 Onboarding 本地服务（无外部依赖）
 *
 * 用途：替客户填表 → 上传实景图 → 生成 examples/<slug>.json → 自动构建单站 → 本地预览
 * 启动：node onboard.mjs   （默认端口 4321，可用 PORT 环境变量覆盖）
 * 打开：http://localhost:4321/
 *
 * 接口：
 *   GET  /api/templates        → 列出 examples/*.json（含 name/template/slug）
 *   GET  /api/example?file=x   → 读取并返回某个示例 JSON
 *   GET  /api/site-images?slug=x → 列出 assets/<slug>/ 下已有图片
 *   POST /api/upload           → body: { slug, renameSeq(bool), images:[{name, data(base64)}] }
 *                                 写入 assets/<slug>/ 下，返回保存文件清单
 *   POST /api/generate         → body: { data }，写入 examples/<slug>.json，
 *                                 自动建 assets/<slug>/ 目录、跑单站构建，返回构建结果+预览URL+部署提示
 *   GET  /preview/:slug/*      → 静态预览 output/<slug>/dist（SPA fallback 到 index.html）
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = path.join(__dirname, 'examples');
const ASSETS_DIR = path.join(__dirname, 'assets');
const OUTPUT_DIR = path.join(__dirname, 'output');
const PORT = process.env.PORT || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}
function sendJSON(res, status, obj) {
  send(res, status, JSON.stringify(obj), { 'Content-Type': MIME['.json'] });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 32 * 1024 * 1024) reject(new Error('body too large (>32MB)'));
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function slugify(name) {
  return (
    (name || '')
      .toLowerCase()
      .trim()
      .replace(/['’]s\b/g, 's')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'site'
  );
}

// 自动把新站点 slug 写入 build-clean.sh 的 PROJS（消除「部署前忘了加 PROJS」的人为遗漏）
function ensureProjInBuildClean(slug) {
  const bc = path.join(__dirname, 'build-clean.sh')
  if (!fs.existsSync(bc)) return { added: false, detail: 'build-clean.sh 不存在' }
  const content = fs.readFileSync(bc, 'utf-8')
  const m = content.match(/PROJS=\(([^)]*)\)/)
  if (!m) return { added: false, detail: 'PROJS 数组未找到' }
  const items = m[1].split(/\s+/).filter(Boolean)
  if (items.includes(slug)) return { added: false, detail: '已存在于 PROJS' }
  items.push(slug)
  fs.writeFileSync(bc, content.replace(/PROJS=\([^)]*\)/, `PROJS=( ${items.join(' ')} )`), 'utf-8')
  return { added: true, detail: `已自动加入 PROJS: ${slug}` }
}

// 列出可用模板（排除明显是测试/批处理的文件）
const SKIP = new Set(['batch-sample.json', 'test-new-templates.json', 'profix-test.json']);

function listTemplates() {
  if (!fs.existsSync(EXAMPLES_DIR)) return [];
  return fs
    .readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith('.json') && !SKIP.has(f))
    .map((f) => {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(EXAMPLES_DIR, f), 'utf-8'));
        return {
          file: f,
          name: d.name || f,
          template: d.template || 'restaurant',
          slug: d.slug || slugify(d.name || f),
        };
      } catch {
        return { file: f, name: f, template: '?', slug: '?' };
      }
    });
}

// 安全文件名：只保留 basename，去掉目录，限定合法字符 + 图片扩展名
function safeImageName(name) {
  const base = path.basename(String(name || '')).replace(/[^A-Za-z0-9._-]/g, '_');
  if (!/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(base)) return null;
  return base;
}

// 解码 data URL / 纯 base64 → Buffer
function decodeB64(data) {
  let s = String(data || '');
  const comma = s.indexOf(',');
  if (comma >= 0 && s.slice(0, comma).includes('base64')) s = s.slice(comma + 1);
  return Buffer.from(s, 'base64');
}

function serveStatic(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/onboarding.html';
  const filePath = path.join(__dirname, path.normalize(urlPath));
  if (!filePath.startsWith(__dirname)) return send(res, 403, 'forbidden');
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return send(res, 404, 'not found');
  }
  const ext = path.extname(filePath);
  send(res, 200, fs.readFileSync(filePath), { 'Content-Type': MIME[ext] || 'application/octet-stream' });
}

// 预览：从 output/<slug>/dist 提供静态文件，SPA fallback 到 index.html
function servePreview(req, res, slug, rest) {
  const distDir = path.join(OUTPUT_DIR, slug, 'dist');
  if (!fs.existsSync(distDir)) {
    return send(
      res,
      404,
      `尚未构建该站点的预览产物。请先在接入工具中点击「生成」完成单站构建，或运行：node generate.mjs ./examples/${slug}.json`,
      { 'Content-Type': 'text/plain; charset=utf-8' }
    );
  }
  let rel = decodeURIComponent(rest || '');
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  const filePath = path.join(distDir, path.normalize(rel));
  if (!filePath.startsWith(distDir)) return send(res, 403, 'forbidden');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    return send(res, 200, fs.readFileSync(filePath), { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  }
  // SPA fallback
  const idx = path.join(distDir, 'index.html');
  if (fs.existsSync(idx)) return send(res, 200, fs.readFileSync(idx), { 'Content-Type': MIME['.html'] });
  return send(res, 404, 'not found');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  // 预览路由
  const prev = p.match(/^\/preview\/([^/]+)(\/.*)?$/);
  if (prev) return servePreview(req, res, prev[1], prev[2] || '');

  // 静态资源
  if (req.method === 'GET' && (p === '/' || p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.css'))) {
    return serveStatic(req, res);
  }

  // 列出模板
  if (req.method === 'GET' && p === '/api/templates') {
    return sendJSON(res, 200, listTemplates());
  }

  // 读取某个示例
  if (req.method === 'GET' && p === '/api/example') {
    const file = url.searchParams.get('file');
    if (!file || file.includes('..') || !file.endsWith('.json')) return send(res, 400, 'bad file');
    const fp = path.join(EXAMPLES_DIR, file);
    if (!fs.existsSync(fp)) return send(res, 404, 'not found');
    return send(res, 200, fs.readFileSync(fp), { 'Content-Type': MIME['.json'] });
  }

  // 列出某站点已有图片
  if (req.method === 'GET' && p === '/api/site-images') {
    const slug = slugify(url.searchParams.get('slug') || '');
    const dir = path.join(ASSETS_DIR, slug);
    if (!fs.existsSync(dir)) return sendJSON(res, 200, { slug, images: [] });
    const imgs = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f));
    return sendJSON(res, 200, { slug, images: imgs });
  }

  // 上传图片
  if (req.method === 'POST' && p === '/api/upload') {
    try {
      const body = JSON.parse(await readBody(req));
      const slug = slugify(body.slug);
      if (!slug) return sendJSON(res, 400, { ok: false, error: '缺少有效的 slug' });
      const dir = path.join(ASSETS_DIR, slug);
      fs.mkdirSync(dir, { recursive: true });

      const imgs = Array.isArray(body.images) ? body.images : [];
      const saved = [];
      imgs.forEach((img, i) => {
        let fname = safeImageName(img.name);
        if (body.renameSeq) {
          // 按上传顺序重命名为 screenshot-1.jpg / 2.jpg / 3.jpg ...
          const ext = (fname ? path.extname(fname) : '.jpg').toLowerCase();
          fname = `screenshot-${i + 1}${ext}`;
        }
        if (!fname) return;
        const buf = decodeB64(img.data);
        if (!buf.length) return;
        fs.writeFileSync(path.join(dir, fname), buf);
        saved.push(fname);
      });

      if (!saved.length) return sendJSON(res, 400, { ok: false, error: '没有有效的图片被保存' });
      return sendJSON(res, 200, { ok: true, slug, dir, saved });
    } catch (e) {
      return sendJSON(res, 500, { ok: false, error: String(e.message || e) });
    }
  }

  // 生成并写入 + 自动单站构建
  if (req.method === 'POST' && p === '/api/generate') {
    try {
      const raw = await readBody(req);
      const { data } = JSON.parse(raw);
      if (!data || typeof data !== 'object') return sendJSON(res, 400, { ok: false, error: 'invalid data' });

      const slug = slugify(data.slug || data.name);
      data.slug = slug;
      const outFile = `${slug}.json`;
      const outPath = path.join(EXAMPLES_DIR, outFile);

      fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

      // 自动创建 assets/<slug>/ 目录（图片上传或手动放置都落到这里）
      const assetDir = path.join(ASSETS_DIR, slug);
      let assetsExisted = fs.existsSync(assetDir);
      fs.mkdirSync(assetDir, { recursive: true });
      const existingImgs = fs.existsSync(assetDir)
        ? fs.readdirSync(assetDir).filter((f) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
        : [];

      // 自动跑单站构建（generate.mjs 会写 output/<slug>/dist）
      // 注意：generate.mjs 在 npm install 网络抖动时会抛未捕获异常并以 exit 1 退出，
      // 因此 buildOk 以「dist/index.html 是否真实生成」为准，并对瞬时失败重试一次。
      const buildEnv = { ...process.env };
      delete buildEnv.CODEBUDDY_SESSION_ID;
      delete buildEnv.CLAUDE_SESSION_ID;
      const distPath = path.join(OUTPUT_DIR, slug, 'dist', 'index.html');
      let build = { status: null, stdout: '', stderr: '' };
      for (let attempt = 1; attempt <= 2; attempt++) {
        build = spawnSync(process.execPath, ['generate.mjs', `./examples/${outFile}`], {
          cwd: __dirname,
          env: buildEnv,
          encoding: 'utf-8',
          maxBuffer: 64 * 1024 * 1024,
          timeout: 300000,
        });
        if (fs.existsSync(distPath)) break;
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 2000));
          console.warn(`[onboard] 第1次构建未产出 dist（exit ${build.status}），2s 后重试…`);
        }
      }
      const buildOk = fs.existsSync(distPath);
      const buildLog = (build.stdout || '') + (build.stderr || '');
      const buildTail = buildLog.split('\n').slice(-25).join('\n').trim();
      const distReady = buildOk;
      const projResult = ensureProjInBuildClean(slug);

      // 是否含 screenshots 区块（用于提示图片命名）
      const hasScreenshots = Array.isArray(data.screenshots) && data.screenshots.length > 0;
      const referencedImgs = (JSON.stringify(data).match(/\.\/images\/([A-Za-z0-9_.\-]+)/g) || []).map(
        (s) => s.replace('./images/', '')
      );
      const missingImgs = referencedImgs.filter((r) => !existingImgs.includes(r));

      return sendJSON(res, 200, {
        ok: true,
        file: outFile,
        slug,
        path: outPath,
        assetsDir: assetDir,
        assetsExisted,
        existingImgs,
        buildOk,
        buildExit: build.status,
        distReady,
        buildTail,
        hasScreenshots,
        missingImgs,
        previewUrl: `/preview/${slug}/`,
        projAutoAdded: projResult.added,
        projDetail: projResult.detail,
        deployHint: `git add -u && git commit -m "feat: add ${slug}" && git push origin main`,
        noteProjs: projResult.added
          ? `已自动把 "${slug}" 加入 build-clean.sh 的 PROJS，Actions 会构建/部署该站。直接部署即可。`
          : `部署前请确认 "${slug}" 已在 build-clean.sh 的 PROJS 中（${projResult.detail}）。`,
      });
    } catch (e) {
      return sendJSON(res, 500, { ok: false, error: String(e.message || e) });
    }
  }

  send(res, 404, 'not found');
});

server.listen(PORT, () => {
  console.log(`\n  站点接入 Onboarding 已启动`);
  console.log(`  ➜  打开: http://localhost:${PORT}/\n`);
  console.log(`  模板目录: ${EXAMPLES_DIR}`);
  console.log(`  资源目录: ${ASSETS_DIR}`);
  console.log(`  构建预览: http://localhost:${PORT}/preview/<slug>/\n`);
});
