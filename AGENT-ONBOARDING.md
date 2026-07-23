# AGENT-ONBOARDING · 项目接手总纲（给协作智能体）

> 本文件让任何新接入的智能体在 5 分钟内接管本项目。**先读「§0 铁律」，再读「§8 当前状态」决定下一步。**
> 配套长期记忆：`D:\workbuddy项目\2026-07-07-09-02-15\.workbuddy\memory\MEMORY.md`（已自动注入）+ 每日日志 `2026-MM-DD.md`。
> 设计任务必须先加载 skill：`independent-site-design`（建视觉）/`web-design-dispatcher`（建页路由）；见 §7。
> 外联/获客任务见 `products/fifthstar/sales-engine/` 与 `uk-biz-outreach` skill。

---

## 0. 立刻要知道的铁律（防复踩，违反任一条都会出事故）

> 分两组：**A 组 = 建站 demo 引擎**（gh-pages-build 仓库），**B 组 = FifthStar 获客系统**（独立仓 thefifthstar）。两组各自有坑。

### A 组 · 建站 demo 引擎（gh-pages-build 仓）

1. **线上 URL 用 `examples/<x>.json` 的 `slug` 字段，不是 `build-clean.sh` 的 PROJS key。**
   例如 `breath-yoga`→`/breath/`、`vault-hotel`→`/vault/`、`atelier-salon`→`/atelier/`、`creme-dessert`→`/creme/`、`forge-trades`→`/forge/`、`mario-pizza`→`/mario/`、`mono-coffee`→`/mono/`、`patisserie-v2`→`/patisserie/`、`chambers-law`→`/chambers/`。
   用 PROJS key 去核对线上会**误报 404**。核对线上一律用 `slug`。

2. **`build-clean.sh` 有意不设 `set -e`，但已加「失败闸门」** —— 循环逐个构建便于暴露所有失败；循环结束若发现**任何构建失败或 dist 缺失**，`exit 1` 让 Actions 变红（不再假成功）。部署后**仍须**核对 sitemap 实际条数 + 抽查若干站 HTTP 200，不能只看 Actions 绿勾。

3. **`generate.mjs` 有真实 safe-delete 守卫**：构建前校验 `projectName` 合规（`^[a-z0-9][a-z0-9-]*$`）且 `outputDir` 确实落在 `output/` 内，否则 `process.exit(1)` 拒绝删除。
   这防止 `slug`/`name` 异常（如 `".."`）让 `rmSync` 递归误删整个工程。重置 output 用 `mv output ../oldbuild_<时间戳>` + `mkdir output` 即可（rename 非 delete）。**禁用 `rm -rf output/*`**。

4. **git push 走 SSH（`github.com` → `ssh.github.com:443`），WorkBuddy Bash 沙箱会拦截读 `~/.ssh/config`**。
   所有 `git push`（或任何走 ssh config 的 git 操作）**必须带 `dangerouslyDisableSandbox:true`**，否则回退 `github.com:22` 被墙报 `Connection refused`。SSH 公钥已注册，无需 PAT。

5. **`outreach/` `business/` `business-kit/` `clients/` 均 gitignored（私有 CRM/客户交付/内部数据）**——**绝不可 `git add -A` 或 `git add -f`**。已上**双技术防线**：①本地 `.githooks/pre-commit` 钩子扫描暂存文件，命中即中止提交；②`deploy.yml` CI 步骤 `git ls-files` 扫敏感目录，命中即 `exit 1` 兜底。`clients/README.md` 为例外放行。

### B 组 · FifthStar 获客系统（独立仓 thefifthstar / thefifthstar-live）

6. **FifthStar 不走 `deploy.yml`，是手动部署**。线上仓 `lcclicheng/thefifthstar`（本地 clone = `thefifthstar-live/`）是 **main 分支 root 原生部署**，无 workflow。改线上两步：①改源仓 `gh-pages-build/products/fifthstar/` 对应文件 → ②手动 `cp` 进 `thefifthstar-live/` 再 `git add` 指定文件 + `commit` + `push`（必须 `dangerouslyDisableSandbox:true`）。**源仓 `products/fifthstar/` 是唯一事实源**，线上仓只是它的镜像，不要直接改线上仓（否则下次从源仓 port 会冲掉）。

