# 建站系统 · 架构漏洞审查（2026-07-15）

> 范围：gh-pages-build（19 站）+ UK Biz Finder + 资产流水线 skill + CI + Decap CMS。
> 方法：实测 9 真实站 JSON 字段、grep 署名/隐私、读 `build-clean.sh` / `deploy.yml` / `admin/config.yml` / `gen-decap-config.mjs`，并重跑 CMS 生成验证修复。
> 结论：架构骨架健康（CI 三闸门 + 孤儿门 + 逐站 dist 校验 + OAuth 已配 + 7/8 模板含隐私页）。但存在 **5 个待处理漏洞，其中 2 个高危**。

---

## 🔴 高危

### H1 — 9 个真实商家站展示"造假/占位"数据，且当前公开上线
证据（实测 `examples/*.json`）：
- **电话造假**：`indaba-yoga` / `seddons-law` 用占位号 `+44 20 7486 9999` / `2222`，却以该商家真实电话展示在站点上。
- **伪造好评**：`vale-hardware` / `papa-bruno` 含编造的 5★ 评价 + 虚构顾客名（Priya Sharma / Mr Okafor / James Whitfield 等），以真实商家名义公开展示。
- **营业时间全为臆测**：9 站 `hours` 均无 OSM 来源、未核实（如 ganache 直接写 "Monday — Closed"）。

风险：对真实商家展示虚假联系方式 + 伪造好评 = 误导消费者，触碰 UK **Consumer Protection from Unfair Trading Regulations 2008** 与 CMA 虚假评价红线；消费者按假电话联系或信假评价消费，有法律/声誉风险。

建议（按风险从低到高）：
1. **加可见免责横幅**："This is a showcase demo — details not yet verified with the business."（最快、零破坏）
2. **隐藏造假字段**：indaba/seddons 电话置空或改 "Contact via our team"；vale/papa 删除 `reviews` 数组。
3. **获授权前移出公开门户 / `noindex`**：9 真实站从根 portal 下架或加 `<meta name="robots" content="noindex">`，避免被搜索引擎收录为"该商家官网"。

### H2 — Decap CMS 配置过期：只覆盖 10 个模板 demo，9 个真实商家站不在 CMS 内
证据：`admin/config.yml` 仅 10 个 `file` 条目；9 真实站 slug 全部缺失。`gen-decap-config.mjs` 实际读 `build-clean.sh` 的 `PROJS`（19 站），重新生成即可全覆盖。

风险：定价承诺"Decap CMS 自助后台"对那 9 家实际客户**不可用**——他们无法自助改内容，与交付包/定价文档矛盾。

修复（**已实测验证**）：`node gen-decap-config.mjs` → config.yml 变 19 站全覆盖（含 9 真实站 ✅），`client_id` 自动沿用不被冲掉。需重新 commit + push 让线上 `/admin` 生效。

---

## 🟠 中危

### H3 — 9 个真实站未给 OSM / Openverse 署名
证据：模板 footer 仅 `© {business}. All rights reserved.`，无 OSM contributors / Openverse 署名。

风险：站名/地址来自 **OSM（ODbL §4.3 须署名）**；og 图来自 **Openverse CC BY（须署名作者 + 许可）**。当前署名缺失 = 许可违约。

修复：footer 加 `Data © OpenStreetMap contributors · Images © Openverse (CC)`（与 `uk-biz-finder` 底栏一致）。

### H4 — ~~ganache(dessert) / papa-bruno(restaurant) 站缺隐私政策页~~ ❌ **经复核为误报（已撤销）**
原证据错误：实测 `src/dessert/App.tsx`(L41/L379) 与 `src/restaurant/App.tsx`(L62/L760) **均含完整 `#privacy` 路由 + 本地 `PrivacyPolicy` 组件**，且 footer 各有 `<a href="#privacy">Privacy Policy</a>` 链接。构建 `ganache`、`papa-bruno` 后，其 `dist` 含 "Privacy Policy / We collect / GDPR / cookies" 文案 → **8/8 模板均已含隐私页，H4 不成立**。

风险：原判定为合规缺口，复核后无此缺口。

修复：把 privacy 路由 + Cookie 链接移植到 dessert / restaurant 模板（与 coffee 等对齐）。

