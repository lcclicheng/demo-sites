# Section Engine（步骤 6 · Section 组合引擎）

> 把「8 套固定行业模板」升级为「组件化 Section + AI 自由组合」的核心一步。
> 对应 `docs/v2-roadmap.md` 步骤 6。

## 1. 这是什么

之前的 8 套模板（`src/<行业>/App.tsx`）是**整体手写页面**：每个行业一份几百行的 App，
消费各自的一份 `business-data.ts`。它们视觉已打磨、零风险，**保留作真实商家垂直站 + 历史样板**（curated 样板预设层已在 v1.1.0 全部迁移到 Section Engine，不再依赖这 8 套）。

Section Engine 是一个**新的组合层**，让「模板数量」从 8 变成「无限」：

```
Business JSON（SectionedData）
        │
        ▼
sectioned 组合器（src/sectioned/App.tsx）
        │  读 data.sections（可选覆盖）或默认顺序
        ▼
通用 Section 组件库（src/components/sections/*）
        │  Hero / Menu / Story / Gallery / Reviews / FAQ / Team / Booking / Location / Instagram / Footer / InfoBar
        ▼
静态站（任意主题：暖金、青绿、李子、工业铜……）
```

客户站只需 `template: "sectioned"` + 填 `SectionedData`，并用 `sections` 字段声明要哪些块、什么顺序。
**AI Intake（步骤 3）上线后，将直接输出带 `sections` 的 SectionedData** —— 一句话建站、AI 自动组合。

## 2. 设计哲学：theme-agnostic

所有 section 组件**不绑定任何品牌色**，配色只靠三个 Tailwind 语义色：

| 语义色 | 用途 |
|---|---|
| `accent` | 强调色（CTA、图标、发丝线、装饰 currentColor 层） |
| `surface` | 背景（页面 / 区块底） |
| `ink` | 前景文字 |

- 装饰层用 `<div className="text-accent">` 包住 `HeroBackdrop` 等，使 `currentColor` 跟随主题强调色
  （与 `src/components/visual.tsx` 同一套 `currentColor + color-mix` 哲学，亮暗主题通用）。
- 强调色由 `sectioned` 模板的 `twConfig` 定义（`accent:'#b8895a'` 暖金默认），
  可通过 `THEMES`（见 `generate.mjs`）**逐站覆盖**成青绿 / 李子 / 工业铜等，无需改组件代码。
- **绝不用 emoji、绝不硬编码品牌色** —— 反网红、editorial 排版、留白充足。

## 3. 数据契约：SectionedData

统一数据结构定义在 `src/components/sections/types.ts`，也是 AI Intake 的**输出目标 schema**。
所有字段可选：section 组件按需取用，数据缺失的 section 自动 `return null`（不渲染）。

关键字段（详见 `types.ts`）：

| 字段 | 供哪个 section 使用 |
|---|---|
| `name / tagline / hero*` / `heroCta*` / `heroStats` | Hero |
| `infoBar: {icon?,text}[]` | InfoBar |
| `menu: {title,icon?,items:[{name,desc,price,pair}]}[]` | Menu |
| `story: {title,paragraphs[],stats[]}` | Story |
| `gallery: {title,sub?,image?,icon?,gradient?}[]` | Gallery |
| `reviews: {name,text,rating?}[]` | Reviews |
| `faqs: {q,a}[]` | FAQ |
| `team: {name,role?,bio?,initials?,image?}[]` | Team |
| `booking: {intro?,note?,occasionOptions?}` + `email` | Booking（mailto 表单） |
| `street/location/phone/email/hoursDetail` | Location（联系/营业时间） |
| `footer: {note?,quickLinks?}` + 社交链接 | Footer（含隐私/合同/发票/注册地址路由链接） |
| `instagram?` | Instagram |
| `sections?: {type}[]` | **组合覆盖**（见下） |

## 4. 组合机制

`src/sectioned/App.tsx` 决定渲染哪些 section：

