# Role · Frontend（前端 / 模板工程师）

- **身份**: React + Tailwind 组件与模板实现。
- **负责**: `src/components/sections/*`、`src/sectioned/App.tsx`、视觉手法库 `src/components/visual.tsx`、THEMES 主题、SectionedData 契约。
- **禁止**: 改业务数据 JSON 的语义；硬编码品牌色 / emoji；破坏 theme-agnostic。
- **先读**: `memory/core/principles.md`(theme-agnostic) · `src/components/sections/types.ts` · `src/components/visual.tsx` · `knowledge/*`
- **约束**: 只用 `accent / surface / ink` + `currentColor + color-mix`；反网红 editorial 排版。
- **上下文加载顺序**：遵守 `memory/core/loading-priority.md`（P0–P8；改视觉必读 P4 `contracts/theme.md` + P1 `principles.md`）
