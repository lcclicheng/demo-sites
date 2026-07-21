# FifthStar 双分线冷外联文案框架（文案层 · v0.2）

> **版本**：v0.2（2026-07-21，基于 v0.1 审核反馈全面修订）
> **本文档定位**：双分线冷外联「文案层」完整骨架，供审核与落地。不部署、不改线上，直到拍板。
> **v0.1→v0.2 修订清单（对应审核反馈）**：
> 1. 新增 §0《Legal & Compliance Guardrails》合规红线（人工痕迹/频率上限/退款终止/GDPR/Google 政策）；
> 2. 分线 B 首触邮件去 AI 味（缩短 Subject、换掉 "Proper job" 重复、改文学化表达）+ 新增 §5.5 个性化观察模板库；
> 3. A/B 分流加自动打标规则（§1）；
> 4. 统一 £29/£79 写法（英文稿 £29/month，中文注 £29/月）+ 统一 P.S. 标准版（§6）；
> 5. 补全跟进序列模板 day4/day10/day14（§7）+ 成功案例插入位（§8）+ 测试 KPI 目标值（§9）+ widget 交付 SOP（§10）；
> 6. 文档管理建议写进 §11（单文件当前可用，未来可拆 4 文件）。

---

## 0. Legal & Compliance Guardrails（合规红线 · 第一优先级）

> 所有批量操作前置条件。违反任一条 = 停手。

| # | 红线 | 做法 |
|---|---|---|
| 1 | **人工审核痕迹** | 所有批量外联（尤其免费样例的 3 条草稿）发送前**必须有本人核实记录**（谁核、核了什么、何时）。样例的个性化观察 `[OBSERVATION]` 占位**必须人工填**，禁止全自动生成即发。 |
| 2 | **退订合规** | 每封正文末含 `reply "STOP" to opt out`；`send-outreach.mjs` 加 `List-Unsubscribe` 头（PECR/GDPR 要求）。 |
| 3 | **发送频率上限** | **每城每天 ≤ 30–40 封**；新发送地址/新域名前 3–4 周更保守（≤ 20–25 封/天），养信誉避免被 Gmail 标 spam。被举报/进 spam 率 > 0.1% 即降速。 |
| 4 | **真实性** | 引用的评分/评价数/网站观察**必须真实**（你 skill 本就有的红线）；不虚构商户授权、不伪造评价、不冒充真人。 |
| 5 | **GDPR / UK 数据保护** | 免费样例**仅用商家公开 Google 评价文本**（公开数据，非个人敏感信息）；不抓顾客手机号/邮箱等 PII；回复稿由**商户本人**从自己 GBP 发布；服务条款写清「AI 辅助、商户确认后发布」；主动求评链接需顾客自愿。 |
| 6 | **Google 政策（review widget）** | widget **仅展示真实公开评价**，不删差评、不 incentivize 只留好评、不诱导改评；避免「操纵评价」观感。嵌入前确认不违反 GBP 条款（待工程层验证）。 |
| 7 | **「满意再付钱」终止/退款条款** | 配套明确：**任何时候可取消，下月不扣；已付当月若不满意可全额退**（降低纠纷）。此条款写进服务条款 + 首触/跟进文案可见处。 |
| 8 | **GMB/FB 不自动化批量发** | 无官网/无邮箱商户走 GMB/FB —— **AI 不代发**，用本人账号手动粘贴，避免封号。 |

---

## 1. 双分线总览

```
            免费 3 条 Google 评价回复样例（双线共同冷启动钩子 · 真实·诚实·人工核）
                                  │
            ┌─────────────────────┴─────────────────────┐
            │                                           │
   分线 A · 商家无官网 / 官网残破            分线 B · 商家已有官网（但评价荒废）
            │                                           │
   声誉楔子建立信任 → £29→£79/月 订阅       声誉引擎独立订阅（官网一动不动）
            │                                           │
   信任后 upsell：£590 建站 + £390/年 Care   终点=已有站 + 官网 review widget 代码片段
            │                                   不强制建站；订阅即交付
            ▼
   客单价更高、转化更顺（建站是「已信任客户的自然升级」）
```