```ts
const DEFAULT_ORDER = [
  'hero','infoBar','menu','story','gallery','reviews',
  'faq','team','booking','location','instagram','footer'
]
// 若 JSON 提供了 sections，严格按它渲染；否则用默认顺序。
// 每个 section 组件在自身数据缺失时 return null → 自动跳过（如某站无 FAQ 就不渲染 FAQ）
const sections = d.sections?.length ? d.sections : DEFAULT_ORDER.map(t => ({ type: t }))
renderSections(sections, d)
```

示例 —— 一家咖啡店只想要 Hero + Menu + Story + Footer，且把 Story 放 Menu 前：

```json
{
  "template": "sectioned",
  "name": "Otto Coffee",
  "sections": [
    { "type": "hero" },
    { "type": "menu" },
    { "type": "story" },
    { "type": "footer" }
  ]
}
```

> 锚点 id：hero=`#hero` menu=`#menu` story=`#story` gallery=`#gallery`
> reviews=`#reviews` faq=`#faq` team=`#team` booking=`#booking` location=`#location` instagram=`#instagram`。
> 导航栏根据最终渲染的 sections 自动生成（跳过 hero/infoBar/footer）。

## 5. 新增一个站（用 Section Engine）

1. 复制 `examples/sectioned-demo.json` 为 `examples/<slug>.json`
2. 填 `SectionedData` 字段；可选加 `sections` 自定义组合
3. `build-clean.sh` 的 `PROJS` 加 `<slug>`（单一事实源，校验闸门同步扫）
4. 推送 → CI 全量重建，自动 build 并部署

## 6. 与现有 8 套模板的关系（重要）

- **curated 样板预设已全部迁移到 `sectioned`**（v1.1.0 收口）：`atelier / breath / chambers / creme / forge / mario / mono / patisserie / sotto-sotto / vault` 共 10 个 curated 预设全部跑在 Section Engine 统一架构上，「未来迁移」对 curated 层已完成。
- **8 套行业模板保留作真实商家垂直站 + 历史样板**：`restaurant / coffee / salon / dessert / yoga / law / hotel / trades` 视觉已打磨、业务字段各异（如 trades 用 `menuCategories`、restaurant 用 `menuSections`），继续用于真实商家演示站（如 morris-coffee 之外的 8 个 OSM 真实商家）展示该垂直行业的打磨 UI；不删除。
- **新客户站优先走 `sectioned`**：统一数据契约 + AI 组合，避免每行业维护一份巨型 App。
- **双轨现状**：curated 预设层已 100% sectioned；真实商家层为混合（morris-coffee 已迁 sectioned 作 pilot，其余 8 个仍用行业模板）。未来若要把真实商家也迁 sectioned，须先用 Playwright 逐像素视觉回归保护（P4 决议：原留待站点数 >15 或来真实客户；现已 20 站，可启用）。未启用回归前不要物理删除 8 套行业模板。

## 7. 扩展：新增 / 定制一个 section

1. 在 `src/components/sections/` 新建 `Xxx.tsx`：
   `export function Xxx({ data }: { data: SectionedData; accent?: string }) { ... }`，
   数据缺失 `return null`；只用 `text-accent/bg-accent/*/bg-surface/text-ink(/60/50)`。
2. 在 `src/components/sections/index.tsx` 的 `SECTIONS` map 注册 `xxx: Xxx`。
3. 在 `src/sectioned/App.tsx` 的 `NAV_MAP` 加 `{ label, id }`（如需进导航）。
4. `generate.mjs` 的 `TEMPLATES.sectioned` 无需改（组合器动态渲染）。

## 8. 限制（诚实说明）

- Section Engine 是**生成时组合**：section 顺序在 JSON（`data.sections`）里定好，构建成静态页。
  不是运行时拖拽。AI 组合发生在「生成前」（Intake 输出带 sections 的 JSON）。
- 纯静态：Booking/联系用 `mailto`（无后端）；AI 客服 / 月报等 serverless 能力需步骤 5 的
  Vercel Adapter（`deploy/vercel/`）承接。
- `sectioned` 默认视觉是「中性高级暖金」；要更强行业辨识度，可经 `THEMES` 给该站覆盖 `accent`
  并扩充 `SectionedData`（如餐厅加 `menu` 的 `pair` 酒搭、酒店加房型 section）。
