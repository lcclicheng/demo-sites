# Checklist · New Client（新客户接入勾选单）

> AI / CI 复用。执行见 `playbooks/new-client.md`。

- [ ] **Plan** — 套餐定档（Free £0 / Reputation £39/mo / Growth Partner £79/mo 含免费建站 / Growth Plus £149/mo），见 `docs/pricing.md` v2
- [ ] **Template** — 选 `sectioned`（优先）或 8 套行业模板之一，见 `state/current-template.md`
- [ ] **Intake** — `examples/<slug>.json` 必填 `template/slug/name` 齐全；真实商家含 `_source`，无编造 hours/rating
- [ ] **PROJS** — slug 已写入 `build-clean.sh` 的 `PROJS`
- [ ] **Preview** — `node generate.mjs "./examples/<slug>.json"` 本地预览核对视觉/文案
- [ ] **Contract** — `contracts/section-data.md` + `business-json.md` 字段合规（theme-agnostic，无 emoji/硬编码色）
- [ ] **Deliver** — `docs/delivery-handover.md` 交付包已出（纯英文）
- [ ] **Deploy** — 通过 `checklists/deployment.md` 上线
- [ ] **Day-7** — 第 7 天满意度调研已发，`clients/<slug>/feedback.md` 已记
