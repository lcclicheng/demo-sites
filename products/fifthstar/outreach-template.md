# Fifth Star · 英文冷外联模板 + 城市饱和打法（零客户冷启动版）

> 品牌：**Fifth Star** — "Lift your business to its fifth star." 发送身份用现有邮箱账号 **`lic28790@gmail.com`**（£0，无需新申请）；域名 thefifthstar.site 已购并上线（对外邮箱 **`hello@thefifthstar.site`**，Cloudflare Email Routing 转发到 Gmail）。
> 框架严格沿用 `uk-biz-outreach` 的 **6 段转化结构**，钩子=免费 3 条评价回复样例。
> 原则不变：钩子 100% 真实诚实、文案克制反网红、付费档放文末不施压、纯英文外联绝不混入中文。
> 起步档：**£29/月 Starter**（已锁定）。默认垂直：独立餐厅（可整套换美发/美甲/牙医/trades）。

---

## 0. 城市饱和打法（用户定的打法）

**一次只打一个垂直 + 一座城，扫透再换城。** 西方城市小，一座城的目标垂直商户通常几百家，足够密。

```
选定 1 垂直（如独立餐厅）
        │
        ▼
锁 1 座城市（如 Manchester）→ OSM/GMB 导出全城该垂直商户（含评分/评价数）
        │
        ▼
用 Fifth Star 6 段冷外联「整城批量扫」（每天 15–25 家，1–2 周扫完全城）
        │  同城商户互相看得见 → 口碑/转介在城内扩散最快（案例规律：口碑 61%）
        ▼
出 3–5 个付费 + 2–3 个真实成效案例
        │
        ▼
把整套（线索脚本 + 模板 + 交付 SOP + 城内案例）原样复制到下一座城
```

**为什么按城不按人**：①同城饱和让"社会证明"生效——A 餐厅看到隔壁 B 餐厅在用；②本地案例内容对同城 SEO 最有效；③一套资产（脚本/模板/SOP）跨城复用，边际成本趋零。

**城市推进顺序建议**（按独立餐厅密度 + 好接触度）：
Manchester → Birmingham → Leeds → Bristol → Liverpool → Edinburgh …（每城扫完沉淀案例再进下一城）

---

## 1. 模板 A · 首触邮件（有核实真实邮箱 → 走 `send-outreach.mjs`）

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

Cheers,
[YourName]
Fifth Star — lift your business to its fifth star
lic28790@gmail.com · reply "STOP" to opt out
```

**对照 6 段**：①来由真实（Google 评价数 + 真实评分，开场即具体观察）②服务定位（代写评价回复→商家发声→本地搜索更活）③已代做免费样例（降门槛，内联 3 条草稿）④所得 bullet（不像机器人 / 差评变冷静回应 / 每周一分钟）⑤市场对比（"多数老板没空回评→显得冷清吃亏"）⑥付费不伤钩子（£29 文末、免费样例白拿）。文案去 AI 味：口语化、用缩略（don't/you're/we'd）、短句错落、收尾 Cheers，不堆砌泛夸形容词与"tends to / genuinely strong"等 AI 痕迹。

> **样例交付方式（默认 = 正文内联，不托管）**：免费样例的 3 条草稿**直接粘贴进邮件正文**（见上方虚线块），不挂公开链接。原因：①评价是商家自己的公开 Google 文本，草稿由商家本人从自己 GBP 发布 —— 内联最稳、零托管风险、GDPR 安全；②完整 one-pager（`outreach/fifthstar-samples/<slug>.onepager.md`，含逐字评价 + 草稿）仅作**内部构建产物**，发送前可一并作为附件/pdf 备份，但**不公开部署**。生成器双编码 bug 已修（`generate_sample.py` 的 `normalize_drafts()`），批量跑已验证稳定。

---

## 2. 模板 B · GMB 留言 / FB 私信（半自动，你本人账号粘贴）

> 无官网 / 无核实邮箱的商户走这条。AI 不代发，避免封号。

```
Hi [FirstName] — I found [BusinessName] on Google and saw you've got
[X.X]★ from [N] reviews. Lovely work.

