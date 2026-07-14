#!/usr/bin/env node
/**
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
 * 也可本地运行 `node validate-sites.mjs` 做 push 前自检。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KNOWN_TEMPLATES = new Set([
  'restaurant', 'coffee', 'salon', 'dessert',
  'yoga', 'law', 'hotel', 'trades'
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

console.log('✅ 全部站点 JSON 校验通过，可安全构建部署。');
