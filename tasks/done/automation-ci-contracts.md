# Task · 自动化：CI 校验 contracts/checklists/ADR 一致性

- **目标**：CI 自动校验——`contracts/`（Schema 单一事实源）与实际生成字段一致；`checklists/` 被任务引用；`decisions/` ADR 的 `Status`/`See` 引用未失效（无悬空链接）。
- **价值**：防止「文档说一套、代码生成另一套」的字段漂移（对应 Law #1 Fact only once + #9 Contracts own schemas）。
- **落地形态**（待定）：GitHub Actions 加一个 `consistency-check` job，解析 contracts/*.md 的字段表 vs `src/components/sections/types.ts` + `examples/*.json` 实际字段。
- **See**: contracts/section-data.md · contracts/business-json.md · contracts/theme.md · decisions/ · checklists/
- **状态**: todo


---

**状态**: done（2026-07-16 落地）
- 实现见：`playbooks/automation-ci-contracts.md` 或 `scripts/automation-ci-contracts.mjs`（详见 current-sprint.md「下一阶段」已落地注释 + events.log）。