7. **主题可覆盖架构（视觉铁律）**：品牌金 `--gold` **恒定不破系统**（nav-cta/btn-gold/eyebrow/stars/footer/sig-mark 全用它）；每个品类页在 `<head>` 内联 `<style>:root{--accent/--accent-soft/--accent-line/--accent-glass/--head-font/--body-font}</style>` 覆盖换色换字体（位于 `assets/base.css` 的 `<link>` 之后级联生效）。**页面差异化必须同时是「配色 + 字体 + 排版骨架」三者**（用户原话"不只是排版，还有颜色、字体"），单换色不够。

8. **真实数据零失真（红线）**：占位页诚实标 **"Be the first"**，绝不编假评价数/评分/案例。回评样例必须真能复制粘贴到 Google。外联里引用的商家评分/评价数必须真实（源自 OSM/真实 GBP）。

9. **`_preview/` 组装 + 链接校验（部署前必做）**：把源仓 `products/fifthstar/` 下的 `integrated-offer.html`→`_preview/index.html`、`assets/`→`_preview/assets/`、`vendor/`→`_preview/vendor/`、`ethan.jpg`、以及 6 个品类目录 + `clients/` 拷进 `_preview/`。**所有内部链接必须用显式 `index.html`**（GitHub Pages / 静态托管无 SPA fallback，`<a href="restaurant/">` 会 404，必须 `<a href="restaurant/index.html">`）。部署前跑脚本校验：所有 `href` + `src` 相对路径都能 `os.path.exists` 解析（实测 36 href + 40 src 全 resolve 零断链）。

10. **双仓隔离 + 域名/收款约束**：①`gh-pages-build` 仅作 FifthStar 内部策略源，不部署、不污染公开 demo 仓；②域名 `thefifthstar.site` 在**国内云厂商注册**（腾讯云/DNSPod，微信/支付宝付——你的卡不支持境外支付，Cloudflare/Porkbun/Namecheap 刷不了），NS 改到 Cloudflare 享免费 DNS/SSL/CDN；③SSL 模式必须 **Full (strict)**，选 Flexible 必死循环（重定向次数过多）；④Cloudflare **Email Routing 仅转发收信**（`hello@thefifthstar.site`→`lic28790@gmail.com`），**发信仍用 Gmail 直接用 lic28790@gmail.com**（不要从 hello@ 发，否则需额外 SMTP）；⑤**收款走 PayPal**（中国个人账户可收跨境 GBP，UK 客户用任意卡/余额/guest checkout，邮件发账单，卡信息不经手我方）——你的卡只限制"往外付钱"，**不影响收英镑**。

---

## 1. 项目一句话定位（两条产品线）

一人公司 **lcclicheng**，对外署名 **Ethan Li**，邮箱 **lic28790@gmail.com**。面向英国小商家做**高端建站 + AI 声誉管理**两条产品线，共用一套零服务器获客/部署机器：

- **产品线 A · 建站 demo 引擎**：Vite + React18 + TS + Tailwind v3 模板引擎，填内容一键生成多个行业样板站，GitHub Pages 零服务器部署（仓 `lcclicheng/demo-sites`，本地 `gh-pages-build/`）。
- **产品线 B · FifthStar 声誉管家（领先产品 / 冷启动楔子）**：用「免费帮商户回 Google 评价」拿下零客户与现金流，再 upsell 到建站。线上落地页独立仓 `lcclicheng/thefifthstar`（域名 `thefifthstar.site`），含枢纽页 + 6 品类展示页 + 2 真实商户页。

**关系**：FifthStar 是获客前端（先拿到客户 + 月订阅），建站是 upsell（已信任客户自然升级）。两条线共享：冷外联框架、GitHub Pages 部署经验、SSH 443 推送、反网红高端调性、MDD 文档纪律。

> **战略总纲（2026-07-23 升级）**：本项目已从"建站工具 + 获客脚本"演进为 **FifthStar OS —— 面向英国本地商家的 AI 增长操作系统**（五引擎：Growth / Service / Customer / AI OS / Data Contracts）。完整经营架构、Sales SOP、Customer Journey、KPI Dashboard、Delivery/Renewal/Learning Loop、Client Portal 设计、70/30 验证指令，见 **`FifthStar-Business-Operating-System-v1.0.md`**（本仓根目录，主交付物）。本文件是"接手操作总纲"，BOS 是"经营战略总纲"，两者配合。

---

## 2. 目录地图（只看有意义的，已排除构建产物）

