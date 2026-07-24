# FifthStar OS 技术架构（多页落地页系统）

> 本文档是 **FifthStar OS**（面向英国本地商家的 AI 增长操作系统，本项目的领先产品）的**架构与目录结构单一事实源**。
> 配套：双轨获客与销售引擎见 `products/fifthstar/sales-engine/`；定价见 `docs/pricing.md`；总览见 `docs/PROJECT-OVERVIEW.md`；接手总纲见 `AGENT-ONBOARDING.md` §0「B 组」。
> 与 A 组（demo-sites 模板引擎）的区别见本文 §7。

---

## 1. 产品定位与双仓模型

FifthStar 是「本地商家增长伙伴」：用 **免费 3 条 Google 评价回复草稿** 拿下零客户与现金流（Lead 钩子），再 upsell 到建站与声誉订阅。网站是 loss-leader 楔子，声誉管理是留存引擎，数据是护城河（SaaS + Service Hybrid）。

**双仓架构（唯一事实源在源仓）**：

- **源仓（事实源）**：`gh-pages-build/products/fifthstar/`。所有页面源文件、共享设计系统、策略文档在此编辑。
- **线上仓（镜像）**：`lcclicheng/thefifthstar`（本地 clone = 同级 `thefifthstar-live/`），`main` 分支 root 原生部署到 `thefifthstar.site`。**只从源仓 port，绝不直接改线上仓**（否则下次 port 冲掉）。

> 部署不走 `demo-sites` 的 `deploy.yml`（那是给 example 站的），是**手动 `cp`**。

---

## 2. 多页结构（1 枢纽 + 6 品类 + 2 干净商户）

```
thefifthstar.site/  (线上仓 thefifthstar-live/ root)
├── index.html                 ← 枢纽页 = 源仓 integrated-offer.html（收费/承诺/Ethan/widget + 6 品类卡片区）
├── restaurant/index.html      ← 餐饮品类展示页
├── law/index.html             ← 律所品类展示页
├── salon/index.html           ← 沙龙品类展示页
├── trades/index.html          ← 家装品类展示页
├── yoga/index.html            ← 瑜伽品类展示页
├── hotel/index.html           ← 酒店品类展示页
├── clients/
│   ├── delhi-wala/index.html      ← 干净商户页（仅业务+真实评价+真实 FifthStar 回评草稿+署名，无收费/承诺/Ethan 模块）
│   └── mcEwan-fraser/index.html
├── reputation-demo/index.html ← B 轨演示页：模拟商户站真实嵌入 review widget + AI 回评草稿闭环（对外演示资产，#434 新增，已进线上仓）
├── widget/
│   └── review-widget.html      ← 可嵌入评价 widget snippet（商户粘贴用）；config <script> 必须在 snippet 之前（#434 修复顺序 BUG）
├── assets/                    ← 共享设计系统（base.css 自适应主题 + site.js 共享脚本 + hub.css/hub.js 枢纽专属）
├── vendor/                    ← GSAP / ScrollTrigger / SplitText（本地化 min.js）
├── ethan.jpg                  ← 创始人头像
└── CNAME                      ← thefifthstar.site（Cloudflare + GitHub Pages）

> 源仓内部、不进线上仓的目录/文件：`rehearsal/`（排练预览）、`widget-delivery-sop.md`（交付 SOP）、
> `DESIGN-LANGUAGE-v1.0.md`、各类 `*_AUDIT*.md` / `*_REPORT*.md`（审计/测试报告）。线上仓已含 `widget/`（公开 snippet）。
```

- **枢纽页**是生产 `index.html` 的源，承载收费 / 承诺 / Ethan / widget + 6 品类卡片。
- **6 品类页**是垂直展示页，承接枢纽页分流。
- **2 干净商户页**（`clients/`）只放业务介绍 + 真实评价 + 真实 FifthStar 回评草稿 + 底部署名 `fs-credit`，**绝不含任何 FifthStar 收费 / 承诺 / Ethan 模块**——用于对外展示真实交付样例而不泄露商业话术。

---

## 3. 共享设计系统

- `assets/base.css`：统一设计语言（主题自适应 + 所有组件）。用 `currentColor` + `color-mix` 实现亮暗主题自适应，避免硬编码。
- `assets/site.js`：共享脚本（reveal 动画 + GSAP 共享，含三重兜底）。
- `assets/hub.css` / `assets/hub.js`：**枢纽页专属**（2026-07-24 P2 重构从内联抽取）。`<head>` 先 `<link base.css>` 再 `<link hub.css>`（hub.css 胜出）；hub.css 末段含两处守卫：①`.hero::before{content:none}` 中和 base.css-only 径向光晕；②图标版 `.cat-card` override 守卫（base.css 图标版 `.cat-card` 复合选择器特异性高于 hub 编辑版单类规则，会压扁标题/变灰 `.cat-why`/错位箭头，故用等于/高于特异性重述 hub 原值）。
- `vendor/`：GSAP 三件套（仅 CDN 本地化 min.js，离线可用）。
- `widget/review-widget.html`：可嵌入评价 widget snippet（纯前端 IIFE，显示商户真实公开 Google 评价）。**`config <script>` 必须在 snippet `<div>` 之前**——IIFE 同步读 `window.FIFTHSTAR_REVIEW_WIDGET`，顺序反了会渲染 0 张卡片（#434 修复的致命 BUG）。
- `reputation-demo/`：B 轨对外演示页，模拟商户站真实嵌入 widget + 自建「AI 回评草稿」闭环组件（新评价 → 草稿 → 采纳/编辑/驳回），纯前端交互，供对外演示 B 轨闭环用。
- 视觉一致 + 角色辨识，反网红化。

