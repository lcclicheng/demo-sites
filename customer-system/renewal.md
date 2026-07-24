# Renewal · 续费系统

> 订阅层（Reputation / Growth Partner / Growth Plus）的收入全靠续费。本文件定义续费节奏与挽回。
> 衔接：`metrics/retention.md`（续费率 ≥ 85% / Churn ≤ 5%）。

## 续费日历

| 时点 | 动作 | 自动化 |
|---|---|---|
| 到期前 60 天 | 系统标 `renewalDue`，拉成功指标快照 | 自动 |
| 到期前 30 天 | 发"价值回顾"邮件（这半年帮你回了 N 条评/评分变化） | 半自动 |
| 到期前 14 天 | 发续费账单（PayPal） | 自动 |
| 到期前 7 天 | 未付提醒（温和） | 自动 |
| 到期日 | 未付 → 降级/暂停服务（不删数据） | 自动 |
| 到期后 14 天 | 挽回序列（1 对 1 问卡在哪） | 人工 |

## 谈判原则

- 不绑死长期：可月付、可随时取消（"pay when you're happy" 一贯承诺）。
- 涨价/降级透明：提前 60 天通知，不沉默扣费。
- 订阅续费：到期前强调"持续声誉管理 + 站点持续更新 + SEO 推进"，按档位做价值回顾（Reputation / Growth Partner / Growth Plus）。

## 流失挽回（Churn Save）

- 信号触发（success-metrics `at_risk`）→ 人工 1 对 1 问"卡在哪"。
- 常见 blockers：预算紧 / 觉得没用 / 换了人管。对应：降 tier / 补价值证明 / 重 onboarding。
- 目标：挽回 ≥ 30% 的退订意向。

## 记录

每个客户 `customer-system/<slug>/renewal.md`：续费日期 / 结果 / 金额 / 备注。
