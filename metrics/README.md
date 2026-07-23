# Metrics · FifthStar OS KPI 指标层

> **P0 必补项**（审计报告 2026-07-23）。原系统只有"做了什么"，没有"经营得怎样"。
> 本层让系统从"项目系统"升级为"经营系统"——每个引擎有可量化目标。

## 四大文件

| 文件 | 管什么 | 核心指标 |
|---|---|---|
| [`sales.md`](./sales.md) | 获客→成交 | 漏斗转化、MRR/ARR、管道价值、A/B 分叉付费率 |
| [`delivery.md`](./delivery.md) | 交付自动化 | Delivery Automation Ratio（资料90/生成95/SEO80/修改50）、交付时长、人工时 |
| [`retention.md`](./retention.md) | 续费→留存 | 续费率、Churn、NPS、LTV:CAC |
| [`growth.md`](./growth.md) | 扩张→再获客 | CAC、推荐率、城市渗透率、口碑系数 |

## 商业漏斗（单一事实源，用于所有指标换算）

```
Free(£0 样例) → Starter(£29/mo) → Pro(£79/mo) → Site(£590 一次性) → Care(£149/mo)
```

> ⚠️ **定价待确认**：本漏斗按 BOS 指令（Free→£29→£79→£590→£149/mo）填写。此前 `docs/pricing.md` / 项目记忆记 Care = **£390/年**（首年合计 £980）。`£149/mo` 与 `£390/yr` 相差 ~4.5 倍，属重大定价变更。**落地前须用户拍板**，并同步 `docs/pricing.md` + `AGENT-ONBOARDING.md` §4.1。本层先以 BOS 指令为准，便于继续推进。

## 当前真实基线（2026-07-23）

- 线索池：`fifthstar-leads.json` **43 条**（sent 35 / lead 4 / excluded 2 / dead 2）。
- 热线索（Track A 无官网）：**6 家 P0x**（P01–P06，全部已 sent）。
- 真实外联：2026-07-22 夜 **19 封测试批**成功；2026-07-23 实发 16 封（A7+B9）。
- 成交：0（尚未进入 won）——所有指标为**目标值 + 起点值**，待销售验证阶段填充。

## 使用纪律

- 每周一更新（current-sprint 节奏）；数字来自真实数据，不虚构。
- 指标异常 → 在 `memory/runtime/lessons-learned.md` 记一条；改动阈值 → 同步本层 + CHANGELOG。
- 下一阶段重心：**70% 销售验证 / 30% 系统优化**（BOS 指令）。指标用于衡量验证进展。
