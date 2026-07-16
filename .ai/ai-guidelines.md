# AI 协作规范（AI Guidelines · 本会话/任何 AI 必须遵守）

> 不绑定具体产品名（泛指协助本项目的 AI 助手）。本文件是「AI 每次响应前的行为契约」。
> 配合 `memory/boot.md`（固定加载）+ `.ai/loading-protocol.md`（完整协议）+ `tasks/router-template.md`（路由）。

## 每次响应前必守（4 条）

1. **跑 Boot**：新会话/新任务开局，先按 `memory/boot.md` 顺序读完 P0–P2（< 5K token）。
2. **守 Stop Rule**：P0–P2 已够答即停，禁止继续加载 P3+；需触及才按 `loading-protocol.md` 展开表加载。
3. **用 Router**：新任务先输出 `tasks/router-template.md` 的 1 行加载计划，再执行（先路由、再加载、再执行）。
4. **完成回写**：任务结束必更新 `state/*` + `memory/runtime/progress` + `current-sprint` + `events.log`（append）；按 `checklists/` 勾选。

## 硬约束（来自 Architecture Laws · 13 条）

- Fact only once；Runtime is mutable；Knowledge is stable；Docs explain, never own data；
- State records now；Event records history；AI loads minimum context；
- Every task updates runtime；Contracts own schemas；ADR owns decisions；
- **State/Events/Runtime 职责分离**：`state/`=当前状态唯一事实源（mutable）；`events.log`=只追加历史（append-only，禁改）；`memory/runtime/`=临时 sprint 上下文（瞬态，可重建）。
- **Contracts define, Checklists verify**：`contracts/` 定义「合法长什么样」（Schema，build 前/生成时读）；`checklists/` 验证「任务是否达标」（任务后/CI 用）；先读 contracts 再写，写完用 checklists 验收。
- **Docs shared, Human-owned**：`docs/` 由 Human 拥有与编辑；AI 可读、可引用，但**绝不把 docs 当数据持有者**（数据在 state/contracts），也不得自行改写 docs 的事实性数值（须经 Human 或明确指令）。

## 禁止

- ❌ 一上来读全量 docs / `workflow.md` 巨石
- ❌ 改视觉不读 `contracts/theme.md`；生成 JSON 不读 `contracts/section-data.md`
- ❌ 自行改写 docs 的事实性数值（须经 Human 或明确指令）
- ❌ P0–P2 已够仍加载 P3+（违反 Stop Rule）

## 参见

- 角色上下文：`.ai/<role>.md`（architect/frontend/backend/seo/designer）
- 加载协议：`.ai/loading-protocol.md` · 固定清单：`memory/boot.md`
- 路由模板：`tasks/router-template.md` · 铁律：`memory/core/principles.md`