**双线共同地基（一套资产复用）**

| 共同项 | 说明 |
|---|---|
| 冷启动钩子 | 免费 3 条评价 AI 回复草稿（内联正文，不托管、GDPR 安全） |
| 起步档 | £29/month Starter（已锁定）→ £79/month Pro |
| 城市饱和打法 | 1 垂直 + 1 城扫透再换（Manchester→Birmingham→Leeds→Bristol→Liverpool→Edinburgh） |
| 6 段转化结构 | ①来由真实 ②痛点定位 ③已代做免费样例 ④所得 bullet ⑤市场对比 ⑥付费不伤钩子 |
| 合规红线 | §0 全部；纯英文外联绝不混入中文；符合邮件七标准 |
| 风险逆转 | 「先做好、满意再付钱」统一话术（§6），双线共用 |

**双线分化点对照**

| 维度 | 分线 A（无站 → 建站） | 分线 B（有站 → 声誉引擎） |
|---|---|---|
| 目标商户 | 无官网 / 官网残破 / 只有 FB 页 | 有官网但评价荒废 / 无 review widget / 不回评 |
| 首触钩子核心 | "你连个像样的门面都没有，顾客搜不到你" | "你网站挺好，但 Google 上评价一片沉默，白瞎了你的站" |
| 交付终点 | 信任后 upsell £590 建站 + £390 Care | £29/£79 订阅即终点；给「官网评价 widget 代码片段」嵌入现有站 |
| 建站角色 | 是 upsell、是北极星 | 不提 / 仅作"以后想焕新再聊"软钩子 |
| 渠道侧重 | 有邮箱走邮件；无邮箱走 GMB/FB | 多数有站商家有邮箱 → 邮件为主；GMB/FB 为辅 |
| 话术情绪 | 帮你"补上缺失的门面" | 帮你"守住已有门面的口碑漏洞" |

**A/B 分流自动打标规则（线索导出时计算，决定用哪套模板）**

导出字段：`has_website`(Y/N) · `review_count` · `last_reply_days`（最近一条回复距今天数）· `reply_rate`（近 10 条回了几条）· `widget_present`(Y/N)。

| 条件 | 打标 | 说明 |
|---|---|---|
| `has_website == N` | **A** | 无站，主推建站楔子 |
| `has_website == Y` 且 (`last_reply_days > 45` 或 `reply_rate < 30%`) | **B** | 有站但评价沉默 |
| `has_website == Y` 且 `review_count >= 10` 且 `widget_present == N` | **B** | 有站、评价多、但首页无 widget，给 widget 钩子 |
| `has_website == Y` 且 `reply_rate >= 60%` 且 `widget_present == Y` | **低优先** | 已认真运营，仅 Pro 监测轻触，不占首批量 |
| `has_website == Y` 但 `review_count < 5` 且无站感 | **A（可）** | 评价极少，建站+回评一起推更顺 |

> 判定来源：复用 `uk-biz-finder` 商家批量搜索脚手架，导出时多抓上述字段；`reply_rate`/`last_reply_days` 抽样成本较高，可用「最近 3 条评价里有几条回了 + 最近回复日期」粗估。

**小范围测试建议（落地第一步）**：同城同垂直，**10 家 A + 10 家 B** 手动发（非脚本），记录分线转化率，对比哪条线更顺。详见 §9 KPI。

---

## 2. 城市饱和打法（双线共用，按线分池）

