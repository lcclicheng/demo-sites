# Daily Operation · 日运营手册

> 商业机器阶段：固定节奏 > 爆发式采集。目标月 3–5 客户。

## 核心节奏（单人公司模型）

```
日 50 leads → AI 筛 10 优质 → 发 10 封高个性 → 拿 1 回复 → 月 3–5 客户
收入：2 × £79/mo Growth = £158/mo recurring + 续费
```

## 每日 Checklist

| 步骤 | 动作 | 工具 |
|---|---|---|
| 1. Collect | 采 50 家（一城扫透，按行业轮替） | `leads_scan2.py` |
| 2. Qualify | 只留有真实邮箱者（无邮箱→gmb 路由） | `verify_leads.py` |
| 3. Score | 算 Stage1 分，排 Top 10 | `score_leads.py`（待建） |
| 4. Enrich | 发前扫 GBP 补 rating/review（Stage2） | 人工 |
| 5. Write | 为 Top 10 各写 3 条真实评价回复 | `outreach-playbook.md` + `dual-track-copy-framework.md` |
| 6. Send | 人工发送首触（v1.0 不自动发） | `send-outreach.mjs` |
| 7. Track | 更新 status + 回复记录 | `fifthstar-leads.json` + `商家清单.md` |

## Agent 角色（见 `.ai/sales/`）

- **Collector Agent**（`collector.md`）：跑 `leads_scan2.py`，产出 business.json。
- **Analyst Agent**（`analyst.md`）：发现痛点（网站缺口 + 评论缺口，Stage2 人工扫 GBP）。
- **Scorer Agent**（`scorer.md`）：按 `scoring-rules.md` 算 `lead_score`，输出 Top N。
- **Outreach Agent**（`outreach.md`）：按 `outreach-playbook.md` 写 3 回复冷邮件。
- **CRM Agent**（`crm.md`）：维护 `fifthstar-leads.json` status + `商家清单.md`。

## 指标看板（人工记录即可，v1.0 不做 Dashboard）

```
Today
Collected:   120
Qualified:    23
Emails sent:  15
Replies:       3
Meetings:      1
Revenue:    £79/mo (Growth)
```

## 周/月节奏

- **每周**：5 个回复 → 跟进至 meeting。
- **每月**：2–4 成交 → 回流成交数据到 `scoring-rules.md` 调权（Feedback Loop）。
- **城市策略**：一城扫透验证模型后再换下一城（对齐 `local-values-landing-copy`）。

## 关联 SOP

- 日运营总 SOP：`outreach/每日运营SOP_2026-07-20起.md`
- 跟进追踪：`outreach/follow-up-tracker.md`
- 发送清单（人类视角）：`outreach/商家清单.md`
