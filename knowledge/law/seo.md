status: draft
industry: law
用途: 本地 SEO 主词 + 长尾 + 推荐 Schema（喂 SEO Agent）

## 主关键词
- "<practice area> solicitors <city>"
- "solicitors <city>"
- "<practice area> lawyer near me"
- "legal advice <area>"

## 长尾
- "fixed fee <practice area> <city>"
- "divorce solicitors <area>"
- "immigration lawyer free consultation <city>"
- "make a will <city>"
- "commercial lease solicitor <city>"
- "SRA regulated solicitors <area>"

## 本地 SEO 动作
- Google Business Profile 完整（品类选 "Solicitor"/"Law firm"）
- NAP 一致 + SRA 号展示
- 本地目录 + 法律门户（如 Legal 500 / 行业指南）
- 嵌入地图 + 办公时间

## 推荐结构化数据
- `LegalService` (继承 `LocalBusiness`)：name/address/telephone/areaServed
- `FAQPage`（与 faq.md 对齐）
- `Attorney` / `Person`（如突出主理律师）
- `BreadcrumbList`
- 注意：不输出虚假 AggregateRating（律所评分类需谨慎合规）

## 博客选题（建立专业权威）
- "Do you need a solicitor for <matter> in <city>? A plain-English guide"
- "Fixed-fee <practice area>: what's included"
- "<area> legal changes 2026: what <clients> should know"