```
选定 1 垂直（如独立餐厅）
        │
        ▼
锁 1 座城市（如 Manchester）→ 导出全城该垂直商户（带 §1 字段）
        │
        ├─ 按 §1 规则拆池：A（无站）/ B（有站评价荒）/ 低优先
        │
        ▼
双线并行扫（每天 ≤30–40 封，A/B 混排；同城互相看得见 → 口碑/转介城内扩散最快）
        │
        ▼
出 3–5 个付费 + 2–3 个真实成效案例（A/B 各沉淀）
        │
        ▼
整套（线索脚本 + 双线模板 + 交付 SOP + 城内案例）原样复制到下一城
```

**城市推进顺序**：Manchester → Birmingham → Leeds → Bristol → Liverpool → Edinburgh（每城扫完沉淀案例再进下一城）。

---

## 3. 6 段转化结构（双线共用骨架 + 每段的"双线变量"）

| 段 | 作用 | 分线 A 变量 | 分线 B 变量 |
|---|---|---|---|
| ①来由真实 | 开场即具体观察，证明做过功课 | "Google 上看到你家 [店名] 有 [N] 条评价、[X.X]★" | "看到你家网站 [具体观察]，但 Google 上最近 [M] 条评价没回" |
| ②痛点定位 | 痛点当下、零风险 | 无站 → 顾客搜不到你 / 显得不正规 | 有站但评价沉默 → 入口星级冷清、流失点击 |
| ③已代做免费样例 | 降门槛，内联 3 条草稿 | 3 条评价回复稿 | 3 条评价回复稿（含差评） |
| ④所得 bullet | 价值清单 | 像你 / 差评转机 / 每周一分钟 | 像你 / 差评转机 / **官网可挂 live review widget 一段代码** |
| ⑤市场对比 | 同城竞品压力 | "隔壁 4.3★ 条条回评，你 4.5★ 没回显冷清" | "同城对手站上挂了评价 widget，你最好的一条评价埋在 Google 里" |
| ⑥付费不伤钩子 | 文末轻推，免费白拿 | £29/month；信任后提 £590 建站 | £29/month；**站点不动、给 widget 代码片段**；不提建站（或软钩） |

---

## 4. 分线 A 文案资产（无站 → 建站 upsell）

> 以下为现有 `outreach-template.md` 的完整搬运（已审可用），列为双线体系的 A 侧，便于你在一份文档里统审。notation 已统一为 £29/month、£79/month。

### 4.1 模板 A · 首触邮件（有核实邮箱 → `send-outreach.mjs`）

**Subject:** I drafted replies to your 3 latest Google reviews — free, [BusinessName]

```
Hi [BusinessName],

Saw your Google reviews last night — [N] of them, sat at [X.X]★. That's
the kind of record that keeps a place busy.

Here's what I do: I write replies to Google reviews for [City] restaurants,
in the owner's own voice. The places that answer their reviews look far
more alive to someone deciding where to eat — and Google gives a quiet nod
to businesses that engage. Most owners never get round to it — fair
enough, you're running a kitchen, not a comms desk.

So I went ahead and wrote replies to your 3 most recent reviews
[ — including that [min★] one][, including the trickier ones]. No sign-up,
no card — they're yours to paste straight into your Google Business Profile:

  ── Your 3 free reply drafts (Fifth Star) ──────────────
  Review 1 · [5★] "[short excerpt of their review]"
  Draft: "[draft 1 text]"

  Review 2 · [5★] "[short excerpt]"
  Draft: "[draft 2 text]"

  Review 3 · [3★] "[short excerpt]"
  Draft: "[draft 3 text — turns the tricky one into a calm reply]"
  ──────────────────────────────────────────────────────

Why it's worth a minute:
• Replies that sound like you, not a chatbot
• [The awkward/tricky ★] turned into a calm, "we'd love to put this right" note
• About a minute a week instead of an hour you don't have

If you'd rather not think about it at all, there's a £29/month option where
I handle it every week. Either way, the drafts above are free — no catch.

[standard P.S.]

Cheers,
Ethan Li
Fifth Star — lift your business to its fifth star
lic28790@gmail.com · reply "STOP" to opt out
```

