# 建站系统 · 项目总说明（最终整合版）

> **版本**：v1.1.0（整合）｜ 整合于 2026-07-16 ｜ 作者：lcclicheng（一人公司 / 独立开发者，对外署名 **Ethan Li**，联系邮箱 **lic28790@gmail.com**）
> **性质**：本文件是把工作区各分散文档（见下「来源」）**综合成的一份最终版完整项目说明**，覆盖「项目定位 · 技术架构 · 双轨站点 · 客户接入 SOP · 订阅付费 · 交付合规 · 质量监控 · 部署认证 · V2 路线」九大块。
> **来源文档**（详细实现仍以这些文件为权威，本文件为整合视图）：`docs/workflow.md`(v1.1.0 系统总文档) · `docs/pricing.md`(报价) · `docs/section-engine.md` · `docs/v2-roadmap.md` · `docs/monitoring.md` · `docs/cms.md` · `docs/deployment-adapter.md` · `docs/architecture-audit-2026-07-15.md` · `README.md`。
> **在线门户**：`https://lcclicheng.github.io/demo-sites/`

---

## 0. 一分钟速览

| 维度 | 结论 |
|---|---|
| 你是谁 | 一人公司 / 独立开发者 **Ethan Li**，面向**英国小商家**的高端建站服务 |
| 卖什么 | 高端静态站 + 部署 + 交付标准化包 + 年维护；**不卖客户自助后台**（2026-07-16 起取消 Decap 自助交付） |
| 技术栈 | Vite + React 18 + TypeScript + Tailwind CSS v3 + GitHub Pages（零服务器成本） |
| 核心引擎 | **Section Engine**（theme-agnostic 通用 section 库 + 组合器）+ 8 套行业模板（真实商家垂直站 / 历史样板） |
| 站点现状 | **45 个线上站点**（demo 站，主题自适应招牌 motif 全覆盖；早期 v1.1.0 为 20 站，见 §2.4） |
| 事实源 | `build-clean.sh` 的 `PROJS` 数组（唯一权威，校验闸门与监控都读它） |
| 怎么收费 | **A 档 £590 一次性（含首月内不限次数代改）/ B 档 £390/年（年度呵护）**；分行业三档微调（±£50/±£40） |
| 部署 | SSH（443 通道）→ push `main` → GitHub Actions 自动「校验→构建→组装→部署」 |
| 监控 | 自建 health-check（每天 1 次，失败开 Issue）+ UptimeRobot（5 分钟，你手动加），共 **22 监测点** |
| 已收录风险 | 真实商家站展示占位/臆测数据（H1 高危，已加免责横幅过渡）、署名缺失（H3 已修）等，详见 §10 |

---

## 1. 项目定位与商业模型

### 1.1 定位
你一个人运营的高端建站服务，面向**英国小商家**：餐饮 / 咖啡 / 沙龙 / 瑜伽 / 律所 / 甜品 / 家装维修 / 精品酒店等。你**替客户填内容**（客户不懂开发），用模板引擎一键生成站点并部署到 GitHub Pages，零服务器成本。

### 1.2 形态
- **一套 Section Engine 模板引擎**（`sectioned` 组合器 + theme-agnostic 通用 section 库）+ **8 套行业模板**（`restaurant/coffee/salon/dessert/yoga/law/hotel/trades`，保留作真实商家垂直站 + 历史样板）。
- 当前 **45 个线上站点**：客户先看演示判断风格，再决定要不要下单。
- 部署在 **GitHub Pages**，零服务器成本。

### 1.3 商业阶段判断
项目已不是「帮人做网站」，而是向 **AI 自动建站生产线（Website Factory）** 演进：一个人一年交付几百个网站（详见 §9 V2 路线）。现有系统已有「工厂骨架」（双轴解耦 `THEMES`/`TEMPLATES`、`PROJS` 单一事实源、`?v=` 防缓存、合规注入、串行构建编排、`currentColor+color-mix` 主题自适应组件库），V2 = 在骨架上加组合 + AI，不是推倒重来。

---

## 2. 技术架构

### 2.1 技术栈
**Vite + React 18 + TypeScript + Tailwind CSS v3**

### 2.2 核心管线 `generate.mjs`（一个站点一次构建）
```
examples/<site>.json  (业务数据，单一数据源)
        ↓ 读取 JSON
  注入 src/<template|sectioned>/business-data.ts  (数据作为变量注入)
        ↓ vite build
  output/<slug>/dist/  (该站构建产物)
        ↓ 部署时由 Actions 组装
  public/<slug>/dist/ → GitHub Pages /demo-sites/<slug>/
```

