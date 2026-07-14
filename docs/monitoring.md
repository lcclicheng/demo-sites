# 站点健康监控（Monitoring）

> 版本：v0.9.3 ｜ 落地：2026-07-14 ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 配套：`health-check.mjs`、`.github/workflows/health-check.yml`、`docs/workflow.md` §11、`docs/pricing.md`（B 年度呵护档含监控）

监控分**两层**，互补使用：

| 层 | 工具 | 频率 | 告警方式 | 成本 | 谁配 |
|---|---|---|---|---|---|
| **自建（已落地）** | 本仓库 `health-check.mjs` + `health-check.yml` | 每天 1 次（cron） | 失败自动开/更 GitHub Issue（标签 `health-alert`），恢复自动关闭 | 免费（GitHub Actions 额度内） | 已就绪，零配置 |
| **外部探测（推荐加）** | UptimeRobot 免费版 | 每 5 分钟 | 邮件 / App 推送 / Webhook | 免费（50 监测点） | 你手动注册 |

**为什么两层**：GitHub Actions 定时任务最快 5 分钟粒度但实际排队常延迟，且不适合“秒级发现宕机”；UptimeRobot 分钟级探测 + 即时推送补足实时性。自建层的价值是**内容级校验**（不只 200，还查挂载点/title 是否真的渲染出来）+ 用 Issue 留痕形成“看板”。

---

## 一、自建层（已落地，无需额外操作）

### 检查内容
`health-check.mjs` 对每个站点（清单取自 `build-clean.sh` 的 `PROJS`，单一事实源）请求线上地址 `<BASE_URL>/<slug>/`，断言：

1. HTTP 200
2. 响应体非空
3. 含 React 挂载点 `<div id="root">`（构建产物特征）
4. 含非空 `<title>`（SEO 注入成功特征）

任一站点不满足 → 退出码 1。

### 运行方式
- **自动**：`.github/workflows/health-check.yml` 每天 UTC 07:17（北京 15:17）跑；也可在仓库 **Actions → Site health check → Run workflow** 手动触发。
- **本地**：`node health-check.mjs`（可选 `--json` 生成 `health-report.json`；可用 `BASE_URL=... node health-check.mjs` 指向其它环境）。

### 告警看板（GitHub Issues）
- 有站点失败：自动创建/更新一个标题为「🩺 Site health alert」、带 `health-alert` 标签的 Issue，正文附完整检查报告与 Run 链接；持续失败会追加评论。
- 全部恢复：自动在该 Issue 追加“已恢复”评论并关闭。
- 即“健康看板” = 仓库 Issues 里筛 `label:health-alert`：**空 = 全绿**。

> 首次运行前建议在仓库手动建一个 `health-alert` 标签（Issues → Labels → New label），否则首次自动创建 Issue 时若无该标签会由 API 顺带创建（GitHub 允许，但先建更可控）。

---

## 二、外部层（UptimeRobot，推荐手动加）

### 配置步骤（约 10 分钟）
1. 注册 <https://uptimerobot.com>（免费版 50 个监测点、5 分钟粒度）。
2. **Add New Monitor** → Monitor Type: `HTTP(s)`。
3. Friendly Name：站点名（如 `sotto-sotto`）；URL：`https://lcclicheng.github.io/demo-sites/<slug>/`。
4. Monitoring Interval：5 minutes。
5. 每个上线站点重复一次（可用 UptimeRobot 的批量导入）。
6. **Alert Contacts**：绑邮箱（默认）；可选加 Telegram / Slack / Webhook。
7. （可选）开启 UptimeRobot 免费 **Status Page**：给客户一个公开的“运行状态”页，专业感加分，也可作为 B 档“年度呵护”的可视交付物。

### 与定价挂钩
- `docs/pricing.md` 的 **B 年度呵护（£390/年）** 已含“站点健康监控 + 异常主动告警”。
- 交付 B 档客户时：把该客户站点 URL 加进 UptimeRobot，并（可选）把其纳入一个公开 Status Page 链接写进交付包。

---

## 三、维护约定
- 新增/下线站点：只需维护 `build-clean.sh` 的 `PROJS`（自建层自动跟随）；UptimeRobot 侧需手动加/删对应监测点。
- 阈值/频率调整：改 `health-check.yml` 的 `cron` 或 `HEALTH_TIMEOUT_MS`。
- 本文件为监控的单一事实源，任何监控改动同步更新此处。
