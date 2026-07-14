# 客户交付标准化包（Delivery Handover Package）

> **用途**：每次把站点交付给真实客户时，复制本文件、填入 `{{占位符}}`，连同下面各模块打包成一个文件夹（或 Notion / Google Drive 链接）发给客户。
> **价值**：交付不再是「发个链接」，而是正式的**客户成功 onboarding**，显著提升客户感知价值与专业度。
> **AI 协作**：以后直接对我说「帮我生成第 {{N}} 个客户（slug = `{{slug}}`）的交付包」，我会读取 `examples/{{slug}}.json` 自动填充本模板，产出可发送的交付材料。

---

## 1. 欢迎邮件模板（Welcome Email）

> 发给客户的正文（英国客户建议英文；如客户偏好中文可切换）。下方为英文模板。

**To**: {{client_email}}
**Subject**: 🎉 Your website is live — {{client_name}} ({{site_name}})

Hi {{client_first_name}},

Your new website is now live and ready to share with the world:

🔗 **Live site**: {{live_url}}  (e.g. https://{{custom_domain}}/  or  https://lcclicheng.github.io/demo-sites/{{slug}}/)

**What you can do yourself (no coding needed)**
- Edit text, menu, photos, opening hours, reviews via the self-service dashboard:
  👉 **CMS login**: {{cms_url}}  (e.g. https://lcclicheng.github.io/demo-sites/admin/)
  👉 Sign in with GitHub (the account we set up for you), then click your site and edit — changes publish automatically in ~1–2 minutes.
- A one-page **maintenance guide** is attached (see §3) covering how to change content, renew your domain, and reach me.

**Compliance & sign-off**
- Please review the **compliance checklist** (§2) and return the signed copy for our records.

**Support**
- Response time, free-change allowance and annual support options are in §5.
- Questions? Just reply to this email.

Welcome aboard — looking forward to seeing {{site_name}} grow.

Best,
{{your_name}}
{{your_business}} · {{your_email}} · {{your_phone}}

---

## 2. 合规交付清单签字版（Compliance Sign-off）

> 来源：[`docs/delivery-checklist.md`](./delivery-checklist.md)。下方为客户确认版，请客户逐项核对后**签名存档**（导出 PDF）。

**Site**: {{site_name}} (`{{slug}}`)  ·  **Client**: {{client_name}}  ·  **Date**: {{delivery_date}}

- [ ] Privacy Policy page present and populated with real terms (template is a placeholder — client must supply actual wording)
- [ ] UK GDPR: a real privacy policy + Cookie consent mechanism in place (template has no cookie banner by default — flag if analytics used)
- [ ] Registered address shown is ECCTA 2024-compliant "appropriate address" (PO Box alone is not allowed)
- [ ] Public-info warning acknowledged: phone / address on a GitHub Pages site are **publicly visible**
- [ ] Image copyright: all photos used are licensed / owned by the client (or Openverse CC-licensed placeholders clearly marked)
- [ ] Domain / DNS / SSL handled (if custom domain — see §4)
- [ ] Client has received CMS login and confirmed they can edit

**Client sign-off**
Signature: ___________________________   Name: {{client_name}}   Date: __________

> 存档：将签名版 PDF 存入 `clients/{{slug}}/handover/` （该目录已 gitignore，不进仓库）。

---

## 3. 站点维护手册（一页纸 · Maintenance Guide）

**Your site**: {{site_name}} — {{live_url}}
**CMS dashboard**: {{cms_url}}

### 如何改内容（自助，无需代码）
1. 打开 {{cms_url}}，用你的 GitHub 账号登录。
2. 点击你的站点（`{{slug}}`），编辑任意字段（文案 / 菜单 / 营业时间 / 评价 / 图片路径）。
3. 保存 → 约 1–2 分钟后线上自动更新（图片改名后会自动刷新缓存）。
4. **换真实照片**：把新图覆盖到对应路径，或在 CMS 里改图片路径字符串。

### 域名续费提醒
- 自定义域名（如 {{custom_domain}}）由**客户自行在注册商处续费**，逾期会失效。
- 建议开启注册商的「自动续费」。到期前 30 天我会提醒一次。
- GitHub Pages 本身免费，无需续费。

### 如何联系我
- 邮箱：{{your_email}}  ·  电话/WhatsApp：{{your_phone}}
- 紧急改动响应时间见 §5 支持条款。

### 注意事项
- 不要在未登录态反复刷新 CMS（GitHub API 有未认证限流，见交付沟通）。
- 结构性改动（换模板 / 加板块）请联系我，不要自行改代码。

---

## 4. 自定义域名交接清单（Custom Domain Handover · 若适用）

> 仅当客户使用自有域名时填写。完整 SOP 见 [`docs/custom-domain.md`](./custom-domain.md)。

- [ ] 客户在域名注册商添加记录：
  - **形态 A（推荐，独立仓库根域）**：A 记录 / ALIAS 指向 GitHub Pages；或子域 CNAME 到 `{{user}}.github.io`
  - **形态 B（子路径）**：CNAME / 301 转发到 `lcclicheng.github.io/demo-sites/{{slug}}/`
- [ ] GitHub Pages → Custom domain 填入 {{custom_domain}}，勾选 **Enforce HTTPS**
- [ ] SSL 证书自动签发（可能需数分钟～24h 生效）
- [ ] 验证：浏览器开 {{custom_domain}} 返回 200 且地址栏有锁标
- [ ] 客户持有注册商账号与 DNS 控制权（你仅协助，不代持）

> 演示期（无自有域名）跳过本节，线上地址用 `https://lcclicheng.github.io/demo-sites/{{slug}}/`。

---

## 5. 支持条款（Support Terms）

> 以下为**默认模板**，实际数值按与客户约定填写。建议写进合同 / 报价单。

- **响应时间**：工作日 {{response_hours}} 小时内回复（如 24h）；紧急故障 {{urgent_hours}}h（如 4h）。
- **免费改动额度**：交付后 {{free_change_window}} 内，{{free_change_count}} 次小改动免费（如 30 天内 3 次文案/图片微调）。
- **计费改动**：超出免费额度按 {{rate_per_change}} / 次，或按小时 {{rate_per_hour}}。
- **年费支持选项（可选）**：
  - **基础** £{{tier1}}/年：监控 + 邮件支持 + 少量改动额度
  - **标准** £{{tier2}}/年：含 CMS 启用维护 + 优先响应 + 定期备份
  - **高级** £{{tier3}}/年：含内容更新代劳 + 月度小优化
- **不包含**：新模板开发、重大 redesign、第三方付费服务订阅费。

---

## 6. 发票 & 付款确认（Invoice & Payment）

- **Invoice No.**: {{invoice_no}}
- **Issued**: {{invoice_date}}  ·  **Due**: {{invoice_due}}
- **Description**: Website build — {{site_name}} (`{{slug}}`) + {{addons}}
- **Amount**: £{{amount}}  ({{currency_note}})
- **Status**: ☐ Paid  ☐ Pending  ☐ Deposit received ({{deposit_amount}})
- **Payment method**: {{payment_method}} (bank transfer / Stripe / etc.)
- **Note**: {{invoice_note}}

---

## 附录：AI 协作提示（内部用，不发给客户）

- 「帮我生成第 {{N}} 个客户（slug = `{{slug}}`）的交付包」→ 读取 `examples/{{slug}}.json` + 本模板，自动填出 §1–§6。
- 「Review 这个站的交付完备度」→ 走 [`docs/delivery-checklist.md`](./delivery-checklist.md) 逐项核对。
- 客户反馈回收见 [`clients/{{slug}}/feedback.md`](./../clients/{{slug}}/feedback.md)（已 gitignore）。