### 2.3 Section Engine（核心资产，v1.1.0 收口）

把「8 套固定行业模板」升级为「组件化 Section + AI 自由组合」。

**设计哲学（theme-agnostic）**：所有 section 组件**不绑定任何品牌色**，只靠三个 Tailwind 语义色：
| 语义色 | 用途 |
|---|---|
| `accent` | 强调色（CTA / 图标 / 发丝线 / 装饰 currentColor 层） |
| `surface` | 背景（页面 / 区块底） |
| `ink` | 前景文字 |

- 强调色由 `sectioned` 模板 `twConfig` 定义（默认暖金 `accent:'#b8895a'`），可经 `THEMES`（`generate.mjs`）逐站覆盖成青绿 / 李子 / 工业铜等，无需改组件。
- 装饰层用 `<div className="text-accent">` 包 `HeroBackdrop` 等，使 `currentColor` 跟随主题色（`currentColor + color-mix` 哲学，亮暗主题通用）。
- **绝不用 emoji、绝不硬编码品牌色** —— 反网红、editorial 排版、留白充足。

**数据契约 `SectionedData`**（定义在 `src/components/sections/types.ts`，也是未来 AI Intake 的输出 schema）：所有字段可选，数据缺失的 section 自动 `return null`（不渲染）。关键字段：
`name/tagline/hero*/heroCta*/heroStats`(Hero)、`infoBar`(InfoBar)、`menu`(Menu)、`story`(Story)、`gallery`(Gallery)、`reviews`(Reviews)、`faqs`(FAQ)、`team`(Team)、`booking`(Booking, mailto 表单)、`street/location/phone/email/hoursDetail`(Location)、`footer`+社交链接(Footer)、`instagram`(Instagram)、`sections?`(组合覆盖)。

**组合机制**：`src/sectioned/App.tsx` 读 `data.sections`（可选覆盖）或默认顺序（hero→infoBar→menu→story→gallery→reviews→faq→team→booking→location→instagram→footer），缺失字段自动跳过；导航栏按最终渲染的 sections 自动生成（跳过 hero/infoBar/footer）。

**限制（诚实说明）**：Section Engine 是**生成时组合**（顺序在 JSON 里定好，构建成静态页，非运行时拖拽）；纯静态——Booking/联系用 `mailto`，无后端；要 AI 客服 / 月报等 serverless 能力需 Vercel Adapter（见 §2.7）。

### 2.4 双轨现状（v1.1.0 收口）

| 层 | 站点数 | 架构 | 说明 |
|---|---|---|---|
| **A. Curated 样板预设** | 10 | 全部 `sectioned` | `atelier/breath/chambers/creme/forge/mario/mono/patisserie/sotto-sotto/vault`；「未来迁移」对 curated 层已完成 |
| **B. 真实英国商家 demo** | 9 | `morris-coffee` 已迁 `sectioned`（pilot）；其余 8 个仍用各自行业模板 | `holborn-nails(salon)/ganache(dessert)/indaba-yoga(yoga)/seddons-law(law)/gower-hotel(hotel)/vale-hardware(trades)/papa-bruno(restaurant)/chinatown-bakery(dessert)`；基于 OSM 真实商家数据 + Openverse CC 占位图 |
| **C. Section Engine 展示站** | 1 | `sectioned` | `sectioned-demo` 引擎能力展示 |

> **事实源**：`build-clean.sh` 的 `PROJS` 数组（`PROJS=( atelier-salon breath-yoga ... )`）是「要构建的站点」**唯一权威**，**现 45 站**（v1.1.0 时期为 20，见下表；完整列表以 `build-clean.sh` 为准）。新增站点须同步加进 `PROJS`，否则 `validate-sites.mjs` 孤儿闸门（软阻断 `exit 1`）会阻断部署。
> **双轨说明**：curated 预设层已 100% sectioned；8 套行业模板保留作真实商家垂直展示 + 历史样板，**未启用 Playwright 逐像素视觉回归前不要物理删除**（真实商家迁 sectioned 须先有回归保护；现已 45 站，远超 15 站阈值，可启用）。

