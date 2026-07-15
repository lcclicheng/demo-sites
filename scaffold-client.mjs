#!/usr/bin/env node
// scaffold-client.mjs — 为单个客户创建生命周期目录（CRM 起点，见 clients/README.md）
// 用法:
//   node scaffold-client.mjs <slug>           # 建空骨架
//   node scaffold-client.mjs <slug> --demo    # 预填示例元数据（演示/测试用）
import fs from 'node:fs'
import path from 'node:path'

const slug = process.argv[2]
const isDemo = process.argv.includes('--demo')
if (!slug || /[^a-z0-9-]/.test(slug)) {
  console.error('用法: node scaffold-client.mjs <slug:小写字母数字连字符> [--demo]')
  process.exit(1)
}

const base = path.join(process.cwd(), 'clients', slug)
const dirs = ['logo', 'assets']
const files = {
  'info.json': JSON.stringify({
    slug,
    businessName: isDemo ? 'Demo Business Ltd' : '',
    industry: '',
    tier: 'A',                      // A=建站+首月不限次修改 / B=年度呵护(年费)
    status: 'intake',               // intake→building→delivered→live→maintaining→renew
    sourceExample: `examples/${slug}.json`,
    contractSigned: false,
    invoiceRaised: false,
    createdAt: new Date().toISOString().slice(0, 10),
    renewalDate: '',
    notes: ''
  }, null, 2) + '\n',
  'contract.md': `# 服务合同 — ${isDemo ? 'Demo Business Ltd' : '<Business Name>'}

> 由 delivery-handover.md 交付包生成；此文件为 Markdown 源，PDF 由交付流水线渲染。

## 套餐
- 档位：A（建站 + 首月内不限次数修改）
- 价格：£590（不含 VAT）

## 范围
- 静态站点 + GitHub Pages 部署
- 首月内不限次数修改
- 7 天上手培训

## 签字
客户：__________________  日期：_________
`,
  'invoice.md': `# 发票 — ${isDemo ? 'Demo Business Ltd' : '<Business Name>'}

- 发票号：INV-<year>-<seq>
- 日期：
- 金额：£590.00（不含 VAT）
- 状态：未付
`,
  'feedback.md': `# 客户反馈 — ${slug}

## 交付后第 7 天满意度调研
- 评分（1-5）：
- 最满意：
- 需改进：
- 是否续费 B 档（年度呵护）：是 / 否
`,
  'seo.md': `# SEO 状态 — ${slug}

## 目标关键词
-
## 已上线 Schema
- LocalBusiness
## 排名跟踪
-
## 博客计划
-
`,
  'analytics.md': `# 数据分析 — ${slug}

## 部署目标
- GitHub Pages: https://lcclicheng.github.io/demo-sites/${slug}/
## PageSpeed
-
## 流量（月）
-
## 转化
-
`
}

console.log(`创建客户目录: clients/${slug}/`)
fs.mkdirSync(base, { recursive: true })
for (const d of dirs) fs.mkdirSync(path.join(base, d), { recursive: true })
for (const [f, c] of Object.entries(files)) {
  fs.writeFileSync(path.join(base, f), c, 'utf-8')
  console.log(`  ✎ ${f}`)
}
console.log('完成。下一步: 填 info.json + 把 examples/<slug>.json 内容对齐。')
