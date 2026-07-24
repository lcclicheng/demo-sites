# Architecture · 六层架构

> 文档驱动 + AI 可执行。每一层对应一个 `.ai/sales/*.md` Agent 与本地脚本。

## 六层总览（用户设计 + 实现约束标注）

```
                    FifthStar Sales Engine

INPUT ── Lead Collector Layer ──┐
          OSM/Overpass(实)      │  ⚠ Google Maps 爬取有 ToS 风险，当前用 OSM；
          FB / Yell /           │    FB/Companies House 为辅助，非主源
          Companies House       │
                                ↓
                 Lead Enrichment Layer ──┐
          Website Analyzer(实)          │  网站/SEO/SSL 自动爬（enrich_emails.py）
          Review Analyzer(Stage2人工)   │  ⚠ 评论文本 OSM 无 → 发送时人工扫 GBP
          AI Business Profile           │
                                ↓
                 Lead Intelligence Layer ──┐
          Pain Detection                │  scoring-rules.md
          Lead Scoring                  │
          ICP Matching                  │
                                ↓
                 Outreach Engine ──┐
          Email Generator(实)       │  dual-track-copy-framework.md
          FB Message(辅助)          │  Day0/3/7/14 序列
          Follow-up Sequence         │
                                ↓
                 CRM Pipeline ──┐
          New→Contacted→Replied   │  ⚠ 用 fifthstar-leads.json + 商家清单.md
          →Qualified→Won/Lost     │    （非 Postgres，见零服务器铁律）
                                ↓
                 Feedback Loop ──→ 成交数据回流优化评分模型
```

## 层 → 资产映射

| 层 | 对应文档 / 脚本 | 状态 |
|---|---|---|
| Collector | `uk-biz-finder/leads_scan2.py` | ✅ 已建（八城 937 家） |
| Enrichment | `enrich_emails.py` + `deepen_website_crawl.py` + 路2 WebSearch | ✅ 已建 |
| Intelligence | `scoring-rules.md` + `score_leads.py` | ⏳ 脚本待建 |
| Outreach | `dual-track-copy-framework.md` + `send-outreach.mjs` | ✅ 已建 |
| CRM | `fifthstar-leads.json` + `商家清单.md` | ✅ 已建（gitignored） |
| Feedback | 成交回流（人工记录到 scoring 调权） | 🔜 待建 |

## Agent 对应（见 `.ai/sales/`）

- `collector.md` → Collector Layer
- `analyst.md` → Enrichment + Intelligence（痛点发现）
- `scorer.md` → Intelligence（评分）
- `outreach.md` → Outreach Engine
- `crm.md` → CRM Pipeline

## 演进路线

- **v1.0（当前）**：OSM → JSON → AI 评分 → 生成邮件 → **人工发送**。零服务器。
- **v1.5（未来）**：加本地 Lead 存储（JSON/MD 或 SQLite 文件）、邮件追踪、自动跟进。Postgres 须重新评估零服务器铁律。
- **v2.0（远期）**：全自动 Agent（自动发现→分析→触达）。前提是 v1.0/v1.5 验证 unit 经济成立。

## 商业目标（单人公司模型）

```
日 50 leads → 筛 10 优质 → 发 10 封 → 回复率 10% → 周 5 回复 → 月 2–4 成交
收入：2 × £79/mo Growth Partner = £158/mo recurring + 续费（Reputation £39 / Growth Plus £149 按单客档位），再规模化。
```
