# FifthStar 融合获客文案框架（文案层 · v0.3 · fusion）

> **版本**：v0.3（2026-07-22，按拍板「融合方案」重构首触）
> **本文档定位**：融合获客「文案层」完整骨架，供审核与落地。不部署、不改线上，直到拍板。
> **v0.2 → v0.3 重构清单（对应 2026-07-22 拍板）**：
> 1. **首触冷钩子统一**：不再分 A/B 两套首触 Subject/开场。冷启动钩子对全体商户统一为「免费 3 条 Google 评价回复草稿」（内联正文，不托管、GDPR 安全）。
> 2. **A/B 分叉后移**：有无官网的分叉（A=无站→建站楔子；B=有站→声誉订阅+widget）从首触移到**回信后 / 跟进阶段**（§5、§7）。首触不再提建站/订阅差异。
> 3. **统一首触模板（§4）**：合并原 §4/§5 首触为一份，开场按 track 仅差一句话（有站=网站观察；无站=无站事实），其余 6 段共享。
> 4. **跟进 A/B 分叉（§5 重构）**：原 §5 首触模板改为「回信后分叉话术」——Track A 信任后推 £79/mo Growth（免费建站）；Track B 推 £29/£79 订阅+widget。
> 5. **线索打标保留作跟进路由（§1）**：`has_website` 等字段仍导出，但仅用于回信后的分叉与追踪，不再决定首触用哪套模板。
> 6. **获客更 lean**：单钩子 + 单路由（has-site?→A/B），同批商户首触文案同源、合规更稳、A/B 转化率可在跟进阶段干净对比。

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

> **外联写作硬标准（每批自检，未达标重写）**：①去 AI 化 ②每家独有风格 ③日常口语化 ④专业化 ⑤不僵硬 ⑥开头有抓眼球钩子 ⑦自带 "咱们"（Ethan）口吻。落款 Ethan Li。所有外联纯英文，绝不混中文。

---

## 1. 融合模型总览（统一冷钩子 + 回信后 A/B 分叉）

```
            免费 3 条 Google 评价回复草稿（统一冷启动钩子 · 全体商户 · 真实·诚实·人工核）
                                  │
                      同一封首触邮件发出（钩子相同，开场按 track 仅差一句）
                                  │
                        ┌─────────┴──────────┐
                  商户回信 / 有互动             商户沉默（走 §7 跟进，不强行分叉）
                        │
                  ┌─────┴─────┐
          有站 (has-site=Y)        无站 (has-site=N)
          ── Track B ──            ── Track A ──
          声誉引擎独立订阅           建站楔子（先信任，后 upsell）
          £29→£79/月 + widget       £79/月 Growth（含免费建站 + 托管 + 更新 + SEO）
          站点一动不动               "满意再付钱"先建站
```

**融合前后对照**

| 维度 | v0.2（双线平行） | v0.3（融合 · 本版） |
|---|---|---|
| 首触钩子 | A/B 两套（建站楔子 / 评价沉默） | **统一一套**（免费 3 条评价回复草稿） |
| 首触 Subject | A、B 不同 | **统一**（`I drafted replies to your 3 latest Google reviews — free, [Name]`） |
| 有无站差异何时出现 | 首触即分 | **回信后 / 跟进阶段才分**（§5、§7） |
| 线索 `has_website` 字段用途 | 决定首触用哪套模板 | 仅作**跟进路由 + 追踪**，不影响首触 |
| 获客效率 | 两套模板并行维护、A/B 打开率互相干扰 | 单钩子更 lean；A/B 转化率在跟进阶段干净对比 |
| 产品层 | 单品牌 FifthStar、阶梯 免费→£29→£79（含免费建站） | 同左（2026-07-24 升级为纯订阅制，取消 £590/£390） |

**统一地基（一套资产复用，双 track 共享）**

| 共同项 | 说明 |
|---|---|
| 冷启动钩子 | 免费 3 条评价 AI 回复草稿（内联正文，不托管、GDPR 安全） |
| 起步档 | £29/month Starter → £79/month Growth（含免费建站 + 托管 + 更新 + 基础 SEO） |
| 城市饱和打法 | 1 垂直 + 1 城扫透再换（Manchester→Birmingham→Leeds→Bristol→Liverpool→Edinburgh） |
| 6 段转化结构 | ①来由真实 ②痛点定位 ③已代做免费样例 ④所得 bullet ⑤市场对比 ⑥付费不伤钩子（首触共享，§3） |
| 合规红线 | §0 全部；纯英文外联绝不混入中文；符合邮件七标准 |
| 风险逆转 | 「先做好、满意再付钱」统一话术（§6），双线共用 |