I'm Fifth Star — I draft replies to Google reviews for local restaurants
in [City]. I've already written 3 free reply drafts for your latest
reviews (including the tricky one). Happy to send them over, no strings —
just reply "yes". — [YourName], Fifth Star
```

---

## 3. 行业价值钩子句（套进模板 A 第②/⑤段）

| 行业 | 痛点钩子（第②段） | 市场对比（第⑤段） |
|---|---|---|
| 独立餐厅 | "A 4.5★ with no replies looks 'quiet' next to a 4.3★ rival who answers every review." | "Across [City], the venues topping 'restaurants near me' almost all reply to reviews — a cheap edge most independents leave on the table." |
| 美发 / 美甲 | "Clients pick salons by vibe — a thoughtful reply to a 5★ review is free marketing." | "Salons a street away sit at 4.7★ with replies on; closing that gap is minutes a week." |
| 牙医 / 诊所 | "Nervous patients read reviews before booking. A calm owner reply builds trust before they call." | "Practices that engage on reviews typically convert more enquiry calls." |
| Trades（屋顶/水管） | "One glowing review with your reply beats ten silent ones when neighbours search." | "On 'roofer near me' the top results almost always engage reviewers." |

---

## 4. 付费不伤钩子句（第⑥段，多档备选）

- 轻：「If you'd like this done for you every week, there's a £29/month plan — no pressure.」
- 中：「Most owners move to the £29/mo plan once they see replies landing weekly; the free drafts are yours either way.」
- 重（已信任后）：「When you're ready, the £79/mo plan adds a dashboard + weekly report + review-request links — and we can look at a proper website while we're at it.」

> 建站 upsell（£590）只对已成订阅、信任建立的客户提，不进首触。

---

## 5. 发送检查清单 + 追踪（沿用 `uk-biz-outreach` Phase 2/追踪表）

每家一行：商家名 · 城市 · 渠道(邮箱/GMB/FB) · 评分/评价数 · 样例链接 · 状态 ☐待发/☐已发/☐已回/☐付费/☐死信。
跟进节奏：**第 4 天**轻问样例是否收到 → **第 10 天**问要不要每周自动版 → **第 14 天**最后轻触。
整城指标：扫完统计 发送数 / 打开 / 回复 / 免费样例领取 / £29 转化，作为下一城基准。

> 合规红线：引用的评分/评价必须真实；GMB/FB 不自动化批量发；邮件带 `List-Unsubscribe` 退订头（脚本已加）；不虚构商户授权/邮箱。

---

## 6. 下一步可交付（等你说"继续"）

1. **首城 100 家线索清单**（默认 Manchester 独立餐厅；OSM 导出：名/地址/评分/评价数/核实邮箱或 GMB 链接）— 当前清洗后已核验 25 家（见 `outreach/fifthstar-manchester.md`）。
2. **免费样例真实生成流程（已跑通）**：抓商户公开评价（WebSearch 摘要，GDPR 安全）→ DeepSeek 生成 3 条回复稿 → 内联进模板 A / 备份 one-pager。当前已为 25 家中的 **25 家**全部生成 one-pager（5 份 pilot 演示 + 20 份清洗 leads），样例链接列已全填。
3. **落地页（已上线）**：公开"门面"已部署在 `https://thefifthstar.site/`（Vite+React 引擎 + GitHub Pages + 自定义域名 thefifthstar.site，约 £10/年）。首触邮件不依赖落地页，样例已内联。

---

## 7. 发送前资产清单（零成本路径 · 2026-07-20 修订）

> 钩子文案与样例都已就绪，**真实外联前只需把"免费发送身份"立起来**——域名/DNS 对 25 家试点不是必须的。逐项打勾：

| # | 资产 | 状态 | 说明 |
|---|---|---|---|
| 1 | **发送邮箱** | ☐ | 用现有账号 **`lic28790@gmail.com`**（£0，免新申请）。发件显示名设 "Fifth Star" 或 "Ethan Li at Fifth Star"。 |
| 2 | **SMTP 凭据（App Password）** | ☐ | Gmail 用 App Password 走 `smtp.gmail.com:587` + STARTTLS；Outlook 类似。25 封 1 对 1 个性化邮件从免费地址发完全可行。 |
| 3 | **退订提示（合规）** | ☐ | 每封正文末含 `reply "STOP" to opt out`，且 `send-outreach.mjs` 加 `List-Unsubscribe` 头（PECR/GDPR 要求）。 |
| 4 | **商家邮箱 / 渠道** | ☐ | 邮件发送需商家邮箱：先抓 25 家 GMB/官网邮箱；无邮箱的走模板 B（GMB/FB 手动）。 |
| 5 | **发送脚本接通真实线索** | ☐ | `send-outreach.mjs` 读 `fifthstar-manchester.md` 的 25 家 → 逐家填模板 A（内联 3 条草稿）→ 走 SMTP。25 家 one-pager 已全部生成。 |
| 6 | *域名 thefifthstar.site（已购并上线）* | ☐ | 已购 thefifthstar.site 并配 DNS/Email Routing（对外邮箱 hello@thefifthstar.site，Cloudflare 转发到 Gmail）+ SPF/DKIM/DMARC。Supabase/Netlify 免费档可做落地页，但**不是邮件发送服务**。 |

> 资产 1–3、5 均 £0、用户 5 分钟内可自设；完成后即可按"每天 15–25 家"节奏真实群发。Supabase 等仅用于后续公开落地/候补名单页，不参与外联发送。
