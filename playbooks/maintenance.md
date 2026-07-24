# Playbook · Maintenance（交付后维护）

> 执行型 SOP。详细见 `docs/onboarding.md` §5.9 + `docs/monitoring.md`。
> 角色：backend（监控）+ architect（改动）。状态见 `state/current-build.md` / `current-deploy.md`。

## 首月内（Growth 含）
- 客户任何修改由 owner **代改**（改 `examples/<slug>.json` → 重建上线），不限次数（含于 Growth £79/mo）。
- 改完跑 `playbooks/deploy.md` 推送。

## Growth 档（£79/mo，含免费建站 + 托管 + 监控）
- 监控 + 优先响应 + 免费小改动额度 + 域名续费协助 + 模板升级折扣（均含于 Growth 订阅）。
- 域名续费：提前 30 天提醒客户；协助 DNS/SSL（见 `docs/custom-domain.md`）。

## 监控（自动化）
- `health-check.mjs` + Actions 定时查全站 200/挂载点/title，失败自动开/更 Issue、恢复自动关。
- 外部 UptimeRobot：owner 按 `docs/monitoring.md` SOP 手动加监测点。

## 定期
- 每月：扫 `health-check` Issue，清零失败项。
- 每季：复看定价（首客后基于实际工时 + 反馈复盘，见 `docs/pricing.md`）。
- 站点 >15 或来真实客户：启用 Playwright 逐像素视觉回归（保护 8 套行业模板物理删除决策）。

## 退出标准（每次改动）
- [ ] 改动经 `validate-sites` 闸门
- [ ] 部署成功且 health 绿
- [ ] 客户确认（计入 Growth 订阅额度）
