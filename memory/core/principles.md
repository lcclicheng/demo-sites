# Principles（开发原则）

- **三者分离（MDD）**：代码给编译器、文档给人、Memory 给 AI。AI 按 `memory/core/loading-priority.md`（P0–P8）+ `memory/boot.md`（固定加载清单）加载——先读 `.ai/<role>` + `memory/core` + `memory/runtime/current-sprint` + `state/health`，再按需读 `decisions/` / `contracts/` / `tasks/` / `docs/`，不读全量。
- **theme-agnostic**：section 组件只用 `accent / surface / ink` 三语义色 + `currentColor + color-mix`；**绝不用 emoji、绝不硬编码品牌色**；反网红、editorial 排版、留白充足。
- **单一事实源**：`PROJS`（构建）、`memory/core/project.md`（AI）、`docs/index.md`（人）各自唯一，避免漂移。
- **fail-fast 闸门**：`validate-sites.mjs`（构建前，缺图/缺字段/孤儿站软阻断）+ `smoke-test.mjs`（构建后，非空壳）拦截坏部署。
- **代改模型（2026-07-16）**：标准交付**不**含客户 CMS 自助后台；A 档首月内不限次数代改，B 档接管首月后改动——所有改动由 owner 经 GitHub Pages 重建，可控可回滚。
- **双轨收敛**：curated 预设全迁 sectioned（v1.1.0 收口）；8 套行业模板保留作真实商家垂直站 + 历史样板，**未启用 Playwright 视觉回归前不删**。
- **引用而非复制**：文档间用 `See: <file>.md` 互相引用，避免重复分析、内容漂移。
- **事实只存一处（Fact only once）**：任何事实（Fact）只能存在一个地方。状态类事实以 `state/*.md` 为唯一源，`docs/` 只**引用**它、绝不复制数值（如版本号 / 部署状态只在 `state/` 写一次，`docs` 用 `See: state/current-version.md`）。复制必漂移。

---

## Architecture Laws（架构铁律 · 10 条，所有 AI 必须遵守）

> 不论 Claude / GPT / Gemini，处理本项目任何任务都遵守以下铁律。

1. **Fact only once** — 任一事实只存在一处，禁止复制。
2. **Runtime is mutable** — `state/` + `memory/runtime/` 可变，随时更新。
3. **Knowledge is stable** — `knowledge/` 行业素材稳定，不随任务改。
4. **Docs explain, never own data** — `docs/` 只解释、不持有数据（数据在 `state/`/`contracts/`）。
5. **State records now** — `state/` 记录「当前是什么」。
6. **Event records history** — `events.log` 记录「为什么变成这样」。
7. **AI loads minimum context** — 按 P0–P8 加载最小必要上下文。
8. **Every task updates runtime** — 每任务完成必回写 `state/` + `memory/runtime/`。
9. **Contracts own schemas** — `contracts/` 持有所有 Schema 单一事实源。
10. **ADR owns decisions** — `decisions/` 持有所有架构决策（含 `Status`）。
11. **State/Events/Runtime 职责分离** — `state/` = 当前状态唯一事实源（mutable，改当前状态只写这里，不写 events）；`events.log` = 只追加历史（append-only，禁止改历史，补记只追加不回填 state）；`memory/runtime/` = 临时 sprint 上下文（瞬态，可被 `current-sprint.md` 重建）。三者不可混用。
12. **Contracts define, Checklists verify** — `contracts/` 定义「合法长什么样」（Schema 单一事实源，build 前/生成时读）；`checklists/` 验证「任务是否达标」（任务后/CI 用）。二者互补不重叠：先读 contracts 再写，写完用 checklists 验收。
13. **Docs shared, Human-owned** — `docs/` 由 Human 拥有与编辑；AI 可读、可引用，但**绝不把 docs 当数据持有者**（数据在 `state/`/`contracts/`），也不得自行改写 docs 的事实性数值（须经 Human 或明确指令）。
