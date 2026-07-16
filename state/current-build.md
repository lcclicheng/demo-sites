# State · Current Build

- **站点总数**：**20**（10 curated sectioned + 9 真实商家 + 1 sectioned-demo）。
- **单一事实源**：`build-clean.sh` 的 `PROJS` 数组（校验闸门 `validate-sites.mjs` 同步扫）。
- **全量重建**：`bash build-clean.sh`（CI 内自动；本地用 `mv` 移旧产物绕过 safe-delete 守卫，见 `docs/deployment.md` §FAQ）。
- **单站**：`node generate.mjs "./examples/<slug>.json"`。
- **质量闸门**：
  - `validate-sites.mjs` —— 拦截缺图 / 缺必填字段（name/slug/template）的残缺站。
  - `smoke-test.mjs` —— CI 内校验每站产物非空壳，接进 deploy.yml Assemble 之后阻断坏部署。
- **已知债**：`build-clean.sh` 随站点数线性变慢 → 待做「增量构建」（只重建变更站，见 `tasks/todo/increment-build.md`）。
- **更新时机**：站点数变化 / 闸门调整时同步。
