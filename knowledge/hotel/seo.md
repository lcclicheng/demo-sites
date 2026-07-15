status: draft
industry: hotel
用途: 本地 SEO 主词 + 长尾 + 推荐 Schema（喂 SEO Agent）

## 主关键词（每站选 1–2 个核心）
- "hotel <city>"
- "boutique hotel <area>"
- "<B&B/inn> near <landmark>"
- "where to stay <city>"

## 长尾（博客 / FAQ 用，转化意图强）
- "dog friendly hotel <area>"
- "weekend break <city> with parking"
- "hotels near <attraction> <city>"
- "family rooms <area>"
- "best <B&B> in <city> 2026"
- "romantic getaway <region>"

## 本地 SEO 动作清单
- Google Business Profile 完整（品类 Hotel / Bed and Breakfast、营业时间、房型照片、设施）
- NAP 一致（Name/Address/Phone 与站点 footer 完全相同）
- OTA 之外强化直订（站内预订 + 价格一致）
- 嵌入地图 + 交通/停车说明

## 推荐结构化数据（JSON-LD）
- `Hotel` / `LodgingBusiness`（继承 `LocalBusiness`）：name/address/telephone/priceRange/starRating
- `Room` / `Product`（如站点列房型）
- `FAQPage`（与 faq.md 对齐）
- `BreadcrumbList`
- `Review` / `AggregateRating`（仅真实评分，切勿造假）

## 博客选题（每周 1 篇，本地相关）
- "Where to stay in <city> (2026) — a local's pick"
- "A weekend in <area>: what to do, eat, see"
- "Dog-friendly breaks near <landmark> — our guide"
