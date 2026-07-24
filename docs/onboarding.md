<!--
  主题文件：客户接入标准作业（SOP）与交付后维护
  来源：由 docs/workflow.md（v1.1.0）§5（含 §5.9/§5.10）+ §7 合规 + 注册地址语义 + §11 新增行业模板 SOP 拆分而来（MDD 拆分，2026-07-16）
  维护：本文件是「接客户 / 交付 / 维护 / 合规 / 新增模板」主题的单一事实源。
-->

# 客户接入 SOP 与交付后维护

> MDD 主题文件 · 索引见 `docs/index.md` · 一册通读见 `docs/PROJECT-OVERVIEW.md`
> 相关：部署见 `docs/deployment.md`｜定价见 `docs/pricing.md`｜交付包见 `docs/delivery-handover.md`｜清单见 `docs/delivery-checklist.md`｜CMS 见 `docs/cms.md`

**原则**：客户不懂开发，全程**你替客户填**。客户只需提供文字内容和照片，你用工具生成、审核、部署。

---

## 1. 接入步骤

1. **启动接入工具**
   ```bash
   gs
   node onboard.mjs
   ```
   浏览器打开 `http://localhost:4321/`

2. **选模板克隆**：下拉选同行业演示站（如新餐厅选 `sotto-sotto`，结构最贴合），自动载入该模板的全部字段。新客户站**优先走 `sectioned`**（见 `docs/section-engine.md`）。

3. **业务类型选择**：Ltd / Sole Trader 一键切换
   - **Sole Trader**：`registeredAddress` 字段自动清空并禁用（Sole Trader 不需要注册办公室）
   - **Ltd**：保留 `registeredAddress` 字段，填合规地址（住宅 / 会计师免费地址 / 虚拟办公室均可，不一定花钱买）

4. **填表**：表单递归渲染模板所有字段（名称、副标题、电话、地址、菜单、评价、关于、营业时间……）。数组字段（如菜单项、评价）可增删。不用碰 JSON 语法。

5. **上传实景图**：在「实景图上传」区选客户照片（可多选），工具自动写入 `assets/<slug>/`，**无需手动放文件夹**。
   - 勾选「按上传顺序重命名为 screenshot-1/2/3.jpg」→ 适合含「实景图区块」的模板（如餐厅），3 张图自动对应区块
   - 不勾选 → 按原文件名保存，表单里以 `./images/<文件名>` 引用即可
   - 当前演示站用的是 Openverse 免费授权占位图，交付客户前替换为客户真实照片（直接覆盖 `assets/<slug>/` 同名文件即可）

6. **生成并自动构建**：点「生成」→ 自动写出 `examples/<slug>.json` + 建 `assets/<slug>/` 目录 + **自动跑单站 `generate.mjs` 构建**（约 30–60 秒，构建失败会重试一次以消弭 npm 网络抖动）。
   - 结果页直接给出：**构建状态**、**本地预览链接**（`/preview/<slug>/`）、**缺失图片提醒**、部署命令
   - 点预览链接即可在浏览器看真实效果（无需起额外服务器）

7. **构建 + 部署**（确认预览无误后）
   ```bash
   bash build-clean.sh
   git add -u && git commit -m "feat: 新增 <slug> 站点"
   git push origin main
   ```
   > ✅ **经接入工具（`onboard.mjs`）生成的新站，slug 已自动写入 `build-clean.sh` 的 `PROJS`**（v0.4 起；v0.5 已加固：写前备份 + `bash -n` 语法校验 + 失败自动还原），结果页 `projDetail` 字段会明确显示「已自动加入」或失败原因。
   > ⚠️ **仅当手动改 `examples/*.json`（不走接入工具）时**，才需自己把 `<slug>` 加入 `PROJS` 数组，否则 Actions 不会构建/部署该新站。
   > 💡 **紧急/临时改动不必全量重建**：只改一张图或一个电话时，用 `node generate.mjs ./examples/<slug>.json` 单站快速 build（约 30–60 秒），详见 §2 快速路径。

8. **交付客户**：发线上地址 + 交付包（见 `docs/delivery-handover.md`；自定义域名/DNS 见 `docs/custom-domain.md`）。

---

## 2. 交付后维护流程

**问题**：真实客户上线后，想改菜单 / 照片 / 地址 / 营业时间，怎么操作？