```
gh-pages-build/
├── AGENT-ONBOARDING.md      ← 本文件（agent 接手操作总纲）
├── FifthStar-Business-Operating-System-v1.0.md  ★ 经营战略总纲（五引擎 + SOP + KPI + 验证指令）
├── generate.mjs             ★ 模板引擎主入口：node generate.mjs ./examples/<slug>.json 单站构建
├── build-clean.sh           ★ 全量构建脚本：PROJS 唯一事实源，循环构建 + dist 校验 + 失败闸门
├── validate-sites.mjs       部署前校验门（本地先跑，EXIT=0 才 push）
├── gen-seo.mjs              sitemap/SEO 生成
├── README.md / CHANGELOG.md / docs/  项目说明 + 变更日志 + 主题文档系统（27 篇 + 项目运营手册.html）
├── index.html               门户
├── .github/workflows/       deploy.yml(主管线) / consistency-check.yml / health-check.yml
├── src/                     ★ 模板引擎源码（visual.tsx 招牌系统 + 8 legacy 行业模板 + sectioned 统一范式）
├── examples/                ★ 站点 JSON（构建事实源，含 slug 字段——见铁律 A1）
├── assets/                  商家图片（og.jpg 等）
├── business/ 🔒 BOS 业务运营框架（gitignored）
├── business-kit/ 🔒 客户交付模板（合同/提案/隐私/话术/定价，gitignored）
├── clients/ 🔒 客户档案（gitignored，clients/README.md 例外放行）
├── outreach/ 🔒 外联 CRM（fifthstar-leads.json 事实源 + 商家清单.md CRM + send-outreach.mjs，整目录 gitignored）
├── uk-biz-finder/           英国商家批量搜索（Overpass/OSM，leads_scan2.py 已扫八城 937 家）
├── products/fifthstar/      ★★ FifthStar 资产（策略源 + 线上源，详见 §4）
├── contracts/                ★ 统一数据契约（business-profile/lead/customer 三 schema + DATA-MODEL.md，P0 数据模型）
├── lead/                     ★ Lead Memory（_template + init-lead.mjs；实例化 lead/<slug>/ gitignored，含真实 PII）
├── metrics/                  ★ KPI 指标层（sales/delivery/retention/growth，P0）
├── customer-system/          ★ Customer Lifecycle 中段（onboarding/renewal/referral/feedback-loop，P1）
└── .ai/ .githooks/ decisions/ memory/ state/ tasks/ playbooks/ contracts/ knowledge/ checklists/ templates/ blog/  （MDD v4 骨架）

thefifthstar-live/           （同级，独立仓克隆，线上事实源镜像）main 分支 root 部署 thefifthstar.site
```

🔒 = gitignored（客户/内部/隐私数据，不进公开仓库，见铁律 A5）。

---

## 3. 产品线 A · 建站 demo 引擎：构建 / 部署流程

**事实源**：`build-clean.sh` 里的 `PROJS` 数组 = 全站重建唯一清单。`examples/<slug>.json` 每个站一个（含 `slug`/`businessType`/`name`/`theme`/`signature`/`mood`）。

- **单站构建**：`node generate.mjs ./examples/<slug>.json` → 产物 `output/<slug>/dist/`
- **全量构建**：`bash build-clean.sh`（循环 PROJS；构建后 grep `output/<slug>/dist/assets/*.css` 确认成功；失败/缺失 dist 触发失败闸门 exit 1，见铁律 A2）
- **本地校验**：`node validate-sites.mjs`（EXIT=0 才能 push）
- **部署**：仅 `git add` 指定源文件（**绝不 -A**）→ `git commit` → `git push origin main`（**必须 `dangerouslyDisableSandbox:true`**）→ Actions 自动跑完上线
- **线上核对**：取各站 `slug` 拼 `https://lcclicheng.github.io/demo-sites/<slug>/`，查 HTTP 200 + 抽查 CSS 含 `sig-watermark`

> 本地 `output/`、`node_modules/`、`public/`、`build-logs/` 全 gitignored；你本地改的是**源文件**，Actions 从源重建。

---

## 4. 产品线 B · FifthStar 获客系统（完整架构）

> 源仓：`gh-pages-build/products/fifthstar/`（策略源 + 线上唯一事实源）。线上：`thefifthstar.site`（独立仓 `thefifthstar-live`）。

### 4.1 产品定义 + 双轨模型