### 2.5 资产约定
- 图片源放 `assets/<slug>/`，`generate.mjs` 整目录拷贝进 `dist/images/`；JSON 引用写相对路径 `./images/xxx.jpg`。
- **坑**：图片目录缺失时 `generate.mjs` 会**静默跳过拷贝**（构建成功但缺图）——已被 §8 校验闸门拦截。
- 图片已带 `?v=<md5前8位>` 内容哈希，覆盖同名文件后浏览器缓存自动失效。

### 2.6 部署架构（GitHub Pages + Actions）
- 仓库：`lcclicheng/demo-sites`（本地工程目录 `gh-pages-build`）。
- 推送 `main` → Actions 自动「校验 → 全量构建 → 组装 → 部署」；用 `GITHUB_TOKEN`，不依赖任何个人 PAT。
- `deploy.yml` 已加 `concurrency` 组避免并行部署互相覆盖；`setup-node cache:'npm'` + 工程根一次性 `npm ci` + 各站符号链接复用 `node_modules`（10 站只装 1 次）。

### 2.7 Deployment Adapter（客户站落 Vercel）
- **demo 留 GitHub Pages（零成本）；客户站走 Vercel**（解锁 serverless：AI 客服 / 表单 / 月报 / 预约），是 MRR 运营层基石。
- `generate.mjs` 已有分发器：`DEPLOY_TARGET=vercel VERCEL_TOKEN=xxxx node generate.mjs ./examples/<slug>.json --deploy`；配套 `deploy/vercel/`（vercel.json + serverless `api/contact.js`）。
- 用户决策（2026-07-16）：**仅做客户站适配器**，demo 不镜像到 Vercel（避免公开项目 + 每次重 build 20 站）。

### 2.8 GitHub Pages 限制（务必知悉）
- 仓库大小建议 < 1 GB；月带宽免费约 100 GB/月；Actions 单次 job 上限 6 小时（构建远小于此）。
- 建议：图片用 WebP / 压到 <300KB；站点/图片暴涨时按业务拆多仓库或换 Vercel。监控建议：在 `deploy.yml` 加 `du -sh .` 超 800MB 直接 `exit 1`，并记录构建时长异常增长预警。

---

## 3. 目录结构与路径约定

> 工程根目录统称 `gh-pages-build/`（含 `generate.mjs` 那层），**勿硬编码带日期的绝对路径**。

| 路径（相对工程根） | 作用 | 部署相关 |
|---|---|---|
| `generate.mjs` | 单站构建引擎（读 JSON → 注入 → vite build） | ✅ 核心 |
| `build-clean.sh` | 全量干净重建 45 站（时间戳校验防 EBUSY 假成功 + 失败闸门 exit 1）；`PROJS` 单一事实源在此 | ✅ 核心 |
| `.github/workflows/deploy.yml` | CI 部署流水线（校验→构建→组装→Pages） | ✅ 核心 |
| `.github/workflows/health-check.yml` | 每天定时全站健康检查，失败开 Issue | ✅ 核心 |
| `validate-sites.mjs` | 部署前自检闸门（缺图/缺字段/孤儿站） | ✅ 核心 |
| `smoke-test.mjs` | 构建后冒烟（挂载点/JS/title 非空壳），阻断坏部署 | ✅ 核心 |
| `onboard.mjs` + `onboarding.html` | 客户接入本地服务（端口 4321）+ 通用 JSON 表单渲染器 | 🟡 工具 |
| `examples/*.json` | 45 个站点的业务数据（接入新客户改这里） | ✅ 数据源 |
| `src/<template>/` | 8 套行业模板 React 组件 + App（真实商家垂直站 + 历史样板） | ✅ 核心 |
| `src/sectioned/App.tsx` + `src/components/sections/*` | Section Engine 组合器 + 通用 section 库（theme-agnostic，12 section） | ✅ 核心 |
| `src/components/visual.tsx` | 共享视觉手法库（HeroBackdrop/StatsStrip/GradientText/GlassCard/ConfettiBg/Eyebrow/SquareMonogram + grid 变体），`currentColor+color-mix` | ✅ 核心 |
| `assets/<slug>/` | 各站图片源 | ✅ 数据源 |
| `output/` · `public/` | 本地构建产物 / CI 组装中间目录（均 gitignore） | ❌ 忽略 |
| `index.html` | 门户页（手写 HTML，链接 45 站；⚠️ 已知会漂移，待改为从 PROJS 自动生成） | ✅ |
| `admin/index.html` + `admin/config.yml` | Decap CMS 后台（现降级为内部演示能力） | 🟡 工具 |
| `gen-decap-config.mjs` | 从 `examples/*.json` 自动生成 `admin/config.yml` 全站字段映射 | 🟡 工具 |
| `inject-privacy.mjs` | 隐私/注册地址/发票/合同页注入器 | ✅ 辅助 |
| `gen-seo.mjs` | sitemap.xml / robots.txt 自动生成 | ✅ 辅助 |
| `health-check.mjs` / `setup-uptimerobot.mjs` | 自建健康检查 / UptimeRobot 批量监测点 | ✅ 监控 |
| `docs/*.md` | 各专项文档（本文件为整合版） | — |

