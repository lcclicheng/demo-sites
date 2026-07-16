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

## 铁律
- 字段全可选；缺失字段的 section **自动 `return null` 不渲染**（宽松契约，不报错）。
- 视觉 **theme-agnostic**：组件只用 `accent / surface / ink` + `currentColor + color-mix`，**绝不硬编码品牌色、绝不用 emoji**。
- 新增字段先改 `types.ts` 契约 → 同步本目录 → 再写生成逻辑；保持「代码 = 编译器事实源，contracts = AI 事实源」一致。