**产品**：FifthStar「声誉管家」——给英国本地实体商户（餐厅/咖啡/沙龙/律所/瑜伽/家装/酒店…）做 AI Google 评价回复 + 声誉监测 + 主动求评。
**楔子→建站 上升阶梯**：`免费 3 条评价回复样例` → `£29/月 Starter` → `£79/月 Pro` → 信任后 upsell `£590 建站 + 首月不限改` → `£390/年 Care + AI 接待`。

**双轨获客（2026-07-23 融合 v0.3）**：首触统一冷钩子 = **「免费 3 条 Google 评价回复草稿」**；A/B 分叉（A=无站→£590 建站 / B=有站→£29/£79 订阅 + widget）移到**回信后**跟进阶段，不在首触区分。
- **轨 A（无官网，建站楔子）**：痛点最强，Stage1 +30。
- **轨 B（有官网，声誉订阅）**：痛点弱，Stage1 −20，走订阅 + 评价 widget。

### 4.2 Sales Engine（获客操作系统）

六层：`Lead Collector(OSM) → Enrichment(网站/邮箱爬) → Intelligence(评分/ICP) → Outreach(邮件生成) → CRM(状态机) → Feedback Loop`。零服务器（全本地脚本 + JSON/MD，不起后端/数据库；v1.5 若需更强存储优先本地 SQLite 文件）。

**数据源**：主源 **OSM/Overpass**（`uk-biz-finder/leads_scan2.py`，已扫八城 **937 家**真实商家，零捏造）。Google 评分/评价 OSM 无 → **Stage2 发送时人工扫 GBP 补**（enrich-at-send，零成本合规）。已核实可直发名单 `verified-leads.json` **57 家**；`fifthstar-leads.json` **36 家**为 `send-outreach.mjs` 事实源；`商家清单.md` 为人类 CRM 追踪。两者均 gitignored。

**两阶段评分**（满分 100，进池阈值 **>70**）：
- **Stage1 自动**：无官网 +30 / 旧劣质官网 +20 / 行业高价值(law·hotel) +20 / 行业标准(salon·restaurant·coffee·trades) +15 / 城市未饱和 +15 / 已有专业官网 −20。
- **Stage2 发送时人工**：Google 评分 3.8–4.5 +20 / Review 100+ +20(500+ +30) / 最近评论有人未回 +25 / Facebook 活跃 +10。
- **最终进池 7 家**（全部无站=Track A 建站楔子）：McEwan Fraser Legal(ed) · Optimal(man) · Meat Shack(bir) · Delhi Wala(lee) · A&B Lawyers(lee) · Brown Turner Ross(liv) · Sabz(man)。详见 `sales-engine/final-pool.md`。
- **关键发现**：多数高分律所 rating>4.5 且评<100 → Stage2 不给分 → 卡 65。故 **enrich-at-send 时人工扫 GBP** 是补分关键。

**外联发送**：`outreach/send-outreach.mjs`（v3，gitignored）——按 `fifthstar-leads.json` 的 `track` 分支正文；合规闸门：Track B 发送前强制 `observation` 人工填（空则 BLOCKED）、`--cap` 默认 25、`List-Unsubscribe` + `reply STOP` 退订合规。真实发送需 `SMTP_PASS`。**真实发送已 DONE**（2026-07-22 夜 19 封测试批成功；域名/Email Routing 已验证）。

### 4.3 线上多页站点架构（已上线 2026-07-23，commit `df23532`）

```
thefifthstar.site/
├── index.html                  枢纽页（= integrated-offer.html：FifthStar 介绍/收费/承诺 + 6 张品类导航卡 "Browse by business type"）
├── integrated-offer.html      同内容别名（防外链断）
├── restaurant/index.html      品类展示页
├── law/index.html
├── salon/index.html
├── trades/index.html
├── yoga/index.html
├── hotel/index.html
├── clients/
│   ├── delhi-wala/index.html   真实商户页（Delhi Wala, Leeds, 1,017 评价）
│   └── mcEwan-fraser/index.html 真实商户页（McEwan Fraser, Edinburgh, 934 评价）
├── assets/base.css             共享设计系统（工具类 + 主题可覆盖骨架）
├── assets/site.js              GSAP 自托管动效（reveal + SplitText + 水印视差，渐进增强）
├── vendor/gsap.min.js · ScrollTrigger.min.js · SplitText.min.js   GSAP 3.13.0 自托管
├── ethan.jpg                   Ethan Li 署名头像
└── CNAME                       thefifthstar.site
```

