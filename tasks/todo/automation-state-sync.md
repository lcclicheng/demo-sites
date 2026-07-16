# Task · 自动化：Task 完成自动同步状态

- **目标**：任一任务完成后，AI/CI 自动更新 `state/`（version/release/build/deploy/health）+ `memory/runtime/`（progress/current-sprint/lessons-learned）+ 仓库根 `CHANGELOG.md`，并向 `events.log` 追加一条变动记录。
- **闭环**：执行 → checklists 勾选 → 回写 runtime/state → events.log 记原因（对应 Architecture Law #8 Every task updates runtime）。
- **落地形态**（待定）：CI step 或 AI 收尾钩子，读取 tasks/doing 卡片 → 写 state + 追加 events.log。
- **See**: state/health.md · memory/runtime/lessons-learned.md · events.log · memory/core/principles.md(Law #8)
- **状态**: todo
