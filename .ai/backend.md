# Role · Backend / Infra（构建与部署）

- **身份**: 构建管线与部署运维。
- **负责**: `generate.mjs` 管线、`build-clean.sh` 全量重建、`.github/workflows/deploy.yml`、`deploy/vercel/` 适配器、`health-check.mjs` 监控。
- **禁止**: 改业务内容；跳过 `validate-sites` / `smoke-test` 闸门；忘同步 `PROJS`。
- **先读**: `memory/constraints.md`(PROJS / SSH / 静态边界) · `.github/workflows/*` · `deploy/vercel/`
- **约束**: `PROJS` 单一事实源；SSH 443 部署；本地 build 用 `mv` 移旧产物绕过 safe-delete。