**部署结果**：GitHub Pages 约 75 秒构建完成，**13 个端点 curl 实测全 200**（根 + 6 品类 + 2 商户 + base.css + site.js + gsap + ethan.jpg）。

**占位页诚实标注**：salon/trades/yoga/hotel 各 0 家真实 lead → 示例卡诚实标 **"Be the first"**，不编数字（铁律 B8）。

### 4.4 视觉差异化系统（6 家族，已落地）

品牌金 `--gold` 恒定（跨页统一锚）；每家族独立 **accent 配色 + 标题字体 + 排版骨架**（铁律 B7 三者同时差异化）：

| 家族 | accent | 标题字体 | 排版骨架 |
|---|---|---|---|
| restaurant | `#e0933b` 暖姜黄 | Fraunces | `.hero-word` "Taste" + 沉浸堆叠 + Delhi Wala 1,017 |
| law | `#6f7d8c` 冷石板 | Playfair Display | `.two-col` + McEwan Fraser 934 |
| salon | `#cf8aa3` 莓粉 | DM Serif Display | `.hero-word` "Style" + `.grid-2` why |
| trades | `#b5532e` 砖锈橙 | Archivo | `.hero-word` "Trade" + `.stack` of `.svc` |
| yoga | `#7fa07a` 鼠尾草绿 | Spectral | 双 breathe-ring + `.stack.center`（**无 hero-word**） |
| hotel | `#5b6b9e` 墨蓝 | Cormorant Garamond | `.band` 伪 hero 图带 + "Stay" |

**base.css 工具类**（每页直接 hook）：`.hero-word`（描边大字水印）· `.accent-rule(.center)` · `.grid-2` · `.two-col` · `.stack(.center)` + `.stack-item` · `.svc`（左侧 accent 边框）· `.band`（伪 hero 图带块）。
**动效**：`assets/site.js` 用 IntersectionObserver reveal + GSAP SplitText 逐字 + 水印视差，尊重 `prefers-reduced-motion`；`html.gsap-hero` 预隐藏兜底；`<noscript>` 兜底让 JS 关时内容仍可见。**BUG 修复记录**：`integrated-offer.html` 第 38 行 `font-variant-numeric:oldstyle-nums` 曾缺 `;` 吞掉后续属性，已补（铁律 B9 校验覆盖）。

### 4.5 部署流程（独立仓，手动）

```bash
# 1) 在源仓改文件（gh-pages-build/products/fifthstar/...），例如改品类页
# 2) 组装 _preview 校验链接（铁律 B9）
SRC=.../products/fifthstar/_preview; DST=.../thefifthstar-live
cp "$SRC/index.html" "$DST/index.html"; cp "$SRC/index.html" "$DST/integrated-offer.html"
for d in restaurant law salon trades yoga hotel; do cp -r "$SRC/$d" "$DST/"; done
cp -r "$SRC/clients" "$DST/"; cp -r "$SRC/assets" "$DST/"; cp -r "$SRC/vendor" "$DST/"
# 3) 跑链接校验脚本（36 href + 40 src 全 resolve 才能推）
# 4) 提交（只 add 指定文件，绝不 -A）+ push（必须沙箱外）
cd thefifthstar-live && git add index.html integrated-offer.html restaurant/ law/ salon/ trades/ yoga/ hotel/ clients/ assets/ vendor/ CNAME ethan.jpg
git commit -m "..." && git push origin main   # 调用时 dangerouslyDisableSandbox:true
```

> **预览方式**：CloudStudio 部署 `_preview/` 看实时效果（沙箱预览，非生产）；生产以 `thefifthstar-live` push 为准。两者内容应一致。

### 4.6 域名 / 收款（见 `products/fifthstar/domain-setup.md` 全文）

- **域名注册**：腾讯云/DNSPod（微信/支付宝付，你的卡不支持境外），实名模板过审，开自动续费。
- **DNS/SSL**：NS 改 Cloudflare（Free），DNS 加 apex/www CNAME → `lcclicheng.github.io`；SSL 模式 **Full (strict)**；Enforce HTTPS。
- **邮箱**：Cloudflare Email Routing 转发 `hello@thefifthstar.site`→`lic28790@gmail.com`（仅收；发用 Gmail）。
- **收款**：PayPal 中国账户收跨境 GBP，UK 客户卡/余额/guest checkout，邮件账单，卡信息不经手。

---

### 4.7 经营系统层（BOS v1.0 · P0/P1 已落地 2026-07-23）