---

## 4. 三套核心工作流

### 4.1 本地开发（改模板 / 看效果）
```bash
# 改单个站（如调试 sotto-sotto）
node generate.mjs "./examples/sotto-sotto.json"
# 全量干净重建（真实 safe-delete 守卫保护：重置用 mv 移旧产物，非 rm）
bash build-clean.sh
# 本地预览（构建后）
python -m http.server 8088 --directory output/sotto-sotto/dist
```
> ⚠️ 本地预览服务器会锁 `dist/`，重建前务必先关掉，否则触发 EBUSY 假成功。

### 4.2 客户接入流程 → 见 §5 标准 SOP

### 4.3 部署流程（push → Actions 自动上线）
```bash
git add -u && git commit -m "..." && git push origin main   # 走 SSH，无需 PAT
```
> 本机已配 SSH（443 通道），`git@github.com:lcclicheng/demo-sites.git`；改 workflow 文件也无需 PAT（SSH 不受 scope 限制）。

---

## 5. 客户接入标准作业（SOP）

**原则**：客户不懂开发，全程**你替客户填**。客户只提供文字内容和照片，你用工具生成、审核、部署。

**步骤**：
1. **启动接入工具**：`node onboard.mjs` → 浏览器开 `http://localhost:4321/`。
2. **选模板克隆**：下拉选同行业演示站（如新餐厅选 `sotto-sotto`），自动载入字段。
3. **业务类型选择**：Ltd（保留 `registeredAddress`，填合规「适当地址」）/ Sole Trader（自动清空禁用该字段）一键切换。
4. **填表**：表单递归渲染模板全部字段（名称/电话/菜单/评价/营业时间…），数组字段可增删，不用碰 JSON。
5. **上传实景图**：选客户照片自动写入 `assets/<slug>/`，可勾选「按上传顺序重命名为 screenshot-1/2/3.jpg」。
6. **生成并自动构建**：点「生成」→ 自动写 `examples/<slug>.json` + 建目录 + 跑单站 `generate.mjs`（约 30–60 秒，失败重试一次）。结果页给构建状态 / 预览链接 / 缺图提醒。
7. **构建 + 部署**：`bash build-clean.sh` → `git add -u && git commit && git push origin main`。经 `onboard.mjs` 生成的新站 slug 已自动写入 `PROJS`。
8. **交付客户**：发线上地址 + 说明（域名/DNS 自定义见配套文档）。

**交付后维护（§5.9）**：由**你（owner）手动改 JSON + rebuild + 部署**，客户不直接碰代码。紧急/临时改动走**单站快速 build**（`node generate.mjs ./examples/<slug>.json`，约 30–60 秒）本地验证，但**要线上看到仍需 push 触发 Actions 全量重建**。

**满意度调研（§5.10）**：上线后第 7 天发满意度调研（内容准确性 / 加载速度 / 手机体验 / 新功能 / NPS），记录到 `clients/<slug>/feedback.md`（已 gitignore，敏感不进仓库），反哺模板优化。

**注册地址语义**：Ltd 法定须有注册办公室（可选住宅/会计师免费地址/虚拟办公室，不必买）；Sole Trader 完全不需要。你自己的业务走 Sole Trader。

---

## 6. 订阅与付费模型（Pricing）

> 详细版见 `docs/pricing.md`。本模型为 **2026-07-14 拍板的初始基准（进攻型，目的多接单）**，**首个客户交付完成后**基于实际工时 + 反馈复盘重定。

### 6.1 货币与税务
- 报价货币：**英镑（£ GBP）**，面向英国小商家。
- 价格**不含 VAT**（英国 VAT 注册阈值 £85,000/年；未达阈值不强制收 VAT，但报价标注 ex VAT 是专业惯例）。
- 建站费一次性；年度支持按年续费。