### 4.2 模板 B · GMB 留言 / FB 私信（半自动，你本人账号粘贴）

> 无官网 / 无核实邮箱的商户走这条。AI 不代发，避免封号。

```
Hi [FirstName] — I found [BusinessName] on Google and saw you've got
[X.X]★ from [N] reviews. Lovely work.

I'm Fifth Star — I draft replies to Google reviews for local restaurants
in [City]. I've already written 3 free reply drafts for your latest
reviews (including the tricky one). Happy to send them over, no strings —
just reply "yes". — Ethan Li, Fifth Star
```

### 4.3 行业价值钩子句（套进模板 A 第②/⑤段）

| 行业 | 痛点钩子（第②段） | 市场对比（第⑤段） |
|---|---|---|
| 独立餐厅 | "A 4.5★ with no replies looks 'quiet' next to a 4.3★ rival who answers every review." | "Across [City], the venues topping 'restaurants near me' almost all reply to reviews — a cheap edge most independents leave on the table." |
| 美发 / 美甲 | "Clients pick salons by vibe — a thoughtful reply to a 5★ review is free marketing." | "Salons a street away sit at 4.7★ with replies on; closing that gap is minutes a week." |
| 牙医 / 诊所 | "Nervous patients read reviews before booking. A calm owner reply builds trust before they call." | "Practices that engage on reviews typically convert more enquiry calls." |
| Trades（屋顶/水管） | "One glowing review with your reply beats ten silent ones when neighbours search." | "On 'roofer near me' the top results almost always engage reviewers — and show the review on the page." |
| 瑜伽 / 健身 | "New students pick a studio by feel — a warm reply to a 5★ review is the cheapest word-of-mouth you'll get." | "Studios a few streets over surface their best reviews on the homepage; that social proof books trials." |
| 家装 / 室内 | "Clients choose a fitter by trust — a calm reply to a tricky review is what wins the next job." | "Local fitters who answer reviews rank above quieter rivals on 'kitchen fitter near me'." |

### 4.4 付费不伤钩子句（第⑥段，多档备选）

- 轻：「If you'd like this done for you every week, there's a £29/month plan — no pressure.」
- 中：「Most owners move to the £29/month plan once they see replies landing weekly; the free drafts are yours either way.」
- 重（已信任后）：「When you're ready, the £79/month plan adds a dashboard + weekly report + review-request links — and we can look at a proper website while we're at it.」
- > 建站 upsell（£590）只对已成订阅、信任建立的客户提，不进首触。

---

## 5. 分线 B 文案资产（有站 → 声誉引擎独立订阅）★ v0.2 修订

> 核心话术逻辑：**先夸他网站（证明看过、建立好感），再点出"评价沉默"这个具体漏洞（钩子），强调"你站我一动不动、只跑声誉引擎 + 给一段 widget 代码"**。全程不碰建站话题（或仅作软钩）。

### 5.1 模板 B·首触邮件（有站 · 有核实邮箱）★ 去 AI 味修订

**Subject:** Your Google reviews are sitting unanswered, [BusinessName]

