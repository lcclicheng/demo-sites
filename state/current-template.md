# State · Current Template（架构现状）

- **核心组合层**：`sectioned` 组合器（`src/sectioned/App.tsx` + `src/components/sections/*`），消费 `SectionedData`（见 `contracts/section-data.md`）。
- **双轨现状**：
  - **curated 预设层（10 个）**：`atelier / breath / chambers / creme / forge / mario / mono / patisserie / sotto-sotto / vault` —— 全部跑在 Section Engine（v1.1.0 收口，curated 层已 100% sectioned）。
  - **真实商家层（8+1 个）**：`restaurant / coffee / salon / dessert / yoga / law / hotel / trades` 8 套行业模板保留作真实商家垂直站 + 历史样板；`morris-coffee` 已迁 sectioned 作 pilot，其余 8 个仍用行业模板展示打磨 UI。**未启用 Playwright 视觉回归前不物理删除 8 套行业模板**（ADR004 影响）。
- **新客户站**：优先走 `sectioned`（统一数据契约 + AI 组合），避免每行业维护巨型 App。
- **8 套行业模板业务字段**：各异（如 `restaurant` 用 `menuSections`、`trades` 用 `menuCategories`），**不强制对齐 SectionedData**。
- **更新时机**：新增/迁移模板、双轨收敛时同步本文件。
