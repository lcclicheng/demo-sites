status: draft
industry: salon
用途: 本地 SEO 主词 + 长尾 + 推荐 Schema（喂 SEO Agent）

## 主关键词（每站选 1–2 个核心）
- "hair salon <city>"
- "<specialty> salon near me" (e.g. "curly hair salon")
- "best hairdressers <area>"
- "where to get <blonde/colour> <city>"

## 长尾（博客 / FAQ 用，转化意图强）
- "balayage <city> price"
- "curly hair salon <area>"
- "wedding hair stylist <city>"
- "men's haircut <area> walk in"
- "hair colour correction <city>"
- "kids' first haircut <area>"

## 本地 SEO 动作清单
- Google Business Profile 完整（品类 Hair Salon / Beauty Salon、营业时间、服务列表、照片含 before/after）
- NAP 一致（Name/Address/Phone 与站点 footer 完全相同）
- 本地目录收录（Yell / Treatwell / 行业向导）
- 嵌入地图 + 停车/交通说明

## 推荐结构化数据（JSON-LD）
- `HairSalon` / `BeautySalon`（继承 `LocalBusiness`）：name/address/telephone/priceRange
- `Service`（如站点列服务与价格）
- `FAQPage`（与 faq.md 对齐）
- `BreadcrumbList`
- `Review` / `AggregateRating`（仅真实评分，切勿造假）

## 博客选题（每周 1 篇，本地相关）
- "Where to get the best <balayage/cut> in <city> (2026)"
- "How to care for <curly/coloured> hair — a <city> stylist's guide"
- "What to ask at your first <colour> consultation"
