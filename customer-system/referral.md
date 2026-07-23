# Referral · 推荐系统（再获客来源）

> 最低成本扩张：一个满意客户 = 本地信任背书。目标推荐率 ≥ 25%（`metrics/growth.md`）。
> 衔接：Growth Engine 的"逐城扫透"——案例商户即是城市内活广告。

## 触发时机

- 客户成功指标达标（NPS ≥ 50 / rating 升）时，自然问："认识同行需要这个的吗？"
- 不早不晚：上线稳定 + 初见效果后再问（避免成交即索推荐显得功利）。

## 机制

| 步骤 | 动作 | 自动化 |
|---|---|---|
| 请求 | 邮件/站内问推荐（附一键转发链接） | 半自动 |
| 跟踪 | `customer.referral.status`：none→asked→promised→given→rewarded | 自动 |
| 奖励 | 推荐成交 → 推荐人获 1 月免费 Care 或 £50 抵扣 | 人工核 |
| 复用 | 推荐新商家进 `fifthstar-leads.json` + `lead/<slug>/` | 脚本 |

## 案例复用（最强推荐）

- 已上线商户页（Delhi Wala / McEwan Fraser）本身就是案例。
- 在新城市外联时引用同城案例："Leeds 的 Delhi Wala 用我们回了 1,017 条评里的关键几条"——本地信任杠杆。
- 目标：每城 ≥ 1 个标杆案例后再放量。

## 记录

`customer-system/<slug>/referral.md`：推荐了谁 / 状态 / 是否成交 / 奖励发放。
