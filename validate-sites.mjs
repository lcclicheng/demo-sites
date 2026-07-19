#!/usr/bin/env node
/**
 * ⚠️⚠️⚠️ 维护者必读 ⚠️⚠️⚠️
 * 本闸门以 build-clean.sh 里的 PROJS 数组为「要构建/校验的站点」唯一事实源。
 * 新增 / 改名 / 删除一个站点，必须同步修改 build-clean.sh 的 PROJS 数组，
 * 否则会出现「JSON 改了却没部署」或「部署了却没校验」的隐性不一致。
 * 本脚本会在校验结束后扫描 examples/ 下「具备 template+slug 但未纳入 PROJS」
 * 的孤儿 JSON：默认【软阻断】（exit 1，令 Actions job 失败，fail-fast）；
 * 仅在显式 --allow-orphans（或 deploy.yml 经 workflow_dispatch 勾选 allow_orphans）时放行。
 * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
 *
 * validate-sites.mjs — 部署前自检闸门（关闭「三.2 部署前自检闸门」缺口）
 *
 * 校验 build-clean.sh 中 PROJS 列表指向的每一个站点 JSON：
 *   1) 合法 JSON（无语法错误）
 *   2) 必填字段 name / slug / template 齐全且合规
 *   3) 引用的 ./images/* 文件在 assets/<slug>/ 下真实存在
 *      （generate.mjs 在 assets 目录缺失时会静默跳过拷贝，
 *       导致「构建成功但页面缺图」，此检查专门拦截这种情况）
 *
 * 任一不满足 → 退出码 1，阻断 GitHub Actions 的后续构建/部署。
 * 也可本地运行 `node validate-sites.mjs` 做 push 前自检
 * （孤儿默认阻断；临时放行：`node validate-sites.mjs --allow-orphans`）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KNOWN_TEMPLATES = new Set([
  'restaurant', 'coffee', 'salon', 'dessert',
  'yoga', 'law', 'hotel', 'trades',
  'sectioned' // 步骤6 Section Engine 组合器模板（theme-agnostic 通用 section 库）
]);
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

/** 从 build-clean.sh 解析 PROJS 列表，作为「要构建/校验的站点」单一事实源 */
function loadProjList() {
  const sh = fs.readFileSync(path.join(__dirname, 'build-clean.sh'), 'utf-8');
  const m = sh.match(/PROJS=\(\s*([^)]*)\)/);
  if (!m) throw new Error('无法从 build-clean.sh 解析 PROJS 列表');
  return m[1].split(/\s+/).filter(Boolean);
}

const errors = [];
const projs = loadProjList();
const projSet = new Set(projs);

