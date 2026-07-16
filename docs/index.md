# 文档索引（MDD · docs/index.md）

> 本项目自 **2026-07-16** 起按 **Memory Driven Development (MDD)** 组织：**代码给编译器、文档给人、Memory 给 AI**。本文档仅做索引——AI / 人按任务**按需读取**，不为无关任务加载全量。
> 完整标准见 `C:\Users\12102\.workbuddy\MDD-STANDARD.md`。

## 给 AI 读（长期记忆，任何任务先读这些）
- `memory/project.md` · `memory/goals.md` · `memory/constraints.md` · `memory/principles.md` · `memory/progress.md` · `memory/glossary.md`
- `decisions/ADR00N-*.md`（架构决策记录，避免重复问「为什么」）
- `tasks/{todo,doing,done}/`（当前任务）
- `.ai/<role>.md`（角色上下文：architect / frontend / backend / seo / designer）

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