```
Hi [BusinessName],

Spotted your place on Google last night and clicked through to your site —
[OBSERVATION]. Whoever did the site knew what they were doing.

Then I scrolled to your reviews. [X.X]★, [N] of them — and the last few
haven't had a reply from you. Bit of a shame, next to a site that clearly
took effort.

Here's the thing: when someone's searching "[trade] near me", Google shows
your star rating before it shows your site. A 4.5★ that's gone quiet reads
colder than a 4.3★ where the owner answers everyone. Your site wins them on
the way in; the silent reviews lose a few on the way out.

So I wrote replies to your 3 latest reviews — including that [min★] one.
Free, no sign-up, paste them straight into your Google Business Profile.
Your site stays exactly as it is, I don't touch it:

  ── Your 3 free reply drafts (Fifth Star) ──────────────
  Review 1 · [5★] "[excerpt]"
  Draft: "[draft]"

  Review 2 · [5★] "[excerpt]"
  Draft: "[draft]"

  Review 3 · [3★] "[excerpt]"
  Draft: "[draft — turns the tricky one into a calm reply]"
  ──────────────────────────────────────────────────────

Why bother:
• Replies that sound like you, not a bot
• That [tricky ★] turned into a calm "we'd love to put this right" note
• Your best reviews can sit on your homepage too — I'll give you one
  snippet to drop in. No rebuild, your site stays yours.

If you'd rather not do it yourself, there's a £29/month option where I
handle replies every week and add a live review widget to your site. Either
way, the drafts above are free — no catch.

[standard P.S.]

Cheers,
Ethan Li
Fifth Star — lift your business to its fifth star
lic28790@gmail.com · reply "STOP" to opt out
```

**对照 6 段（分线 B 变量）**：①来由 = **网站具体观察 `[OBSERVATION]` + 评价沉默事实**（双钩子）②痛点 = 入口星级冷清、流失点击 ③已代做样例（内联 3 条，站点不动承诺）④所得 = 像你 / 差评转机 / **官网可挂 live widget** ⑤市场对比 = 同城对手站上挂了评价 widget ⑥付费不伤 = £29/month、站点不动、给 widget 代码。
**去 AI 味要点（v0.2）**：删掉原 "Proper job. You've clearly put proper thought into it." 的重复 "proper"；把文学化 "the one patch of your online presence that's gone quiet" 换成口语 "the last few haven't had a reply from you. Bit of a shame, next to a site that clearly took effort."；Subject 从长句缩短为直白陈述。

### 5.2 模板 B·GMB 留言 / FB 私信（有站变体）

> 有站但无核实邮箱 → 走这条。AI 不代发。

```
Hi [FirstName] — found [BusinessName] on Google. Your site's lovely
([OBSERVATION]), but the last [M] Google reviews are unanswered, which is a
shame next to such a polished site. I'm Fifth Star — I draft replies to
Google reviews for [City] [trade]. Already wrote 3 free drafts for your
latest reviews. Happy to send, no strings — just reply "yes". — Ethan Li, Fifth Star
```

### 5.3 分线 B 行业钩子句（有站角度，套 ②⑤段）

| 行业 | 痛点钩子（第②段 · 已有站但评价沉默） | 市场对比（第⑤段） |
|---|---|---|
| 独立餐厅 | "Your menu page sells the food; your unanswered reviews undersell the experience." | "A couple of [City] rivals have their best reviews living right on the homepage — yours are buried in Google." |
| 美发 / 美甲 | "Your portfolio's gorgeous — but a 5★ review with no reply is a free testimonial left hanging." | "Salons a street away show a live review feed on their site; that social proof is money left on the table." |
| 牙医 / 诊所 | "Your site builds confidence — but a nervous patient who reads an unanswered 2★ review hesitates to call." | "Local practices that surface reviews on-site convert more enquiry calls." |
| Trades | "Your site shows the work; silent reviews let a neighbour pick the rival who talks back." | "Top 'roofer near me' results show reviews on the page — that's the edge." |
| 酒店 / B&B | "Your photos book the room; an unanswered review makes a wary guest second-guess." | "Guesthouses up the road wear their 5★ reviews on the homepage — you should too." |
| 瑜伽 / 健身 | "Your site sells the vibe; silent reviews let a curious first-timer pick the studio that talks back." | "Studios nearby surface their 5★ reviews on the homepage — that books trial sessions." |

### 5.4 分线 B 付费不伤钩子句（独立订阅，不绑建站）