### 6.2 两档套餐

#### A — 建站 + 首月无忧改版（一次性）**£590**
适合想立刻拥有专业、可上线、零托管成本站点，且希望上线初期随意调整的小商家。把「每个内容都要自己改」变成「首月内你帮我改到满意」——客户零后台学习成本，你也无需维护自助后台。

**包含**：
- 1 个高端静态站点（基于 Section Engine 或 8 套行业模板之一，Vite + React 18 + TS + Tailwind）
- 部署到 GitHub Pages（零服务器成本）+ SEO 基础（og: / sitemap / robots）+ 隐私政策页自动注入
- **交付标准化包**（`docs/delivery-handover.md`）：欢迎邮件、合规交付清单签字版、站点维护手册（一页纸）、支持条款、发票
- **上手卡（一页纸）**：如何查看站点、如何提修改需求、如何续费域名（非 CMS 后台操作指南）
- **上线后 7 天**邮件/微信培训支持
- **首月内不限次数修改**：交付后 30 天内任何文案/图片/菜单/营业时间调整，邮件告诉我即可，不限轮次、免费改到满意

> **差价值（2026-07-16 重构）**：取消 Decap CMS 自助后台，改为「首月你代改 + 之后走年度呵护」——客户零后台学习成本，你也省去为每个客户配 OAuth / 培训 / 维护后台的隐性负担；首月后改动自然导向 B 档续费，黏性更强。

#### B — 年度呵护（年费）**£390 / 年**
在 A 基础上按年续费：
- 站点健康监控（UptimeRobot + GitHub Issues 看板，异常主动告警）
- **优先响应**：支持请求 48 小时内响应（SLA 见支持条款）
- **免费小改动额度**：合理频次的小改动（改一段文案 / 加一项菜单 / 换一张图）
- 年度域名 / DNS 续费协助（若用自定义域名）
- 模板小幅升级享折扣

> **客户首年总支出 = £590 + £390 = £980**。对比市场 freelancer（一次性 £1,000–£3,000 + 维护 £300–£1,200/年），总价更低、你利润更好——静态站维护极轻，B 档近乎纯毛利。
> **首月后改动归口**：A 档「首月无忧改版」结束后，任何内容修改走 B 档（或单次付费改版），**不再提供客户自助后台**——所有改动由你经 GitHub Pages 重建上线，可控、可回滚。

### 6.3 分行业定价调整（按层次微调）
保留两档为**基准锚点**，按行业「支付力 / 形象溢价」分 3 档，**仅做轻微调整**（幅度 ±£50 一次性 / ±£40 年费），不破坏进攻型定价：

| 档位 | 行业（`template`） | A 一次性 | B 年费 | 首年合计 |
|---|---|---|---|---|
| **高 Premium** | 律所 `law`、酒店 `hotel` | **£640** | **£430** | £1,070 |
| **标准 Standard** | 餐饮 `restaurant`、沙龙 `salon`、甜品 `dessert`、咖啡 `coffee`、瑜伽 `yoga` | £590 | £390 | £980 |
| **经济 Value** | 家装 / 维修 `trades` | **£540** | **£350** | £890 |

**分档逻辑**：Premium（律所预算高、精品酒店有市场预算）→ 上浮；Standard（生活方式类，形象敏感但预算居中）→ 基准；Value（家装多为 sole trader，极价格敏感）→ 下浮换量。报价以对应行业档位价为准，结构/包含项/交付包完全一致，仅金额微调；个案可协商并在交付包注明。

### 6.4 增项与可选（按需报价，具体 £ 首客后复盘定）
| 增项 | 说明 |
|---|---|
| 自定义域名 + DNS / SSL 交接 | 见 `docs/custom-domain.md`；含在 Annual Care 或单收 |
| 新增行业模板 | 按「新增行业模板 SOP」 |
| 多语言站点 | 英文版 onboarding + 双语内容 |
| 深度 SEO / 投放落地页 | 超出基础 SEO |

### 6.5 定价复盘约定
本两档 £ 为 2026-07-14 拍板初始基准，用于立刻接单报价。**首个客户交付完成后**，基于实际工时、客户反馈（§5.10）、市场对标复盘重定，结论更新 `docs/pricing.md` 并同步 `docs/workflow.md`。

---

## 7. 交付、合规与 CMS 现状

