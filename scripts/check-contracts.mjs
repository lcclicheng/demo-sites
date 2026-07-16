#!/usr/bin/env node
// check-contracts.mjs — CI 一致性校验（对应 Law #1 Fact only once + #9 Contracts own schemas）
// ─────────────────────────────────────────────────────────────────────────
// 三类校验：
//   1. contracts/section-data.md 字段表  vs  src/components/sections/types.ts（权威源）
//      → 契约声明的字段必须在 types 中真实存在，否则 = 字段漂移（契约说一套、代码另一套）
//   2. examples/*.json（含 template 字段的）+ 必填字段（template/slug/name）
//      → 缺必填 = 摄入文件不合法（测试夹具无 template 则跳过）
//   3. decisions/ADR00N-*.md 的 Status 字段 + See: 引用是否悬空
//
// 严重度：
//   - 1/2 类不一致 → 硬错误（exit 1，阻断 CI）
//   - 3 类 ADR See 悬空 → 告警（不阻断，避免风格性引用误杀）
//
// 用法：node scripts/check-contracts.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const errors = []
const warnings = []
const info = []

function read(rel) {
  const fp = path.join(ROOT, rel)
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : null
}

// ── 1. 契约字段 vs types ──────────────────────────────────────────────────
function extractContractFields(src) {
  const fields = new Set()
  for (const line of src.split('\n')) {
    if (!line.startsWith('|')) continue
    if (!line.includes('`')) continue // 跳过表头/分隔行
    const cells = line.split('|')
    const first = cells[1] || ''
    // 取反引号内的标识符，并按 / 拆分（同一格多个字段）
    const ids = [...first.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())
    for (const id of ids) {
      id.split('/').forEach((s) => {
        const t = s.trim().replace(/[*`]/g, '')
        if (t && /^[a-zA-Z_][\w]*$/.test(t)) fields.add(t)
      })
    }
  }
  return fields
}

function extractTypeFields(src) {
  const fields = new Set()
  const m = src.match(/export interface SectionedData\s*\{([\s\S]*?)\n\}/)
  if (!m) return fields
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^\s*([a-zA-Z_$][\w$]*)\s*\??\s*:/)
    if (mm && !mm[1].startsWith('[')) fields.add(mm[1])
  }
  return fields
}

// ── 2. 业务 JSON 必填 ────────────────────────────────────────────────────
function checkBusinessJson() {
  const dir = path.join(ROOT, 'examples')
  if (!fs.existsSync(dir)) return
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue
    const fp = path.join(dir, f)
    let json
    try {
      json = JSON.parse(fs.readFileSync(fp, 'utf8'))
    } catch {
      warnings.push(`examples/${f}: JSON 解析失败（跳过）`)
      continue
    }
    if (typeof json.template !== 'string') continue // 测试夹具/非摄入文件 → 跳过
    for (const k of ['template', 'slug', 'name']) {
      if (json[k] === undefined || json[k] === null || json[k] === '') {
        errors.push(`examples/${f}: 缺必填字段 "${k}"（business-json 契约要求）`)
      }
    }
  }
}

// ── 3. ADR Status + See 悬空 ─────────────────────────────────────────────
function checkAdr() {
  const dir = path.join(ROOT, 'decisions')
  if (!fs.existsSync(dir)) return
  for (const f of fs.readdirSync(dir)) {
    if (!/^ADR\d+.*\.md$/.test(f)) continue
    const src = fs.readFileSync(path.join(dir, f), 'utf8')
    if (!/(?:\*\*Status\*\*|Status)\s*[:：]/.test(src)) {
      warnings.push(`decisions/${f}: 缺 Status 字段（ADR 应含 Status:）`)
    }
    for (const m of src.matchAll(/See\s*[:：]\s*([^\n]+)/g)) {
      const refs = m[1].split(/[,\s]+/).map((s) => s.trim()).filter(Boolean)
      for (let ref of refs) {
        ref = ref.replace(/^[`*]|[`*]$/g, '')
        if (!ref.endsWith('.md')) continue // 只校验 .md 引用
        const rp = path.join(ROOT, ref)
        if (!fs.existsSync(rp)) {
          warnings.push(`decisions/${f}: See 悬空 → ${ref}`)
        }
      }
    }
  }
}

// ── 主流程 ───────────────────────────────────────────────────────────────
console.log('🔍 check-contracts: contracts / business-json / ADR 一致性校验\n')

const secSrc = read('contracts/section-data.md')
const typeSrc = read('src/components/sections/types.ts')
if (secSrc && typeSrc) {
  const cf = extractContractFields(secSrc)
  const tf = extractTypeFields(typeSrc)
  const drift = [...cf].filter((f) => !tf.has(f))
  info.push(`契约字段 ${cf.size} 个，types 字段 ${tf.size} 个`)
  if (drift.length) {
    errors.push(`契约字段在 types 中缺失（字段漂移）：${drift.join(', ')}`)
  } else {
    info.push(`✅ 契约字段全部命中 types（无漂移）`)
  }
} else {
  warnings.push('缺少 contracts/section-data.md 或 src/components/sections/types.ts（跳过字段比对）')
}

checkBusinessJson()
checkAdr()

console.log(info.map((s) => '· ' + s).join('\n'))
if (warnings.length) {
  console.log('\n⚠️ 告警（不阻断）：')
  warnings.forEach((w) => console.log('  - ' + w))
}
if (errors.length) {
  console.log(`\n❌ 阻断性错误 ${errors.length} 处：`)
  errors.forEach((e) => console.log('  - ' + e))
  process.exit(1)
}
console.log('\n✅ 一致性校验通过')
process.exit(0)
