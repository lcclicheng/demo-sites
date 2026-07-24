<!--
  主题文件：SEO 基础与内容营销
  来源：由 docs/workflow.md（v1.1.0）SEO 相关条目（§11 待办 SEO 基础、新增模板 SOP §3 SEO checklist）+ blog-pipeline.md 汇总（MDD 拆分，2026-07-16）
  维护：本文件是「SEO / 结构化数据 / Blog」主题的单一事实源。
-->

# SEO 基础与内容营销

> MDD 主题文件 · 索引见 `docs/index.md` · 一册通读见 `docs/PROJECT-OVERVIEW.md`
> 相关：架构见 `docs/architecture.md`｜Blog 脚手架见 `docs/blog-pipeline.md`

---

## 1. SEO 基础（generate.mjs 自动注入，v0.4 已落地）

每个站构建时 `generate.mjs` 会自动注入以下 SEO 元素，**无需手工写 `<head>`**：

- **`<title>` / `<meta name="description">`**：取自 JSON 的 `seo.{title,description}`；未填则回退到 `pageTitle` / `tagline`。
- **Open Graph（`og:title` / `og:description` / `og:image` / `og:url`）**：社媒分享卡片；`og:image` 取首张实景图（`assets/<slug>/` 第一张），确保分享有缩略图。
- **`<link rel="canonical">`**：指向该站在 `SITE_BASE_URL` 下的规范 URL，避免重复内容降权。
- **`sitemap.xml` / `robots.txt`**：部署时按 `PROJS` 生成全站 sitemap，`robots.txt` 允许抓取并指向 sitemap。

**`SITE_BASE_URL`**：所有绝对 URL（canonical / og:url / sitemap）的基址，默认 `https://lcclicheng.github.io/demo-sites`；客户用自定义域名后改此值（见 `docs/custom-domain.md`）。

---

## 2. 新增站点的 SEO checklist（对接 onboarding）

接入新客户 / 新行业模板时，逐项确认：

- [ ] `seo.title` 填写：含**商家名 + 城市 + 核心业务**（如 `Sotto Sotto | Authentic Italian Restaurant in Soho, London`），利于本地搜索。
- [ ] `seo.description`：一句话价值主张 + 位置 + 行动号召，150 字以内。
- [ ] 首张实景图（`assets/<slug>/` 第一张）确认存在且清晰 → 作 `og:image` 分享卡。
- [ ] 图片 `alt` 文本：描述性、含关键词（可请 AI 批量生成，见 `docs/PROJECT-OVERVIEW.md` AI 协作规范）。
- [ ] 结构化数据（下方 §3）按行业填 `LocalBusiness` / `Restaurant` 等类型（如适用）。
- [ ] 交付后确认线上 `curl -sI` 200，且 `sitemap.xml` 含该 slug。

---

## 3. 结构化数据 JSON-LD（本地商家 SEO 强增强）

英国小商家的核心 SEO 场景是**本地搜索**（"restaurant near me"、Google Maps）。`LocalBusiness` 系列 Schema.org JSON-LD 能显著提升本地展现（评分星级、营业时间、地址卡）。

**按行业选类型**：
- 餐厅 / 咖啡：`Restaurant` / `CafeOrCoffeeShop`
- 沙龙 / 美甲：`HealthAndBeautyBusiness` / `BeautySalon`
- 律所：`LegalService` / `Attorney`
- 酒店 / 民宿：`LodgingBusiness` / `BedAndBreakfast`
- 家装维修：`HomeAndConstructionBusiness` / `Plumber` 等
- 瑜伽 / 甜品：`HealthClub` / `Bakery`

**推荐字段**（映射自现有 JSON）：`name` / `address`（PostalAddress）/ `telephone` / `openingHours` / `image` / `priceRange` / `aggregateRating`（如有真实评价）。

> 🔲 **待落地**：目前 `generate.mjs` 尚未自动注入 JSON-LD，可作为一项低难度/高收益增强——从 JSON 的 `template` 映射到对应 Schema 类型 + 现有字段填充，注入 `<script type="application/ld+json">`。列入 `docs/v2-roadmap.md` 时同步此处。

---

## 4. 内容营销 / Blog 脚手架

Blog 是英国小商家做长尾 SEO 与内容营销的抓手（"how to choose a wedding cake"、"best coffee in Soho" 等）。脚手架方案（Markdown 驱动、静态生成、零后端）详见 **`docs/blog-pipeline.md`**——此处不复制，避免双写漂移。

要点提要：
- 每篇文章一个 Markdown 文件，构建时转静态 HTML，套用该站主题样式。
- 文章页自动进 `sitemap.xml`，带 canonical + og。
- 作为 Growth Partner / Growth Plus 订阅的增值内容服务卖点（基础 SEO 含在 Growth Partner，SEO 内容在 Growth Plus；见 `docs/pricing.md`）。

---

*本主题文件由 `docs/workflow.md` v1.1.0 SEO 相关条目拆分（2026-07-16 MDD 重构）；Blog 细节以 `docs/blog-pipeline.md` 为准。*