原系统"只有获客+交付、没有经营中段"。v1.0 补齐为闭环操作系统，详见 `FifthStar-Business-Operating-System-v1.0.md`：

- **统一数据模型（P0）**：`contracts/business-profile.schema.json` 为唯一事实源，收编旧三格式（examples JSON / lead-schema.md / fifthstar-leads.json），`DATA-MODEL.md` 映射表零破坏适配。纠正旧文档"有 lead_score 字段"错误（真实数据无）。
- **Lead Memory（P0）**：`lead/_template/`(6 文件) + `init-lead.mjs`，为 6 家 P0x 热线索实例化 `lead/<slug>/` 长期资产（已被 gitignore 保护 PII）。
- **KPI Metrics（P0）**：`metrics/{sales,delivery,retention,growth}.md` + README，定义商业漏斗 Free→£29→£79→£590→£149/mo 与 Delivery Automation Ratio（资料90/生成95/SEO80/修改50）。
- **Customer Lifecycle（P1）**：`customer-system/` 补齐成交→交付→续费→推荐→再获客中段（onboarding/renewal/referral/feedback-loop）。
- **Client Portal / AI Learning Loop（P1 设计）**：零服务器静态仪表盘设计 + 五层记忆学习闭环，见 BOS §9/§10。

> ⚠️ **定价冲突待拍板**：BOS 漏斗写 Care = **£149/mo**（按用户 BOS 指令）；此前 `docs/pricing.md` / 项目记忆记 Care = **£390/年**。上线前须用户确认并同步 `docs/pricing.md` + 本文件 §4.1。

## 5. 视觉系统（建站引擎，theme-agnostic）