**当前机制**：由**你（owner）手动改 JSON + rebuild + 部署**，客户不直接碰代码。内容更新按订阅档覆盖——Growth Partner / Growth Plus 含的「内容更新」额度由订阅覆盖（`docs/pricing.md` 免费建站交付边界）；超出边界（扩页、超 1 revision·月、超频改版）走增项计费。详见 `docs/pricing.md`、`decisions/ADR006-no-cms-selfservice.md`。
1. 客户通过微信 / 邮件把变更发你（新文案、新照片文件）
2. 你改对应 `examples/<slug>.json`（或图片覆盖 `assets/<slug>/`）
3. 重建并部署：
   ```bash
   bash build-clean.sh
   git add -u && git commit -m "chore(<slug>): 更新菜单/照片"
   git push origin main
   ```
4. 图片已带 `?v=<md5>` 内容哈希，覆盖同名文件后缓存自动失效，客户刷新即见新图

**🚀 紧急 / 临时改动快速路径（单站快速 build，不必全量）**
- **场景**：客户只改一张图、一个电话或一段文案，且你只想最快验证 / 预览，不想等全量 20 站重建。
- **本地单站快速构建**（约 30–60 秒，只动这一个站）：
  ```bash
  gs
  node generate.mjs "./examples/<slug>.json"        # 仅重建该站 → output/<slug>/dist
  node onboard.mjs                                  # 然后浏览器开 /preview/<slug>/
  # 或 python -m http.server 8088 --directory output/<slug>/dist
  ```
- ⚠️ **注意**：单站 build 只更新本地 `output/<slug>/dist`，**不会自动上线**。要让客户在线上看到，仍需 `git add -u && git commit && git push origin main` 触发 Actions 全量重建。
- 若改动很大（换模板 / 加板块 / 改结构），仍建议走全量 `bash build-clean.sh` 以确保所有站一致。

> ℹ️ **CMS 现状**：Decap 自助后台已降级为内部演示能力，不再作为客户交付项（见 `docs/cms.md`、`decisions/ADR006-no-cms-selfservice.md`）。所有客户内容修改统一走 owner 代改。

---

## 3. 交付后第 7 天满意度调研（反馈循环）

**目的**：把一次性交付变成持续优化的闭环，积累客户洞察反哺模板。

**时机**：站点上线后第 7 天，发送「上线后满意度调研」（简单 Google Form 或邮件）。
- 收集维度：内容准确性、加载速度、手机端体验、想新增的功能、整体满意度 / NPS。
- **知识库沉淀**：反馈记录到 `clients/<slug>/feedback.md`（该目录已 gitignore，敏感信息不进仓库），形成可检索的知识库。
- **AI 复用**：以后可以说「根据过去 N 个客户的反馈，帮我优化 `restaurant` 模板的菜单区块」，AI 会基于 `clients/*/feedback.md` 给出有数据支持的改进。

**调研模板（建议问题）**
1. 网站内容是否准确反映了你的业务？[是 / 部分 / 否 + 备注]
2. 页面加载速度满意吗？[1–5]
3. 手机上浏览体验如何？[1–5]
4. 最希望新增的功能？[开放题]
5. 整体满意度与推荐意愿（NPS）？[0–10]

> 反馈文件结构与填写规范见 `clients/README.md`。

---

## 4. 业务合规与法律风险

- **ECCTA 2024**：禁止把纯 PO Box 作为注册办公室，必须是能接收官方信件的「适当地址」(appropriate address)。
- **Ltd**：强制有注册办公室，但可选住宅 / 会计师免费地址 / 虚拟办公室，不必额外购买。
- **Sole Trader**：不向 Companies House 注册、无注册办公室概念，最简单，适合刚起步的小商家。

**注册地址语义（务必搞清）**

| 业务类型 | 需要注册办公室？ | `registeredAddress` 字段 |
|---|---|---|
| **Ltd（有限责任公司）** | 法定必须，但**不一定要买**；住宅 / 会计师免费地址 / 虚拟办公室都合规（ECCTA 2024 禁纯 PO Box，须是「适当地址」） | 保留，给客户填 |
| **Sole Trader（个体户）** | **完全不需要**（不向 Companies House 注册，无注册办公室概念） | 清空禁用 |

> owner 自己的业务走 **Sole Trader**，所以 `registeredAddress` 对自己无意义；但模板保留该字段是给 **Ltd 客户**用的。演示站已加 Sole Trader 提示段区分语义。

**⚠️ 法律风险边界（重要）**：
- **不要替客户选择或担保注册地址的合法性**。你仅做模板注入（把客户提供的地址填进 `registeredAddress` 字段），适当地址由**客户提供并负责**。模板/文档中可提示「须为 ECCTA 合规的适当地址」，但不替客户做法律判断。
- **GDPR / 隐私政策 / Cookie（英国）**：
  - `inject-privacy.mjs` 已自动注入隐私政策页，但内容为**占位模板**，客户须补充真实条款
  - 交付清单须提醒客户：英国 GDPR 下需有真实隐私政策 + Cookie 同意机制（模板站目前无 Cookie 同意弹窗，若用分析工具需补）

