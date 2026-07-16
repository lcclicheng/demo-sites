# Progress（最近进度，按 Sprint 追加）

## 2026-07-16
- **定价重构 v0.9.2.2**：A 档取消 Decap CMS 自助，改「首月内不限次数代改」；B 档 £390/年 接管首月后。
- **V2 路线图落地**：步骤1(CRM `clients/`) / 2(知识库 8 行业) / 4a(JSON-LD 注入) / 4b(Blog 脚手架) / 5(Vercel 适配器) / 6(Section Engine) 全部完成。
- **步骤6 收口**：10 curated 预设全迁 `sectioned`，双轨在 curated 层终结；站点 19→20（含 morris-coffee 迁 sectioned + sectioned-demo）。
- **文档同步 v1.1.0 + 门户同步**（补 sectioned-demo 卡 + OG/Twitter 文案）。
- **产出 `docs/PROJECT-OVERVIEW.md`**（最终整合版，含架构 + 订阅付费）。
- **MDD 架构落地**：按用户要求改为 Memory Driven Development —— 建 `memory/ decisions/ tasks/ .ai/` 骨架 + `docs/index.md`；`workflow.md`(57KB) 已拆为 `architecture.md`/`deployment.md`/`onboarding.md`/`seo.md`（+ 现有 pricing/monitoring/section-engine 等专项），workflow.md 顶部加归档标注不再维护，README/index.md 回链全部改指主题文件。
- **MDD 成熟度收敛（三轮闭环，用户评分 96→99/100）**：①骨架 `memory/ decisions/ tasks/ .ai/` + `docs/index`（f2281b4）→ ②`workflow.md`(57KB) 拆主题文件（8b0233d）→ ③第二轮系统级收口 `memory` 拆 `core/runtime` + `contracts/`(Schema 单一事实源) + `state/`(运行时) + `playbooks/`(执行 SOP) + `checklists/`(AI/CI) + ADR `Status` + 加载优先级 P0–P8（a604623）→ ④第三轮 99 分精炼：Architecture Laws(10 铁律) + Stop Rule(P0–P2 够答即停) + `state/health.md`(一眼健康度) + `runtime/lessons-learned.md`(Sprint 复盘) + 根 `events.log`(变动历史) + 4 个自动化方向落 `tasks/todo`（073de6e）。**最终定级 V4 · AI Native Operating System**，项目进入「架构稳定期」，后续重点=自动化维护而非继续加目录。本仓库即 MDD 参考实现（标准见 `C:\Users\12102\.workbuddy\MDD-STANDARD.md` v4）。

## 2026-07-15
- **架构审查**（H1-H5 / L1-L4）：H2(CMS 覆盖) 已闭环、H3(OSM 署名) 已修、H1(占位数据) 加免责横幅过渡；H4 误报撤销。
- 9 真实英国商家 demo 全上线（v1.0）。

## 2026-07-14
- **流程标准化 v1**：交付包 / 模板库 SOP / 反馈循环 / AI 协作规范 / 遗留待办(P3-P6) 落地；定价改进攻型两档（原三档）。

- 2026-07-16 [state-sync · feature (v4.1)] 落地 MDD v4 自动化四件套：Router(playbooks/router.md,叠 min-context) + state-sync 脚本 + cross-sync playbook/脚本(并修 Laws 10→13 头体漂移) + ci-contracts 校验(workflow+脚本)