**线索打标字段（保留作跟进路由，见 §10 #6）**

导出字段：`has_website`(Y/N) · `review_count` · `last_reply_days`（最近一条回复距今天数）· `reply_rate`（近 10 条回了几条）· `widget_present`(Y/N)。`send-outreach.mjs` 的 `autoTag()` 仍按这些字段算 track，但**仅用于跟进路由与追踪**，首触永远走 `buildBodyUnified()`（见 §4 / `send-outreach.mjs`）。

> 判定来源：复用 `uk-biz-finder` 商家批量搜索脚手架，导出时多抓上述字段；`reply_rate`/`last_reply_days` 抽样成本较高，可用「最近 3 条评价里有几条回了 + 最近回复日期」粗估。

**小范围测试建议（落地第一步）**：同城同垂直，**10 家 A + 10 家 B** 用统一首触发（非脚本），记录首触打开/回信率（应一致，因钩子相同），再在回信后分叉追踪 A/B 的付费转化率，对比哪条线更顺。详见 §9 KPI。

---

## 2. 城市饱和打法（统一扫，A/B 仅作跟进路由）

```
选定 1 垂直（如独立餐厅）
        │
        ▼
锁 1 座城市（如 Manchester）→ 导出全城该垂直商户（带 §1 字段，has-site 两批一起抓）
        │
        ├─ 按 §1 字段打 A/B 标（仅用于回信后分叉 + 追踪，首触不分）
        │
        ▼
统一首触扫（每天 ≤30–40 封，A/B 混排；同城互相看得见 → 口碑/转介城内扩散最快）
        │
        ▼
回信商户按 has-site 分叉：A→建站楔子 / B→声誉订阅
        │
        ▼
出 3–5 个付费 + 2–3 个真实成效案例（A/B 各沉淀）
        │
        ▼
整套（线索脚本 + 统一首触 + 跟进分叉 + 交付 SOP + 城内案例）原样复制到下一城
```

**城市推进顺序**：Manchester → Birmingham → Leeds → Bristol → Liverpool → Edinburgh（每城扫完沉淀案例再进下一城）。

**扩线索池（融合要点）**：曼城餐厅里「有 GBP 但网站弱/没有」(Track A) 与「有站但评价参差」(Track B) 两批**一起抓、统一打 `has-site`/`no-site` 标签**，进同一冷投队列；首触文案同源，分叉只在回信后。线索源：`outreach/fifthstar-leads.json`（canonical single source，当前 25 家 = 19A + 6B，已体现融合捕获）。

---

## 3. 转化结构（首触共享 6 段 + 跟进分叉）

**首触 6 段（全体商户共享，v0.3 统一）**

| 段 | 作用 | 统一内容（首触共享） |
|---|---|---|
| ①来由真实 | 开场即具体观察，证明做过功课 | 引真实 `[N] 条评价、[X.X]★`；有站追加网站观察 `[OBSERVATION]`，无站点出「无站、点击没处落」 |
| ②痛点定位 | 痛点当下、零风险 | 评价不回 → 入口星级冷清、流失点击（有站）/ 无站 → 搜索只有地图没落地页 |
| ③已代做免费样例 | 降门槛，内联 3 条草稿 | 3 条评价回复稿（含差评），粘贴即用 |
| ④所得 bullet | 价值清单 | 像你 / 差评转机 / 每周一分钟 |
| ⑤市场对比 | 同城竞品压力 | 「同城对手条条回评/挂了 widget，你最好的一条评价埋在 Google 里」 |
| ⑥付费不伤钩子 | 文末轻推，免费白拿 | £29/month；免费草稿白拿；**不提建站/订阅差异**（分叉留跟进） |

**跟进分叉（回信后，按 track，见 §5 / §7）**

