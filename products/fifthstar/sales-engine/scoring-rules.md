# Scoring Rules · 评分规则

> `lead_score` 满分 100，决定"谁进销售池"。两阶段：**Stage1 自动**（OSM 字段）**+ Stage2 发送时人工**（扫 GBP 补 rating/review）。

## Stage 1 — 自动（采集后即算，零人工）

| 信号 | 分值 | 说明 |
|---|---|---|
| 无官网（Track A 核心痛点） | **+30** | 最大痛点，建站楔子最强 |
| 旧/劣质官网 | +20 | 痛点中等 |
| 行业高价值（law/hotel） | +20 | 对齐定价 Premium 档 |
| 行业标准（salon/restaurant/coffee/trades） | +15 | 标准档 |
| 城市未饱和 | +15 | 一城扫透，避免内部撞单 |
| 已有专业官网（Track B） | **−20** | 痛点弱，走声誉订阅而非建站 |

> `google_rating` / `review_count` / `reply_gap` 在 Stage1 **留空**（OSM 无此数据）。

## Stage 2 — 发送时人工（enrich-at-send，零成本）

发每天那 10 封前，扫一眼商家 Google 商家资料，补：

| 信号 | 分值 | 说明 |
|---|---|---|
| Google 评分 3.8 – 4.5 | +20 | 黄金区间，有提升空间 |
| Review 数量 100+ | +20 | 口碑基础厚 |
| Review 数量 500+ | +30 | 极高口碑，必争 |
| 最近评论有人未回复 | +25 | 直接对应"免费 3 条回复"钩子 |
| Facebook 活跃 | +10 | 多渠道触达机会 |

## 进池阈值

```
lead_score（Stage1 + Stage2） > 70  →  进入销售池（每日 Top 10）
```

## 示例

```
Rose Hair Studio
Score: 87
✓ 186 reviews (+20)
✓ 4.2 rating (+20)
✓ 最近评论无人回 (+25)
✓ 无官网 (+30)  ← Stage1
✓ 行业 salon (+15)  ← Stage1
= 87 → 进销售池
```

## 为什么 rating 放发送时补（而非 API）

- Google Places API 付费 + key + GDPR 敏感 + ToS 限制。
- 当前节奏日 10 封高个性，人工扫 GBP 零成本、合规、且天然保证"看过真实评论才能写那 3 条回复"。
- 放量阶段（日 50+）再评估是否接 Places API。

## score_leads.py（待建）

- 输入：八城 `leads-pipeline-*.json` + `verified-leads.json`
- 输出：按 `lead_score` 排序的 Top N 待触达清单（含"需补 GBP rating"标记）
- 零服务器，纯本地脚本