---

## 5. 新增行业模板 SOP（标准化起点）

> 目的：让「做新行业站」可复制、可 Review，避免每次从零摸索。模板库索引见仓库根 `templates/README.md`（指向 `src/<template>/`，不物理复制避免漂移）。

**1. 命名规范**
- 模板名（即 `data.template` 值）：全小写英文、行业语义清晰，如 `restaurant` / `yoga` / `law`；不与现有 8 套重名。
- 站点 slug（`data.slug`）：全词小写连字符，如 `sotto-sotto` / `breath`；避免缩写（见 §6 附录）。
- 源文件：`examples/<slug>.json`；组件：`src/<template>/`（含 `App.tsx` + `business-data.ts`）。

**2. 必须包含的字段清单（至少）**
- 结构性（必填，被 `validate-sites.mjs` 与 Decap 校验）：`name` / `slug` / `template`。
- 业务基础：`tagline` / `aboutParagraphs[]` / `phone` / `address` / `email`（如适用）。
- 内容区块（按行业）：菜单 / 服务 / 作品集 / 评价 / 营业时间 / 预订方式 等。
- 图片引用：统一 `./images/<file>` 约定，对应 `assets/<slug>/`。

**3. SEO / 隐私 / CMS 配置 checklist**（SEO 细节见 `docs/seo.md`）
- SEO：`seo.{title,description}` 填（否则回退 pageTitle/tagline）；`generate.mjs` 会自动注入 og:/canonical/sitemap。
- 隐私：`inject-privacy.mjs` 会自动注入隐私/发票/合同页；如 Ltd 客户需填 `registeredAddress`。
- CMS：如启用自助后台（现为可选增项），跑 `gen-decap-config.mjs` 重新生成 `admin/config.yml`；`template`/`slug` 会被设为 hidden+required。
- 图片：真实图放 `assets/<slug>/`；`?v=` 哈希由 `generate.mjs` 自动加，覆盖同名即刷新。

**4. 测试验证步骤**
- `node validate-sites.mjs` 校验通过（无缺字段 / 缺图 / 孤儿告警）。
- `node generate.mjs "./examples/<slug>.json"` 单站构建成功出 `dist/index.html`。
- 本地预览（onboard.mjs `/preview/<slug>/` 或 `python -m http.server`）。
- 加入 `PROJS`（用 onboard.mjs 生成会自动写；手动加见 `docs/architecture.md` §3）。
- `git add -u && git commit && git push` → Actions 全量校验 + 构建 + 部署，确认线上 200。

---

## 6. 附录：slug 命名约定

- 规则：小写字母 / 数字 / 连字符，如 `sotto-sotto`、`vault`
- **历史不一致（已修复 v0.5）**：`creme-dessert` 源曾用 slug `cr-me`（CRÈME 缩写）、`vault-hotel` 曾用 `the-vault`，已于 2026-07-14 统一为 `creme`、`vault`（同步改了 `generate.mjs` 的 `THEMES` key、门户链接、文档）
- **新增建议**：统一用全词小写连字符
- **旧 slug 的 301 重定向（真实客户场景必做）**：演示期门户无稳定外链，旧 URL 失效影响不大；但若真实客户已对外分享过旧 slug，需做 301 跳转，否则分享链接 404、SEO 权重流失。
  - **GitHub Pages 子路径不支持 `_redirects`**（那是 Netlify 语法）。可用：
    1. **占位跳转页（推荐，零成本）**：在 `public/<旧slug>/index.html` 放 `<meta http-equiv="refresh" content="0; url=/demo-sites/<新slug>/">` + 前端 `location.replace()` 兜底；在 `deploy.yml` 组装阶段复制该页。虽非严格 301（200 + meta refresh），但用户 / 爬虫都能跳转。
    2. **自定义域名侧 301**：若客户已用自定义域名（见 `docs/custom-domain.md`），在其 DNS / Cloudflare 配 301 转发规则（最干净，标准 301）。
  - 备注：本仓库当前 slug 均为首次设定，无历史旧 slug 需重定向；此方案仅作未来改名时的标准动作。

---

*本主题文件由 `docs/workflow.md` v1.1.0 §5/§5.9/§5.10/§7/新增模板 SOP/附录A 拆分（2026-07-16 MDD 重构）。*
