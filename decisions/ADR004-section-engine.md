# ADR004 · Section Engine 作核心组合层

- **Status**: Accepted
- **Decision**: 客户站优先走 `sectioned` 组合器 + 通用 section 库；curated 10 预设全迁 sectioned（v1.1.0 收口）。
- **Reason**: 模板数从 8 变「无限」，AI Intake 直接输出带 `sections` 的 `SectionedData`；统一数据契约避免每行业维护巨型 App。
- **备选**: 继续维护 8 套手写 monolith 行业模板 —— 难 AI 组合、难扩展。
- **影响**: 8 套行业模板保留作真实商家垂直站 + 历史样板（未启用 Playwright 视觉回归前不删）；真实商家多数仍用行业模板展示打磨 UI。
- **See**: docs/section-engine.md, memory/core/glossary.md(Section Engine)
