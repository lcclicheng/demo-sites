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

## 本期待办（进行中）
- 真实商家替换（步骤 2）：9 个真实站仍用占位/臆测数据，首批 4 家高风险外联包就绪待发。
- 首个真实客户签约 → 实测 Vercel 部署（`DEPLOY_TARGET=vercel`）。
- 增量构建（build 随站点数线性变慢）。
- Playwright 逐像素视觉回归（已 20 站，可启用）。

## 本期不做（架构稳定期，防目录膨胀）
- `tasks/` 不扩成 5 子目录；`knowledge/` 不二次拆分；不新增 `prompts/` / `context/`（`.ai/` 已承担角色上下文）。
- 见 `core/loading-priority.md`：未来重点在「自动化维护 + 统一 Context Loading」，而非继续加目录。

## 最近完成
- MDD 骨架（`memory/ decisions/ tasks/ .ai/ docs/index`）落地（commit `f2281b4`）。
- 超级单文件 `workflow.md` 拆为主题文件（commit `8b0233d`）。
- PROJECT-OVERVIEW.md 整合版（commit `3292658`）。
