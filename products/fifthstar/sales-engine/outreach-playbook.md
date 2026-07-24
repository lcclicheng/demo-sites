# Outreach Playbook · 触达剧本

> 首触**绝不卖网站**。钩子 = 「我免费帮你写 3 条 Google 评价回复」。

## 统一冷钩子（dual-track 共用）

- 真经源：`products/fifthstar/dual-track-copy-framework.md`（v0.3）。
- 外联硬标准（用户要求，每批发前自检）：去 AI 化 / 每家独有风格 / 日常口语化 / 专业化 / 不僵硬 / 抓眼球钩子 / 自有 Ethan 口吻。落款 **Ethan Li**。
- 合规：B2B 公开联系方式 + 必带 `List-Unsubscribe` 头 + 双退订（`send-outreach.mjs`）。

## 首触结构（骨架，非照搬）

```
Subject: A few ideas for [Business Name]

Hi [FirstName],

我注意到 [商家名] 在 Google 上有 [N] 条好评，挺厉害的。
也看到最近有几条评价还没人回——挺可惜，回一下回头客感觉完全不一样。

我顺手写了 3 条现成回复，你直接复制就能用，不用注册啥：

1. [针对某条具体评价]
2. [针对某条具体评价]
3. [针对某条具体评价]

有用就好。要是想把这事长期托管，我也能顺带把你家最好的评价
变成官网上的信任锚点。

Regards,
Ethan
```

**那 3 条回复必须在发送时现写**（enrich-at-send）：先扫一眼商家 GBP 真实评论，才能写出"针对某条具体评价"的内容。这是钩子成立的前提，不能模板化填空。

## 跟进序列（Day 0 / 3 / 7 / 14）

| 时点 | 动作 | 内容要点 |
|---|---|---|
| **Day 0** | 首触冷钩子 | 3 条免费评价回复，不卖任何东西 |
| **Day 3** | 轻触提醒 | 一句价值提醒，无压力（"那 3 条回复用着顺手不？"） |
| **Day 7** | 网站/声誉建议 | 按 Track 给承接：A=建站楔子 / B=声誉订阅+widget |
| **Day 14** | 最后提醒 | 软收尾，留门，带退订 |

> Track A/B 分叉在 **Day 7** 显化（A 无官网→£79/mo Growth Partner 免费建站；B 有官网→£39/£79/£149 订阅 + 评价 widget（Reputation / Growth Partner / Growth Plus））。

## 合规底线

- 每封带 `List-Unsubscribe` + 退订说明（PECR）。
- P.S. 始终带风险逆转：「先做好、满意再付钱」（见 `payment-reply-template.md`）。
- 不打电话（用户只走文字/文件交流）。

## 关联

- 生成/发送：`outreach/send-outreach.mjs`（v3 统一 `buildBodyUnified()` 首触）。
- 话术圣经：`dual-track-copy-framework.md`。
- 写作标准 skill：`uk-biz-outreach`。
- 手动 GMB 路由（无邮箱商家）：`outreach/GMB留言体_SERENITY_PEDNOLVA.md`。