`src/components/visual.tsx` 是共享视觉核心，**所有组件不得硬编码品牌色**：用 `currentColor` + `color-mix` 跟随主题（每站 THEMES 覆盖 `accent`）。**招牌签名系统**（本项目 IP）：17 个行业 SVG motif（全部 `stroke="currentColor"`），`deriveSignature(d)` 自动映射，`HeroBackdrop` 有签名水印层。**Mood 系统**（v0.10，数据驱动）：example JSON 可加 `"mood":{deco,hero,sig,cta}` 调装饰密度/构图/**绝不调色**；`getMood(d)` 兜底默认不报错。
❌ 禁止 JSX 内联 `<style>` 逃避 THEMES 替换。

---

## 6. src/ 模板源码结构

```
src/
├── main.tsx / App.tsx / business-data.ts / index.css
├── coffee/ dessert/ hotel/ law/ restaurant/ salon/ trades/ yoga/   8 个 legacy 行业模板
├── sectioned/        ★ 新统一范式（3 色系统 surface/ink/accent + 共享 visual.tsx，逐站 THEMES 覆盖）
└── components/
    ├── visual.tsx        ★ 招牌签名系统 + Mood 系统
    └── sections/         12 区块（Hero/Footer/Menu/Gallery/Booking/Faq/Reviews/Story/Team/Location/Instagram/InfoBar）
```
> 改动视觉/招牌：优先改 `visual.tsx` + `generate.mjs` 的 `VISUAL_CSS` + `components/sections/Hero.tsx`，再按 §3 重建部署。

---

## 7. 设计 / 建页任务必用 skill

- **`independent-site-design`**：所有「建站 / 重做页面 / 设计落地页」类任务先加载。四层融合：编辑型主题无关视觉语言 + 招牌 motif 系统 + 三素材库（motionsites/react-bits/uiverse，只作灵感、差异化重写）+ gh-pages-build 部署集成。
- **`web-design-dispatcher`**：建页路由总入口，盘点本项目全部建页 skill，按任务路由到正确子 skill，守住跨 skill 共享铁律。
- **`uk-biz-outreach` / `uk-biz-site-asset-pipeline` / `uk-biz-lead-finder`**：外联/资产流水线/商家搜索。

**铁律 7（差异化、禁止直接复制）**：三素材库只作灵感源，**必须差异化重写实现**，肉眼不应认出是某素材库条目复制品。判定标准：能认出复制品即违规。

---

## 8. 当前状态（2026-07-23）

**✅ 已完成（2026-07-23 · BOS v1.0 落地）**
- **经营系统升级**：项目从"建站工具+获客脚本"演进为 **FifthStar OS（AI 增长操作系统，五引擎）**。主交付物 `FifthStar-Business-Operating-System-v1.0.md`（五引擎架构 + Sales SOP + Customer Journey + KPI Dashboard + Delivery/Renewal/Learning Loop + Client Portal 设计 + 70/30 验证指令）。综合评分 8.2→9.0。
- **P0 三件套 DONE**：
  - 统一数据契约 `contracts/`：`business-profile.schema.json`(唯一事实源) + `lead.schema.json` + `customer.schema.json`(draft2020-12) + `DATA-MODEL.md`（纠正旧 lead-schema.md 与真实数据不符：真实 fifthstar-leads.json **无 lead_score**，键名 name/stars/reviews 非 business_name/google_rating/review_count）。
  - Lead Memory `lead/`：`_template/`(6 文件) + `init-lead.mjs`；为 6 家 P0x 热线索（P01–P06，Track A 无官网）实例化 `lead/<slug>/`；`.gitignore` 已保护真实 PII。
  - KPI Metrics `metrics/`：sales/delivery/retention/growth + README，定义商业漏斗 + Delivery Automation Ratio。
- **P1 中段 DONE**：`customer-system/`（customer-profile/onboarding/success-metrics/renewal/referral/feedback-loop + README），补齐成交→续费→推荐闭环。
- **建站引擎**：45 个 demo 站全部主题自适应 + 招牌 motif，已部署（sitemap 46 条全 200）。MDD v4 文档体系（docs/ 27 篇 + 项目运营手册.html）。
- **安全加固**（commit `c2549a5`）：safe-delete 守卫 / build-clean 失败闸门 / outreach 泄漏双防线 / validate 重复 slug / deploy 回滚产物保留。
- **FifthStar 全链路上线**：
  - 品牌定 FifthStar；落地页独立仓 `thefifthstar.site`（腾讯云注册 + Cloudflare DNS/SSL/Email Routing 全配）。
  - **8 页差异化终版已上线**（commit `df23532`，2026-07-23 push `b12977b..df23532`）：枢纽页 + 6 品类（各独立 accent+字体+骨架，品牌金恒定）+ 2 真实商户页（Delhi Wala 1,017 / McEwan Fraser 934）。13 端点 curl 全 200。
  - GSAP 自托管 + noscript 兜底 + "How to pay" 段（PayPal）已上线。
  - **双轨融合 v0.3**：首触统一「免费 3 条评价回复」；Sales Engine Stage1+Stage2 评分跑出 final-pool 7 家。
  - **真实外联发送 DONE**（2026-07-22 夜 19 封测试批成功）。

**🟡 进行中 / 待办**
- 外联首批回信后起草 B 类跟进 + 建站 upsell 话术；商家同意后的替换上线。
- 放量阶段（日 50+）评估是否接 Google Places API 自动补 Stage2 评分。

---

## 9. 记忆系统（让 agent 持续对齐上下文）

- **自动注入**：`.workbuddy/memory/MEMORY.md`（项目长期记忆，含铁律/定价/视觉系统/部署坑）。
- **每日日志**：`.workbuddy/memory/2026-MM-DD.md`（追加式，不可覆盖）。
- **跨项目偏好**：`~/.workbuddy/MEMORY.md`（Ethan Li 署名、SSH 443 沙箱坑、文件全放 D 盘、国内卡支付约束、MDD v4 等）。
- **AI 五层记忆（BOS 目标）**：`system/project/business/customer/learning`（升级自当前 `memory/core/`+`memory/runtime/` 两层）。当前仓库 `memory/` 仍为 core/runtime，迁移待办见 BOS §9；`.workbuddy/memory/MEMORY.md` 已含项目级长期记忆。
- 新 agent 第一件事：读 `MEMORY.md` + 今日日志 + 本文件，再动手。

---

## 10. 常用命令速查

```bash
# === 建站引擎（gh-pages-build）===
cd gh-pages-build
bash build-clean.sh                         # 全量构建 45 站
node generate.mjs ./examples/<slug>.json    # 单站构建
node validate-sites.mjs                     # 部署前校验（EXIT=0 才 push）
git add <具体文件...> && git commit -m "..." # 绝不 -A
git push origin main   # 调用时 dangerouslyDisableSandbox:true
curl -s -o /dev/null -w "%{http_code}" https://lcclicheng.github.io/demo-sites/<slug>/

# === FifthStar（thefifthstar-live，独立仓）===
# 源改：gh-pages-build/products/fifthstar/... → 手动 cp 进 thefifthstar-live/ → 链接校验 → add 指定文件 → commit → push(沙箱外)
curl -s -o /dev/null -w "%{http_code}" https://thefifthstar.site/
curl -s -o /dev/null -w "%{http_code}" https://thefifthstar.site/restaurant/index.html

# === 外联（outreach/，gitignored）===
node outreach/send-outreach.mjs --dry-run --track A   # 试装配不发送
node outreach/send-outreach.mjs --cap 25 --track A     # 真实发送（需 SMTP_PASS）
```

---

## 11. 禁做清单（红线）

**A 组（建站引擎）**
- ❌ `git add -A` / `git add .`（泄漏 outreach/ 真实邮箱 / 推上 business-kit）
- ❌ 用 PROJS key 去核对线上 URL（用 `slug`）
- ❌ 只看 Actions 绿勾就认为全站上线（必核 sitemap 条数 + 抽查 HTTP 200）
- ❌ `rm -rf output/*`（破坏守卫语义）；重置用 `mv output ../oldbuild_<时间戳>` + `mkdir output`
- ❌ `git push` 不带 `dangerouslyDisableSandbox:true`（SSH 443 通道，沙箱拦截会 Connection refused）
- ❌ 设计任务直接复制 motionsites/react-bits/uiverse（必须差异化重写）
- ❌ 在 JSX 内联 `<style>` 逃避主题替换
- ❌ 改动 `outreach/` `business/` `business-kit/` `clients/`（gitignored，改了也不进仓）

**B 组（FifthStar）**
- ❌ 直接改线上仓 `thefifthstar` 而不改源仓 `products/fifthstar/`（源仓是唯一事实源，下次 port 会冲掉）
- ❌ 内部链接用 `<a href="dir/">` 而非 `<a href="dir/index.html">`（静态托管无 SPA fallback → 404）
- ❌ 占位页编假评价数/评分（必须 "Be the first"）
- ❌ 页面只换色不换字体/骨架（差异化须三者同时）
- ❌ 部署前不跑链接校验（36 href + 40 src 必须全 resolve）
- ❌ Cloudflare SSL 选 Flexible（必死循环，须 Full/Full strict）
- ❌ 从 `hello@thefifthstar.site` 发信（仅收，发用 Gmail lic28790@gmail.com）
- ❌ 用境外卡注册域名（Cloudflare/Porkbun 刷不了，走国内腾讯云/阿里云）

---

## 12. 部署回滚

**建站引擎（GitHub Pages 覆盖式）**：
1. **最快**：`git revert <坏提交>` → `git push origin main`（必须沙箱外），Actions 重跑约数分钟回到坏提交前。
2. **保留期内重跑旧部署**：Pages artifact `retention-days:30`，Actions → 选历史成功 Deploy run → Re-run all jobs。
3. **定点修源码再 push**：已知坏在哪直接改 `examples/<slug>.json` 或 `generate.mjs` 修好 → commit → push。
> 回滚后必核 sitemap 条数 + 抽查 HTTP 200。

**FifthStar（独立仓，同上述 revert/修源码两法）**：`thefifthstar-live` 走 main root 部署，revert 或改源仓重 port 皆可；CNAME/Email Routing 不变。

---

## 13. 架构 / 流程改动必须同步文档（变更同步纪律）

**铁律**：任何「架构 / 构建 / 部署 / 安全 / 视觉系统 / 产品线」改动，落地代码的同时**必须同步更新对应文档**，否则新 agent 会读到过时甚至错误的信息（本项目已踩过「文档描述不存在的守卫」的坑）。

**改动类型 → 必改文档**：

| 改了什么 | 同步更新 |
|---|---|
| `generate.mjs` / `src/` / 视觉系统 | `docs/architecture.md` · 本文件 §5/§6 |
| `build-clean.sh` / `deploy.yml` / CI | `docs/deployment.md` · 本文件 §3/§12 · `CHANGELOG.md` |
| FifthStar 站点/部署/视觉 | 本文件 §4 · `products/fifthstar/*.md` · `CHANGELOG.md` |
| 定价 / 套餐 | `docs/pricing.md` · `CHANGELOG.md` |
| 新增/改文档本身 | `docs/index.md` · `README.md` · `CHANGELOG.md` |
| 任何对外/安全相关 | `CHANGELOG.md`（时间戳条目，变更历史单一事实源） |

**必做**：每次改动在 `CHANGELOG.md` 加一条带日期 + commit 的条目。文档以「主题文件」为准，本文件为整合视图、随主题文件同步。
