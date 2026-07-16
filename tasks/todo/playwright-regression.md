# Task · Playwright 逐像素视觉回归

- **背景**: 真实商家迁 sectioned 前需回归保护；否则重构可能悄悄破坏 UI。
- **目标**: 接入 Playwright 视觉回归，保护 20 站 UI 不退化（smoke-test 仅查非空壳，不够）。
- **完成度**: 0%（站点 >15 已满足启用条件，原留待真实客户；现 20 站可启用）
- **负责人**: AI
- **相关文件**: `smoke-test.mjs` · `src/components/sections/*` · `src/components/visual.tsx`
- **See**: memory/core/principles.md(双轨收敛·未回归前不删行业模板)
