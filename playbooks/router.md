# Playbook · Router（任务类型 → 最小加载计划）

> **身份**：MDD v4 自动化方向第一阶段的「手动实现」。所有 AI（本会话助手 / Claude / GPT / Gemini）处理本项目任何任务，先经 Router 决定「加载什么」，再执行——不靠自由发挥。
> **配套**：`memory/boot.md`（固定清单 1–7 步）+ `.ai/loading-protocol.md`（完整协议）+ `memory/core/loading-priority.md`（P0–P8 + Stop Rule）+ `tasks/router-template.md`（输出模板）。
> **目标**：落实 Stop Rule，P0–P2 够答即停，防上下文膨胀致遗忘（对应 Law #7 AI loads minimum context）。

## 1. 强制底座（每次必读，顺序固定，< 5K token）

不论任务类型，开场必走 `memory/boot.md` 的 1–7 步：

```
P0  .ai/<role>.md             → 我是哪类 AI、负责/禁止/先读什么
P1  memory/core/              → project · constraints · principles(Laws) · glossary
P2  memory/runtime/current-sprint.md → 本期焦点 / 待办 / 不做
```

读完三件套，已能回答「项目是什么、边界在哪、现在该干什么」。

## 2. Router 流程

```
User 任务
  → ① 匹配下表「任务类型」
  → ② 输出 1 行加载计划（模板见 §4）
  → ③ 评估 Stop?（P0–P2 够答 → 停；否则按表加载 P3+）
  → ④ 执行；完成后跑 state-sync 回写闭环（见 playbooks/cross-sync.md 关联）
```

**Stop Rule 是最高优先级铁律**：若 P0–P2 已能完整回答，立即停，**禁止**加载 P3–P8。
判断标准：「不读 `docs/` 能否给出正确、可执行的回答？」能 → 停。例外：用户明确要求读文档 / 查细节 / 对比方案，才允许进 P6。

## 3. 任务类型 → 加载计划映射表（核心）

> 只列任务真正触及的层，不要为无关任务多读。状态文件（`state/`）随对应主题加载。

| # | 任务类型（关键词） | 加载计划（P0–P2 + 仅这些） | Stop? 典型 |
|---|---|---|---|
| T1 | 项目目标 / 定位 / 边界 / 状态问答 | P0–P2 | **Y**（读完 core 即答） |
| T2 | 架构 / 决策疑问 | P0–P2 + `decisions/ADR00N-*.md`（按主题看 `Status`） | N |
| T3 | 生成 / 校验业务 JSON（站点数据） | P0–P2 + `contracts/section-data.md` + `contracts/business-json.md` | N |
| T4 | 改视觉 / 主题 / 配色 | P0–P2 + `contracts/theme.md` + `memory/core/principles.md`(theme-agnostic) | N |
| T5 | 部署 / SSH / CI / Pages | P0–P2 + `docs/deployment.md` + `state/current-deploy.md` | N |
| T6 | 接客户 SOP / 交付 / 维护 | P0–P2 + `playbooks/new-client.md` + `docs/onboarding.md` | N |
| T7 | 某行业内容（文案 / FAQ / SEO 文案） | P0–P2 + `knowledge/<行业>/`（只该行业） | N |
| T8 | 改代码 / 查实现细节 | P0–P2 + `src/` + `contracts/`（契约为准） | N |
| T9 | 发布 / 交付包 / 上线 | P0–P2 + `playbooks/release.md` + `checklists/release.md` | N |
| T10 | 健康检查 / 为何变 | P0–P2 + `state/health.md` + `events.log` | N |
| T11 | 自动化维护（Router/state-sync/CI） | P0–P2 + 本 `playbooks/router.md` + `tasks/todo/automation-*.md` | N |

## 4. 输出模板（每个新任务开场先打这行）

见 `tasks/router-template.md`：

```
[Router] role=<role> → P0-P2 + {实际要读的 P3..} → Stop? <Y/N>
```

例：
- 「咱项目现在做什么的？」→ `[Router] role=architect → P0-P2 → Stop? Y`
- 「把 mario 站的菜单改一下」→ `[Router] role=frontend → P0-P2 + contracts/section-data + examples/mario.json → Stop? N`

## 5. 最小上下文规则（automation-min-context 折叠于此）

Router 本身就实现「按任务类型选最小上下文」。额外约束：

- **不加层**：映射表外的一律不读。例如 T7 只进 `knowledge/<该行业>/`，不读其余 7 个行业目录。
- **不预读**：不要「先大概看看 docs 再决定」——先匹配类型、输出计划、再读。
- **早停优先**：哪怕任务类型命中 T2–T11，若执行中发现 P0–P2 已够，仍可中途 Stop。
- **Token 预算**：P0–P2 < 5K；单任务典型 < 15K；极端全量 < 40K。超预算 = 违反 Stop Rule 或读错层（回看 `loading-protocol.md` §4）。

## 6. 反模式（禁止）

- ❌ 一上来 `cat docs/workflow.md` 全量（已归档巨石）。
- ❌ 改视觉不读 `contracts/theme.md`（theme-agnostic 漂移）。
- ❌ 生成 JSON 不读 `contracts/section-data.md`（字段漂移）。
- ❌ 小任务把 P3–P8 全读一遍（token 浪费 + 上下文膨胀致遗忘）。
- ❌ P0–P2 已能回答仍继续加载 P3+（违反 Stop Rule）。
- ❌ boot 阶段读 `knowledge/` 或 `src/`。

## 7. 与回写闭环的关系

Router 决定「读什么」；任务完成后由 **state-sync**（`scripts/state-sync.mjs`）自动回写 `state/` + `memory/runtime/progress.md` + `events.log`（对应 Law #8）。两者构成 V4 自动化的最小闭环：

```
Router(读最小) → 执行 → state-sync(写最小) → events.log(记为什么)
```

## 8. 演进

- 本文件是 Router 的「规则实现」。未来可升级为脚本分类器（关键词→计划），但当前规则表已足够，且零风险、易审计。
- 若新增任务类型，在此表加一行即可（不新增目录）。
