# 文档索引（MDD · docs/index.md）

> 本项目自 **2026-07-16** 起按 **Memory Driven Development (MDD)** 组织：**代码给编译器、文档给人、Memory 给 AI**。本文档仅做索引——AI / 人按任务**按需读取**，不为无关任务加载全量。
> 完整标准见 `C:\Users\12102\.workbuddy\MDD-STANDARD.md`。
> **第二轮收口（2026-07-16）**：`memory/` 拆 `core/`+`runtime/`；新增 `contracts/`（Schema 单一事实源）、`state/`（运行时状态）、`playbooks/`（执行 SOP）、`checklists/`（AI/CI 复用）；`decisions/` 各 ADR 加 `Status`；落地「加载优先级 P0–P8」（`memory/core/loading-priority.md`）。架构进入稳定期，不再新增目录。
> **第三轮精炼（2026-07-16，评审 99/100）**：`principles.md` 加 **Fact only once** + **Architecture Laws(10 条铁律)**；`loading-priority.md` 加 **Stop Rule**（P0–P2 够答即停）；新增 `state/health.md`（一眼健康度）、`memory/runtime/lessons-learned.md`（Sprint 复盘）、根 `events.log`（变动历史=为什么变成这样，与 `state/` 配对）；4 个自动化方向落 `tasks/todo/`（Router / 状态同步 / CI 校验 / 最小上下文）。未新增任何目录。

## MDD 骨架（当前目录）

```
gh-pages-build/
├── src/ generate.mjs build-clean.sh …   【代码给编译器，本次未动】
├── docs/          【文档给人】索引见下 + 主题文件 + PROJECT-OVERVIEW + workflow(归档)
├── memory/
│   ├── core/      【稳定层 P1】project · constraints · principles · glossary · loading-priority
│   └── runtime/   【易变层 P2】goals · progress · current-sprint · lessons-learned
├── contracts/     【P4】section-data · business-json · theme（Schema 单一事实源，多 AI 统一字段）
├── state/         【运行时状态直查】current-version · release · template · build · deploy · health
├── decisions/     【P3】ADR001–006（均含 Status: Accepted）
├── tasks/         【P5】todo · doing · done（按你收口保持三态，未扩 review/）
├── playbooks/     【执行型 SOP】new-client · deploy · release · seo · maintenance
├── checklists/    【AI/CI 复用勾选单】release · deployment · new-client
├── .ai/           【P0】architect · frontend · backend · seo · designer
├── knowledge/     【P7】8 行业素材（restaurant/coffee/salon/dessert/yoga/law/hotel/trades，不再二次拆分）
└── events.log     【变动历史】为什么 state 变成这样（与 state/ 配对，AI 排查 Bug 优先读）
```

## 给 AI 读（长期记忆，按加载优先级 P0–P8 读取，见 `memory/core/loading-priority.md`）

**Core（稳定层 · P1 必读）** — `memory/core/`
- `project.md` · `constraints.md` · `principles.md` · `glossary.md`

**Runtime（易变层 · P2 必读）** — `memory/runtime/`
- `goals.md` · `progress.md` · `current-sprint.md`（每次会话先读）· `lessons-learned.md`（Sprint 复盘，越跑越聪明）

**契约 / 状态 / 决策 / 任务 / 角色（P3–P8 按需）**
- `contracts/`（Schema 单一事实源：section-data / business-json / theme）
- `state/`（运行时状态直查：version / release / template / build / deploy / **health 健康度**）
- `decisions/ADR00N-*.md`（架构决策，含 `Status` 字段，避免重复问「为什么」）
- `tasks/{todo,doing,done}/`（当前任务；按收口保持三态，不扩 review）
- `.ai/<role>.md`（角色上下文：architect / frontend / backend / seo / designer）
- `playbooks/`（执行型 SOP）· `checklists/`（AI/CI 复用勾选单）
- `events.log`（**变动历史**：为什么 state 变成这样，排查 Bug 优先读）
- `memory/core/principles.md` 的 **Architecture Laws(10 条铁律)** + `loading-priority.md` 的 **Stop Rule** 是所有 AI 必须遵守的硬约束

## 给人读（按主题 —— 已从超级单文件 workflow.md 拆出）

| 主题 | 文件 | 内容 |
|---|---|---|
| ⭐ 一册通读 | `docs/PROJECT-OVERVIEW.md` | 最终整合版项目说明（架构 + 订阅付费全景，总入口） |
| 技术架构 | `docs/architecture.md` | 技术栈 / 核心管线 / 8 模板 + Section Engine / GitHub Pages 限制 / 目录结构 / PROJS 单一事实源 |
| 部署认证 | `docs/deployment.md` | 本地开发 / push→Actions / SSH 443 / FAQ 坑 / 质量闸门 / 安全清单 / 命令速查 |
| 客户接入 | `docs/onboarding.md` | 接入 SOP 8 步 / 交付后维护 / 第 7 天满意度 / 合规与注册地址 / 新增模板 SOP / slug 约定 |
| SEO / 内容 | `docs/seo.md` | SEO 基础自动注入 / checklist / JSON-LD 结构化数据 / Blog（指向 blog-pipeline.md） |
| Section Engine | `docs/section-engine.md` | theme-agnostic 12 section 组合器 + SectionedData 数据契约 |
| 定价 | `docs/pricing.md` | A £590 / B £390/年 + 分行业微调 |
| 监控 | `docs/monitoring.md` | health-check + UptimeRobot 看板 |
| 路线图 | `docs/v2-roadmap.md` | 增量构建 / Playwright / 真实商家替换等 |

## 配套专项文档
- `docs/custom-domain.md`（自定义域名/DNS）· `docs/delivery-handover.md`（交付包）· `docs/delivery-checklist.md`（交付清单）
- `docs/cms.md`（Decap CMS，已降级为可选演示能力）· `docs/blog-pipeline.md`（Blog 脚手架）
- `docs/real-merchant-outreach.md` · `docs/outreach-emails.md` · `docs/outreach-batch-1.md`（真实商家外联）
- `docs/architecture-audit-2026-07-15.md` · `docs/deployment-adapter.md`（历史审计/适配）

## 归档
- `docs/workflow.md` — 🗄️ **已归档（v1.1.0，2026-07-16 定格）**。原 57KB 超级单文件，已按上表拆分为各主题文件，**不再维护**，仅作历史版本脉络与完整版本记录留存。新内容请写入对应主题文件。

## 行业知识（AI 生成可直接引用，非代码）
- `knowledge/{restaurant,coffee,salon,dessert,yoga,law,hotel,trades}/`（各含 hero / seo / faq / cta）

## 关联
- 在线门户：https://lcclicheng.github.io/demo-sites/
- 仓库：lcclicheng/demo-sites（本地 `gh-pages-build`）
