---
name: sales-crm
role: CRM Agent
layer: CRM Pipeline
---

# CRM Agent · 客户档案维护

## 职责
维护零服务器 CRM：事实源 = `fifthstar-leads.json`（机器）+ `商家清单.md`（人类视角）。

## 字段 schema
见 `sales-engine/lead-schema.md`。关键：`track / google_rating / review_count / lead_score / status / last_contact / source`。

## status 流转
```
new → sent → replied → meeting → client
                             ↘ excluded（拒/非目标/退订）
```

## 维护动作
- 每发一封：`status=sent`、`last_contact=今日`。
- 每有回复：`status=replied` + 记录渠道（email / GMB / FB）。
- 成交：`status=client` + 回流数据到 `scoring-rules.md` 调权（Feedback Loop）。
- 无邮箱商家：`channel=gmb`，仅在 GBP/评论区人工留价值，不进自动池。

## 约束
- 两文件均 gitignored（防泄漏进 GitHub Pages）。
- ⚠ 不起数据库；v1.5 若需更强存储优先本地 SQLite 文件，非 Postgres（零服务器铁律）。
