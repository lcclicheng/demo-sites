# AI Loading Protocol（MDD v4 完整加载协议）

> 与 `memory/boot.md` 配对：boot 是**固定清单**（每次必读哪些文件），本文件是**完整协议**（含按需展开表 / token 预算 / 反模式 / Router 钩子）。
> 所有 AI（Claude / GPT / Gemini / 本会话助手）处理本项目任何任务都遵守。

## 1. 强制加载（P0–P2，每次必读，顺序固定）

见 `memory/boot.md` 的 1–7 步。这是「最小必要上下文」底座（< 5K token）。

## 2. Stop Rule（铁律，最高优先级）

- 若 P0–P2 已能完整回答用户问题，**立即停**，禁止加载 P3+。
- 判断标准：能否不读 `docs/` 就给出正确、可执行的回答？能 → 停。
- 例外：用户明确要求读文档 / 查细节 / 对比方案，才允许进 P6。
- 违反 Stop Rule 是最常见 token 浪费与上下文漂移根因。

## 3. 按需展开表（P3–P8，仅任务触及才读）

| 任务触及 | 加载（不要多读） |
|---|---|
| 架构/决策疑问 | `decisions/ADR00N-*.md`（按主题，看 `Status`） |
| 生成/校验数据(JSON) | `contracts/section-data.md` + `business-json.md` |
| 改视觉/主题 | `contracts/theme.md` + `memory/core/principles.md`(theme-agnostic) |
| 当前任务卡片 | `tasks/todo·doing·done/` |
| 部署/SSH/CI | `docs/deployment.md` + `state/current-deploy.md` |
| 接客户 SOP | `playbooks/new-client.md` + `docs/onboarding.md` |
| 某行业内容 | `knowledge/<行业>/`（只该行业） |
| 改代码/查实现 | `src/` + `contracts/`（契约为准） |
| 发布/交付 | `playbooks/release.md` + `checklists/release.md` |

## 4. Token 预算

- P0–P2：< 5K
- 单任务典型（P0–P8 按需）：< 15K
- 单任务全量（极端）：< 40K
- 超预算 = 违反 Stop Rule 或读错层。

## 5. 反模式（禁止）

- ❌ 一上来 `cat docs/workflow.md` 全量（已归档巨石）。
- ❌ 改视觉不读 `contracts/theme.md` + `principles.md`（theme-agnostic 漂移）。
- ❌ 生成 JSON 不读 `contracts/section-data.md`（字段漂移）。
- ❌ 小任务把 P3–P8 全读一遍（token 浪费 + 上下文膨胀致遗忘）。
- ❌ P0–P2 已能回答仍继续加载 P3+（违反 Stop Rule）。
- ❌ boot 阶段读 `knowledge/` 或 `src/`。

## 6. Router 钩子（轻量，落实 Stop Rule）

- 新任务开场，先输出 1 行加载计划（模板见 `tasks/router-template.md`）：
  `[Router] role=<role> → P0-P2 + {实际要读的 P3..} → Stop? <Y/N>`
- Router 决定「加载什么」，不靠 AI 自由发挥；这是 V4→自动化方向的当前手动实现。

## 7. 回写闭环（任务完成必做）

- 更新 `state/*`（current-*.md + health.md）
- 追加 `memory/runtime/progress.md` + 更新 `current-sprint.md`
- 追加 `events.log`（为什么变）
- 按 `checklists/` 勾选；Sprint 末追加 `lessons-learned.md`