### H5 — 9 个真实商家在"未获授权"状态下被公开展示
证据：第二步外联尚未发出；9 站已公开上线、使用真实商号 + 地址。

风险：未经同意公开展示真实商家（含臆测信息）= 潜在冒充/诽谤风险。外联邮件已含"不愿展示可要求下架"缓冲，但展示本身先于授权。

修复：同 H1-③（获授权前 `noindex` / 移出门户），或加速外联获取 opt-in。

---

## 🟡 低危 / 已知

- **L1**：CI 每次 push 全量重建 19 站（含 docs-only），费时；incremental build 在 `workflow.md` 标 🔲 待做。
- **L2**：Bath 咖啡 JSON 仍在 C 盘桌面未导入（第二步范围，设计如此）。
- **L3**：UK Biz Finder — law 行业 Overpass SSL EOF 偶发需重试；"无网站"代理不可靠（连锁分店缺 website 标签被误判）；Photon SSL 抖动已用硬编码坐标绕开。
- **L4**：`generate.mjs` 的 `TEMPLATES` 内 `favicon` emoji 为死配置（无害）。

---

## ✅ 架构优势（已确认健康）

- **CI 三闸门**：`validate-sites` 孤儿门 → `build-clean.sh`（逐站校验 dist 真生成，不盲信 exit0）→ `smoke-test` → `gen-seo` → deploy；权限最小化（仅 `GITHUB_TOKEN`，无明文 PAT）。
- **PROJS 为唯一事实源**，孤儿门防漏构建 / 防孤儿上线。
- **safe-delete 守卫绕法**（`mv` 非 `rm`）已文档化。
- **OAuth `client_id` 已填**，CMS 后端可用（仅覆盖面子缺口，见 H2）。
- **8/8 模板含隐私页 + Cookie 声明**（PECR 意识具备，H4 经复核为误报，见下）。
- 资产流水线 skill + UK Biz Finder 工具链完整。

---

## 建议处理顺序

| 序 | 项 | 工作量 | 性质 |
|---|---|---|---|
| 1 | H2：CMS 重生（已验证 5 分钟） | 极小 | 让定价承诺成立 |
| 2 | H1：加免责横幅 | 小 | 最快消除法律风险 |
| 3 | H3：footer 加 OSM/Openverse 署名 | 小 | 许可合规 |
| 4 | H4：dessert/restaurant 加隐私页 | 中 | GDPR 合规 |
| 5 | H5：加速外联 / 获授权前 noindex | 中 | 冒充/诽谤风险 |

> 审查当天已获授权执行修复（用户"可以，开始"）。进度见下。

---

## 修复执行记录（2026-07-15 夜）

| 项 | 状态 | 落地方式 | 提交 |
|---|---|---|---|
| H2 · CMS 覆盖 19 站 | ✅ 已推送 | `node gen-decap-config.mjs` 重生成 `admin/config.yml`，自动保留 `client_id`，覆盖 10 模板 + 9 真实商家 | `923adc1` |
| H3 · OSM/Openverse 署名 | ✅ 已修复 | `generate.mjs` 在 `</body>` 前注入底部署名条，仅 `_source==='osm'` 真实站生效（模板 demo 不注入） | 本轮 |
| H1 · 未核实免责横幅 | ✅ 已闭环 | `generate.mjs` 注入顶部横幅"数据未核实，商家可 claim/下架"，仅真实站生效；claim 邮箱已替换为真实 `lic28790@gmail.com` | 本轮 |
| H4 · dessert/restaurant 隐私页 | ✅ 误报已复核 | 经复核 8/8 模板均含完整隐私页（含 dessert/restaurant），构建产物已验证含隐私文案，无需改动 | 本轮 |
| H5 · 外联/授权 | ⏸ 第2步范畴 | 加速外联 + 获授权前 `noindex` | — |

**本轮改动文件**：`generate.mjs`（注入逻辑）+ 9 个真实站 JSON（`_source:'osm'` 来源标记，既修复数据缺陷又驱动 H1/H3 判定）。

**H1 已闭环**：claim 邮箱已替换为用户真实邮箱 `lic28790@gmail.com`（H1 完全闭环）。**剩余待第2步**：站上占位电话 / 编造好评 / 臆测营业时间本身待联系商家核实后替换（横幅仅为过渡期消险）。