| 阶段 | Track A（无站） | Track B（有站） |
|---|---|---|
| 回信后首推 | 先信任；后续推 **£79/mo Growth（免费建站，"满意再付钱"先建站、不收一次性费）** | 推 £29/£79 订阅 + 官网 review widget 代码片段（站点不动） |
| 话术情绪 | 帮你"补上缺失的门面" | 帮你"守住已有门面的口碑漏洞" |

---

## 4. 统一首触模板（v0.3 fusion · 全体商户共享）

> 合并原 §4/§5 首触为一份。开场按 track 仅差一句（有站=网站观察；无站=无站事实），其余 6 段（§3）共享。`send-outreach.mjs` 的 `buildBodyUnified()` 即本模板的程序实现。

### 4.1 模板 · 首触邮件（有核实邮箱 → `send-outreach.mjs` · 统一冷钩子）

**Subject:** I drafted replies to your 3 latest Google reviews — free, [BusinessName]

```
Hi [BusinessName],

[开场 · 按 track 二选一]
  • 有站 (Track B): Spotted your place on Google and clicked through to your site —
    [OBSERVATION]. Whoever did it knew what they were doing. Then I looked at your
    reviews. [X.X]★, [N] of them — and the last few haven't had a reply from you.
    Bit of a shame, next to a site that clearly took effort.
  • 无站 (Track A): Saw you don't have a website yet — so when someone searches
    "[trade] near me", Google shows your star rating and a map, but there's nowhere
    for them to land. That click just drifts to a competitor who does have a site.
    Your [N] reviews at [X.X]★ are the kind of record that keeps a place busy, though.

Here's what I do: I write replies to Google reviews for [City] businesses, in the
owner's own voice. The places that answer their reviews look far more alive to
someone deciding where to spend — and Google gives a quiet nod to businesses that
engage. Most owners never get round to it — fair enough, you're running a business,
not a comms desk.

So I went ahead and wrote replies to your 3 most recent reviews
[ — including that [min★] one][, including the trickier ones]. No sign-up, no card —
they're yours to paste straight into your Google Business Profile:

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

If you'd like to see the kind of thing I do, there's a showcase at https://thefifthstar.site.

If you'd rather not think about it at all, there's a £29/month option where I handle
replies every week. Either way, the drafts above are free — no catch.

[standard P.S.]

Cheers,
Ethan Li
Fifth Star — lift your business to its fifth star
lic28790@gmail.com · reply "STOP" to opt out
```

### 4.2 模板 · GMB 留言 / FB 私信（半自动，你本人账号粘贴）

> 无官网 / 无核实邮箱的商户走这条。AI 不代发，避免封号。钩子统一为「免费 3 条评价回复草稿」。

```
Hi [FirstName] — I found [BusinessName] on Google and saw you've got [X.X]★ from
[N] reviews. Lovely work.

I'm Fifth Star — I draft replies to Google reviews for local [trade]s in [City].
I've already written 3 free reply drafts for your latest reviews (including the
tricky one). Happy to send them over, no strings — just reply "yes".
— Ethan Li, Fifth Star
```

### 4.3 行业价值钩子句（套进模板第②/⑤段 · 双 track 通用）

| 行业 | 痛点钩子（第②段） | 市场对比（第⑤段） |
|---|---|---|
| 独立餐厅 | "A 4.5★ with no replies looks 'quiet' next to a 4.3★ rival who answers every review." | "Across [City], the venues topping 'restaurants near me' almost all reply to reviews — a cheap edge most independents leave on the table." |
| 美发 / 美甲 | "Clients pick salons by vibe — a thoughtful reply to a 5★ review is free marketing." | "Salons a street away sit at 4.7★ with replies on; closing that gap is minutes a week." |
| 牙医 / 诊所 | "Nervous patients read reviews before booking. A calm owner reply builds trust before they call." | "Practices that engage on reviews typically convert more enquiry calls." |
| Trades（屋顶/水管） | "One glowing review with your reply beats ten silent ones when neighbours search." | "On 'roofer near me' the top results almost always engage reviewers — and show the review on the page." |
| 瑜伽 / 健身 | "New students pick a studio by feel — a warm reply to a 5★ review is the cheapest word-of-mouth you'll get." | "Studios a few streets over surface their best reviews on the homepage; that social proof books trials." |
| 家装 / 室内 | "Clients choose a fitter by trust — a calm reply to a tricky review is what wins the next job." | "Local fitters who answer reviews rank above quieter rivals on 'kitchen fitter near me'." |