- 轻：「If you'd like this run for you every week, there's a £29/month plan — your site stays exactly as it is. No pressure.」
- 中：「Most owners move to the £29/month plan once they see replies landing weekly; the free drafts are yours either way. I'll also drop a review widget snippet into your site — one copy-paste, no rebuild.」
- 重（已信任后）：「When you're ready, the £79/month plan adds a dashboard + weekly report + review-request links + the widget kept live. （And if one day you fancy a site refresh, we can talk — but that's miles off, no rush.）」
- > 分线 B **不把建站当 upsell 主推**；仅重档末尾一句软钩，绝不进首触。

### 5.5 个性化观察模板库（[OBSERVATION] 占位 · 必须人工填）

> 审核反馈 #1：批量生成时 "genuine specific" 易生硬。**规则：每封首触必须 ≥1 处真实个性化观察，[OBSERVATION] 占位由人工核实后填写，禁止全自动。** 以下为各垂直可套的具体观察示例（发前按实际站点挑 1 条）：

| 垂直 | 可套的具体观察（挑真实存在的 1 条） |
|---|---|
| 独立餐厅 | "that [dish] shot on the homepage is the kind of thing that makes you book" · "your 'about the chef' bit actually sounds like a person" · "the way the menu's laid out — you can tell what you're paying before you sit down" |
| 美发 / 美甲 | "your portfolio shots are properly styled, not stock" · "the booking page's vibe matches the chairs" |
| 牙医 / 诊所 | "your 'meet the team' page is unusually un-scary" · "the before/after gallery is laid out sensibly" |
| Trades | "your 'recent jobs' page shows real addresses, not blurred-out stock" · "the 'about' bit explains the guarantee in plain English" |
| 酒店 / B&B | "the room photos actually show the window, not just the bed" · "your 'local walks' page is a nice touch" |
| 瑜伽 / 健身 | "your class timetable's readable on a phone — rarer than it should be" · "the 'why we started' bit is genuinely warm" |

---

## 6. 双线「先做好、满意再付钱」统一话术

> 审核反馈 #2/#4：承诺要显眼 + 需配套终止/退款条款 + P.S. 统一成一版。

- **统一标准 P.S.（双线首触 + 所有跟进都加，冷邮件 P.S. 阅读率最高）**：
  > "P.S. Even if you ever want more than this free one — I do the work first and you only pay once you're happy with it. Never any money up front."
- **终止/退款条款（写进服务条款 + 首触/定价可见处）**：「任何时候可取消，下月不扣；已付当月若不满意，全额退。」降低纠纷，契合「只文字/文件交流、不视频」。
- **叙事页 Hero 承诺条**：✓ "I do the work first — you only pay once you're happy with it."
- **£29 卡片 li（双线共用）**："Pay only when you're happy."
- **风险逆转末条**："Replies drafted first — pay only when you're happy."
- **范围**：承诺仅限"回评/声誉服务先做好满意再付"；£590 建站 upsell 的"先建站再谈钱"在分线 A 信任后阶段体现，不进分线 B 首触。

---

## 7. 跟进序列模板（FifthStar · day4 / day10 / day14，双线通用 + B 变体）★ 新增

> 节奏：发后第 4 天轻问样例是否收到 → 第 10 天问要不要每周自动版 → 第 14 天最后轻触。双线共用 base；分线 B 在第 10 天加 widget 句。每天发送遵守 §0 #3 频率上限。

### 7.1 跟进 1（发后第 4 天 · 轻问是否收到）

**Subject:** Re: your 3 free reply drafts, [BusinessName]

```
Hi [BusinessName],

Quick one — just checking the 3 reply drafts I sent actually landed (spam
folders love to eat the good stuff). They're yours either way, no catch.

If it helps, I can point at the one review reply that's quietly costing you
bookings right now — happy to name it, no sell.

Either way, hope [City]'s busy.

[standard P.S.]

Best,
Ethan Li
Fifth Star
lic28790@gmail.com · reply "STOP" to opt out
```

### 7.2 跟进 2（发后第 10 天 · 问要不要每周自动版）

**Subject:** Re: your 3 free reply drafts, [BusinessName]

