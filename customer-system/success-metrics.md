# Success Metrics · 客户成功指标

> 续费的前提是"客户真的变好了"。本文件定义如何量化客户成功。
> 衔接：`metrics/retention.md` + `customer-system/customer-profile.md` 的 `success` 段。

## 核心指标（每客户跟踪）

| 指标 | 目标 | 数据来源 |
|---|---|---|
| 评价回复覆盖 | 新评 48h 内回 ≥ 90% | FifthStar 回评记录 |
| 评分趋势 | 90 天内 rating 不降 | GBP 周期扫 |
| 可量化收益 | 评分+/新评+/咨询增 | 客户自报 + GBP |
| NPS | ≥ 50 | 季度问卷 |
| 主动触达 | 每客户季度 ≥ 1 次价值回访 | outreach-history |

## 跟踪节奏

- **每周**：`success.reviewsReplied30d` 更新；未回评价清零。
- **每月**：rating 趋势复核；标注 `at_risk` 信号（30 天无新评可回 / rating 降 / 无回复）。
- **每季**：NPS 问卷 + 价值回访（案例复用机会挖掘）。

## at_risk 信号 → 干预

| 信号 | 干预 |
|---|---|
| 连续 30 天无新评 | 主动邀评（review-request 模板） |
| rating 下降 ≥ 0.2 | 诊断差评 + 回评 + 给商家建议 |
| 续费前 30 天无互动 | Customer Engine 启动续费序列 |

## 客户成功 = 续费引擎

成功指标达标 → 续费水到渠成（见 `renewal.md`）。指标不达标 → 先救活再谈续费。
