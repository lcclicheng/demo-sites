# 自动化：跨项目同步 Playbook（长期）

- **背景**：`gh-pages-build` 是 `MDD-STANDARD.md`（v4.1）的**参考实现**。当本仓库的 `principles.md`(Architecture Laws) / `loading-priority.md` / `boot.md` / `loading-protocol.md` 等核心规则演进时，需同步回全局标准，否则标准会漂移落后。
- **目标**：建一个 `playbooks/cross-sync.md`（或脚本），把本仓库核心规则 diff 后更新 `C:\Users\12102\.workbuddy\MDD-STANDARD.md` + `~/.workbuddy/MEMORY.md` 的 MDD 节，保持「参考实现 ↔ 标准」一致。
- **触发**：本仓库核心规则（Laws / 加载协议 / 骨架）变更后，或在重大 MDD 收敛完成时。
- **做法**：
  1. 提取本仓库 `memory/core/principles.md` 的 Laws、`memory/boot.md` 清单、`docs/architecture-v4.md` 骨架。
  2. 比对 `MDD-STANDARD.md` 对应段，若有新增/修正，merge 进标准（保留标准通用性，去掉项目特有细节）。
  3. 同步 `~/.workbuddy/MEMORY.md` 的 MDD 节（标注参考实现 commit）。
  4. 在 `events.log` 记 `SYNC`。
- **约束**：标准保持**通用**（去项目名），参考实现保持**具体**（带本仓库路径）；不双向复制、不漂移（Fact only once）。
- **See**: tasks/todo/automation-ci-contracts.md · memory/core/principles.md · C:/Users/12102/.workbuddy/MDD-STANDARD.md