```
Hi [BusinessName],

Following up properly this time. The drafts were a taster — most owners who
start replying to reviews see their Google listing look alive within a few
weeks, before we even talk about the ranking nudge.

If you'd rather not do it yourself every week, the £29/month plan has me
handle replies [Track B: + drop a review widget on your site]. No contract,
cancel anytime, pay only when you're happy.

Either way — the free drafts are still yours.

[standard P.S.]

Best,
Ethan Li
Fifth Star
lic28790@gmail.com · reply "STOP" to opt out
```

### 7.3 跟进 3（发后第 14 天 · 最后轻触）

**Subject:** Re: your 3 free reply drafts, [BusinessName]

```
Hi [BusinessName],

Last note from me — I won't keep cluttering your inbox.

If reviews ever climb up your to-do list, you've got my email and the free
drafts are there whenever. One thing I do regardless of paying: a proper
reply to a tricky review can save a booking — reply with the review link
and I'll do one more free.

All the best,
Ethan Li
Fifth Star
lic28790@gmail.com · reply "STOP" to opt out
```

> 微调提示：按业态换语气（理发店可痞一点、律所稳一点、花店柔一点）；若商户已回/已转化，跟进 2/3 不发。每封发前过 §4/§5 七标准 + §6 承诺可见。

---

## 8. 成功案例 / 社会证明插入位置 ★ 新增

> 审核反馈 #5：案例插入位置未明确。**规则：零客户冷启动期不虚构；有首个真实付费/成效后立即补。**

- **插入位 1（第④段后）**：在首触邮件「所得 bullet」之后，加 1 句真实小胜，如："One [City] place I help went from 4.2★ silent to 4.5★ with replies on in six weeks — bookings ticked up."（**须真实，未发生时整句删除**）。
- **插入位 2（叙事页案例区）**：沿用 `integrated-offer.html` 的 "How it works" 示意块，首个真实案例后替换为真实闭环（评分变化 + 商户原话截图授权）。
- **占位纪律**：所有 `[CASE]` 占位在拿到真实素材前保留占位，不编撰数字/引号。

---

## 9. 发送检查清单 + 追踪 + 测试 KPI ★ 扩展 KPI

每家一行：商家名 · 城市 · **分线(A/B)** · 渠道(邮箱/GMB/FB) · 评分/评价数 · 样例链接 · 状态 ☐待发/☐已发/☐已回/☐付费/☐死信 · **核实人/核实时间**（§0 #1）。
**新增字段 `分线`**：决定用 §4（A）还是 §5（B）模板；同一商家不跨线重复发。

**跟进节奏（双线统一）**：第 4 天 → 第 10 天 → 第 14 天（§7）。

**整城 / 小范围测试 KPI（目标值，供基准对比）**

| 指标 | 目标值 | 说明 |
|---|---|---|
| 发送量（小范围） | 10A + 10B 同城同垂直 | 先手动发，观察分线差异 |
| 打开率 | 40–60% | 低则 Subject/发件名问题 |
| 回复率 | 10–20% | 低则钩子/观察不真 |
| 免费样例领取率 | 回复者中 ≥60% | 衡量钩子价值 |
| £29 转化率 | 回复者中 5–10%（全量 1–2%） | A/B 分线分别统计对比 |
| 90 天续费率 | ≥70% | 留存健康度 |
| spam / 退订率 | <0.1% / <2% | 超则降速（§0 #3） |

> 合规红线（双线共用）：§0 全部；评分/评价必须真实；GMB/FB 不自动化批量发；邮件带退订头；回复稿标注"AI 辅助、商户确认后发布"。

---

## 10. 发送前资产清单（双线）+ widget 交付 SOP ★ 扩展 widget SOP

