/**
 * onboard.mjs — 站点接入 Onboarding 本地服务（无外部依赖）
 *
 * 用途：替客户填表 → 生成 examples/<slug>.json → 给出构建/部署命令
 * 启动：node onboard.mjs   （默认端口 4321，可用 PORT 环境变量覆盖）
 * 打开：http://localhost:4321/
 *
 * 接口：
 *   GET  /api/templates        → 列出 examples/*.json（含 name/template/slug）
 *   GET  /api/example?file=x   → 读取并返回某个示例 JSON
 *   POST /api/generate         → body: { file, data }，写入 examples/<slug>.json
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = path.join(__dirname, 'examples');
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 8 * 1024 * 1024) reject(new Error('body too large'));
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

function serveStatic(req, res) {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/onboarding.html';
  const filePath = path.join(__dirname, path.normalize(urlPath));
  // 防目录穿越
  if (!filePath.startsWith(__dirname)) return send(res, 403, 'forbidden');
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return send(res, 404, 'not found');
  }
  const ext = path.extname(filePath);
  send(res, 200, fs.readFileSync(filePath), { 'Content-Type': MIME[ext] || 'application/octet-stream' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // 静态资源
  if (req.method === 'GET' && url.pathname === '/') return serveStatic(req, res);
  if (req.method === 'GET' && (url.pathname.endsWith('.html') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
    return serveStatic(req, res);
  }

  // 列出模板
  if (req.method === 'GET' && url.pathname === '/api/templates') {
    return send(res, 200, JSON.stringify(listTemplates()), { 'Content-Type': MIME['.json'] });
  }

  // 读取某个示例
  if (req.method === 'GET' && url.pathname === '/api/example') {
    const file = url.searchParams.get('file');
    if (!file || file.includes('..') || !file.endsWith('.json')) return send(res, 400, 'bad file');
    const fp = path.join(EXAMPLES_DIR, file);
    if (!fs.existsSync(fp)) return send(res, 404, 'not found');
    return send(res, 200, fs.readFileSync(fp), { 'Content-Type': MIME['.json'] });
  }

  // 生成并写入
  if (req.method === 'POST' && url.pathname === '/api/generate') {
    try {
      const raw = await readBody(req);
      const { data } = JSON.parse(raw);
      if (!data || typeof data !== 'object') return send(res, 400, 'invalid data');

      const slug = slugify(data.slug || data.name);
      data.slug = slug;
      const outFile = `${slug}.json`;
      const outPath = path.join(EXAMPLES_DIR, outFile);

      // 安全：不覆盖已存在的不同站点（同名 slug 视为更新，允许覆盖）
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');

      // 同时把截图占位同步逻辑提示返回（实际图片由用户放到 assets/<slug>/）
      return send(
        res,
        200,
        JSON.stringify({
          ok: true,
          file: outFile,
          slug,
          path: outPath,
          buildCmd: `bash build-clean.sh`,
          previewCmd: `node generate.mjs ./examples/${outFile}`,
          deployHint: `git add -A && git commit -m "feat: add ${slug}" && git push origin main`,
        }),
        { 'Content-Type': MIME['.json'] }
      );
    } catch (e) {
      return send(res, 500, JSON.stringify({ ok: false, error: String(e.message || e) }), {
        'Content-Type': MIME['.json'],
      });
    }
  }

  send(res, 404, 'not found');
});

server.listen(PORT, () => {
  console.log(`\n  站点接入 Onboarding 已启动`);
  console.log(`  ➜  打开: http://localhost:${PORT}/\n`);
  console.log(`  模板目录: ${EXAMPLES_DIR}\n`);
});