### 7.1 交付标准化包
`docs/delivery-handover.md` 定义了每次交付的标准化包：欢迎邮件 / 合规交付清单签字版 / 站点维护手册（一页纸）/ 支持条款 / 发票。模板顶部用 HTML 注释块（AI 内部填充说明，不渲染、不发给客户），**交付正文一律纯英文**（UK 客户），中文仅允许出现在文件顶部注释块。

### 7.2 业务合规与法律风险
- **ECCTA 2024**：禁止纯 PO Box 作注册办公室，须是「适当地址」(appropriate address)。Ltd 强制有注册办公室（可选住宅/会计师免费地址/虚拟办公室，不必买）；Sole Trader 无此概念。
- **不要替客户担保注册地址合法性**：你仅做模板注入（把客户提供的地址填进字段），适当地址由客户提供并负责。
- **GDPR / 隐私政策 / Cookie**：`inject-privacy.mjs` 已自动注入隐私政策页（占位模板，客户须补真实条款）；模板站目前无 Cookie 同意弹窗，若用分析工具需补。

### 7.3 Decap CMS 现状（已降级）
- `/admin` 仍随构建部署到 `/demo-sites/admin/`，`client_id` 已填并注册 OAuth App，任何人可打开、你本人有写权限可登录编辑——作**能力展示 / 获客卖点**。
- **标准交付包不再含客户 CMS 自助后台**：2026-07-16 A 档改为「首月内不限次数代改」，B 档接管首月后改动。`docs/cms.md` 已降级为**内部演示能力参考 / 可选增项**。真实客户仅在其单独付费要求自助后台时，才按「生产模型」（独立仓库 + 协作者隔离 + 各自注册 OAuth App）启用。
- `admin/config.yml` 由 `gen-decap-config.mjs` 从 `PROJS` 自动生成，全 45 站 100% 字段覆盖（防保存丢字段），`template`/`slug` 已设 `hidden+required` 防误删。

---

## 8. 质量闸门与监控

### 8.1 质量闸门（部署前 fail-fast）
- **`validate-sites.mjs`**（构建前）：逐站校验 ① JSON 合法 ② 必填字段 `name/slug/template` 齐全 ③ JSON 引用的 `./images/*` 在 `assets/<slug>/` 真实存在；任一不满足 → `exit 1` → 不构建不部署。同时**孤儿站软阻断**：发现「有 template+slug 却未进 PROJS」的 JSON 默认 `exit 1`，避免漏部署（临时放行：`--allow-orphans`）。**重复构建目标检测**：遍历 PROJS 各 JSON 归一化 `projectName(slug||name)`，两站归一化到同一 `output/<slug>/` 即 `exit 1`，防双事实源冲突线上互相覆盖丢站。
- **`smoke-test.mjs`**（Assemble 之后）：校验每站产物含挂载点 / JS / title，非空壳，阻断坏部署。

### 8.2 监控（两层互补）
| 层 | 工具 | 频率 | 告警 | 成本 |
|---|---|---|---|---|
| **自建（已落地）** | `health-check.mjs` + `health-check.yml` | 每天 1 次（cron UTC 07:17） | 失败自动开/更 GitHub Issue（标签 `health-alert`），恢复自动关 | 免费（Actions 额度内） |
| **外部（你手动加）** | UptimeRobot 免费版 | 每 5 分钟 | 邮件 / App / Webhook | 免费（50 监测点） |

- 自建层做**内容级校验**（不只 200，还查挂载点/title 真渲染）+ 用 Issue 留痕成「看板」（筛 `label:health-alert`，空=全绿）。
- 监测点清单（取自 `PROJS`）：门户 + CMS admin + **45 站** = **47 个监测点**（见 `docs/monitoring.md` 可直接复制的清单）；或跑 `UPTIMEROBOT_API_KEY=urXX node setup-uptimerobot.mjs` 批量创建（幂等）。
- **与定价挂钩**：B 档（£390/年）已含监控；交付 B 客户时把其站点加进 UptimeRobot，可选纳入公开 Status Page 写进交付包。

---

## 9. V2 路线图 · 从「建站项目」到「AI Website Factory」

> 规划文件见 `docs/v2-roadmap.md`（v2.0-draft）。核心判断：项目向 AI 自动建站生产线演进，V2 = 在现有骨架上加「组合（Section Engine）+ AI（Intake / Agent Pipeline / Knowledge Base）」。

