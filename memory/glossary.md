# Glossary（术语）

- **Section Engine**: theme-agnostic 通用 section 组件库（`src/components/sections/*` 12 section）+ 组合器 `src/sectioned/App.tsx`；数据契约 `SectionedData`（全字段可选，缺则 section 返回 null）。
- **THEMES vs TEMPLATES**: `generate.mjs` 双轴解耦——`THEMES`(主题色) 独立于 `TEMPLATES`(版式/模板)。
- **PROJS**: `build-clean.sh` 里的硬编码数组，要构建的站点**唯一事实源**（20 站）。
- **Curated 预设**: 10 个样板站（atelier/breath/chambers/creme/forge/mario/mono/patisserie/sotto-sotto/vault），全 `sectioned`。
- **真实商家 demo**: 9 个基于 OSM 真实数据的展示站（morris-coffee 已迁 sectioned，其余用行业模板）。
- **MDD**: Memory Driven Development，本项目架构标准（见 `C:\Users\12102\.workbuddy\MDD-STANDARD.md`）。
- **ADR**: Architecture Decision Record，架构决策记录（`decisions/ADR00N-*.md`）。
- **Decap CMS**: 静态站自助后台（GitHub OAuth）；2026-07-16 起**降级为演示能力**，标准交付不再含。
- **Onboarding 工具**: `onboard.mjs` + `onboarding.html`，替客户填表生成 `examples/<slug>.json`（自动写 PROJS）。
- **视觉手法库**: `src/components/visual.tsx`（HeroBackdrop / StatsStrip / GradientText / GlassCard / ConfettiBg / Eyebrow / SquareMonogram），currentColor+color-mix 主题自适应。
- **UK Biz Finder**: 独立单文件 SPA，按行业+地区批量拉真实商家（Overpass+Photon+Openverse），导出对齐 `examples/<slug>.json`。
