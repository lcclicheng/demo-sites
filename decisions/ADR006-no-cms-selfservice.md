# ADR006 · 标准交付不含客户 CMS 自助后台（2026-07-16）

- **Status**: Accepted
- **Decision**: A 档取消 Decap CMS 自助交付，改「首月内不限次数代改」；首月后任何改动走 B 档（或单次付费），所有改动由 owner 经 GitHub Pages 重建上线。
- **Reason**: 省去为每个客户配 OAuth / 培训 / 维护后台的隐性成本；客户零后台学习成本；首月后改动自然导向 B 档续费，黏性更强。
- **备选**: 保留 Decap CMS 自助（原 A 档含 CMS）—— 每客户运维成本高、且 9 真实商家站原未覆盖 CMS（H2 风险）。
- **影响**: `/admin` 仅留演示能力（OAuth 已激活，可登录编辑）；真实客户需自助时按生产模型（独立仓库 + 协作者隔离 + 各自注册 OAuth App）单独付费启用。`docs/cms.md` 降级为内部演示参考。
- **See**: docs/pricing.md(v0.9.2.2), docs/cms.md(§1 降级说明), docs/architecture-audit-2026-07-15.md(H2 闭环)
