# Current Sprint（当前迭代 · runtime）

> 易变层。每次会话开始 AI 必读（加载优先级 P2）。任务完成后由 AI 自动更新本文件 + `progress.md`。
> 状态机：`todo → doing → done`（见 `tasks/`，按收口保持三态，不扩 review/）。

## 本期焦点（2026-07-16 起）

**MDD 架构第二轮收口**（用户评分 96/100 后的 4 项系统级升级）：
- ✅ `memory/` 拆 `core/`（稳定）+ `runtime/`（易变 + current-sprint）
- ✅ `decisions/` 各 ADR 加 `Status` 字段
- ✅ 新增 `contracts/`（SectionedData / business-json / theme 三契约）
- ✅ 新增 `state/`（运行时状态直查）
- ✅ 新增 `playbooks/`（执行型 SOP）
- ✅ 新增 `checklists/`（AI/CI 复用）
- ✅ 落地「加载优先级 P0–P8」规则（`core/loading-priority.md`）
- ✅ 第三轮精炼（99/100 评审）：`principles.md` 加 Fact only once + Architecture Laws(10 条铁律)；`loading-priority.md` 加 Stop Rule（P0–P2 够答即停）；新增 `state/health.md`（一眼健康度）+ `memory/runtime/lessons-learned.md`（Sprint 复盘）+ 根 `events.log`（变动历史）；4 个自动化方向落 `tasks/todo/`。未新增目录。

## 本期待办（进行中）
- 真实商家替换（步骤 2）：9 个真实站仍用占位/臆测数据，首批 4 家高风险外联包就绪待发。
- 首个真实客户签约 → 实测 Vercel 部署（`DEPLOY_TARGET=vercel`）。
- 增量构建（build 随站点数线性变慢）。
- Playwright 逐像素视觉回归（已 20 站，可启用）。

## 本期不做（架构稳定期，防目录膨胀）
- `tasks/` 不扩成 5 子目录；`knowledge/` 不二次拆分；不新增 `prompts/` / `context/`（`.ai/` 已承担角色上下文）。
- 见 `core/loading-priority.md`：未来重点在「自动化维护 + 统一 Context Loading」，而非继续加目录。

## 下一阶段（V4 · 自动化，不再加目录）

架构已完成「代码仓库 → AI 可持续协作系统」的转变（V4: AI Native Operating System）。下一步投入**把这套架构自动化**，而非继续设计：

- ~~`tasks/todo/automation-router.md` — Router 自动生成加载计划（User→Router→Task Type→Loading Plan→AI）~~ ✅ 已落地 `playbooks/router.md`
- ~~`tasks/todo/automation-state-sync.md` — 任务完成自动更新 `state/` + `runtime/` + `CHANGELOG` + `events.log`~~ ✅ 已落地 `scripts/state-sync.mjs`
- ~~`tasks/todo/automation-ci-contracts.md` — CI 自动校验 `contracts/`/`checklists/`/`ADR` 引用一致、字段不漂移~~ ✅ 已落地 `scripts/check-contracts.mjs` + `.github/workflows/consistency-check.yml`
- ~~`tasks/todo/automation-min-context.md` — AI 自动按任务类型选最小上下文（落实 Stop Rule）~~ ✅ 已折叠进 `playbooks/router.md` §5

> **自动化四件套已闭环（commit 见 events.log）**：Router 规则 + 状态回写脚本 + 跨项目同步 playbook/脚本 + CI 一致性闸门全部就绪。附带修复一处真实漂移——`principles.md` 与 `MDD-STANDARD.md` 的 Laws 段标题「10 条」与正文 13 条不符，已统一为 13，`scripts/cross-sync-check.mjs` 可自检此类头体漂移。

## 最近完成
- PROJECT-OVERVIEW.md 整合版（commit `3292658`）。
- MDD 骨架（`memory/ decisions/ tasks/ .ai/ docs/index`）落地（commit `f2281b4`）。
- 超级单文件 `workflow.md` 拆为主题文件（commit `8b0233d`）。
- 第二轮系统级收口：`memory` 拆 `core/runtime` + `contracts/`(Schema) + `state/`(运行时) + `playbooks/`(执行 SOP) + `checklists/`(AI/CI) + ADR `Status` + 加载优先级 P0–P8（commit `a604623`）。
- 第三轮精炼（99/100 评审）：`principles.md` 加 Fact only once + Architecture Laws(10)；`loading-priority.md` 加 Stop Rule；新增 `state/health.md` + `runtime/lessons-learned.md` + 根 `events.log`；4 个自动化方向落 `tasks/todo`（commit `073de6e`）。
