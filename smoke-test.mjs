#!/usr/bin/env node
/**
 * smoke-test.mjs — 构建产物冒烟测试（P4 自动化 UI 测试 · 轻量层）
 *
 * 在 build-clean.sh 构建、assemble 组装出 public/ 之后运行，对每个站点校验：
 *   1) public/<slug>/index.html 存在且非空
 *   2) 含 React 挂载点 `<div id="root"`（否则模板注入/构建异常）
 *   3) 含至少一个打包后的 JS 资源引用（<script ... src=".../assets/*.js">）
 *   4) 含非空 <title>（SEO 注入成功）
 * 另校验门户首页 public/index.html 与 CMS 后台 public/admin/index.html 存在。
 *
 * 任一不满足 → 退出码 1，阻断部署（在 deploy.yml Assemble 步骤之后）。
 *
 * 定位：这是「轻量冒烟」，只保证“构建出来的东西不是空壳”。
 * 更重的**视觉回归**（Playwright 截图逐像素对比）留待站点数 > 15 或有真实客户后再上，
 * 见 docs/workflow.md §11。本脚本零外部依赖、跑得快、可本地复现。
 *
 * 用法：
 *   node smoke-test.mjs                 # 默认检查 ./public
 *   PUBLIC_DIR=public node smoke-test.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, process.env.PUBLIC_DIR || 'public');

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

function checkHtml(html) {
  const problems = [];
  if (!html || html.length < 200) problems.push('index.html 过短/为空');
  if (!/<div\s+id=["']root["']/.test(html)) problems.push('缺 React 挂载点 <div id="root">');
  if (!/<script[^>]+src=["'][^"']*\.js["']/i.test(html)) problems.push('缺打包 JS 资源引用');
  const title = html.match(/<title>([^<]*)<\/title>/i);
  if (!title || !title[1].trim()) problems.push('缺非空 <title>');
  return problems;
}

const errors = [];
const projs = loadProjList();

console.log(`🔎 冒烟测试：${projs.length} 个站点产物 @ ${PUBLIC_DIR}\n`);

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`❌ 找不到 ${PUBLIC_DIR}（是否已运行 build-clean.sh 并组装 public/？）`);
  process.exit(1);
}

// 门户首页
if (!fs.existsSync(path.join(PUBLIC_DIR, 'index.html'))) {
  errors.push('门户 public/index.html 缺失');
} else {
  console.log('  ✅ portal            index.html OK');
}

// CMS 后台（若启用）
const adminIndex = path.join(PUBLIC_DIR, 'admin', 'index.html');
if (fs.existsSync(adminIndex)) {
  console.log('  ✅ admin (CMS)       index.html OK');
} else {
  console.log('  ℹ️ admin (CMS)       未组装（如未启用 CMS，可忽略）');
}

// 各站点
for (const proj of projs) {
  let slug = proj;
  try {
    const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'examples', `${proj}.json`), 'utf-8'));
    slug = toSlug(d) || proj;
  } catch { /* 退回 proj 名 */ }

  const idx = path.join(PUBLIC_DIR, slug, 'index.html');
  if (!fs.existsSync(idx)) {
    errors.push(`${slug}: public/${slug}/index.html 缺失`);
    console.log(`  ❌ ${slug.padEnd(18)} 产物缺失`);
    continue;
  }
  const html = fs.readFileSync(idx, 'utf-8');
  const problems = checkHtml(html);
  if (problems.length) {
    for (const p of problems) errors.push(`${slug}: ${p}`);
    console.log(`  ❌ ${slug.padEnd(18)} ${problems.join('; ')}`);
  } else {
    console.log(`  ✅ ${slug.padEnd(18)} OK`);
  }
}

if (errors.length) {
  console.error(`\n❌ 冒烟测试未通过，共 ${errors.length} 项：`);
  for (const e of errors) console.error('  • ' + e);
  console.error('\n部署已阻断（产物为空壳/缺失）。请检查构建日志 build-logs/。');
  process.exit(1);
}

console.log(`\n✅ 全部产物冒烟通过（挂载点 + JS + title 齐全）。`);
