# Contracts（Schema 单一事实源）

> 所有 AI（GPT / Claude / Gemini / 本会话 AI）生成站点数据或组件时，**必须**以本目录契约为准，
> 避免不同模型输出不同字段、破坏统一 Schema。代码侧 `src/components/sections/types.ts` 是运行时校验基准。
>
> 加载优先级 P4：仅在「要生成/修改站点数据或主题」时读取，不要每次都读。

| 契约 | 管什么 | 权威源 |
|---|---|---|
| [`section-data.md`](./section-data.md) | `SectionedData` —— sectioned 组合器的统一数据契约（也是 AI Intake 输出目标） | `src/components/sections/types.ts` |
| [`business-json.md`](./business-json.md) | `examples/<slug>.json` —— 每站业务摄入文件（含真实商家 `_source`） | `generate.mjs` + `onboard.mjs` |
| [`theme.md`](./theme.md) | Tailwind v3 主题契约（语义三色 + 字体 + THEMES 逐站 diff） | `generate.mjs` THEMES + ADR003 |
| [`business-profile.schema.json`](./business-profile.schema.json) | **唯一业务主档**（FifthStar OS 数据契约，draft2020-12，superset） | `outreach/fifthstar-leads.json` + `examples/*.json` + `customer-system/` |
| [`lead.schema.json`](./lead.schema.json) | 线索/CRM 子集（真实 `fifthstar-leads.json` 键名，纠正旧 lead-schema.md 错误） | `outreach/fifthstar-leads.json` |
| [`customer.schema.json`](./customer.schema.json) | 成交后客户档案（续费/推荐/成功指标/自动化率） | `customer-system/` |
| [`DATA-MODEL.md`](./DATA-MODEL.md) | 三格式问题说明 + 旧→新字段映射表 + 零破坏迁移策略 | 审计 2026-07-23 |

## 铁律
- 字段全可选；缺失字段的 section **自动 `return null` 不渲染**（宽松契约，不报错）。
- 视觉 **theme-agnostic**：组件只用 `accent / surface / ink` + `currentColor + color-mix`，**绝不硬编码品牌色、绝不用 emoji**。
- 新增字段先改 `types.ts` 契约 → 同步本目录 → 再写生成逻辑；保持「代码 = 编译器事实源，contracts = AI 事实源」一致。

## JSON Schema（机器可校验层，2026-07-23 新增）

- 三个 `*.schema.json` 用 **JSON Schema draft2020-12**，是 AI/脚本读写数据的**机器校验闸门**（CI 用 ajv 校验 `fifthstar-leads.json` 每条符合 `lead.schema.json`）。
- `business-profile.schema.json` 是**经营全程唯一主档**（market→lead→won→customer），`lead`/`customer` 是它的阶段切片。
- **旧格式零破坏**：`examples/*.json` 与 `fifthstar-leads.json` 保持原样；新代码用 `DATA-MODEL.md` 映射表适配（见该文件 §3）。
- ⚠️ 纠偏：真实 `fifthstar-leads.json` **无 `lead_score` 字段**（旧 `lead-schema.md` 描述错误）；评分由 `sales-engine/scoring-rules.md` 计算后写入 `business-profile.sales.leadScore`。
