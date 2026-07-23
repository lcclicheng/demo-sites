# Feedback Loop · 反馈→AI 学习闭环

> AI Operating System 的核心：每次交付/客户反馈都让系统更聪明，不重复踩坑。
> 衔接：AI OS 五层记忆（system/project/business/customer/learning）。

## 闭环

```
客户反馈 / 交付异常 / 外联效果
   → 记入 memory/runtime/lessons-learned.md + lead/<slug>/conversation.md
   → 提炼为可复用资产（话术/模板/样例/检测规则）
   → 回灌 AI（system 层规则 / 七标准自检 / 差异化约束）
   → 下次同类任务自动更好
```

## 三类反馈入口

| 来源 | 落到哪 | 提炼成什么 |
|---|---|---|
| 商家回信（兴趣/拒绝/问价） | `lead/<slug>/conversation.md` + outreach-history | 外联话术优化（七标准） |
| 交付修改请求 | `customer-system/<slug>/` + delivery 指标 | 改稿自动化规则（revisionPct↑） |
| 续费/流失原因 | `renewal.md` + retention 指标 | 成功指标权重调整 |

## 复用资产库

- `fifthstar-samples/`：3 条评价回复样例（可复用模板）。
- `uk-biz-outreach` / `local-values-landing-copy` skill：外联/本地化方法论。
- 七标准自检（去 AI 味/独有/口语/专业/不僵硬/钩子/自有口吻）：每次外联强制过。

## 学习增益指标（metrics/growth.md）

- 复用资产数周 +5；外联打开率 ≥ 40%；去 AI 味达标率 ≥ 95%。
- 每条 lessons-learned 必须在 7 天内变成"可执行的系统改进"，否则记一条过期警告。