// ── 重复构建目标检测（#277：双事实源 PROJS↔slug 的隐性冲突）──
// 两个不同 PROJS 项若解析出相同 projectName（即 output/<name>/ 相同），
// 会构建到同一目录互相覆盖，线上只会保留一个站点，另一个「凭空消失」。
// 此处拦截：不仅比较 slug，也按 generate.mjs 的规则 (slug||name) 归一化后比较，
// 以覆盖「slug 不同但归一名相同」的边界情况。
const normName = (d) => ((d.slug || d.name) || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const nameToProjs = new Map();
for (const f of projs) {
  const file = path.join(__dirname, 'examples', `${f}.json`);
  if (!fs.existsSync(file)) continue;
  let dd;
  try { dd = JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { continue; }
  const pn = normName(dd);
  if (!pn) continue;
  if (!nameToProjs.has(pn)) nameToProjs.set(pn, []);
  nameToProjs.get(pn).push(f);
}
for (const [pn, list] of nameToProjs) {
  if (list.length > 1) {
    errors.push(`重复构建目标 output/${pn}/ ：PROJS 项 [${list.join(', ')}] 解析出相同 projectName（slug 或 name 冲突）→ 会互相覆盖，线上只剩一个站点`);
  }
}

/**
 * 孤儿站点自动发现（软阻断 / 可 override）
 * 扫描 examples/*.json，找出「同时具备 template + 非空 slug」但未纳入
 * build-clean.sh PROJS 的 JSON —— 它们看起来应被部署，却不会出现在构建里。
 * 默认在文件末尾软阻断（exit 1，令 Actions 失败）；除非 --allow-orphans。
 * （batch-sample / profix-test / test-new-templates 等测试夹具因 slug 为空被排除）
 */
const examplesDir = path.join(__dirname, 'examples');
const orphanWarnings = [];
for (const jf of fs.readdirSync(examplesDir).filter(f => f.endsWith('.json'))) {
  const fp = path.join(examplesDir, jf);
  let dd;
  try { dd = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { continue; }
  const looksDeployable =
    typeof dd.template === 'string' && KNOWN_TEMPLATES.has(dd.template) &&
    typeof dd.slug === 'string' && dd.slug.trim();
  if (looksDeployable && !projSet.has(jf.replace(/\.json$/, ''))) {
    orphanWarnings.push(`${jf} (slug=${dd.slug}, template=${dd.template})`);
  }
}

console.log(`🔍 校验 ${projs.length} 个站点 JSON ...\n`);

for (const f of projs) {
  const file = path.join(__dirname, 'examples', `${f}.json`);
  if (!fs.existsSync(file)) {
    errors.push(`${f}: 缺少 examples/${f}.json`);
    continue;
  }

  // 1) JSON 合法性
  let d;
  try {
    d = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    errors.push(`${f}: JSON 解析失败 — ${e.message}`);
    continue;
  }

  // 2a) name
  if (typeof d.name !== 'string' || !d.name.trim()) {
    errors.push(`${f}: 缺少 name（站点名称）`);
  }

  // 2b) slug
  if (typeof d.slug !== 'string' || !d.slug.trim()) {
    errors.push(`${f}: 缺少 slug（决定线上地址 /demo-sites/<slug>/）`);
  } else if (!SLUG_RE.test(d.slug)) {
    errors.push(`${f}: slug "${d.slug}" 不合规（需小写字母/数字/连字符，如 sotto-sotto）`);
  }

  // 2c) template
  if (typeof d.template !== 'string' || !KNOWN_TEMPLATES.has(d.template)) {
    errors.push(`${f}: template "${d.template ?? ''}" 非法或缺失（可选: ${[...KNOWN_TEMPLATES].join('/')}）`);
  }

  // 3) 图片引用是否真实存在
  const slug = d.slug || '';
  const assetDir = path.join(__dirname, 'assets', slug);
  const have = fs.existsSync(assetDir) ? new Set(fs.readdirSync(assetDir)) : new Set();
  const raw = fs.readFileSync(file, 'utf-8');
  const refs = raw.match(/\.\/images\/[A-Za-z0-9_.\-]+/g) || [];
  for (const r of refs) {
    const fn = r.replace('./images/', '');
    if (!have.has(fn)) {
      errors.push(`${f}: 引用图片 ./images/${fn}，但 assets/${slug}/${fn} 不存在（构建会静默缺图）`);
    }
  }
}

if (errors.length) {
  console.error(`\n❌ 校验未通过，共 ${errors.length} 项问题：\n`);
  for (const e of errors) console.error('  • ' + e);
  console.error('\n部署已阻断。请修复上述问题后重新 push。');
  process.exit(1);
}

// ── 孤儿站点软阻断（在 errors 之后处理；fail-fast）──
// 默认任一孤儿即 exit 1，令 Actions job 失败，避免「忘了加 PROJS 直接 push 漏部署」；
// 显式 --allow-orphans（或 deploy.yml workflow_dispatch 勾选 allow_orphans）时放行。
const allowOrphans = process.argv.includes('--allow-orphans');
if (orphanWarnings.length && !allowOrphans) {
  console.error(`\n⚠️ 发现 ${orphanWarnings.length} 个 examples/ 下「具备 template+slug 但未纳入 PROJS」的 JSON，将不会被构建/部署（软阻断）：`);
  for (const o of orphanWarnings) console.error('  • ' + o);
  console.error('\n请确认它们是否应被部署：若应部署，加入 build-clean.sh 的 PROJS 数组；若确认临时放行，可加 --allow-orphans（或 workflow_dispatch 勾选 allow_orphans）。部署已阻断。');
  process.exit(1);
}
if (orphanWarnings.length && allowOrphans) {
  console.warn(`\nℹ️ 发现 ${orphanWarnings.length} 个孤儿站点，但已 --allow-orphans 放行（不阻断）。建议事后补入 PROJS：`);
  for (const o of orphanWarnings) console.warn('  • ' + o);
}

console.log('✅ 全部站点 JSON 校验通过，可安全构建部署。');
