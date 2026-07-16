# Task · 自动化：AI 按任务类型选最小上下文

- **目标**：AI 自动据任务类型选择最小必要上下文，而非依赖人工指定加载哪些文件——落实 `loading-priority.md` 的 P0–P8 + Stop Rule。
- **机制**：结合 `automation-router.md` 的加载计划，AI 在 P0–P2 够答时立即停（Stop Rule），不读 P3–P8 全量。
- **价值**：防止上下文膨胀致遗忘（大型项目核心风险），降低 token 成本。
- **See**: memory/core/loading-priority.md(Stop Rule) · .ai/* · tasks/todo/automation-router.md
- **状态**: todo（与 automation-router 协同）


---

**状态**: done（2026-07-16 落地）
- 实现见：`playbooks/automation-min-context.md` 或 `scripts/automation-min-context.mjs`（详见 current-sprint.md「下一阶段」已落地注释 + events.log）。