**已落地进度（截至 v1.1.0）**：
- [x] 步骤 1 CRM `clients/` 目录 + 脚手架（`clients/README.md` + `scaffold-client.mjs`）
- [x] 步骤 2 Knowledge Base：8 行业全覆盖 `knowledge/{restaurant,coffee,salon,dessert,yoga,law,hotel,trades}/`（各含 hero/seo/faq/cta，共 32 文件）
- [x] 步骤 4a JSON-LD 自动注入（`generate.mjs` 按 `template` 映射 Schema.org 类型，仅取真实字段、不编造 hours）
- [x] 步骤 4b Blog 管道脚手架（`docs/blog-pipeline.md` + `blog/`；LLM 生成与渲染器留待上线后）
- [x] 步骤 5 Deployment Adapter：客户站 Vercel 适配器上线（`DEPLOY_TARGET` 分发 + `deployVercel` + `deploy/vercel/`）
- [x] 步骤 6 Section Engine：组合器 `sectioned` + 12 section 库 + 10 curated 预设全迁、双轨在 curated 层终结 + `sectioned-demo` 进 CI

**关键决策**：
- **AI Intake（步骤 3）降级为上线后增值服务**：LLM 选 OpenAI / DeepSeek 家族（择一，暂未定），key 留空/env 占位、不硬编码、不现在烧额度；脚本按 provider-agnostic 设计（`LLM_API_KEY`+`LLM_BASE_URL`+`LLM_MODEL`）。
- **别现在过度工程**：Multi-Agent 编排框架、4 平台 Deployment Adapter、自主爬 Google 的 Ops Agent 都 premature，先拿最小商业化闭环验证。
- **静态站边界是真墙**：GitHub Pages 跑不了 AI 客服/发邮件/抓实时评论，要么第三方 embed，要么接 Vercel serverless（步骤 5），要么定时 GitHub Action（放 API key 到 secrets）。

---

## 10. 已知风险与待办台账

### 10.1 架构审查漏洞（`docs/architecture-audit-2026-07-15.md`，已部分闭环）
| 项 | 等级 | 状态 |
|---|---|---|
| **H1** 真实商家站展示占位电话 / 伪造好评 / 臆测营业时间（法律风险） | 🔴 高危 | ⚠️ **过渡闭环**：`generate.mjs` 已注入顶部「数据未核实，商家可 claim/下架」免责横幅（claim 邮箱 `lic28790@gmail.com`）；但占位电话/编造好评/臆测营业时间**本身待联系商家核实后替换** |
| **H2** Decap CMS 配置过期（只覆盖 10 模板，9 真实站不在内） | 🔴 高危 | ✅ **已按设计消除**：A 档取消 CMS 自助交付，标准交付不再承诺客户自助后台；`/admin` 仅留演示能力 |
| **H3** 9 真实站未给 OSM / Openverse 署名（ODbL §4.3 / CC BY 违约） | 🟠 中 | ✅ 已修：`generate.mjs` 在 `</body>` 前注入底部署名条，仅 `_source==='osm'` 真实站生效 |
| **H4** ganache/dessert、papa-bruno/restaurant 缺隐私页 | 🟠 中 | ❌ 误报已撤销：复核 8/8 模板均含完整隐私页 |
| **H5** 9 真实商家未获授权即公开（冒充/诽谤风险） | 🟡 低-中 | ⏸ 第2步范畴：加速外联 + 获授权前 `noindex` |
| **L1** CI 每次 push 全量重建 19/20 站费时 | 🟡 低 | 🔲 增量构建待做（v0.6 缓存已缓解安装） |
| **L2** Bath 咖啡 JSON 仍在 C 盘未导入 | 🟡 低 | 设计如此（第二步范围） |
| **L3** UK Biz Finder Overpass/Photon SSL 抖动 | 🟡 低 | 重试 / 硬编码坐标绕开 |
| **L4** `generate.mjs` favicon emoji 死配置 | 🟡 低 | 无害 |

