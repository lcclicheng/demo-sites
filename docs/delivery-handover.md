<!--
  AI INTERNAL NOTES — this block is an HTML comment and will NOT render or be sent to the client.
  Purpose: every time we deliver a site to a real client, copy this file, fill the {{placeholders}},
  and bundle it with the attached modules into one folder (or a Notion / Google Drive link) to email the client.
  Value: turns "here's a link" into a formal client-success onboarding.
  How to use: tell me "generate the delivery package for client #{{N}} (slug = {{slug}})". I will read
  examples/{{slug}}.json and auto-fill §1–§6. For a readiness review, follow docs/delivery-checklist.md.
  Client feedback lives in clients/{{slug}}/feedback.md (gitignored, local only).
  RULE: keep the entire visible document in English — UK clients. Never put Chinese into the deliverable.
-->

# Delivery Handover Package

> Copy this file, fill the `{{placeholders}}`, and send it to the client together with the attached modules.

---

## 1. Welcome Email

**To**: {{client_email}}
**Subject**: 🎉 Your website is live — {{client_name}} ({{site_name}})

Hi {{client_first_name}},

Your new website is now live and ready to share with the world:

🔗 **Live site**: {{live_url}}  (e.g. https://{{custom_domain}}/  or  https://lcclicheng.github.io/demo-sites/{{slug}}/)

**What's included in your first month**
- **Unlimited revisions for 30 days** after go-live: any tweak to text, menu, photos, opening hours or reviews — just email me and I'll publish it (usually within 1–2 days, free of charge).
- After the first month, ongoing changes are covered by the **Annual Care plan** (§5) or available as one-off paid edits.
- A one-page **maintenance guide** is attached (see §3) covering how to request changes, renew your domain, and reach me.

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

## 2. Compliance Sign-off

> Source: `docs/delivery-checklist.md`. The client confirms each item, then signs and returns a PDF copy for our records.

**Site**: {{site_name}} (`{{slug}}`)  ·  **Client**: {{client_name}}  ·  **Date**: {{delivery_date}}

- [ ] Privacy Policy page present and populated with real terms (template is a placeholder — client must supply actual wording)
- [ ] UK GDPR: a real privacy policy + Cookie consent mechanism in place (template has no cookie banner by default — flag if analytics used)
- [ ] Registered address shown is ECCTA 2024-compliant "appropriate address" (PO Box alone is not allowed)
- [ ] Public-info warning acknowledged: phone / address on a GitHub Pages site are **publicly visible**
- [ ] Image copyright: all photos used are licensed / owned by the client (or Openverse CC-licensed placeholders clearly marked)
- [ ] Domain / DNS / SSL handled (if custom domain — see §4)
- [ ] Client understands the 30-day unlimited-revision window and how to request changes (email {{your_email}})

**Client sign-off**
Signature: ___________________________   Name: {{client_name}}   Date: __________

> Archive the signed PDF in `clients/{{slug}}/handover/` (this directory is gitignored and stays local).

---

## 3. Maintenance Guide (one page)

**Your site**: {{site_name}} — {{live_url}}

### How to request a change (no dashboard needed)
1. Email {{your_email}} with what you'd like changed (text / menu / photos / opening hours / reviews).
2. Within your **first 30 days**, changes are unlimited and free — I'll publish within 1–2 days.
3. After 30 days, changes run through the **Annual Care plan** (§5) or as one-off paid edits — just ask.
4. **To swap in real photos**: send me the image files and I'll place them (or tell me the path and I'll update it).

### Domain renewal reminder
- A custom domain (e.g. {{custom_domain}}) is **renewed by the client at their registrar** — it lapses if not renewed.
- Enable the registrar's auto-renew. I will send one reminder ~30 days before expiry.
- GitHub Pages itself is free and needs no renewal.

### How to reach me
- Email: {{your_email}}  ·  Phone / WhatsApp: {{your_phone}}
- Urgent-change response time is in §5 Support Terms.

