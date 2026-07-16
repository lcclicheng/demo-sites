# Loading Priority（上下文加载优先级 · P0–P8）

> **本文件是 MDD 的运行机制核心**。AI（含 GPT / Claude / Gemini 等多模型协同）处理本项目的**任何任务**，
> 都按以下顺序加载上下文——**先读什么、后读什么、什么情况下可以不读**。
> 决定效率的不是「目录有多少」，而是「规定先读什么、后读什么、何者可不读」。
> 完整标准见 `C:\Users\12102\.workbuddy\MDD-STANDARD.md`。

## 优先级表

| 优先级 | 加载内容 | 是否每次加载 | 说明 |
|---|---|---|---|
| **P0** | `.ai/<role>.md` | ✅ 必须 | 角色身份 / 负责 / 禁止 / 先读（先定自己是哪类 AI） |
| **P1** | `memory/core/`（project · constraints · principles · glossary） | ✅ 必须 | 稳定层，长期不变；任何任务都先建立基础约束 |
| **P2** | `memory/runtime/current-sprint.md` | ✅ 必须 | 易变层；本次迭代焦点 / 待办 / 不做，决定「现在该干什么」 |
| **P3** | `decisions/ADR00N-*.md`（按主题） | 按需 | 仅当任务触及某决策时读对应 ADR（含 `Status`） |
| **P4** | `contracts/`（section-data · business-json · theme） | 按需 | 仅当生成/改站点数据或主题时读 |
| **P5** | `tasks/doing/` | 按需 | 仅当任务关联进行中卡片时读 |
| **P6** | `docs/`（architecture · deployment · onboarding · seo …） | 按需 | 仅当任务需要人类文档细节时读，按 `docs/index.md` 索引定位 |
| **P7** | `knowledge/<行业>/` | 按需 | 仅当生成某行业内容时读对应目录 |
| **P8** | 源代码（`src/` `generate.mjs` …） | 最后 | 仅当要改代码 / 查实现细节时读；契约以 `contracts/` 为准 |

## 运行规则

1. **每次会话起点**：P0 → P1 → P2 必读，建立「我是谁 + 项目边界 + 当前焦点」三件套上下文（典型 < 5K token）。
2. **按需展开**：仅当任务真正触及某层才往下读（如「改部署」才读 `docs/deployment.md` + `state/current-deploy.md`），**不要为无关任务加载全量 `docs/`**。
3. **多 AI 协同**：不同模型共用同一套加载策略 + `contracts/` 统一 Schema，避免输出不同字段。
4. **回写（自动化方向）**：任务完成后由 AI 自动更新 `memory/runtime/progress.md` + `current-sprint.md` + `state/*`，并据 `checklists/` 勾选——未来可由 CI 读取复用。
5. **稳定期纪律**：项目已进「架构稳定期」，重点在**运行机制**（自动维护 + 统一加载），不再新增目录（见 `current-sprint.md` 的「本期不做」）。
6. **Stop Rule（强制）**：若 **P0–P2 已足够回答当前任务**，立即停手，**禁止**继续加载 P3–P8。例：问「项目目标？」→ 读完 `memory/core/` 即答，不得再读 `docs/` / `knowledge/` / `playbooks/`。早停 = 省 token、防上下文膨胀。只有当 P0–P2 确实无法回答时才按需下行。

## 反模式（禁止）
- ❌ 一上来就 `cat docs/workflow.md` 全量（已归档且巨石）。
- ❌ 改视觉却不读 `contracts/theme.md` + `memory/core/principles.md`（theme-agnostic）。
- ❌ 生成业务 JSON 却不读 `contracts/section-data.md`（字段漂移）。
- ❌ 为小任务把 P3–P8 全读一遍（token 浪费 + 上下文膨胀致遗忘）。
- ❌ P0–P2 已能回答仍继续加载 P3+（违反 Stop Rule）。