### 4.4 付费不伤钩子句（第⑥段 · 首触统一，双 track 相同）

> 首触**不区分** A/B —— 都只轻推 £29/month 回评服务。建站 vs 订阅的分叉在回信后（§5）。

- 轻：「If you'd like this done for you every week, there's a £29/month plan — no pressure.」
- 中：「Most owners move to the £29/month plan once they see replies landing weekly; the free drafts are yours either way.」
- > 免费建站（Growth £79/mo 内含）与声誉订阅（£79）**都不进首触**；只在回信后按 track 分叉推（§5）。

---

## 5. 跟进阶段 A/B 分叉（回信后 · v0.3 重构）

> 原 §5 首触模板整体后移为本节。逻辑：**商户先被统一钩子（免费样例）转化、建立信任，回信后再按 has-site 分叉**——无站推建站楔子，有站推声誉订阅+widget。全程不强行跨线。

### 5.1 Track A 跟进 · 建站楔子（无站 → £79/mo Growth 免费建站）

> 信任建立后推。话术核心："你没站，搜索只有地图没落地页；我先把站免费建好你满意再启订阅——没有一次性建站费，你只按月付 £79"。

- 轻（回信首推）：「Since you've no site yet — I can put up a simple one-pager (hours, location, photos, your story) and send you the link. Free build, no card — it's yours to look at. You only start the £79/month once you're happy with it.」
- 中（信任后）：「When you're ready, the £79/month Growth plan covers the site build + hosting on GitHub Pages + updates + basic SEO — all included, nothing extra. The build goes up first; you only pay the monthly once you've seen and liked the preview.」
- > 建站只在已成订阅 / 已信任的客户提，且作为 Growth 订阅内含项（不再收 £590 一次性），不进首触（§4.4）。

### 5.2 Track B 跟进 · 声誉订阅 + widget（有站 → £29/£79 + 代码片段）

> 站点一动不动，只跑声誉引擎 + 给一段 widget 代码。

- 轻：「If you'd like this run for you every week, there's a £29/month plan — your site stays exactly as it is. No pressure.」
- 中：「Most owners move to the £29/month plan once they see replies landing weekly; the free drafts are yours either way. I'll also drop a review widget snippet into your site — one copy-paste, no rebuild.」
- 重（已信任后）：「When you're ready, the £79/month plan adds a dashboard + weekly report + review-request links + the widget kept live. （And if one day you fancy a site refresh, we can talk — but that's miles off, no rush.）」
- > Track B **不把建站当 upsell 主推**；仅重档末尾一句软钩，绝不强推。

### 5.3 个性化观察模板库（[OBSERVATION] 占位 · 首触 Track B 开场用 · 必须人工填）

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

- **统一标准 P.S.（首触 + 所有跟进都加，冷邮件 P.S. 阅读率最高）**：
  > "P.S. Even if you ever want more than this free one — I do the work first and you only pay once you're happy with it. Never any money up front."
- **终止/退款条款（写进服务条款 + 首触/定价可见处）**：「任何时候可取消，下月不扣；已付当月若不满意，全额退。」降低纠纷，契合「只文字/文件交流、不视频」。
- **叙事页 Hero 承诺条**：✓ "I do the work first — you only pay once you're happy with it."
- **£29 卡片 li（共用）**："Pay only when you're happy."
- **风险逆转末条**："Replies drafted first — pay only when you're happy."
- **范围**：承诺覆盖全部付费项（回评订阅"先回评满意再付"；Growth 含的免费建站"先建站满意再启订阅"，不收一次性建站费）；Track A 的建站作为 Growth 订阅内含项在信任后阶段体现（§5.1），不进首触。

---

## 7. 跟进序列模板（FifthStar · day4 / day10 / day14，统一 + A/B 分叉）★ v0.3 加 A/B 分支

> 节奏：发后第 4 天轻问样例是否收到 → 第 10 天问要不要每周自动版 → 第 14 天最后轻触。第 10 天起**已回信商户按 track 分叉**（§5.1 / §5.2）；未回信商户走统一温和版。每天发送遵守 §0 #3 频率上限。

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

