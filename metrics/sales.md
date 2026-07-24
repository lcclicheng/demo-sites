# Metrics · Sales（获客→成交）

> 对应引擎：Growth Engine + Service Engine（前端）。数据源：`outreach/fifthstar-leads.json` + `lead/<slug>/outreach-history.md` + `customer-system/`。

## 1. 漏斗转化（Lead → Won）

| 阶段 | 定义 | 起点(2026-07-23) | 目标 |
|---|---|---|---|
| 线索池 | `fifthstar-leads.json` 非 excluded | 43 | 持续增长（周 +20） |
| 已发送 | status=sent | 35 | 90% 合格线索已触达 |
| 已回复 | status=replied | 0 | 回复率 ≥ 15% |
| 合格 | stage=qualified（明确意向） | 0 | 回复中 ≥ 30% 合格 |
| 成交 | stage=won | 0 | 合格中 ≥ 30% 成交 |
| **综合线索→成交率** | won / 池 | **0%** | **≥ 4%** |

> 起点 0 成交是预期的——系统刚进商业验证。前 4–8 周重点把"回复率/合格率"拉起。

## 2. A/B 双轨分叉付费率

- **Track A（无官网）**：首触统一钩子 → 回信后切 **£79/mo Growth Partner（免费建站楔子）**。付费率目标 ≥ 8%（订阅高价值、低量）。
- **Track B（有官网）**：回信后切 £39 Reputation / £79 Growth Partner / £149 Growth Plus 订阅 + widget。付费率目标 ≥ 12%（低客单、高量）。
- 追踪：`sales-engine` 在 `business-profile.sales.leadScore` 与 `customer.tier` 上分轨统计，不混算。

## 3. 收入（MRR / ARR）

按商业漏斗换算（月常 + 一次性）：

| 层 | 单价 | 月常贡献 | 一次性 | 起点 |
|---|---|---|---|---|
| Free | £0 | £0 | £0 | 样例已发 |
| Reputation | £39/mo | £39 | — | 0 |
| Growth Partner | £79/mo（含免费建站） | £79 | — | 0 |
| Growth Plus | £149/mo | £149 | — | 0 |

- **MRR 目标（验证期 90 天）**：≥ £300/mo（约 4×Reputation 或 2×Growth Partner 或混合）。
- **ARR 目标（年化）**：MRR×12（v2 无一次性建站费，站点含于 Growth Partner 订阅）。首年验证期 ARR ≥ £5,000。
- 首次成交前 MRR=£0，属正常；指标用于验证期跟踪斜率。

## 4. 管道价值（Pipeline）

`管道 = Σ(各活跃线索 × 预计首单价值 × 阶段概率)`

- 6 家 P0x（Track A，预计首单 £79/mo Growth Partner，年化 £948）→ 管道基线 ≈ 6 × £948 × 0.3(合格概率) ≈ **£1,706**。
- 全部 Track B 活跃线索（订阅，预计首单 £39×12≈£468 / 升档 £79–£149）→ 叠加管道。
- 目标：验证期管道 ≥ £3,000（需持续补线索 + 推回复率）。

## 5. 外联健康度

| 指标 | 起点 | 目标 |
|---|---|---|
| 发送成功率（非 bounce） | 19/19 测试批 OK | ≥ 98% |
| 退订率 | 0 | < 2% |
| 域名信誉（Spam 分） | 未测 | < 2（Gmail 绿） |

## 6. 周报字段（current-sprint 填）

```
本周新增线索 / 已发 / 已回 / 新成交 / MRR增量 / 管道变化 / A轨付费率 / B轨付费率
```
