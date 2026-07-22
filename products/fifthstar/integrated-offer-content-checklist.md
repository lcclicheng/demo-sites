<!-- 内容待填清单 · 可进版本库（无 PII，纯协作模板） -->

# FifthStar 一体叙事页 · 真实内容待填清单

> **铁律**：本页当前所有评价 / 案例 / 创始人照均为**占位或示例**，绝不可伪造真实客户赞美后上线。以下清单列出每一处需要 Ethan 提供真实素材的位置、格式要求与替换方法。真实替换待素材到位后做，本条只整理清单。

---

## 占位标注状态（已确认清晰）

页面现有 **3 处明确占位**，均带 HTML 注释标记，发布前搜 `PLACEHOLDER` / `Replace the monogram` 即可复核，不会误发假内容：

| 标记位置（行号） | 区块 | 标记文本 |
|---|---|---|
| `integrated-offer.html:286` | Social proof（评价区） | `PLACEHOLDER: these 3 testimonials are structural placeholders...` |
| `integrated-offer.html:444` | Case study（案例闭环） | `PLACEHOLDER: illustrative example of the closed loop...` |
| `integrated-offer.html:593` | Founder（创始人块） | `Replace the monogram with a real photo...` |

---

## ① 三条真实客户评价（testimonials）

- **页面位置**：`integrated-offer.html` 第 286–308 行，区块标题 *"What owners say"* / *"They sound like you."*
- **当前占位**：3 条示例 quote + `— Independent salon, Leeds · placeholder` 等署名（行 296–307）。
- **需提供**（每条）：
  - 评价原文（1–2 句，口语化、带具体场景最佳）
  - 商户名（可要求匿名，如 "Independent salon, Leeds"）
  - 业态 + 城市
  - 是否获授权公开引用（**必须**，否则用匿名或暂不发）
  - 如有星级可附（如 5★）
- **格式要求**：纯文本即可，无需排版；建议 3 条覆盖不同业态（如 沙龙 / 餐饮 / 水电），增强可信广度。
- **替换方法**：
  - 改行 296 / 301 / 306 的 `<p class="quote">` 文本；
  - 改行 297 / 302 / 307 的 `<span class="who">` 署名，**去掉 `· placeholder`**；
  - 删除行 286 的 `PLACEHOLDER` 注释。

---

## ② 一个真实案例闭环（case study）

- **页面位置**：`integrated-offer.html` 第 444–467 行，区块标题 *"From a review, to a reply, to the homepage."*
- **当前占位**：3 步示例（行 455 差评 / 行 460 回复 / 行 465 上首页好评），均为虚构样例；行 450 lead 还带 "Swap in a real client story when you have one." 提示。
- **需提供**（一段完整闭环，可匿名）：
  - **The review**：一条真实差评或中性评原文 + 星级 + 时间（如 "3★, left in March"）
  - **The reply**：你（或 AI 代写）实际发出的真实回复原文
  - **The homepage**：一条真实好评原文，拟放到首页的 quote
- **格式要求**：3 段纯文本；商户名可隐去（"Independent café, Leeds"）；回复须是**真实发过**的，不可编造。
- **替换方法**：
  - 改行 455 / 460 / 465 的 `<div class="body">` 文本；
  - 删除行 444 的 `PLACEHOLDER` 注释；
  - 行 450 的 lead 提示语（"Swap in a real client story..."）一并删掉，改为正式文案。

---

## ③ 创始人照片（Ethan Li）— ✅ 已完成

- **页面位置**：`integrated-offer.html` 第 589–599 行，区块 *"Hi, I'm Ethan."*
- **完成方式**：采用 **AI 生成职业形象**（用户决策，已知"虚构人脸冒充真人、视频见面穿帮"风险，约定不对外宣称真人抓拍）。已生成并裁切为 `products/fifthstar/ethan.jpg`（900×900，无平台水印）。
- **已替换**：行 589–592 的 monogram 占位块已改为 `<img src="ethan.jpg" alt="Ethan Li">`。
- **后续建议**：一旦有真实照片，仍建议替换为本人真实头像，以完全兑现"one real human"卖点。

---

## ④（软）Hero 信任条随真实数据更新

- **页面位置**：`integrated-offer.html` 第 267–273 行，`.trust-row` 区块。
- **当前状态**：**诚实的"启动中"文案**——`score` = *"Rated by UK local businesses"*，`trust-note` = *"Launching with our first clients — every early partner is quoted by name with their permission."* 这是真实状态、**非假数据**，可先上线。
- **待更新触发**：① 拿到真实评价 / ② 有真实客户数后，把 `score` 改为真实数字（如 *"Rated 5★ by 12 UK businesses"*），`trust-note` 改为真实引用说明。
- **无需立即提供**，随 ①② 素材到位自然更新。

---

## 非占位（已为真实内容，无需替换）

- 定价：£590（建站）/ £390·yr（Care）/ £980（首年合计）—— 见行 418 / 536 / 547，真实定价。
- 所有 CTA：`mailto:hello@thefifthstar.site?subject=My%20free%20review%20replies` —— 真实对外邮箱（域名已上线 thefifthstar.site，DNS+Email Routing 已配，见 domain-setup.md）。
- 风险逆转：No signup / No card / No obligation / Replies within 48h —— 行 638–644，真实承诺。
- 创始人第一人称文案（行 598–599）—— 真实 Ethan Li 口吻，非占位。

---

## 交付节奏建议

1. 先拿 **① 三条评价**（最容易：从已发/已回客户要授权引用）。
2. 同步补 **③ 照片**（一次性提供）。
3. 有第一个成功闭环客户后补 **② 案例**。
4. ①②③ 齐了再动 **④** 数字。
5. 替换后重新部署 `thefifthstar` 仓（流程见 `AGENT-ONBOARDING.md` 或历史部署记录）。
