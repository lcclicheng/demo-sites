# Playbook · New Client（接入新客户）

> 执行型 SOP。详细背景见 `docs/onboarding.md`。勾选单见 `checklists/new-client.md`。
> 角色：architect（定模板）→ frontend（填数据/视觉）→ backend（构建部署）→ seo（内容/JSON-LD）。

## 步骤
1. **定档**：确认套餐（Free £0 / Starter £29/mo 声誉管理 / Growth £79/mo 含免费建站 + 托管 + 更新 + 基础 SEO）。定价见 `docs/pricing.md` v1.0。
2. **选模板**：新客户优先 `sectioned`（统一契约）；需要强行业辨识度且 8 套模板已覆盖该行业时可选行业模板。见 `state/current-template.md`。
3. **录入**：复制 `examples/sectioned-demo.json` → `examples/<slug>.json`，填 `SectionedData`（必填 `template/slug/name`）。可跑 `node onboard.mjs` 开录入助手。
   - 真实商家：用 uk-biz-finder 取 OSM 真实数据，导出含 `_source` 对象；**禁止编造 hours / googleRating**。
4. **同步 PROJS**：`build-clean.sh` 的 `PROJS` 加 `<slug>`（onboard.mjs 自动写，手动也务必同步）。单一事实源见 `contracts/business-json.md`。
5. **本地预览**：`node generate.mjs "./examples/<slug>.json"` → 开 `http://localhost:5173/`(或 4321) 核对视觉 + 文案。
6. **交付包**：按 `docs/delivery-handover.md` 出欢迎邮件/合规签字/维护手册/支持条款/发票（纯英文，UK 客户）。
7. **部署**：见 `playbooks/deploy.md`。上线后发预览链接 + Ethan Li 署名外联。
8. **第 7 天**：跑 `docs/onboarding.md` §5.10 满意度调研，结果写入 `clients/<slug>/feedback.md`。

## 退出标准
- [ ] `examples/<slug>.json` 通过 `validate-sites.mjs`（无缺图/缺字段）
- [ ] 站点已在 `/demo-sites/<slug>/` 可访问
- [ ] 交付包已发给客户（英文）
- [ ] 第 7 天反馈已回收
