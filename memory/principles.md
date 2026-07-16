# Principles（开发原则）

- **三者分离（MDD）**：代码给编译器、文档给人、Memory 给 AI。AI 按任务读 `memory/` + 相关 `decisions/` + `tasks/`，不读全量 docs。
- **theme-agnostic**：section 组件只用 `accent / surface / ink` 三语义色 + `currentColor + color-mix`；**绝不用 emoji、绝不硬编码品牌色**；反网红、editorial 排版、留白充足。
- **单一事实源**：`PROJS`（构建）、`memory/project.md`（AI）、`docs/index.md`（人）各自唯一，避免漂移。
- **fail-fast 闸门**：`validate-sites.mjs`（构建前，缺图/缺字段/孤儿站软阻断）+ `smoke-test.mjs`（构建后，非空壳）拦截坏部署。
- **代改模型（2026-07-16）**：标准交付**不**含客户 CMS 自助后台；A 档首月内不限次数代改，B 档接管首月后改动——所有改动由 owner 经 GitHub Pages 重建，可控可回滚。
- **双轨收敛**：curated 预设全迁 sectioned（v1.1.0 收口）；8 套行业模板保留作真实商家垂直站 + 历史样板，**未启用 Playwright 视觉回归前不删**。
- **引用而非复制**：文档间用 `See: <file>.md` 互相引用，避免重复分析、内容漂移。
