# Contract · SectionedData（sectioned 组合器统一数据契约）

> **身份**：所有 `template: "sectioned"` 站点消费的数据结构，也是 AI Intake（步骤 3）输出的目标 schema。
> **权威源**：`src/components/sections/types.ts`。**加载优先级**：P4（生成/改站点数据时读）。
> **设计原则**：宽松 —— 所有字段可选；section 组件按需取用；缺数据的 section 自动 `return null` 跳过渲染。

## 1. SectionType（12 个可用块，顺序可覆盖）

```
'hero' | 'infoBar' | 'menu' | 'story' | 'gallery' | 'reviews'
| 'faq' | 'team' | 'booking' | 'location' | 'instagram' | 'footer'
```

## 2. 顶层字段（节选自 `types.ts`）

| 字段 | 类型 | 供哪个 section |
|---|---|---|
| `template` | `string` | 必须 `"sectioned"` |
| `name` | `string` **(必填)** | 全局 |
| `subtitle` / `tagline` / `established` / `location` | `string?` | Hero / Footer |
| `street` / `postcode` / `registeredAddress` | `string?` | Location / Footer（注册地址语义见下） |
| `phone` / `email` | `string?` | InfoBar / Booking / Location / Footer |
| `googleRating` / `googleReviews` | `string?` | Hero / Reviews |
| `heroLine1` / `heroLine2` / `heroBadge` | `string?` | Hero |
| `heroStats` | `HeroStat[]?` | Hero（`{val,label,stars?}`） |
| `heroCta1` / `heroCta2` | `{text,href}?` | Hero |
| `sections` | `SectionConfig[]?` | **组合覆盖**（见 §3） |
| `infoBar` | `InfoItem[]?` | InfoBar（`{icon?,text}`） |
| `menu` | `MenuCategory[]?` | Menu（`{title,icon?,items:[{name,desc?,price?,pair?}]}`） |
| `menuIntroTitle` / `menuIntroText` | `string?` | Menu 导语 |
| `story` | `{title?,subtitle?,paragraphs?,stats?}?` | Story |
| `gallery` | `GalleryItem[]?` | Gallery（`{title?,sub?,image?,icon?,gradient?}`） |
| `reviews` | `Review[]?` | Reviews（`{name,text,rating?}`） |
| `faqs` | `Faq[]?` | FAQ（`{q,a}`） |
| `team` | `TeamMember[]?` | Team（`{name,role?,bio?,initials?,image?}`） |
| `booking` | `{intro?,note?,occasionOptions?}?` | Booking（mailto 表单） |
| `hoursDetail` | `{wedFri?,saturday?,sunday?,closedDays?}?` | Location（**用非规范文本，禁止编造**） |
| `footer` | `{note?,quickLinks?,hoursTitle?}?` | Footer |
| `instagram` / `facebook` / `twitter` | `string?` | Footer / Instagram |
| `pageTitle` / `seo` | `string?` / `{title?,description?}?` | SEO |

## 3. 组合机制（关键）

- `src/sectioned/App.tsx` 默认顺序：
  `['hero','infoBar','menu','story','gallery','reviews','faq','team','booking','location','instagram','footer']`
- 若 JSON 提供 `sections`，**严格按它渲染**；否则用默认顺序。
- 每个 section 组件在自身数据缺失时 `return null` → 自动跳过（如某站无 FAQ 就不渲染 FAQ）。
- 锚点 id：hero=`#hero` … footer=`#footer`；导航栏根据最终渲染的 sections 自动生成（跳过 hero/infoBar/footer）。

## 4. 注册地址语义（合规）

- `registeredAddress`：仅当商家为 Ltd/PLC 且须公开公司注册地址时填；sole trader 不填。
- 展示层 Footer 路由链接（隐私 / 条款 / 发票 / 注册地址）由 `footer` 字段驱动，详见 `docs/delivery-checklist.md`。

## 5. 约束（违反即违背 ADR003 / ADR004）

- ❌ 硬编码品牌色、❌ emoji、❌ 造假的 `hours` / `googleRating`。
- ✅ 只用 `accent / surface / ink` + `currentColor + color-mix`。
- ✅ 新增 section：在 `src/components/sections/` 建 `Xxx.tsx`（`data` 缺失 return null），注册进 `SECTIONS` map。

## 6. 与 8 套行业模板的关系

- curated 10 预设全跑在 Section Engine（v1.1.0 收口）。
- 8 套行业模板（`restaurant/coffee/...`）保留作真实商家垂直站 + 历史样板；其 `business-data.ts` 字段各异（如 `menuSections` / `menuCategories`），**不强制对齐 SectionedData**。
- 新客户站优先走 `sectioned`。
