#!/usr/bin/env node
/**
 * gen-seo.mjs — 生成 SEO 索引文件（sitemap.xml + robots.txt）
 *
 * 单一事实源：从 build-clean.sh 的 PROJS 数组解析「要构建的站点」，
 * 再逐个读 examples/<proj>.json 取 slug（与 build-clean.sh 的部署目录推导规则一致），
 * 输出到 public/（Actions 组装目录，部署后即站点根 /demo-sites/）。
 *
 * 用法：
 *   node gen-seo.mjs                # 写入 public/sitemap.xml + public/robots.txt
 *   SITE_BASE_URL=https://x.co.uk node gen-seo.mjs   # 自定义域名场景
 *
 * 注意：public/ 在 .gitignore，属部署产物，不必提交。
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

// ── 1) 从 build-clean.sh 解析 PROJS（单一事实源）──
const buildCleanPath = path.join(root, 'build-clean.sh')
if (!fs.existsSync(buildCleanPath)) {
  console.error('❌ 找不到 build-clean.sh，无法解析 PROJS')
  process.exit(1)
}
const buildClean = fs.readFileSync(buildCleanPath, 'utf-8')
const m = buildClean.match(/PROJS=\(([^)]*)\)/)
if (!m) {
  console.error('❌ 无法从 build-clean.sh 解析 PROJS 数组')
  process.exit(1)
}
const PROJS = m[1].split(/\s+/).map((s) => s.trim()).filter(Boolean)

// ── 2) 计算部署 slug（与 build-clean.sh 推导规则一致）──
function slugOf(file) {
  const p = path.join(root, 'examples', `${file}.json`)
  if (!fs.existsSync(p)) return null
  let d
  try {
    d = JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {
    return null
  }
  const raw = d.slug || d.name || file
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const BASE = (process.env.SITE_BASE_URL || 'https://lcclicheng.github.io/demo-sites').replace(/\/$/, '')

// ── 3) 收集 URL ──
const urls = [{ loc: `${BASE}/`, priority: '0.8' }]
for (const proj of PROJS) {
  const slug = slugOf(proj)
  if (!slug) {
    console.warn(`⚠️  跳过（示例不存在或解析失败）: ${proj}`)
    continue
  }
  urls.push({ loc: `${BASE}/${slug}/`, priority: '0.9' })
}

// ── 4) 生成 sitemap.xml ──
const lastmod = new Date().toISOString().slice(0, 10)
const urlEntries = urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`

// ── 5) 生成 robots.txt ──
const robots = `User-agent: *
Allow: /

Sitemap: ${BASE}/sitemap.xml
`

// ── 6) 写入 public/ ──
const outDir = path.join(root, 'public')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf-8')
fs.writeFileSync(path.join(outDir, 'robots.txt'), robots, 'utf-8')

console.log(`✅ sitemap.xml（${urls.length} 条 URL）+ robots.txt 已生成 → public/`)
console.log(`   BASE = ${BASE}`)
console.log(`   URLs:`)
urls.forEach((u) => console.log(`     • ${u.loc}`))
