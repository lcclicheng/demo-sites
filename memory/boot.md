# Boot Sequence（固定加载清单 · 每次会话/任务开局必读）

> 本文件是 AI 进入项目时的**固定加载清单**（配合 `.ai/loading-protocol.md` 完整协议）。
> 任何任务第一步：按顺序读完本清单（P0–P2），然后执行 **Stop Rule 检查**（第 8 步）。
> 这是 MDD v4 可执行性的核心——把「AI 如何准确加载」从隐性自觉变成固定步骤，避免每次对话靠 AI 自由发挥。

## 固定加载顺序（必须，顺序即优先级）

| # | 文件 | 作用 | 优先级 |
|---|---|---|---|
| 1 | `.ai/<role>.md` | 我是哪类 AI（architect/frontend/backend/seo/designer）→ 身份/禁止/负责/先读 | P0 |
| 2 | `memory/core/project.md` | 项目事实：名称/阶段/商业模式/技术/在线/Sites | P1 |
| 3 | `memory/core/principles.md` | Architecture Laws（13 条铁律）+ Fact only once | P1 |
| 4 | `memory/core/constraints.md` | 静态边界/SSH/UK合规/PROJS/沙箱 | P1 |
| 5 | `memory/core/glossary.md` | 术语 | P1 |
| 6 | `memory/runtime/current-sprint.md` | 当前迭代焦点/待办/不做/下一阶段 | P2 |
| 7 | `state/health.md` | 现在健康度（Build/Deploy/Health/Smoke/Coverage） | P2 |

## 第 8 步：Stop Rule 检查（强制）

- 问自己：**读完 1–7，能否不读 `docs/` 就给出正确、可执行的回答？**
- **能 → 立即停**，不再加载 P3+（`decisions/` `contracts/` `tasks/` `docs/` `knowledge/` `src/`）。
- **不能 → 仅加载任务明确触及的 P3+ 层**（见 `.ai/loading-protocol.md` 的「按需展开表」），禁止把 P3–P8 全读一遍。
- 例外：用户明确要求「读文档/查细节/对比方案」时，才允许进入 P6。

## Token 预算

- P0–P2（1–7）合计 **< 5K token**。超过即说明读错了文件（见 loading-protocol 反模式）。
- 单任务全量（极端 P0–P8）上限 **< 40K token**。

## 禁止在 boot 阶段读取

- ❌ `docs/` 全文（已拆主题，按需读单文件）
- ❌ `knowledge/<行业>/`（除非任务明确做该行业内容）
- ❌ `src/` `generate.mjs` 等源码（除非要改代码）
- ❌ `contracts/`（除非任务生成/校验数据或主题）

## 之后

- 任务执行参考 `playbooks/` + `checklists/`。
- 任务完成必回写：`state/*` + `memory/runtime/progress` + `current-sprint` + `events.log`（append）。
- 新任务开场先输出 Router 计划（见 `tasks/router-template.md`）。
