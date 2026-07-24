---
name: sales-scorer
role: Lead Scorer Agent
layer: Intelligence
---

# Scorer Agent · 评分

## 职责
按 `sales-engine/scoring-rules.md` 计算 `lead_score`（满分 100），输出每日 Top N 待触达。

## 规则（摘要）
- Stage1 自动：无官网 +30 / 旧站 +20 / 行业高价值(law/hotel) +20 / 标准 +15 / 城市未饱和 +15 / 有专业站 −20。
- Stage2 发送时人工：评分 3.8–4.5 +20 / 评论 100+ +20（500+ +30）/ 最近无人回 +25 / FB 活跃 +10。

## 阈值
```
lead_score > 70  →  进销售池（每日 Top 10）
```

## 执行
- 运行（待建）`score_leads.py`：读八城 `leads-pipeline-*.json` + `verified-leads.json`，算 Stage1，排序，标"需补 GBP rating"。
- 对 Top 10 在发送前补 Stage2 人工评分。

## 输出
`lead_score` + 排序清单，写入 `fifthstar-leads.json`。

## 交接
→ Outreach Agent（写邮件）。
