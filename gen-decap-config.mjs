#!/usr/bin/env node
/**
 * gen-decap-config.mjs — 从 examples/*.json 自动生成 admin/config.yml 的 Decap 字段映射
 *
 * 为什么需要它：Decap CMS 保存时【只写配置里出现的字段】，未在 config 列出的 key 会被丢弃，
 * 若丢弃的是结构性字段（template/slug）会导致构建崩。手工维护 10 个站的字段极易漏。
 * 本脚本递归遍历每个 JSON，按类型推断 widget，生成【完整】字段块，保证 100% 覆盖。
 *
 * 用法：node gen-decap-config.mjs
 * 产物：admin/config.yml（头部手写 + files 自动生成）
 *
 * 注意：生成的 label 由 camelCase 自动 humanize（如 heroCta1 → "Hero Cta 1"），够用；
 *       如需更友好文案，可后续手工微调对应 field 的 label（不影响覆盖正确性）。
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ── 取「要构建的站点」单一事实源（build-clean.sh 的 PROJS） ──
const bc = fs.readFileSync(path.join(__dirname, 'build-clean.sh'), 'utf-8')
const m = bc.match(/PROJS=\(\s*([^)]*)\)/)
if (!m) { console.error('✗ 无法从 build-clean.sh 解析 PROJS'); process.exit(1) }
const PROJS = m[1].split(/\s+/).map(s => s.trim()).filter(Boolean)
console.log(`PROJS (${PROJS.length}): ${PROJS.join(' ')}`)

const EXAMPLES_DIR = path.join(__dirname, 'examples')
const OUT = path.join(__dirname, 'admin', 'config.yml')

// ── 类型推断 ──
function scalarWidget(v) {
  if (typeof v === 'number') return 'number'
  if (typeof v === 'boolean') return 'boolean'
  if (typeof v === 'string') {
    if (v.includes('\n') || v.length > 60) return 'text'
    return 'string'
  }
  return 'string'
}
function humanize(k) {
  // camelCase / snake_case → 可读中文友好标签（保留常见缩写）
  const s = k
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^./, c => c.toUpperCase())
    .trim()
  return s
}
function isRatingKey(k) { return /rating|stars?/i.test(k) }

function inferField(k, v) {
  const label = humanize(k)
  if (Array.isArray(v)) {
    if (v.length === 0) {
      return { name: k, label, widget: 'list', field: { label: '项', widget: 'string' } }
    }
    const first = v[0]
    if (first && typeof first === 'object') {
      // 合并所有元素对象的 key，保证覆盖（避免某元素多了字段被漏）
      const merged = {}
      for (const el of v) if (el && typeof el === 'object') Object.assign(merged, el)
      const sampleKey = Object.keys(first)[0] || 'name'
      return { name: k, label, widget: 'list', summary: `{{fields.${sampleKey}}}`, fields: inferFields(merged) }
    }
    return { name: k, label, widget: 'list', field: { label: '项', widget: scalarWidget(first) } }
  }
  if (v && typeof v === 'object') {
    return { name: k, label, widget: 'object', fields: inferFields(v) }
  }
  // 结构性字段：template / slug 决定构建与部署路径，绝不可让客户在 UI 改动或保存时丢失。
  // 设为 hidden（UI 不可见、但保存时保留原值）+ required: true，彻底防误操作导致构建崩。
  if (k === 'template' || k === 'slug') {
    return { name: k, label: label + '（结构性·勿改）', widget: 'hidden', required: true }
  }
  const w = scalarWidget(v)
  const f = { name: k, label, widget: w }
  if (w === 'number') {
    if (isRatingKey(k)) { f.min = 1; f.max = 5 }
    else { f.min = 0; f.max = 999999 }
  }
  if (w === 'boolean') f.required = false
  return f
}
function inferFields(obj) {
  const fields = []
  for (const [k, v] of Object.entries(obj)) fields.push(inferField(k, v))
  return fields
}

// ── YAML 序列化（手写，避免引入 yaml 依赖） ──
function yamlStr(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
}
function fieldToYaml(f, indent) {
  const pad = ' '.repeat(indent)
  let s = `${pad}- name: ${f.name}\n`
  s += `${pad}  label: ${yamlStr(f.label)}\n`
  s += `${pad}  widget: ${f.widget}\n`
  if (f.required !== undefined) s += `${pad}  required: ${f.required}\n`
  if (f.min !== undefined) s += `${pad}  min: ${f.min}\n`
  if (f.max !== undefined) s += `${pad}  max: ${f.max}\n`
  if (f.summary) s += `${pad}  summary: "${f.summary}"\n`
  if (f.field) {
    s += `${pad}  field: { label: ${yamlStr(f.field.label)}, widget: ${f.field.widget} }\n`
  }
  if (f.fields) {
    s += `${pad}  fields:\n`
    for (const sub of f.fields) s += fieldToYaml(sub, indent + 4)
  }
  return s
}

// ── 覆盖校验 ──
function collectJsonKeys(obj, acc = new Set()) {
  if (Array.isArray(obj)) {
    for (const el of obj) if (el && typeof el === 'object') collectJsonKeys(el, acc)
    return acc
  }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      acc.add(k)
      if (v && typeof v === 'object') collectJsonKeys(v, acc)
    }
  }
  return acc
}
function collectFieldNames(fields, acc = new Set()) {
  for (const f of fields) {
    acc.add(f.name)
    if (f.fields) collectFieldNames(f.fields, acc)
  }
  return acc
}

// ── 生成每个站的 file 块 ──
let filesYaml = ''
let allOk = true
for (const slug of PROJS) {
  const jsonPath = path.join(EXAMPLES_DIR, `${slug}.json`)
  if (!fs.existsSync(jsonPath)) { console.warn(`! 跳过 ${slug}（examples/${slug}.json 不存在）`); continue }
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const fields = inferFields(data)

  // 覆盖校验
  const jsonKeys = collectJsonKeys(data)
  const fieldNames = collectFieldNames(fields)
  const missing = [...jsonKeys].filter(k => !fieldNames.has(k))
  if (missing.length) {
    console.error(`✗ ${slug} 字段覆盖缺失: ${missing.join(', ')}`)
    allOk = false
  } else {
    console.log(`✅ ${slug} 字段覆盖 100% (${fieldNames.size} 字段)`)
  }

  const siteLabel = `${data.name || slug}${data.location ? ' · ' + data.location : ''}${data.subtitle ? ' · ' + data.subtitle : ''}`
  filesYaml += `      - name: "${slug}"\n`
  filesYaml += `        label: ${yamlStr(siteLabel)}\n`
  filesYaml += `        file: "examples/${slug}.json"\n`
  filesYaml += `        fields:\n`
  for (const f of fields) filesYaml += fieldToYaml(f, 10)
}

if (!allOk) {
  console.error('\n✗ 存在字段覆盖缺失，已中止写入（避免生成不完整的 config）。请检查上方缺失项。')
  process.exit(1)
}

// ── 头部（手写，含激活说明） ──
const header = `# ═════════════════════════════════════════════════════════════════════════
# Decap CMS 配置（客户自助内容后台 · 自动生成，勿手改 files 段）
#
# ⚠️ 本文件由 gen-decap-config.mjs 从 examples/*.json 自动生成（覆盖全部 ${PROJS.length} 站、100% 字段映射）。
#    修改站点字段后请重跑：node gen-decap-config.mjs
#    手写微调 label 等可直接改下方 files（不影响覆盖正确性）。
#
# 工作原理：客户在 /admin 登录（GitHub OAuth）→ 编辑 examples/<slug>.json
#           → 保存即 commit 到仓库 main → 触发 Actions 重建 → 站点自动上线。
#
# ⚠️ 重要安全约定（避免保存时丢字段导致构建崩）：
#    Decap 保存时【只写配置里出现的字段】，未在下面列出的 key 会被丢弃。
#    本配置已【完整覆盖每个站点 JSON 的每一个 key】（含结构性 template / slug），
#    确保保存后 JSON 不残缺。新增/修改站点务必重跑 gen-decap-config.mjs。
#
# 🔧 一次性激活（详见 docs/cms.md）：
#    1) 在 GitHub 注册一个 OAuth App（Settings → Developer settings → OAuth Apps）
#    2) Authorization callback URL 填：https://lcclicheng.github.io/demo-sites/admin/
#    3) 把拿到的 Client ID 填到下方 backend.client_id
#    重跑本脚本会自动沿用已填的 client_id，不会冲掉（无需重复填）。
# ═════════════════════════════════════════════════════════════════════════

backend:
  name: github
  repo: lcclicheng/demo-sites
  branch: main
  base_url: https://api.github.com
  auth_scope: repo
  # client_id: "在此填入你的 GitHub OAuth App Client ID"   # ← 注册 OAuth App 后取消注释并填入

# Decap 管理界面语言（中文）
locale: "zh"

# 说明：本脚手架暂不启用 image/file 上传组件（见 docs/cms.md「图片处理」）。
# 图片路径以字符串形式编辑（如 ./images/screenshot-1.jpg），保留现有 ./images/ 约定，
# 避免 Decap 上传把路径写成 /images/xxx.jpg 在子路径部署下失效。
# 如需启用图片上传，见 docs/cms.md 的「生产模型（客户独立仓库）」一节。

collections:
  - name: "sites"
    label: "客户站点内容"
    files:
`

// ── 保留已激活的 client_id：重跑生成脚本时不冲掉已填的 OAuth App ID ──
let clientIdLine = '  # client_id: "在此填入你的 GitHub OAuth App Client ID"   # ← 注册 OAuth App 后取消注释并填入'
if (fs.existsSync(OUT)) {
  try {
    const prev = fs.readFileSync(OUT, 'utf-8')
    const mm = prev.match(/^\s*client_id:\s*"([^"]+)"\s*$/m)
    if (mm && mm[1] && !mm[1].includes('在此填入')) {
      clientIdLine = `  client_id: "${mm[1]}"`
      console.log(`↳ 沿用已有 client_id: ${mm[1]}`)
    }
  } catch { /* 忽略解析错误，回退占位符 */ }
}
const headerOut = header.replace(/^\s*#\s*client_id:.*$/m, clientIdLine)
fs.writeFileSync(OUT, headerOut + filesYaml, 'utf-8')
console.log(`\n✅ 已写入 ${OUT}（${PROJS.length} 站，字段 100% 覆盖）`)
