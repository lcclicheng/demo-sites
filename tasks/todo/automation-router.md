# Task · 自动化：Router 生成加载计划

- **目标**：以后所有任务先经 Router 再加载再执行，而非 AI 自由发挥。
  `User → Router → Task Type → Loading Plan → AI`。
  例：「改 SEO」→ Router 输出 `Load: P0, P1, runtime, ADR005, seo.md, knowledge/restaurant`。
- **落地形态**（待定）：一个轻量分类器 / 规则文件（`playbooks/router.md` 或脚本），据任务关键词映射最小加载计划。
- **约束**：输出必须遵守 `memory/core/loading-priority.md` 的 P0–P8 + Stop Rule。
- **See**: memory/core/loading-priority.md · .ai/* · playbooks/
- **状态**: todo（架构稳定期后的第一阶段自动化）