| # | 资产 | 状态 | 说明 |
|---|---|---|---|
| 1 | 发送邮箱 | ☐ | `lic28790@gmail.com`，发件名 "Ethan Li at Fifth Star" |
| 2 | SMTP App Password | ☐ | Gmail `smtp.gmail.com:587` + STARTTLS |
| 3 | 退订提示（合规） | ☐ | 正文末 `reply "STOP"` + `List-Unsubscribe` 头（§0 #2） |
| 4 | 商家邮箱 / 渠道 | ☐ | 邮件需邮箱；无邮箱走 GMB/FB 手动 |
| 5 | 发送脚本接通真实线索 | ☐ | `send-outreach.mjs` 读线索 .md → 按 A/B 标填对应模板 → SMTP |
| 6 | A/B 分流打标 | ☐ | 线索导出时算 §1 字段，决定 A/B 模板 |
| 7 | **官网 review widget 交付 SOP** | ☐（工程层·待验证） | **早期人工+文件跑通**：给商户一段 embed 代码片段（HTML+CSS，静态展示最近 3–5 条真实公开 Google 评价）+ 截图说明放首页哪个位置；**不伪造、不删差评、仅展示真实公开评价**（§0 #6）。工程化（iframe / NiceJob 类服务）待验证可行性后做。 |
| 8 | 人工核实记录 | ☐ | 每批发前 `[OBSERVATION]` 占位 + 样例由本人核实签字（§0 #1） |
| 9 | *域名 thefifthstar.co.uk（可选）* | ☐ | 仅当日发送稳定 > ~50 封/天或长期品牌化时再买 |

---

## 11. 文档管理建议

> 审核反馈「文档管理建议」：当前单文件已可用（自包含、便于统审）。**未来可拆 4 文件**维护，降低单文件膨胀：
> - `dual-track-framework.md`（本文件 · 总骨架 + 合规 + 分流 + KPI）
> - `outreach-template-A.md`（分线 A 全套模板 + 行业钩子）
> - `outreach-template-B.md`（分线 B 全套模板 + 观察库）
> - `follow-up-templates.md`（跟进序列 day4/10/14，双线变体）
>
> **当前决策**：v0.2 仍保持单文件（便于你统审 + 小范围测试）；测试跑顺、内容稳定后再拆。每次重大修改更新顶部版本号 + 修订清单（本文件已遵循）。

---

## 12. 已采纳修订小结（对应审核反馈）

| 审核点 | v0.2 处理 |
|---|---|
| #1 分线 B 话术 AI 味 | §5.1 重写（去 "Proper job" 重复 / 文学化表达，缩短 Subject）+ §5.5 观察模板库（人工填） |
| #2 合规需强化 | §0 合规红线专章（频率上限 / 退款终止 / GDPR / Google widget 政策） |
| #3 A/B 分流细化 | §1 自动打标规则（last_reply>45天→B / review<10无站→优先A 等） |
| #4 小问题 | 统一 £29/month 写法；统一 P.S. 标准版（§6）；缩短 B Subject；强化 Trades 钩子 + 增瑜伽/家装 |
| #5 缺失内容 | §7 跟进模板（day4/10/14）；§8 案例插入位；§9 KPI 目标值；§10 widget SOP |
| 后续·合规优先 | §0 置于文档最前，第一优先级 |
| 后续·技术落地 | `send-outreach.mjs` A/B 分支 + 线索字段扩展（§1/§10 #5/#6）标注为落地项 |
| 后续·文案迭代 | 每封 ≥1 处个性化观察（§5.5）；A/B Subject 测试留待小范围（§9） |
| 后续·测试数据 | 10A+10B 小范围测试 + KPI 表（§9） |
| 后续·文档管理 | §11 单文件当前 + 未来拆 4 文件建议 |

> 本文档通过审核后，再据拍板结果落到 `send-outreach.mjs` 的 A/B 模板分支 + 线索打标，并补工程层 widget 代码片段（待办③的后续）。待办④域名 DNS / ⑤遗留清理 / thefifthstar 仓重新部署仍不在本文档范围。
