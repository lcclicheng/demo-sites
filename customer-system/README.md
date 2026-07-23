# Customer System · 客户生命周期层（Customer Lifecycle Layer）

> **P1 建议项**（审计报告 2026-07-23）。原系统最大缺口：**从"线索"直接跳到"交付"，没有客户中段**。
> 本层补齐 **成交 → 交付 → 续费 → 推荐 → 再获客** 的完整经营闭环，让 FifthStar 从"获客机器"变"经营系统"。

## 文件

| 文件 | 管什么 | 衔接 |
|---|---|---|
| [`customer-profile.md`](./customer-profile.md) | 客户档案结构（FK→business-profile，符合 customer.schema.json） | contracts/customer.schema.json |
| [`onboarding.md`](./onboarding.md) | 成交后上手 SOP（首周动作 + 交付包） | metrics/delivery.md |
| [`success-metrics.md`](./success-metrics.md) | 客户成功指标（续费前提） | metrics/retention.md |
| [`renewal.md`](./renewal.md) | 续费系统（提醒/谈判/挽回） | metrics/retention.md |
| [`referral.md`](./referral.md) | 推荐系统（再获客来源） | metrics/growth.md |
| [`feedback-loop.md`](./feedback-loop.md) | 反馈→AI 学习闭环 | AI Operating System |

## 生命周期全景（打通三模块的经营主轴）

```
[Growth]  market → lead → contacted → replied → qualified
                                    ↓ (won)
[Customer]  onboarding → delivery → success → renewal → referral → reacquire
                                    ↑___________________________↓
[Service]   交付自动化 + 客户成功支撑续费/推荐
```

- `business-profile.stage` 字段贯穿全程（market/lead/contacted/replied/qualified/won/delivered/retained/referred/churned/lost）。
- 当 `stage` 进入 `won`：从 `lead/<slug>/profile.json` 派生 `customer-system/<slug>/` 档案（本层）+ 写 `customer.schema.json` 实例。

## 实例化

- 当前 0 客户（尚未 won）。首个成交后，复制本目录逻辑落 `customer-system/<slug>/` 真实档案。
- `lead/` 与 `customer-system/` 均含真实商家 PII，**已被 `.gitignore` 忽略**（仅本文档 + 模板骨架入库）。
