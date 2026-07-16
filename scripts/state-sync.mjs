#!/usr/bin/env node
// state-sync.mjs — 任务完成自动回写闭环（对应 MDD Law #8 Every task updates runtime）
// ─────────────────────────────────────────────────────────────────────────
// 任一任务完成后，由 AI / CI 调用本脚本，把变动写进：
//   1. memory/runtime/progress.md     追加一条完成记录
//   2. events.log                      追加一条「为什么变」
//   3. state/health.md                 刷新「更新于」日期 + 可选刷新状态格
//   4. CHANGELOG.md（仓库根）          追加一条版本/变更记录
//
// 用法：
//   node scripts/state-sync.mjs --type build --summary "重建 10 站并校验"
//   node scripts/state-sync.mjs --type deploy --status PASS --summary "推送 origin/main"
//   node scripts/state-sync.mjs --type docs --version v4.1 --summary "补齐加载协议"
//
// 不新增目录、不改动代码/CI；纯本地文件回写，幂等（追加式）。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── 参数解析 ──────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const o = { type: 'misc', summary: '', version: '', status: '' }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--type') o.type = argv[++i] || o.type
    else if (a === '--summary') o.summary = argv[++i] || o.summary
    else if (a === '--version') o.version = argv[++i] || o.version
    else if (a === '--status') o.status = (argv[++i] || '').toUpperCase()
    else if (a === '--help' || a === '-h') {
      console.log('Usage: node scripts/state-sync.mjs --type <build|deploy|docs|feature|release|misc> --summary "<text>" [--version vX.Y] [--status PASS|FAIL]')
      process.exit(0)
    }
  }
  if (!o.summary) {
    console.error('❌ 缺少 --summary "<text>"（变动说明）')
    process.exit(2)
  }
  return o
}

// ── 日期工具 ──────────────────────────────────────────────────────────────
function nowLocal() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return {
    date: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`,
    iso: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}+08:00`,
  }
}

// ── 安全追加 ─────────────────────────────────────────────────────────────
function appendSafe(relPath, text) {
  const fp = path.join(ROOT, relPath)
  const head = fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : ''
  const sep = head.length && !head.endsWith('\n') ? '\n' : ''
  fs.writeFileSync(fp, head + sep + text, 'utf8')
  return fp
}

function replaceFirst(relPath, regex, repl) {
  const fp = path.join(ROOT, relPath)
  if (!fs.existsSync(fp)) return false
  const src = fs.readFileSync(fp, 'utf8')
  const out = src.replace(regex, repl)
  if (out !== src) {
    fs.writeFileSync(fp, out, 'utf8')
    return true
  }
  return false
}

// ── 主流程 ───────────────────────────────────────────────────────────────
function main() {
  const o = parseArgs(process.argv)
  const t = nowLocal()
  const typeUpper = o.type.toUpperCase()
  const verTag = o.version ? ` (${o.version})` : ''

  // 1. progress.md
  appendSafe(
    'memory/runtime/progress.md',
    `\n- ${t.date} [state-sync · ${o.type}${verTag}] ${o.summary}`,
  )

  // 2. events.log
  appendSafe('events.log', `[${t.iso} ${typeUpper}] ${o.summary}\n`)

  // 3. state/health.md：刷新「更新于」日期
  const dateRefreshed = replaceFirst(
    'state/health.md',
    /(更新于 )\d{4}-\d{2}-\d{2}/,
    `$1${t.date}`,
  )
  // 可选：刷新状态格（build/deploy + --status）
  if (o.status && (o.type === 'build' || o.type === 'deploy')) {
    const rowLabel = o.type === 'build' ? 'Current Build' : 'Deploy'
    const rowRe = new RegExp(`(\\| ${rowLabel} \\| )\\w+(\\s*\\|)`)
    replaceFirst('state/health.md', rowRe, `$1${o.status}$2`)
  }

  // 4. CHANGELOG.md（仓库根）
  const cl = `- ${t.date} · **${o.type}${verTag}** — ${o.summary}\n`
  const clPath = path.join(ROOT, 'CHANGELOG.md')
  if (fs.existsSync(clPath)) {
    appendSafe('CHANGELOG.md', cl)
  } else {
    fs.writeFileSync(
      clPath,
      `# CHANGELOG\n\n> 自动化维护（state-sync 回写），不抄进 docs（Fact only once）。\n\n${cl}`,
      'utf8',
    )
  }

  console.log(
    `✅ state-sync 完成\n` +
      `   type=${o.type}${verTag} status=${o.status || '—'}\n` +
      `   progress.md + events.log + CHANGELOG.md 已追加${dateRefreshed ? '，health.md 日期已刷新' : ''}`,
  )
}

main()
