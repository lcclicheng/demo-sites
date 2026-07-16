# State · Current Deploy

- **托管**：GitHub Pages，子路径 `https://lcclicheng.github.io/demo-sites/`。
- **认证**：SSH（`ssh.github.com:443`）+ `GITHUB_TOKEN`，**不用 PAT**（ADR005）。
  - 本机 `~/.ssh/config`：`Host github.com → ssh.github.com:443`，密钥 `id_ed25519_github`。
  - **WorkBuddy 内 `git push` 须 `dangerouslyDisableSandbox:true`**，否则沙箱拦截读 `~/.ssh/config` 致 443 失败。
- **触发**：`git push origin main` → `.github/workflows/deploy.yml` 自动「校验 → 构建 → 组装 → 部署」。
- **CI 无 safe-delete 守卫**：本地构建用 `mv output ../oldbuild_<时间戳>` 绕过（CI 不受影响）。
- **客户站部署**：默认同 GitHub Pages；首个真实客户签约后实测 Vercel（`DEPLOY_TARGET=vercel`，`deploy/vercel/` Adapter）。
- **监控**：`health-check.mjs` + Actions 定时任务查全站 200/挂载点/title，失败自动开 Issue；外部 UptimeRobot SOP 见 `docs/monitoring.md`。
- **最近成功推送**：`8b0233d`（2026-07-16，已上线 `origin/main`）。
- **更新时机**：部署配置变更 / 最近推送 hash 变化时同步。
