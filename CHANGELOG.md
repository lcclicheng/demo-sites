# CHANGELOG

> 自动化维护（state-sync 回写），不抄进 docs（Fact only once）。

- 2026-07-16 · **feature (v4.1)** — 落地 MDD v4 自动化四件套：Router(playbooks/router.md,叠 min-context) + state-sync 脚本 + cross-sync playbook/脚本(并修 Laws 10→13 头体漂移) + ci-contracts 校验(workflow+脚本)

- 2026-07-19 · **security (约定防线 → 技术防线)** · commit `c2549a5` — 接手 agent 风险评审后，把 5 条「约定防线」升级为「技术防线」：
  - `generate.mjs`：加**真实 safe-delete 守卫**（替代原文档虚构的 `SAFE_DELETE_BULK_CONFIRM_REQUIRED`）——`rmSync` 前校验 `projectName` 合规(`^[a-z0-9][a-z0-9-]*$`)且 `outputDir` 严格落在 `output/` 内，否则 `process.exit(1)` 拒删，防 `slug=".."` 越界误删工程。
  - `build-clean.sh`：加**失败闸门**——构建失败 / dist 缺失计数，任一 >0 即 `exit 1`（不再假成功）；刻意不设 `set -e`（避免首个失败即中止循环、隐藏其余站点失败）。
  - `validate-sites.mjs`：加**重复构建目标检测**——遍历 PROJS 各 JSON 归一化 `projectName(slug||name)`，重复即 `exit 1`（防双事实源冲突线上丢站）。
  - `.githooks/pre-commit` + `deploy.yml`：**outreach 泄漏双防线**——本地钩子扫描暂存文件拦截 `outreach/business/business-kit/clients`（`clients/README.md` 例外）；CI 步骤 `git ls-files` 扫敏感目录兜底 `exit 1`。
  - `deploy.yml`：`upload-pages-artifact` 加 `retention-days: 30`（保留期可 Re-run 历史 Deploy 回滚）；`AGENT-ONBOARDING.md` 补 §11 回滚方案 + 修正虚构守卫描述。
  - 验证：`node --check` / `bash -n` 通过；safe-delete 守卫对 `".."` 拒删；`validate-sites.mjs` 实跑 45 站 exit 0；push 后线上 sitemap 46 条全 200 无漏站。
  - 注：本次**仅改 CI/守卫逻辑，未动站点 HTML**，线上内容与上一成功部署一致。
