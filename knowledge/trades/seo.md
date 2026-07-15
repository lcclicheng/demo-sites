status: draft
industry: trades
用途: 本地 SEO 主词 + 长尾 + 推荐 Schema（喂 SEO Agent）

## 主关键词（每站选 1–2 个核心）
- "<trade> <city>" (e.g. "plumber Bristol")
- "<trade> near me"
- "emergency <trade> <area>"
- "best <trade> <city>"

## 长尾（博客 / FAQ 用，转化意图强）
- "boiler repair <city> price"
- "bathroom fitter <area> reviews"
- "free quote <trade> <city>"
- "24/7 emergency <trade> <area>"
- "kitchen extension cost <city>"
- "how much does <job> cost <area>"

## 本地 SEO 动作清单
- Google Business Profile 完整（品类 plumber/builder/electrician、营业时间、服务区、资质照片）
- NAP 一致（Name/Address/Phone 与站点 footer 完全相同）
- 评价平台： Checkatrade / TrustMark / Which? Trusted Trader 同步
- 嵌入地图 + 服务范围说明

## 推荐结构化数据（JSON-LD）
- `Plumber` / `HomeAndConstructionBusiness`（继承 `LocalBusiness`）：name/address/telephone/priceRange/areaServed
- `Service`（如站点列服务）
- `FAQPage`（与 faq.md 对齐）
- `BreadcrumbList`
- `Review` / `AggregateRating`（仅真实评分，切勿造假）

## 博客选题（每周 1 篇，本地相关 + 省钱科普）
- "How much does a <boiler/bathroom> cost in <city> (2026)"
- "5 signs you need a <trade> — a <area> guide"
- "Choosing a reliable <trade> in <city>: what to check"