---

## 4. 链接策略铁律（双主机鲁棒）

- 所有内部相对链接**显式指向 `index.html`**（`restaurant/index.html`、`../clients/delhi-wala/index.html`、`../../index.html`），**不用裸目录**（`restaurant/`、`../`）。
- 原因：CloudStudio 预览服务器做 SPA fallback（无扩展名路径退回根 index.html），GitHub Pages 生产同样支持显式 `index.html`；一举双主机鲁棒。
- 部署核查一律用 `slug` 而非 `PROJS` key。

---

## 5. 定价（纯订阅制 v2 · 2026-07-24 Pricing v2）

| 档位 | 价格 | 定位 |
|---|---|---|
| Free | £0 | 3 条个性化 Google 评价回复草稿（Lead 钩子） |
| Reputation | £39/mo | Review monitoring / AI replies / Monthly insights（Track B，已有网站商家） |
| **Growth Partner** | **£79/mo** | **Most Popular**：Reputation + 免费专业网站 + Hosting + Local SEO + 月更新（Track A 无站落此档） |
| Growth Plus | £149/mo | 高阶溢出：SEO 内容 + 更多更新 + Priority support |

**免费建站交付边界**（防一人公司时间被吃）：template-based / ≤5 pages / 1 revision·月 / 7 天标准交付；超出按需收费。
**话术红线**：对外不写 "Free website — £79/mo"，改 "Build your online presence without upfront website costs" / "Your reputation, website and local growth — managed in one place"。

**付款周期（v2.1 · 2026-07-24，#431 校正）**：月/季(3mo)/半年(6mo)/年(12mo) 四周期可选，周期=付款节奏。季=3×月、半年=6×月（无折扣）；**年付享约 17% 折扣** → Reputation **£390/yr** · Growth Partner **£790/yr** · Growth Plus **£1,490/yr**（即标准月费×10 而非 ×12）。各档 `.t-cadence` 周期价行已落地（含 `save ~17%`）。
**新户首年欢迎价（v2.1 · 一次性，每商家限一次，任选档+任选周期）**：首 12 个月 Reputation £29/mo · Growth Partner £59/mo · Growth Plus £119/mo，之后回标准价。落地页 `.welcome-banner` 横幅 + 各付费档 `.t-cadence` 周期价行；外联冷邮件提及「季付/半年付/年付 + 新户首年欢迎价」。

> 口径厘清（#431）：**首年欢迎价**（£29/£59/£119/mo）是新户一次性钩子，仅首 12 个月；**年付折扣**（£390/£790/£1,490）是续费/长期付款激励，任何阶段可选。两者并存、互不影响——欢迎价到期回标准月费，年付则在标准月费基础上再省 17%。

---

## 6. 部署流程（手动 port）

```bash
# 1) 改源仓 products/fifthstar/ 对应文件（唯一事实源）
# 2) 组装预览（可选，CloudStudio 沙箱，非生产）：products/fifthstar/_preview/
# 3) 手动 port 到线上仓：
SRC=.../gh-pages-build/products/fifthstar
DST=.../thefifthstar-live
cp "$SRC/integrated-offer.html" "$DST/index.html"
cp "$SRC/integrated-offer.html" "$DST/integrated-offer.html"   # 备份
cp -r "$SRC/"{restaurant,law,salon,trades,yoga,hotel,clients,reputation-demo,widget,assets,vendor} "$DST/"
cp "$SRC/ethan.jpg" "$DST/"
# 4) 提交（保留线上仓既有 CNAME）
cd thefifthstar-live && git add index.html integrated-offer.html restaurant/ law/ salon/ trades/ yoga/ hotel/ clients/ reputation-demo/ widget/ assets/ vendor/ ethan.jpg CNAME
git commit -m "..." && git push   # 必须 dangerouslyDisableSandbox（SSH 443）
# GitHub Pages 从 main/root 自动部署，CDN 1–3 分钟刷新
```

> ⚠️ `products/fifthstar/_preview/` 是本地组装暂存（CloudStudio 预览用），**非事实源、可能滞后**；port 时一律从 `products/fifthstar/` 源复制，不要从 `_preview/` 复制。

---

## 7. 与 A 组（demo-sites 引擎）的区别

- **A 组**：`generate.mjs` 模板引擎 → 10 个 example 站 → Actions 自动部署到 `/demo-sites/<slug>/`。
- **B 组（本文）**：手工多页落地页 → 手动 port 到独立仓 `thefifthstar-live` → `thefifthstar.site`。
- 两者同仓（`demo-sites`）但不同部署通道；FifthStar 是领先产品 / 获客楔子，建站是其 upsell。
