# Runtime Health（运行时健康度 · state）

> 易变层。AI / CI 第一眼查项目是否健康，**不要去读 CI 日志**。每次 build / deploy / release 后由 CI 或 AI 更新本文件（见 `events.log` 记录变动原因）。
> 状态语义：`PASS` 正常 · `FAIL` 异常（立即看 `events.log`）· `N/A` 不适用 · `PENDING` 进行中。

## 当前状态（更新于 2026-07-16 · commit `a604623`）

| 检查项 | 状态 | 说明 |
|---|---|---|
| Current Build | PASS | 20 站全量构建通过（commit `a604623`） |
| Deploy | PASS | `origin/main` 已推送，GitHub Pages 子路径 `/demo-sites/` 在线 |
| Health | PASS | `health-check.yml` 每日定时查全站 200/挂载点/title，最近一次绿 |
| Smoke | PASS | `smoke-test.mjs` 接进 `deploy.yml` Assemble 之后，非空壳阻断 |
| Coverage | N/A | 静态站生成器无单测套件；视觉回归（Playwright）未启用 |

## 关联

- 变动历史 → `events.log`（为什么变成这样）
- 版本 / 发布 / 构建 / 部署明细 → `state/current-version.md` · `current-release.md` · `current-build.md` · `current-deploy.md`
- 闸门定义 → `memory/core/principles.md`（fail-fast）+ `decisions/ADR004`(Section Engine)
