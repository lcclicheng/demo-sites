# ADR002 · 业务数据以 JSON 为单一来源（不用数据库）

- **Decision**: 每站 `examples/<slug>.json` 为数据源，Git 跟踪，无数据库。
- **Reason**: 简单、可 Git、与 Decap CMS 兼容、CI 重建即上线；单人项目不需要后端。
- **备选**: 数据库 / Headless CMS —— 过度工程，增加运维与成本。
- **影响**: 改动 = 改 JSON + 重建；CMS 编辑即 commit JSON；`validate-sites.mjs` 以 JSON 为校验基准。
- **See**: memory/constraints.md(PROJS 事实源), docs/workflow.md(§3 目录)
