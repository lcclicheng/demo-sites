# ADR003 · Tailwind v3 + 语义三色（theme-agnostic）

- **Status**: Accepted
- **Decision**: Tailwind CSS v3；组件只用 `accent / surface / ink` 三语义色 + `currentColor + color-mix`。
- **Reason**: 主题自适应、亮暗通用、反硬编码品牌色、反网红；新增主题经 `THEMES` 逐站覆盖，不改组件代码。
- **备选**: 每模板独立配色变量（旧 8 套行业模板做法）—— 切到 sectioned 后旧替换串不命中致主题静默丢失，已废弃。
- **影响**: section 组件绝不用 emoji / 硬编码品牌色；视觉手法库统一 `src/components/visual.tsx`。
- **See**: memory/core/principles.md(theme-agnostic), docs/section-engine.md(§2)
