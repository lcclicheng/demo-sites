# ReplyLocal · 英文冷外联模板（零客户冷启动版）

> 框架严格沿用 `uk-biz-outreach` 的 **6 段转化结构**，仅把"免费建站预览"钩子换成"**免费评价回复样例**"。
> 原则不变：钩子 100% 真实诚实、文案克制反网红、付费档放文末且不施压、纯英文外联绝不混入中文。
> 默认目标：曼城 / 伯明翰独立餐厅（可整套换成美发 / 美甲 / 牙医 / trades）。

---

## 模板 A · 首触邮件（带核实真实邮箱时走 `send-outreach.mjs`）

**Subject:** I drafted replies to your 3 latest Google reviews — free, [BusinessName]

```
Hi [FirstName],

I came across [BusinessName] on Google Maps while looking at independent
restaurants in [City] — you've got [N] reviews at [X.X] stars, which is
genuinely strong.

One thing I noticed: a few recent reviews don't have an owner reply yet.
Replying (even a short one) tends to lift both new-customer trust and
where you rank in local search — most owners just run out of time.

So I went ahead and drafted AI replies for your 3 most recent reviews,
including that [3-star] one, in a polite British tone. No account, no
card — they're yours to copy-paste:

→ [link to free sample / attach as PDF]

You get:
• On-brand replies that sound like you, not a bot
• The tricky 3-star turned into a calm, solution-focused response
• A minute a week instead of an hour

If you'd like this done automatically every week, there's a small
£29/month option — no pressure, the free drafts are yours either way.

All the best,
[YourName]
ReplyLocal — AI replies for UK local businesses
[unsubscribe link]
```

**为什么这版有效（对照 6 段）**：① 来由真实（Google Maps 发现 + 真实评分/评价数）② 服务定位（省时的评价回复）③ 已代做样例（免费 3 条草稿，降门槛）④ 所得 bullet（像你、化差评、省时）⑤ 市场对比（"多数老板没空回评→本地排名吃亏"）⑥ 付费不伤钩子（£29 放文末、强调免费样例白拿）。

---

## 模板 B · GMB 留言 / FB 私信（半自动，你本人账号粘贴）

> 无官网 / 无核实邮箱的商户走这条。AI 不代发，避免封号。

```
Hi [FirstName] — I found [BusinessName] on Google and saw you've got
[X.X]★ from [N] reviews. Nice work.

I draft replies to Google reviews for local restaurants, and I've written
3 free reply drafts for your latest reviews (including the tricky one) —
happy to send them over, no strings. Just reply "yes" and I'll drop them
here. — [YourName], ReplyLocal
```

---

## 行业价值钩子句（套进模板 A 第②/⑤段）

| 行业 | 痛点钩子（第②段） | 市场对比（第⑤段） |
|---|---|---|
| 独立餐厅 | "A 4.5★ with no replies looks 'quiet' next to a 4.3★ rival who answers every review." | "Across [City], the venues ranking top in 'restaurants near me' almost all reply to reviews. It's a cheap edge most independents leave on the table." |
| 美发 / 美甲 | "Clients pick salons by vibe — and a thoughtful reply to a 5★ review is free marketing." | "Competitors a street away sit at 4.7★ with replies on; closing that gap is a few minutes a week." |
| 牙医 / 诊所 | "Nervous patients read reviews before booking. A calm owner reply builds trust before they call." | "Practices that engage on reviews typically convert more enquiry calls." |
| Trades（屋顶/水管） | "One glowing review with your reply beats ten silent ones when neighbours search." | "On 'roofer near me' the top results almost always engage reviewers." |

---

## 付费不伤钩子句（第⑥段，多档备选）

- 轻：「If you'd like this done for you every week, there's a £29/month option — no pressure.」
- 中：「Most owners move to the £29/mo plan once they see replies landing weekly; the free drafts are yours either way.」
- 重（已信任后）：「When you're ready, the £79/mo plan adds a dashboard + weekly report + review-request links — and we can also look at a proper website while we're at it.」

> 注意：模板 C（建站 upsell）只在对方已成订阅客户、信任建立后使用，不放在首触。

---

## 发送检查清单（沿用 `uk-biz-outreach` Phase 2 + 追踪表）

每家商户一行，含：商家名 · 渠道(邮箱/GMB/FB) · 预览/样例链接 · 状态 ☐ 待发 / ☐ 已发 / ☐ 已回 / ☐ 付费 / ☐ 死信。
跟进节奏：**发后第 4 天**轻提醒样例是否收到 → **第 10 天**问是否要每周自动版 → **第 14 天**最后轻触。

> 合规红线（与外联 skill 一致）：外联里引用的评分/评价必须真实；GMB/FB 不自动化批量发；邮件带 `List-Unsubscribe` 退订头（脚本已加）。

---

## 下一步可交付

1. 100 家曼城/伯明翰独立餐厅线索清单（OSM 导出：名/地址/评分/评价数/核实邮箱或 GMB 链接）。
2. 免费样例的**真实生成流程**（拿商户公开评价 → OpenAI 生成 3 条回复稿 → 出 PDF/页）。
3. 落地页上线（用你 Vite+React 引擎 + GitHub Pages 零托管，替换当前 HTML 占位版）。