### Notes
- No dashboard or login needed — all changes go through me by email, so there's nothing for you to manage.
- Structural changes (swap template / add a section) — contact me; do not edit code yourself.
- **Tier C clients**: you received the Full Ownership Handover — you self-edit via the Decap `/admin` backend (see §7); no need to email me for content changes.

---

## 4. Custom Domain Handover (if applicable)

> Fill this section only if the client uses their own domain. Full SOP: `docs/custom-domain.md`.

- [ ] Client adds records at their registrar:
  - **Form A (recommended, standalone repo root domain)**: A / ALIAS record pointing to GitHub Pages; or a subdomain CNAME to `{{user}}.github.io`
  - **Form B (subpath)**: CNAME / 301 redirect to `lcclicheng.github.io/demo-sites/{{slug}}/`
- [ ] GitHub Pages → Custom domain set to {{custom_domain}}, tick **Enforce HTTPS**
- [ ] SSL certificate issued automatically (may take minutes–24h)
- [ ] Verify: opening {{custom_domain}} returns 200 and shows a lock icon
- [ ] Client holds the registrar account and DNS control (you assist only, never custody)

> Demo period (no own domain): skip this section; use `https://lcclicheng.github.io/demo-sites/{{slug}}/`.

---

## 5. Support Terms

> Default template — fill actual numbers per client agreement; put them in the contract / quote.

- **Response time**: reply within {{response_hours}} business hours (e.g. 24h); urgent incidents within {{urgent_hours}}h (e.g. 4h).
- **First 30 days — unlimited revisions (included in Tier A)**: any text / photo / menu / hours tweak, free, just email me — no allowance counting.
- **Free-change allowance (Annual Care, Tier B)**: {{free_change_count}} small changes / year included (e.g. 12 tweaks — copy / image edits).
- **Billable changes (no plan)**: beyond the above, {{rate_per_change}} / change, or {{rate_per_hour}} / hour.
- **Annual Care plan (optional)**: £{{annual_care_price}}/year — site monitoring + priority response + free small-change allowance + domain-renewal assistance (recommended; static site upkeep is minimal, near pure-margin).
- **Not included**: new template development, major redesign, third-party paid service subscriptions.
- **Tier C clients**: not on A/B support terms — you own the site and self-manage via Decap (see §7). Annual Care may be added optionally for monitoring / priority response.

---

## 6. Invoice & Payment

- **Invoice No.**: {{invoice_no}}
- **Issued**: {{invoice_date}}  ·  **Due**: {{invoice_due}}
- **Description**: Website build — {{site_name}} (`{{slug}}`) + {{addons}}
- **Amount**: £{{amount}}  ({{currency_note}})
- **Status**: ☐ Paid  ☐ Pending  ☐ Deposit received ({{deposit_amount}})
- **Payment method**: {{payment_method}} (bank transfer / Stripe / etc.)
- **Note**: {{invoice_note}}

---

## 7. Tier C — Full Ownership Handover (optional)

> Fill this section only if the client purchased the **Full Ownership Handover (Tier C)**. The handover differs from A/B: the client receives the source repository + data + a self-serve editing backend they own.

- [ ] Source repository transferred to the client's own GitHub account (or a new repo under their name); client has full ownership.
- [ ] Client's site `examples/<slug>.json` handed over; client owns all content.
- [ ] Decap CMS configured to point at the **client's own repo** + the **client's own GitHub OAuth App** (free, client registers) — see `docs/cms.md` §3 / §6.
- [ ] Client can self-edit at `/admin` → auto-commit + deploy; **no ongoing maintenance from us**.
- [ ] Handover doc + short training delivered: repo structure, Decap one-pager, how to self-deploy / change domain.
- [ ] Optional: client may still purchase **Annual Care (Tier B)** for monitoring / priority response, but it is not required.

> After Tier C handover, all content and infrastructure changes are the client's responsibility. We are not on the hook for ongoing maintenance.