### 10.2 已知坑（FAQ 精选）
| 现象 | 原因 | 解法 |
|---|---|---|
| 构建报成功但页面是旧的/缺内容 | 预览服务器锁 `dist/` 致 `rmdir` 失败（EBUSY 假成功） | 重建前关预览；`build-clean.sh` 时间戳校验 |
| 部署成功但缺图 | 图片目录缺失时 `generate.mjs` 静默跳过 | §8 校验闸门拦截 |
| 改了图页面没变 | 浏览器/CDN 缓存同名旧图 | 图片 URL 加 `?v=<md5前8位>`（已落地） |
| `push` 认证失败 | PAT 缺 workflow scope / 22 端口被墙 | 改 SSH（`ssh.github.com:443`） |
| 新增站点没被部署 | 忘了把 JSON 加进 `PROJS` | §8 孤儿告警提示；记得同步 |
| `generate.mjs` 路径错仍 `exit 0` | 路径参数不带 `examples/` 前缀 | 必须 `node generate.mjs ./examples/<slug>.json`，build 后 grep `dist/*.css` 确认新类真落地 |

### 10.3 待办（非阻塞，按优先级）
- 门户 `index.html` 改为从 `PROJS` 自动生成（现手写，已知会漂移）。
- 增量构建（只重建变更站）提速。
- Playwright 逐像素视觉回归（站点 >15 或来真实客户再上；现已 45 站，远超阈值，可启用）。
- 步骤 2 外联真实商家取真图/真数据替换（首批 4 家高风险商家发送包已就绪 `docs/outreach-batch-1.md`）。
- 首个真实客户签约后实测 `DEPLOY_TARGET=vercel`（需填 `VERCEL_TOKEN`）。

---

## 11. 快速命令速查

```bash
# 本地接入新客户（填表生成 JSON + 自动构建 + 预览）
node onboard.mjs                      # http://localhost:4321/

# 单站构建
node generate.mjs "./examples/<site>.json"

# 全量干净重建 45 站（PROJS 单一事实源）
bash build-clean.sh

# 本地预览
python -m http.server 8088 --directory output/<slug>/dist

# 部署（SSH 推送触发 Actions 自动上线）
git add -u && git commit -m "..." && git push origin main

# 部署前自检（孤儿站默认 exit 1）
node validate-sites.mjs

# 站点健康检查（本地）
node health-check.mjs                 # 可选 --json；BASE_URL=... 指向其它环境

# 刷新 Decap 后台全站字段映射（如改了 JSON 结构）
node gen-decap-config.mjs

# 客户站部署到 Vercel（VERCEL_TOKEN 必填）
DEPLOY_TARGET=vercel VERCEL_TOKEN=xxxx node generate.mjs ./examples/<slug>.json --deploy

# UptimeRobot 批量监测点（UPTIMEROBOT_API_KEY 必填）
UPTIMEROBOT_API_KEY=urXX node setup-uptimerobot.mjs
```

---

## 附录 · 版本脉络

- **v0.4–v0.8**：自动化部署、接入工具、合规清单、SEO、Decap CMS、图片哈希等逐项落地。
- **v0.9.x**：新增行业模板 SOP、监控仪表盘、smoke-test、共享视觉手法系统（v0.9.4–v0.9.9 采集闭环：Hero/粒子/流光/玻璃卡/方字母 monogram 等 8 组件全量落地，从 20 旧站抽取）。
- **v0.9.2**：定价改为**进攻型两档**（A £590 含 CMS 自助 / B £390 年）；v0.9.2.1 增补分行业三档微调；**v0.9.2.2（2026-07-16）A 档重构**：取消 CMS 自助，改首月内不限次数代改。
- **v1.0–v1.0.1**：9 个真实英国商家 demo 全上线（19 站）；配套 UK Biz Finder 工具 + 资产流水线 skill。
- **v1.1.0（2026-07-16）**：**步骤 6 Section Engine 收口**——10 curated 预设全迁 `sectioned`、双轨在 curated 层终结；8 套行业模板保留作真实商家垂直站 + 历史样板；站点 19→20（morris-coffee 迁 sectioned + sectioned-demo）；monitoring 监测点扩至 22；文档版本同步。
- **安全加固（2026-07-19）**：站点扩至 **45 个**；接手 agent 风险评审后把「约定防线」升级为「技术防线」——`generate.mjs` 真实 safe-delete 守卫、`build-clean.sh` 失败闸门、`validate-sites.mjs` 重复 slug 检测、outreach 泄漏双防线（pre-commit + CI）、`deploy.yml` 回滚产物保留（retention-days:30）。详见 `CHANGELOG.md`。

> 本整合版与 `docs/workflow.md`（系统总文档）同步至 v1.1.0；任何实现细节以 workflow.md 及各专项文档为准。
