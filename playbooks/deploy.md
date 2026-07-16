# Playbook · Deploy（部署上线）

> 执行型 SOP。详细坑表见 `docs/deployment.md`。勾选单见 `checklists/deployment.md`。
> 角色：backend。状态直查见 `state/current-deploy.md`。

## 前置（一次）
- 确认 `~/.ssh/config` 有 `Host github.com → ssh.github.com:443` + 密钥 `id_ed25519_github`。
- 确认 remote 是 `git@github.com:lcclicheng/demo-sites.git`。

## 步骤
1. **校验**：`bash build-clean.sh`（含 `validate-sites.mjs` 闸门）。本地重建前用 `mv output ../oldbuild_<时间戳>` 移旧产物，**绝不用 `rm -rf output`**（safe-delete 守卫会拦）。
2. **提交**：
   ```bash
   git add -u && git commit -m "feat(site): <slug> 上线"
   ```
3. **推送（关键）**：
   ```bash
   git push origin main        # WorkBuddy 内必须 dangerouslyDisableSandbox:true
   ```
   沙箱默认拦截读 `~/.ssh/config` → SSH 回退 22 端口被墙。禁用沙箱后走 443 成功。
4. **等 CI**：Actions 自动「校验→构建→组装→部署」到 `/demo-sites/`。
5. **验证**：开 `https://lcclicheng.github.io/demo-sites/<slug>/` 核对 200 / 挂载点 / title（或等 `health-check` 自动 Issue）。

## 客户站（Vercel）
- 首客签约后：`DEPLOY_TARGET=vercel` 走 `deploy/vercel/` Adapter；GitHub Pages 仍作 demo 门户。

## 退出标准
- [ ] `validate-sites` 无阻断
- [ ] `git push` 成功（SSH 443，非 PAT）
- [ ] Actions 绿，站点 200 可访问
- [ ] `state/current-release.md` 已同步 commit hash
