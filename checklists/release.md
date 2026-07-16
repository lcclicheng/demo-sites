# Checklist · Release（发版勾选单）

> AI / CI 复用。执行顺序见 `playbooks/release.md`。

- [ ] **Build** — `bash build-clean.sh` 全量重建无错
- [ ] **Smoke** — `node smoke-test.mjs` 每站产物非空壳
- [ ] **Health** — `node health-check.mjs` 全站 200 / 挂载点 / title 正常
- [ ] **Commit** — `git commit` 已建（领先 1）
- [ ] **Deploy** — `git push origin main`（WorkBuddy 内 `dangerouslyDisableSandbox:true`）成功，Actions 绿
- [ ] **Tag** — `git tag vX.Y.Z && git push origin vX.Y.Z`（可选）
- [ ] **Version** — `state/current-version.md` 已更新
- [ ] **Release** — `state/current-release.md` 同步 commit hash + 日期
- [ ] **Progress** — `memory/runtime/progress.md` 追加条目
- [ ] **Sprint** — `memory/runtime/current-sprint.md` 本迭代任务归 done
