# Data Model · FifthStar OS 统一数据模型

> **问题**：审计（2026-07-23）发现系统里存在 **三套互不匹配的数据格式**，AI/脚本各自读各自的，长期必然漂移。
> **解法**：以 `business-profile.schema.json` 为**唯一事实源**，三套旧格式通过下方映射表**适配**（不强行改写存量数据），新代码一律读写 canonical 契约。

---

## 1. 三格式问题（审计结论）

| # | 格式 | 位置 | 代表字段 | 问题 |
|---|---|---|---|---|
| (a) | Website Factory 摄入文件 | `examples/<slug>.json` | `template/slug/name/subtitle/heroLine1/sections/...` | 扁平、面向渲染；无销售/声誉字段 |
| (b) | Sales Engine CRM 文档 | `sales-engine/lead-schema.md` | `business_name/lead_score/google_rating/review_count/has_website/status` | **描述与真实数据不符**（用 `business_name` 但真实键是 `name`；声称有 `lead_score` 但**真实数据无此字段**） |
| (c) | **真实**线索数据 | `outreach/fifthstar-leads.json` | `id/name/city/industry/stars/reviews/track/hasWebsite/ownerEmail/status/verified` | 实际运行的唯一真相，但**无 schema 校验**，且字段命名与 (b) 冲突 |

**结论**：(c) 是真实运行的真相；(b) 是过时/错误的文档；(a) 是渲染侧事实。三者必须由 (c) 校准，并由 `business-profile.schema.json` 统一向上抽象。

---

## 2. 字段映射表（旧 → 新 canonical）

`business-profile.schema.json` 的嵌套结构把三套旧格式收编如下：

| Canonical 字段 | (a) examples JSON | (b) lead-schema.md（旧·错误） | (c) fifthstar-leads.json（真实） |
|---|---|---|---|
| `id` | — | — | `id` ✅ |
| `name` | `name` | `business_name` ❌ | `name` ✅ |
| `industry` | — | `industry` | `industry` ✅ |
| `template` | `template` | — | — |
| `slug` | `slug` | — | — |
| `location.city` | `street`/`postcode` | `city` | `city` ✅ |
| `location.area` | — | — | `area` ✅ |
| `online_presence.hasWebsite` | — | `has_website` | `hasWebsite` ✅ |
| `online_presence.widgetPresent` | — | — | `widgetPresent` ✅ |
| `online_presence.channels.email` | `email` | `email` | `ownerEmail` ✅ |
| `online_presence.channels.facebook` | `instagram` | — | — |
| `reputation.googleRating` | `googleRating` | `google_rating` | `stars` ✅ |
| `reputation.reviewCount` | `googleReviews` | `review_count` | `reviews` / `reviewCount` ✅ |
| `reputation.lastOwnerReplyDays` | — | — | `lastReplyDays` ✅ |
| `sales.track` | — | `track` | `track` ✅ |
| `sales.leadScore` | — | `lead_score` ❌（真实数据无） | —（由 scoring-rules 计算后写回） |
| `sales.status` | — | `status` | `status` ✅ |
| `sales.channel` | — | — | `channel` ✅ |
| `sales.onePager` | — | — | `onePager` ✅ |
| `sales.observation` | — | — | `observation` ✅ |
| `sales.verified` | — | — | `verified` ✅ |
| `stage` | — | — | —（新增经营生命周期字段） |
| `website` | `slug` + 构建产物 | — | —（成交后填） |
| `customer` | — | — | —（成交后填，见 customer.schema.json） |

> ⚠️ **关键纠偏**：`lead_score` 在真实数据中**不存在**。Stage1/Stage2 两阶段评分由 `sales-engine/scoring-rules.md` + `send-outreach.mjs` 计算，结果应写入 `business-profile.sales.leadScore`，而非假设 raw 数据自带。

---

## 3. 迁移策略（零破坏）

1. **不重写存量**：`fifthstar-leads.json` 与 `examples/*.json` 保持原样（避免引入"文档说有、数据没有"的二次漂移）。
2. **新增适配层**：任何新脚本先读 canonical，再用本表映射回旧键写回。例：`send-outreach.mjs` 已直接吃 `fifthstar-leads.json` 真实键——保持；新增的 `init-lead.mjs`（Lead Memory）用 canonical 字段，但读取时兼容 `ownerEmail`↔`channels.email`。
3. **校验闸门**：CI 加 `ajv` 校验 `outreach/fifthstar-leads.json` 每条符合 `lead.schema.json`；新业务主档符合 `business-profile.schema.json`。失败即 `exit 1`。
4. **单一写入点**：未来如需统一库，以 `business-profile` 为主档，`leads.json` 降级为 `sales` 子集的镜像。

---

## 4. 三个 Schema 的关系

```
business-profile.schema.json   ← 唯一业务主档（market→lead→won→customer 全程）
        │  (成交后派生)
        ├── lead.schema.json       ← 线索/CRM 子集（outreach 事实源，真实键名）
        └── customer.schema.json   ← 成交后客户档案（续费/推荐/成功指标）
```

- `business-profile` 是 superset；`lead` 与 `customer` 是它的两个"视图/阶段切片"。
- `stage` 字段（market/lead/contacted/replied/qualified/won/delivered/retained/referred/churned/lost）是打通三模块的经营主轴。

---

## 5. 校验用法（ajv，draft2020-12）

```bash
# 校验 outreach 线索文件
node -e "const Ajv=require('ajv');const a=new Ajv({strict:false});const s=require('./contracts/lead.schema.json');const d=require('./outreach/fifthstar-leads.json');const v=a.compile(s);let bad=0;for(const l of d.leads){if(!v(l)){console.log('FAIL',l.id,JSON.stringify(v.errors));bad++}}console.log(bad?('❌ '+bad+' bad'):'✅ all leads valid')"
```

> 注：`ajv` 需 `npm i ajv`（本地 workspace，勿污染全局）；CI 可加等价步骤。当前 `additionalProperties:true` 保证旧数据不报错，仅校验已知字段类型。
