# Task · 增量构建（只重建变更站）

- **背景**: 全量 `build-clean.sh` 随站点数线性变慢（现 20 站，每次 push 全量重建）。
- **目标**: 只重建变更站 + 门户，未变更站跳过；或按业务拆多仓库。
- **完成度**: 0%（计划 v0.9，v0.6 依赖缓存已缓解安装）
- **负责人**: AI
- **相关文件**: `build-clean.sh` · `generate.mjs` · `.github/workflows/deploy.yml`
- **See**: memory/core/constraints.md(PROJS 事实源)
