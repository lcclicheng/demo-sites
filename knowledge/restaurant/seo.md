status: draft
industry: restaurant
用途: 本地 SEO 主词 + 长尾 + 推荐 Schema（喂 SEO Agent）

## 主关键词（每站选 1–2 个核心）
- "<cuisine> in <city>"
- "restaurant <city>"
- "<cuisine> near me"
- "where to eat <area>"

## 长尾（博客 / FAQ 用，转化意图强）
- "best <cuisine> in <area>"
- "<cuisine> delivery <city>"
- "<cuisine> for date night <city>"
- "private dining <cuisine> <city>"
- "<cuisine> sunday roast <area>"
- "vegetarian <cuisine> <city>"

## 本地 SEO 动作清单
- Google Business Profile 完整（品类/营业时间/菜单链接/照片）
- NAP 一致（Name/Address/Phone 与站点 footer 完全相同）
- 本地目录收录（Yell / Thomson Local / 行业向导）
- 嵌入地图 + 交通/停车说明

## 推荐结构化数据（JSON-LD）
- `Restaurant` (继承 `LocalBusiness`)：name/address/telephone/cuisine/priceRange/servesCuisine
- `Menu` + `MenuItem`（如站点有菜单页）
- `Review` / `AggregateRating`（仅在有真实评分时，切勿造假）
- `FAQPage`（与 faq.md 对齐）
- `BreadcrumbList`

## 博客选题（每周 1 篇，本地相关）
- "Top 10 <cuisine> spots in <city> (2026)"
- "What to drink with <dish> — a <city> guide"
- "A local's guide to <area>'s food scene"
