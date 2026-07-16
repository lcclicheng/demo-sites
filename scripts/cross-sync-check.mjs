#!/usr/bin/env node
// cross-sync-check.mjs — 参考实现 ↔ 标准 漂移检测（非阻断）
// ─────────────────────────────────────────────────────────────────────────
// 检测两类漂移：
//   A. 单文件「头体不符」：Laws 段落标题声明「N 条」但正文实际编号数 ≠ N
//   B. 跨文件「参考实现 ↔ 标准」Laws 数不一致
// 另检查 ~/.workbuddy/MEMORY.md 是否含 MDD 节。
//
// 用法：
//   node scripts/cross-sync-check.mjs            # 打印报告，exit 0
//   node scripts/cross-sync-check.mjs --strict   # 不一致时 exit 1（可接 CI）
//
// 跨项目文件（MDD-STANDARD.md / MEMORY.md）默认在 Windows 本机路径。
// 可用环境变量覆盖：MDD_STANDARD_PATH / MDD_MEMORY_PATH
// CI（Linux）无该路径时自动跳过跨项目比对，仅做仓库内自检。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const STRICT = process.argv.includes('--strict')

function read(relOrAbs) {
  try {
    return fs.readFileSync(relOrAbs, 'utf8')
  } catch {
    return null
  }
}

// 解析一个 md 文件的 Laws 段：返回 { claimed, actual, sectionFound }
function parseLaws(src) {
  if (!src) return null
  const lines = src.split('\n')
  let sectionIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3}\s+.*Architecture Laws/i.test(lines[i])) {
      sectionIdx = i
      break
    }
  }
  if (sectionIdx < 0) return null

  const heading = lines[sectionIdx]
  const claimedM = heading.match(/(\d+)\s*条/)
  const claimed = claimedM ? Number(claimedM[1]) : null

  // 统计该段内的编号条目，直到下一个同级/更高级标题或文件尾
  let actual = 0
  for (let i = sectionIdx + 1; i < lines.length; i++) {
    if (/^#{1,3}\s/.test(lines[i])) break // 遇到任意标题即结束本段
    if (/^\s*\d+\.\s+\*\*/.test(lines[i])) actual++
  }
  return { claimed, actual, heading: heading.trim() }
}

function findMddSection(src) {
  if (!src) return false
  // 粗略判断：含「大型项目架构标准」或「MDD」节标题
  return /大型项目架构标准\s*[（(]?MDD/.test(src) || /^##?\s.*MDD/.test(src)
}

// ── 主流程 ───────────────────────────────────────────────────────────────
const problems = []
const report = []

function check(label, parsed) {
  if (!parsed) {
    report.push(`· ${label}: 未找到 Architecture Laws 段（跳过）`)
    return
  }
  if (parsed.claimed === null) {
    report.push(`· ${label}: 找到 Laws 段但未声明「N 条」，实际编号 ${parsed.actual}`)
    return
  }
  if (parsed.claimed !== parsed.actual) {
    problems.push(`${label} 头体不符：标题声明 ${parsed.claimed} 条，正文实际 ${parsed.actual} 条`)
    report.push(`· ${label}: ⚠️ 头体不符（声明 ${parsed.claimed} / 实际 ${parsed.actual}）`)
  } else {
    report.push(`· ${label}: ✅ 一致（${parsed.actual} 条）`)
  }
  return parsed.actual
}

console.log('🔍 cross-sync-check: 参考实现 ↔ 标准 漂移检测\n')

// A. 仓库内自检
const repoPrinciples = read(path.join(ROOT, 'memory/core/principles.md'))
const repoActual = check('gh-pages-build/memory/core/principles.md', parseLaws(repoPrinciples))

// B. 跨项目（标准）
const stdPath =
  process.env.MDD_STANDARD_PATH ||
  (os.platform() === 'win32'
    ? 'C:\\Users\\12102\\.workbuddy\\MDD-STANDARD.md'
    : '/root/.workbuddy/MDD-STANDARD.md')
const stdSrc = read(stdPath)
if (stdSrc) {
  const stdActual = check('MDD-STANDARD.md', parseLaws(stdSrc))
  if (repoActual != null && stdActual != null && repoActual !== stdActual) {
    problems.push(`参考实现(${repoActual}) 与 标准(${stdActual}) Laws 数不一致`)
    report.push(`· 跨项目比对: ⚠️ 参考实现(${repoActual}) ≠ 标准(${stdActual})`)
  } else if (repoActual != null && stdActual != null) {
    report.push(`· 跨项目比对: ✅ 参考实现(${repoActual}) = 标准(${stdActual})`)
  }
} else {
  report.push(`· 跨项目比对: ⏭️ 跳过（无标准文件：${stdPath}）`)
}

// C. MEMORY.md 是否含 MDD 节
const memPath =
  process.env.MDD_MEMORY_PATH ||
  (os.platform() === 'win32'
    ? 'C:\\Users\\12102\\.workbuddy\\MEMORY.md'
    : '/root/.workbuddy/MEMORY.md')
const memSrc = read(memPath)
if (memSrc) {
  const has = findMddSection(memSrc)
  if (!has) {
    problems.push(`~/.workbuddy/MEMORY.md 未含 MDD 节`)
    report.push(`· ~/.workbuddy/MEMORY.md: ⚠️ 未含 MDD 节`)
  } else {
    report.push(`· ~/.workbuddy/MEMORY.md: ✅ 含 MDD 节`)
  }
} else {
  report.push(`· ~/.workbuddy/MEMORY.md: ⏭️ 跳过（无该文件）`)
}

console.log(report.join('\n'))

if (problems.length) {
  console.log(`\n❌ 发现 ${problems.length} 处漂移：`)
  problems.forEach((p) => console.log('  - ' + p))
  if (STRICT) process.exit(1)
} else {
  console.log('\n✅ 未检测到漂移')
}
process.exit(0)
