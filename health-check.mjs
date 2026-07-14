#!/usr/bin/env node
/**
 * health-check.mjs — 线上站点可用性健康检查（P3 监控仪表盘的自建部分）
 *
 * 作用：对已部署到 GitHub Pages 的每一个站点发起 HTTP 请求，断言：
 *   1) HTTP 状态码 200
 *   2) 响应体非空
 *   3) 含 React 挂载点 `<div id="root"`（构建产物特征，缺失=部署残缺）
 *   4) 含非空 <title>（SEO 注入成功特征）
 * 任一站点不满足 → 汇总后退出码 1，便于 GitHub Actions 定时任务据此自动开 Issue。
 *
 * 站点清单以 build-clean.sh 的 PROJS 为唯一事实源（与 validate-sites.mjs 一致），
 * 各站线上地址 = <BASE_URL>/<slug>/，slug 取自 examples/<proj>.json（与构建推导一致）。
 *
 * 用法：
 *   node health-check.mjs                       # 用默认 BASE_URL 检查全部站点
 *   BASE_URL=https://xxx.github.io/demo-sites node health-check.mjs
 *   node health-check.mjs --json                # 额外输出 JSON 结果（供看板/通知消费）
 *
 * 依赖：Node 18+ 全局 fetch（本项目 CI 用 Node 22）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = (process.env.BASE_URL || 'https://lcclicheng.github.io/demo-sites').replace(/\/+$/, '');
const OUT_JSON = process.argv.includes('--json');
const TIMEOUT_MS = Number(process.env.HEALTH_TIMEOUT_MS || 15000);

/** 从 build-clean.sh 解析 PROJS（单一事实源） */
function loadProjList() {
  const sh = fs.readFileSync(path.join(__dirname, 'build-clean.sh'), 'utf-8');
  const m = sh.match(/PROJS=\(\s*([^)]*)\)/);
  if (!m) throw new Error('无法从 build-clean.sh 解析 PROJS 列表');
  return m[1].split(/\s+/).filter(Boolean);
}

/** 与 build-clean.sh / generate.mjs 一致的 slug 推导 */
function toSlug(d) {
  return (d.slug || d.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** 带超时的 fetch */
async function fetchWithTimeout(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    const body = await res.text();
    return { status: res.status, body };
  } finally {
    clearTimeout(t);
  }
}

function checkBody(body) {
  const problems = [];
  if (!body || body.length < 200) problems.push('响应体过短/为空');
  if (!/<div\s+id=["']root["']/.test(body)) problems.push('缺 React 挂载点 <div id="root">');
  const titleMatch = body.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) problems.push('缺非空 <title>（SEO 注入可能失败）');
  return problems;
}

const projs = loadProjList();
const results = [];

console.log(`🩺 线上健康检查：${projs.length} 个站点 @ ${BASE_URL}\n`);

for (const proj of projs) {
  const jsonPath = path.join(__dirname, 'examples', `${proj}.json`);
  let slug = proj;
  try {
    const d = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    slug = toSlug(d) || proj;
  } catch {
    /* 读不到就退回用 proj 名，下面请求若 404 会被记录 */
  }
  const url = `${BASE_URL}/${slug}/`;
  const entry = { proj, slug, url, ok: false, status: 0, problems: [] };
  try {
    const { status, body } = await fetchWithTimeout(url);
    entry.status = status;
    if (status !== 200) {
      entry.problems.push(`HTTP ${status}`);
    } else {
      entry.problems = checkBody(body);
    }
    entry.ok = entry.problems.length === 0;
  } catch (e) {
    entry.problems.push(`请求失败：${e.name === 'AbortError' ? `超时 >${TIMEOUT_MS}ms` : e.message}`);
  }
  results.push(entry);
  console.log(`  ${entry.ok ? '✅' : '❌'} ${slug.padEnd(18)} ${entry.status || '---'}  ${entry.ok ? 'OK' : entry.problems.join('; ')}`);
}

const failed = results.filter(r => !r.ok);

if (OUT_JSON) {
  fs.writeFileSync(
    path.join(__dirname, 'health-report.json'),
    JSON.stringify({ checkedAt: new Date().toISOString(), baseUrl: BASE_URL, total: results.length, failed: failed.length, results }, null, 2)
  );
  console.log('\n📝 已写出 health-report.json');
}

if (failed.length) {
  console.error(`\n❌ ${failed.length}/${results.length} 个站点异常：`);
  for (const f of failed) console.error(`  • ${f.slug} (${f.url}) — ${f.problems.join('; ')}`);
  process.exit(1);
}

console.log(`\n✅ 全部 ${results.length} 个站点健康（200 + 挂载点 + title）。`);
