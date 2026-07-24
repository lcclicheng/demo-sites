# Lead Schema · 数据源 + 准入 + CRM 字段

## 1. 数据来源优先级（P0–P3）

| 优先级 | 来源 | 现状 |
|---|---|---|
| P0 | Google Business Profile（rating/reviews/回复） | ⚠ OSM 无此数据 → **Stage2 发送时人工扫 GBP 填**（enrich-at-send），零成本合规 |
| P1 | Facebook Pages | 辅助（社媒触达），非主邮箱源 |
| P2 | Yell / Thomson Local | 低质目录，辅助 |
| P3 | Companies House | 仅有限公司有，很多小店不是 → 非主源 |

**实际主源 = OSM / Overpass**（`leads_scan2.py`），已扫八城 937 家真实商家，零捏造。

## 2. business.json 示例

```jsonc
{
  "name": "Rose Hair Studio",
  "industry": "hair salon",
  "city": "London",
  "google_rating": 4.2,      // Stage2 发送时人工填（OSM 无）
  "reviews": 186,            // Stage2 发送时人工填
  "website": "xxx.com",      // OSM 有 / 无
  "facebook": "facebook.com/xxx",
  "phone": "xxx",
  "email": "info@xxx.co.uk"  // 经 verify_leads.py 过 DNS
}
```

## 3. 准入（Qualification）

**硬条件：有真实可联系邮箱才进自动化外联池。**

- 邮箱合法 + 非占位 + 域名 DNS 可解析 = 可联系/在营。
- 商家在营业、信息明确、属目标行业（law/hotel/restaurant/salon/coffee/trades）。
- Track A（无官网）/ Track B（有官网）分叉在**回信后**发生，首触统一冷钩子。

**现有已核实名单：**
- `verified-leads.json`：**57 家**带真实邮箱、已核实、可直发。
- `recovery-report.json`：**19 家**新拿回邮箱（路1 爬取 3 + 路2 WebSearch 16），待拍板并入。
- 无邮箱 858 家 → `channel:gmb` 人工路由（Google 资料/评论区），不进自动化池。

> 无邮箱但想进池：走路1 `deepen_website_crawl.py` 或路2 WebSearch 找回，再经 `verify_leads.py` 准入。

## 4. CRM 字段（fifthstar-leads.json，零服务器）

```jsonc
{
  "id": "slug-or-uuid",
  "business_name": "商家名",
  "industry": "law|hotel|restaurant|salon|coffee|trades",
  "city": "manchester|...",
  "track": "A|B",                 // day10 分叉后才定
  "google_rating": 4.2,           // Stage2 发送时填
  "review_count": 186,            // Stage2 发送时填
  "has_website": false,
  "email": "info@x.co.uk",
  "facebook": "facebook.com/x",
  "phone": "0113...",             // 可选，咱不打电话
  "pain_points": ["最近评论无人回", "无官网"],
  "lead_score": 87,               // scoring-rules.md 两阶段合计
  "status": "new|sent|replied|meeting|client|excluded",
  "last_contact": "2026-07-23",
  "source": "osm|path1-crawl|path2-websearch"
}
```

- **事实源**：`fifthstar-leads.json`（机器，喂 `send-outreach.mjs`）+ `商家清单.md`（人类追踪）。
- 两文件均 gitignored（防泄漏进 GitHub Pages），与构建隔离。
- status 流转：`new → sent → replied → meeting → client`，或 `→ excluded`（拒/非目标/退订）。

> 不起数据库。v1.5 若需更强存储，优先本地 SQLite 文件而非 Postgres（零服务器铁律）。
