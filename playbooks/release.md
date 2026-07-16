# Playbook · Release（发版）

> 执行型 SOP。勾选单见 `checklists/release.md`。
> 角色：architect。状态直查见 `state/current-version.md` / `current-release.md`。

## 步骤
1. **收口**：确认本迭代任务全在 `tasks/done/`，`memory/runtime/current-sprint.md` 已更新。
2. **构建 + 冒烟**：
   ```bash
   bash build-clean.sh && node smoke-test.mjs
   ```
3. **健康检查**：`node health-check.mjs`（或等 Actions 定时）。
4. **提交 + 推送**（见 `playbooks/deploy.md`，须 `dangerouslyDisableSandbox`）。
5. **定版号**：更新 `state/current-version.md`（语义化：v1.1.0 → v1.2.0 等）。
6. **写 Release Note**：在 `memory/runtime/progress.md` 追加条目；如需对外，更新 `docs/PROJECT-OVERVIEW.md` 版本脉络。
7. **（可选）Tag**：`git tag v1.2.0 && git push origin v1.2.0`（GitHub Releases 展示）。
8. **同步状态**：更新 `state/current-release.md`（commit hash + 日期）。

## 退出标准
- [ ] Build 通过，smoke 通过
- [ ] Health 全站 200
- [ ] Deploy 成功
- [ ] Version / Release / Progress 三处状态已同步