### 7.2 跟进 2（发后第 10 天 · 已回信商户按 track 分叉）

**Subject:** Re: your 3 free reply drafts, [BusinessName]

```
Hi [BusinessName],

Following up properly this time. The drafts were a taster — most owners who
start replying to reviews see their Google listing look alive within a few
weeks, before we even talk about the ranking nudge.

[分叉 · 按 track]
  • Track A（无站）:
    If you'd rather not do it yourself every week, the £29/month plan has me
    handle replies. And since you've no site yet — I can put up a simple
    one-pager and send you the link; pay only when you're happy with it.
    No contract, cancel anytime.
  • Track B（有站）:
    If you'd rather not do it yourself every week, the £29/month plan has me
    handle replies and drop a review widget on your site. Your site stays
    exactly as it is. No contract, cancel anytime, pay only when you're happy.

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

> 微调提示：按业态换语气（理发店可痞一点、律所稳一点、花店柔一点）；若商户已回/已转化，跟进 2/3 不发。每封发前过邮件七标准 + §6 承诺可见。未回信商户的跟进 2 用统一温和版（不强行分叉，避免显得"我已经给你贴了标签"）。

---

## 8. 成功案例 / 社会证明插入位置 ★ 保留

> 审核反馈 #5：案例插入位置未明确。**规则：零客户冷启动期不虚构；有首个真实付费/成效后立即补。**

- **插入位 1（第④段后）**：在首触邮件「所得 bullet」之后，加 1 句真实小胜，如："One [City] place I help went from 4.2★ silent to 4.5★ with replies on in six weeks — bookings ticked up."（**须真实，未发生时整句删除**）。
- **插入位 2（叙事页案例区）**：沿用 `integrated-offer.html` 的 "How it works" 示意块，首个真实案例后替换为真实闭环（评分变化 + 商户原话截图授权）。
- **占位纪律**：所有 `[CASE]` 占位在拿到真实素材前保留占位，不编撰数字/引号。

---

## 9. 发送检查清单 + 追踪 + 测试 KPI ★ 扩展 KPI

每家一行：商家名 · 城市 · **track(A/B，仅跟进路由用)** · 渠道(邮箱/GMB/FB) · 评分/评价数 · 样例链接 · 状态 ☐待发/☐已发/☐已回/☐付费/☐死信 · **核实人/核实时间**（§0 #1）。
**track 字段用途变更**：v0.3 起 `track` 不再决定首触模板（首触统一），仅用于回信后分叉（§5）与 A/B 付费转化追踪（§9 KPI）。

**跟进节奏（统一）**：第 4 天 → 第 10 天（分叉）→ 第 14 天（§7）。

**整城 / 小范围测试 KPI（目标值，供基准对比）**

| 指标 | 目标值 | 说明 |
|---|---|---|
| 发送量（小范围） | 10A + 10B 同城同垂直 | 统一首触发，观察首触一致性 |
| 打开率 | 40–60% | 低则 Subject/发件名问题（A/B 应接近，因钩子同） |
| 回复率 | 10–20% | 低则钩子/观察不真 |
| 免费样例领取率 | 回复者中 ≥60% | 衡量钩子价值 |
| £29 转化率 | 回复者中 5–10%（全量 1–2%） | 首触后统一推 £29；A/B 订阅 vs 建站分别在跟进阶段统计 |
| A/B 分叉付费率 | 回信 A 中 Growth(免费建站)转化 / 回信 B 中订阅转化 | **v0.3 核心对比**：哪条线更顺 |
| 90 天续费率 | ≥70% | 留存健康度 |
| spam / 退订率 | <0.1% / <2% | 超则降速（§0 #3） |

> 合规红线（双线共用）：§0 全部；评分/评价必须真实；GMB/FB 不自动化批量发；邮件带退订头；回复稿标注"AI 辅助、商户确认后发布"。

---

## 10. 发送前资产清单（统一首触）+ widget 交付 SOP ★ 扩展 widget SOP

| # | 资产 | 状态 | 说明 |
|---|---|---|---|
| 1 | 发送邮箱 | ☐ | `lic28790@gmail.com`，发件名 "Ethan Li at Fifth Star"（对外可见 From 走 hello@thefifthstar.site，经 Cloudflare 转发） |
| 2 | SMTP App Password | ☐ | Gmail `smtp.gmail.com:587` + STARTTLS |
| 3 | 退订提示（合规） | ☐ | 正文末 `reply "STOP"` + `List-Unsubscribe` 头（§0 #2） |
| 4 | 商家邮箱 / 渠道 | ☐ | 邮件需邮箱；无邮箱走 GMB/FB 手动 |
| 5 | 发送脚本接通真实线索 | ☐ | `send-outreach.mjs` 读线索 .json → **统一 `buildBodyUnified()` 首触** → SMTP |
| 6 | track 打标（仅跟进路由） | ☐ | 线索 `has_website` 等字段算 track，决定回信后分叉（§5）+ A/B 追踪，不影响首触 |
| 7 | **官网 review widget 交付 SOP** | ✅ 已交付 | 见 `widget/review-widget.html`（自包含 embed 片段 + Light/Dark 预览）＋ `widget-delivery-sop.md`（合规 + 摆放位置 + 各平台粘贴步骤 + 失败回退）。**currentColor/color-mix 主题自适应、仅真实公开评价、不删差评**（§0 #6）。工程化（iframe / NiceJob 类服务）仍待验证可行性后做。 |
| 8 | 人工核实记录 | ☐ | 每批发前 `[OBSERVATION]` 占位（Track B 首触开场）+ 样例由本人核实签字（§0 #1） |
| 9 | *域名 thefifthstar.site（已购并上线）* | ☐ | 已购 thefifthstar.site 并配 DNS/Email Routing，对外邮箱 hello@thefifthstar.site 可用 |

---

## 11. 文档管理建议

> 审核反馈「文档管理建议」：当前单文件已可用（自包含、便于统审）。**未来可拆 4 文件**维护，降低单文件膨胀：
> - `dual-track-framework.md`（本文件 · 总骨架 + 合规 + 融合模型 + KPI）
> - `outreach-template-unified.md`（统一首触全套模板 + 行业钩子）
> - `follow-up-track-A.md`（Track A 建站楔子跟进话术）
> - `follow-up-track-B.md`（Track B 声誉订阅 + widget 跟进话术）
>
> **当前决策**：v0.3 仍保持单文件（便于你统审 + 小范围测试）；测试跑顺、内容稳定后再拆。每次重大修改更新顶部版本号 + 修订清单（本文件已遵循）。

---

## 12. 已采纳修订小结（对应审核反馈 + v0.3 融合）

| 审核点 | 处理 |
|---|---|
| #1 分线 B 话术 AI 味 | §4.1 统一首触吸收「去 AI 味」写法 + §5.3 观察模板库（人工填） |
| #2 合规需强化 | §0 合规红线专章（频率上限 / 退款终止 / GDPR / Google widget 政策） |
| #3 A/B 分流细化 | §1 打标字段保留，但**用途改为跟进路由 + 追踪**，不再决定首触 |
| #4 小问题 | 统一 £29/month 写法；统一 P.S. 标准版（§6）；强化 Trades 钩子 + 增瑜伽/家装 |
| #5 缺失内容 | §7 跟进模板（day4/10/14，含 A/B 分叉）；§8 案例插入位；§9 KPI 目标值；§10 widget SOP |
| 后续·合规优先 | §0 置于文档最前，第一优先级 |
| 后续·技术落地 | `send-outreach.mjs` 改 `buildBodyUnified()` 统一首触，track 仅驱动跟进分叉（§5/§7） |
| 后续·文案迭代 | 每封 ≥1 处个性化观察（§5.3）；Subject 统一测试留待小范围（§9） |
| 后续·测试数据 | 10A+10B 小范围测试（统一首触）+ A/B 分叉付费率 KPI（§9） |
| **v0.3 融合重构** | 首触统一冷钩子（免费 3 条评价回复草稿）；A/B 分叉后移至回信后/跟进（§5/§7）；线索打标降为跟进路由；获客更 lean |

> 本文档通过审核后，再据拍板结果落到 `send-outreach.mjs` 的 `buildBodyUnified()` + 跟进分叉路由，并补工程层 widget 代码片段（待办③的后续）。待办④域名 DNS / ⑤遗留清理 / thefifthstar 仓重新部署仍不在本文档范围。
