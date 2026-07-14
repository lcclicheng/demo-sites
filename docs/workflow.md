# 建站系统流程文档（v0.9.5）

> 版本：v0.9.5 ｜ 更新：2026-07-14（v0.9.5：共享视觉手法延展到区块层 —— GlassCard 注入 trades 评价卡/ConfettiBg 注入 dessert 下单区，Eyebrow 因各模板已手写 kicker 暂不强制；v0.9.4：共享视觉手法系统落地，见 `src/components/visual.tsx` 与 `generate.mjs`；v0.9.3：监控仪表盘 + 轻量冒烟测试落地，见 `docs/monitoring.md`；v0.9.2：定价两档落地（进攻型）见 `docs/pricing.md`；v0.9.1：定价三套餐、v0.8：客户自助 CMS 全 10 站自动映射 + 图片 `?v=` 防缓存；v0.7 CMS 脚手架、v0.6 部署缓存已落地） ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 初版 v0.1 同日发布；本次依据审查意见修订：补充**交付后维护流程**、路径去硬编码、GitHub Pages 限制、孤儿站点自动发现、合规/法律风险、SEO/部署健壮性、文档维护规则、统一格式与难度标签。
> **定位**：本文档是系统的「单一事实来源」。任何重大改动（新增站点、改模板、动部署流程）须同步更新此处（见 §11 文档维护规则）。

### 版本历史摘要（顶部速览）

| 版本 | 日期 | 关键变更 |
|---|---|---|
| v0.1 | 2026-07-14 | 初版：系统概述、技术架构、三套工作流、客户接入 SOP |
| v0.2 | 2026-07-14 | 审查修订：交付后维护流程、路径去硬编码、GitHub Pages 限制、孤儿站点自动发现、合规/法律风险、SEO/部署健壮性、文档维护规则、难度标签 |
| v0.3 | 2026-07-14 | onboarding 工具增强：图片上传接口（base64）、生成后自动单站构建、`/preview/<slug>/` 本地预览、缺失图片提醒 |
| v0.4 | 2026-07-14 | SEO（og:image/sitemap/robots）、部署后 Slack/Telegram 通知、合规交付清单、自定义域名 SOP、onboarding 自动写 PROJS、README 回链单一事实源 |
| **v0.5** | 2026-07-14 | slug 统一重命名（cr-me→creme、the-vault→vault）；onboard.mjs 自动写 PROJS 加固（备份 + bash -n 校验 + 失败还原）；validate 孤儿站点改软阻断；custom-domain 形态 B 补全；GitHub Pages 监控建议；GITHUB_TOKEN 权限最小化；文档审查整改闭环 |
| **v0.6** | 2026-07-14 | **部署依赖缓存**：deploy.yml `setup-node cache:'npm'`（缓存键取根 package-lock.json）；generate.mjs 改为「工程根一次性 `npm ci` + 各站点符号链接复用 node_modules」，10 站只装 1 次并命中缓存，构建提速 |
| **v0.7** | 2026-07-14 | **客户自助 CMS 脚手架**：Decap CMS + GitHub OAuth；`admin/index.html` + `admin/config.yml`（完整映射 `sotto-sotto` 全部字段，含结构性 template/slug，防保存丢字段）；`deploy.yml` 把 `admin/` 发布到 `/demo-sites/admin/`；`docs/cms.md` 写清 OAuth 注册、逐站启用、生产模型（客户独立仓库+自定义域名）、图片处理、安全防坑 |
| **v0.8** | 2026-07-14 | **客户自助 CMS 全量落地 + 图片防缓存**：`gen-decap-config.mjs` 从 `examples/*.json` 自动生成 `admin/config.yml` 全 10 站字段映射（100% 覆盖、防保存丢字段崩站）；`generate.mjs` 注入时给所有图片路径加 `?v=<构建版本>`（每次部署不同、对 CMS 保存自愈）；演示站 `/admin` 保留公开作能力展示 |
| **v0.9** | 2026-07-14 | **流程标准化规范 v1**：交付标准化包（`docs/delivery-handover.md`）、模板库索引（`templates/README.md`）+ 新增行业模板 SOP、交付后第 7 天反馈循环（`clients/` + §5.10）、AI 协作规范（§13）、中低优先待办（监控 / 定价 / 自动化测试 / 多语言） |
| **v0.9.2** | 2026-07-14 | **定价两档落地（进攻型）**：建站含 CMS 自助 £590 一次性 / 年度呵护 £390/年，作为初始报价基准（首客交付后复盘重定），见 `docs/pricing.md` |
| **v0.9.3** | 2026-07-14 | **监控 + 轻量冒烟落地**：`health-check.mjs` + `.github/workflows/health-check.yml` 每天定时查全站 200/挂载点/title，失败自动开/更 Issue、恢复自动关；`smoke-test.mjs` 校验每站产物非空壳，接进 `deploy.yml` Assemble 之后阻断坏部署；UptimeRobot 外部探测 SOP 见 `docs/monitoring.md` |
| **v0.9.4** | 2026-07-14 | **共享视觉手法系统**：从 20 个旧站（`premium-*`/`bento-dashboard`/`vanguard-landing`/`coffee-template` 等）抽取 Hero+视觉库沉淀为 `src/components/visual.tsx`（HeroBackdrop/StatsStrip/GradientText/GlassCard/ConfettiBg/Eyebrow），`generate.mjs` 注入 `VISUAL_CSS`（particles/breathe-ring/gradient-text 等 keyframes）+ `copyDir` 拷贝组件到 `output/src/components`；7 套模板（咖啡/沙龙/甜品/瑜伽/律所/民宿/家装）hero 注入发光背景+呼吸环+粒子、流光标题，咖啡/瑜伽加指标条；restaurant 保留原生等效手法；全 `currentColor`+`color-mix` 主题自适应，亮暗模板通用 |
| **v0.9.5** | 2026-07-14 | **共享视觉手法延展到区块层**：GlassCard 注入 trades 评价卡（信任区块）作磨砂玻璃面板、ConfettiBg 注入 dessert 下单区作点阵纹理；Eyebrow 因各模板已手写 kicker+分隔线暂不强制使用；全组件 currentColor+color-mix 主题自适应，亮暗通用 |

> 完整版本记录见文末「版本记录」行。

---

## 0. 文档导航

| 你想做的事 | 跳到 |
|---|---|
| 整体了解这个系统是啥 | §1 项目概述 |
| 看代码怎么组织 / 路径约定 | §2 技术架构 / §3 目录结构与路径约定 |
| 接一个新客户（标准化流程） | §5 客户接入 SOP |
| **客户上线后想改内容怎么办** | **§5.9 交付后维护流程** |
| **客户想自己改内容（自助 CMS）** | **docs/cms.md** |
| **交付给客户的标准化包（欢迎邮件/合规/维护/支持条款）** | **docs/delivery-handover.md** |
| **报价与套餐（£ 定价基准）** | **docs/pricing.md** |
| 本地改模板 / 看效果 | §4.1 本地开发流程 |
| 推送上线 | §4.3 部署流程 / §6 部署与认证 |
| **排查部署失败** | **§4.3 + §9 已知坑 FAQ** |
| **与 AI 助手怎么协作（生成交付包/Review/分析日志）** | **§13 与 AI 助手协作规范** |
| **客户站点健康看板（监控 / 告警 / 自动 Issue）** | **docs/monitoring.md** |
| 知道还差什么、下一步做什么 | §11 待迭代优化清单 |

---

## 1. 项目概述

**定位**：你一个人运营的高端建站服务，面向**英国小商家**（餐厅、咖啡馆、沙龙、瑜伽馆、律所、甜品店、维修、精品酒店等）。

**形态**：
- 一套**模板引擎** + **10 个行业样板演示站**，客户先看演示判断风格
- 你**替客户填内容**（客户不懂开发），一键生成站点并部署
- 部署在 **GitHub Pages**，零服务器成本

**在线门户**：`https://lcclicheng.github.io/demo-sites/`

**当前 10 个样板站**（源文件 → 行业 → 线上 slug → 地址）：

| 源文件 | 行业模板 | 线上 slug | 在线地址 |
|---|---|---|---|
| examples/atelier-salon.json | salon | atelier | /demo-sites/atelier/ |
| examples/breath-yoga.json | yoga | breath | /demo-sites/breath/ |
| examples/chambers-law.json | law | chambers | /demo-sites/chambers/ |
| examples/creme-dessert.json | dessert | creme | /demo-sites/creme/ |
| examples/forge-trades.json | trades | forge | /demo-sites/forge/ |
| examples/mario-pizza.json | restaurant | mario | /demo-sites/mario/ |
| examples/mono-coffee.json | coffee | mono | /demo-sites/mono/ |
| examples/patisserie-v2.json | dessert | patisserie | /demo-sites/patisserie/ |
| examples/sotto-sotto.json | restaurant | sotto-sotto | /demo-sites/sotto-sotto/ |
| examples/vault-hotel.json | hotel | vault | /demo-sites/vault/ |

> ℹ️ **slug 命名已统一（v0.5）**：原 `cr-me`（CRÈME 缩写）、`the-vault` 已于 2026-07-14 重命名为 `creme`、`vault`，与全词小写连字符风格一致。旧 URL `/demo-sites/cr-me/`、`/demo-sites/the-vault/` 已失效（演示门户无稳定外链，无需 301；真实客户场景需配重定向）。详见附录 A。

---

## 2. 技术架构

**技术栈**：Vite + React 18 + TypeScript + Tailwind CSS v3

**核心管线 `generate.mjs`**（一个站点一次构建）：
```
examples/<site>.json  (业务数据)
        ↓ 读取 JSON
  注入 src/<template>/business-data.ts  (数据作为变量注入)
        ↓ vite build
  output/<slug>/dist/  (该站构建产物)
        ↓ 部署时由 Actions 组装
  public/<slug>/dist/ → GitHub Pages /demo-sites/<slug>/
```

**8 种行业模板**（`data.template` 字段决定用哪套 UI）：
`restaurant` / `coffee` / `salon` / `dessert` / `yoga` / `law` / `hotel` / `trades`

**资产约定**：
- 图片源放在 `assets/<slug>/`（如 `assets/sotto-sotto/screenshot-1.jpg`）
- `generate.mjs` 把整个 `assets/<slug>/` 目录拷贝进 `dist/images/`
- JSON 里图片引用写相对路径 `./images/xxx.jpg`
- **坑**：图片目录缺失时 `generate.mjs` 会**静默跳过拷贝**（构建成功但页面缺图）——已被 §8 的校验闸门拦截

**部署架构**：单仓库 + GitHub Actions + GitHub Pages
- 仓库：`lcclicheng/demo-sites`（本地工程目录 `gh-pages-build`）
- 推送 `main` 分支 → Actions 自动「校验 → 全量构建 → 组装 → 部署」
- 部署用 `GITHUB_TOKEN`，不依赖任何个人 PAT

### GitHub Pages 限制注意事项（务必知悉）
GitHub Pages 是静态托管，有软限制，10 个站全静态打包后若图片未优化可能接近边界：
- **仓库大小**：建议 < 1 GB；单个 Pages 站点（含全部历史）软上限，图片多会吃空间
- **月带宽**：免费版约 100 GB/月（一般够用，但若某站图片巨大且流量高需注意）
- **构建时长**：Actions 单次 job 上限 6 小时（我们的构建远小于此）；Pages 自身不构建（只托管 Actions 产物）
- **建议**：
  - 图片用 WebP / 压缩后再放 `assets/<slug>/`（一张餐厅照压到 <300KB 为宜）
  - Vite 生产构建默认已压缩 JS；大站点可加 `build.rollupOptions` 代码分割
  - 若未来站点/图片暴涨，按业务拆多个仓库或换 Vercel/Netlify
  - **监控建议**（站点增多时务必加，避免悄悄触限）：
    - **仓库大小**：在 `deploy.yml` 加一步 `du -sh .` 与 `git count-objects -vH`，超过阈值（如 800MB）时**直接 `exit 1` 让该次部署变红失败**（比仅打印更显眼），并可在同一步 `curl` 发 Slack/Telegram 主动告警；也可接第三方仓库大小监控。
    - **Pages 带宽 / 构建时长**：GitHub 不提供原生带宽告警；可在 `deploy.yml` 记录每次构建耗时（`date +%s` 差值）并打印，时长异常增长即预示站点 / 图片膨胀。需要主动告警可接 Slack / Telegram（见 §11 部署通知）。
    - **构建变慢应对**：单仓库全量 `build-clean.sh` 随站点数线性变慢；中期可改「增量构建」（只重建变更站）或按业务拆多仓库（每个客户 / 行业一个仓库 + 各自 Actions），或迁移到 Vercel / Netlify 的分支预览。

---

## 3. 目录结构与路径约定

> **路径约定（重要）**：本文档**全文使用相对路径**，工程根目录统称 `gh-pages-build/`（即含 `generate.mjs` 的那一层）。
> ❌ 不要硬编码带日期的绝对路径（如 `D:\workbuddy项目\2026-07-07-09-02-15\gh-pages-build\`）——换机器 / 改文件夹名后文档立即失效。
> 建议把工程根目录固定命名为 `gh-pages-build`，并设置别名方便使用：
> ```bash
> # 在 ~/.bashrc 或 ~/.zshrc 加一行（路径按你实际放置位置改）
> alias gs='cd /你的工作区/gh-pages-build'
> # 之后随时 gs 进入工程
> ```

工程根目录 `gh-pages-build/` 关键文件：

| 路径（相对工程根） | 作用 | 部署相关 |
|---|---|---|
| `generate.mjs` | 单站构建引擎（读 JSON → 注入 → vite build） | ✅ 核心 |
| `build-clean.sh` | 全量干净重建 10 站（含时间戳校验，防 EBUSY 假成功） | ✅ 核心 |
| `.github/workflows/deploy.yml` | CI 部署流水线（校验→构建→组装→Pages） | ✅ 核心 |
| `validate-sites.mjs` | **部署前自检闸门**（拦截缺图/缺字段的残缺站）+ 孤儿站点告警 | ✅ 核心 |
| `onboard.mjs` | 客户接入本地服务（端口 4321） | 🟡 工具 |
| `onboarding.html` | 通用 JSON 表单渲染器（替客户填表生成站点） | 🟡 工具 |
| `examples/*.json` | 10 个样板站的业务数据（接入新客户改这里） | ✅ 数据源 |
| `src/<template>/` | 8 套行业模板的 React 组件 + App | ✅ 核心 |
| `assets/<slug>/` | 各站图片源（截图、菜品等） | ✅ 数据源 |
| `output/` | 本地构建产物（gitignore） | ❌ 忽略 |
| `public/` | Actions 组装用中间目录（gitignore） | ❌ 忽略 |
| `index.html` | 门户页（链接 10 个站） | ✅ |
| `docs/workflow.md` | **本文档（v0.8，git 跟踪）** | — |
| `README.md` | 入口说明（回链本文档为单一事实源） | — |
| `inject-privacy.mjs` | 隐私/注册地址/发票/合同页注入器 | ✅ 辅助 |
| `admin/index.html` + `admin/config.yml` | **客户自助 CMS 后台**（Decap CMS + GitHub OAuth）加载器与字段映射，发布到 `/demo-sites/admin/` | 🟡 工具（见 `docs/cms.md`） |
| `gen-decap-config.mjs` | 从 `examples/*.json` 自动生成 `admin/config.yml` 全站字段映射（100% 覆盖、防保存丢字段） | 🟡 工具 |
| `docs/cms.md` | 客户自助 CMS 文档（OAuth 注册 / 逐站启用 / 生产隔离模型） | — |

> `PROJS=( atelier-salon breath-yoga chambers-law creme-dessert forge-trades mario-pizza mono-coffee patisserie-v2 sotto-sotto vault-hotel )` —— 这是 `build-clean.sh` 第 8 行的硬编码数组，是「要构建的站点」**单一事实源**。`validate-sites.mjs` 以它为准；两处脚本开头均有醒目提醒注释（见 §8）。

---

## 4. 三套核心工作流

### 4.1 本地开发流程（改模板 / 看效果）

```bash
gs   # 进入工程根目录 gh-pages-build

# 改单个站（如调试 sotto-sotto）
node generate.mjs "./examples/sotto-sotto.json"

# 全量干净重建（绕过安全删除守卫，逐个时间戳校验）
bash build-clean.sh

# 本地预览（构建后在 output/<slug>/dist 起静态服务，端口自定）
python -m http.server 8088 --directory output/sotto-sotto/dist
```

> ⚠️ 本地预览服务器会锁定 `dist/` 目录，重建前务必先关掉，否则会触发 EBUSY 假成功（见 §9）。

### 4.2 客户接入流程（见 §5 标准 SOP）

### 4.3 部署流程（push → Actions 自动上线）

```bash
gs
git add -u                 # 改已有跟踪文件用 -u（删 gitignore 旧文件也要用 -u，非 -A）
git commit -m "..."
git push origin main      # 走 SSH，无需 PAT
```

- **Actions 已具备并发控制**（`deploy.yml` 中 `concurrency` 组，避免并行部署互相覆盖）。
- **Actions 失败怎么看**：GitHub 仓库 → Actions 标签 → 看对应 run 的日志。校验闸门报错会明确告诉你「哪个站、缺什么」。
- **部署依赖缓存已落地（v0.6）**：`setup-node` 已加 `cache: 'npm'`（缓存键取根 `package-lock.json`）；`generate.mjs` 改为「工程根一次性 `npm ci` + 各站点符号链接复用 `node_modules`」，10 站只真正安装 1 次并命中 CI 的 npm 缓存，构建显著提速。详见 §11。

---

## 5. 客户接入标准作业（SOP）—— 重点

**原则**：客户不懂开发，全程**你替客户填**。客户只需提供文字内容和照片，你用工具生成、审核、部署。

### 步骤

1. **启动接入工具**
   ```bash
   gs
   node onboard.mjs
   ```
   浏览器打开 `http://localhost:4321/`

2. **选模板克隆**：下拉选同行业演示站（如新餐厅选 `sotto-sotto`，结构最贴合），自动载入该模板的全部字段。

3. **业务类型选择**：Ltd / Sole Trader 一键切换
   - **Sole Trader**：`registeredAddress` 字段自动清空并禁用（Sole Trader 不需要注册办公室）
   - **Ltd**：保留 `registeredAddress` 字段，填合规地址（住宅 / 会计师免费地址 / 虚拟办公室均可，不一定花钱买）

4. **填表**：表单递归渲染模板所有字段（名称、副标题、电话、地址、菜单、评价、关于、营业时间……）。数组字段（如菜单项、评价）可增删。不用碰 JSON 语法。

5. **上传实景图**：在「实景图上传」区选客户照片（可多选），工具自动写入 `assets/<slug>/`，**无需手动放文件夹**。
   - 勾选「按上传顺序重命名为 screenshot-1/2/3.jpg」→ 适合含「实景图区块」的模板（如餐厅），3 张图自动对应区块
   - 不勾选 → 按原文件名保存，表单里以 `./images/<文件名>` 引用即可
   - 当前 Sotto 用的是 Openverse 免费授权占位图，交付客户前替换为客户真实照片（直接覆盖 `assets/<slug>/` 同名文件即可）

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
   > ⚠️ **仅当手动改 `examples/*.json`（不走接入工具）时**，才需自己把 `<slug>` 加入 `PROJS` 数组（见 §10 / 代码顶部注释），否则 Actions 不会构建/部署该新站。
   > 💡 **紧急/临时改动不必全量重建**：只改一张图或一个电话时，用 `node generate.mjs ./examples/<slug>.json` 单站快速 build（约 30–60 秒），详见 §5.9「快速路径」。

8. **交付客户**：发线上地址 + 说明（域名/DNS 自定义见 §11 待办）。

### §5.9 交付后维护流程（当前最大流程缺口 —— 已补）

**问题**：真实客户上线后，想改菜单 / 照片 / 地址 / 营业时间，怎么操作？

**当前机制（v0.3 明确写法）**：由**你（owner）手动改 JSON + rebuild + 部署**，客户不直接碰代码。
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
- **场景**：客户只改一张图、一个电话或一段文案，且你只想最快验证 / 预览，不想等全量 10 站重建（约数分钟）。
- **本地单站快速构建**（约 30–60 秒，只动这一个站）：
  ```bash
  gs
  node generate.mjs "./examples/<slug>.json"        # 仅重建该站 → output/<slug>/dist
  # 本地预览（任选其一）
  node onboard.mjs                                  # 然后浏览器开 /preview/<slug>/
  # 或
  python -m http.server 8088 --directory output/<slug>/dist
  ```
- ⚠️ **注意**：单站 build 只更新本地 `output/<slug>/dist`，**不会自动上线**。要让客户在线上看到，仍需 `git add -u && git commit && git push origin main` 触发 Actions 全量重建（Actions 以 `build-clean.sh` 的 `PROJS` 为准；单站 build 仅为本地快速验证 / 预览）。
- 若改动很大（换模板 / 加板块 / 改结构），仍建议走全量 `bash build-clean.sh` 以确保所有站一致。

**工作分工（onboarding 与 CMS 如何并存，避免互相覆盖）**：
- **初期 / 演示 / 接入新客户**：你用 `onboarding` 工具把关（选模板 → 填表 → 生成 JSON → 预览 → 部署），质量与结构由你控制，最稳妥。
- **真实客户启用 CMS 后**：客户主要走 `/admin` 自助改内容（菜单/文案/评价/营业时间/图片路径），保存即自动重建上线；你**仅在模板升级 / 结构性改动（换模板、加板块、改字段结构）时介入**——此时直接改 `examples/<slug>.json` + 重建，并跑 `gen-decap-config.mjs` 刷新后台字段。
- ⚠️ **冲突规避（重要）**：onboarding 与 CMS 都改同一份 `examples/<slug>.json`。CMS 启用后该站**以 CMS 为准**——你用 onboarding/手改前务必先 `git pull` 拉取客户最新保存，且避免与客户同时编辑同一站；否则你本地覆盖会丢客户未保存的 CMS 改动。两者写入都会触发 Actions，不存在「谁覆盖谁」的隐藏问题，只有「谁最后提交」的时序问题。
- 详见 `docs/cms.md`（§5 全 10 站自动映射、§6 生产模型、§11 一页纸上手卡）。

### §5.10 交付后第 7 天满意度调研（反馈循环）

**目的**：把一次性交付变成持续优化的闭环，积累客户洞察反哺模板。

**时机**：站点上线后第 7 天，自动或手动发送「上线后满意度调研」（简单 Google Form 或邮件）。
- 收集维度：内容准确性、加载速度、手机端体验、想新增的功能、整体满意度 / NPS。
- **知识库沉淀**：反馈记录到 `clients/<slug>/feedback.md`（该目录已 gitignore，敏感信息不进仓库），形成可检索的知识库。
- **AI 复用**：以后可以说「根据过去 N 个客户的反馈，帮我优化 `restaurant` 模板的菜单区块」，我会基于 `clients/*/feedback.md` 给出有数据支持的改进。

**调研模板（建议问题）**
1. 网站内容是否准确反映了你的业务？[是 / 部分 / 否 + 备注]
2. 页面加载速度满意吗？[1–5]
3. 手机上浏览体验如何？[1–5]
4. 最希望新增的功能？[开放题]
5. 整体满意度与推荐意愿（NPS）？[0–10]

> 反馈文件结构与填写规范见 `clients/README.md`。

### 注册地址语义（务必搞清）

| 业务类型 | 需要注册办公室？ | `registeredAddress` 字段 |
|---|---|---|
| **Ltd（有限责任公司）** | 法定必须，但**不一定要买**；住宅 / 会计师免费地址 / 虚拟办公室都合规（ECCTA 2024 禁纯 PO Box，须是「适当地址」） | 保留，给客户填 |
| **Sole Trader（个体户）** | **完全不需要**（不向 Companies House 注册，无注册办公室概念） | 清空禁用 |

> 你自己的业务走 **Sole Trader**，所以 `registeredAddress` 对你无意义；但模板保留该字段是给 **Ltd 客户**用的。演示站已加 Sole Trader 提示段区分语义。

---

## 6. 部署与认证

**已根治的认证方案：SSH（443 通道）**

背景：GitHub 已禁用密码登录；且推送「新增/修改 workflow 文件」的 PAT 必须带 `workflow` scope，极易踩坑。改用 SSH 彻底绕开。

**本机已配置**（无需你再操作）：
- 密钥：`~/.ssh/id_ed25519_github`（无密码，个人项目够用）
- `~/.ssh/config`：`github.com` → `ssh.github.com:443`（标准 22 端口被墙，走 443）
- 远程已切 SSH：`git@github.com:lcclicheng/demo-sites.git`

**若换机器 / 重新配置**：生成密钥 → 把公钥加到 GitHub（Settings → SSH and GPG keys → New SSH key）→ 复制 `~/.ssh/config` 这段配置。

**验证连通**：`ssh -T git@github.com`（返回 `Hi lcclicheng!` 即成功；退出码 1 是正常的，GitHub 不提供 shell）。

**安全提醒（务必遵守）**：
- 🔑 **定期轮换 SSH 密钥**（如每年），旧公钥从 GitHub 移除
- 🚫 **绝不要把私钥**（`id_ed25519_github` 等）**提交进 git**；`.gitignore` 不覆盖 `~/.ssh`，但人工需警惕
- 🌐 **GitHub Pages 站点完全公开**：JSON 中的电话 / 地址等客户信息会公开可见。交付前提醒客户此点；对隐私敏感的客户未来可支持私有部署（见 §11）

---

## 7. 业务合规与法律风险

- **ECCTA 2024**：禁止把纯 PO Box 作为注册办公室，必须是能接收官方信件的「适当地址」(appropriate address)。
- **Ltd**：强制有注册办公室，但可选住宅 / 会计师免费地址 / 虚拟办公室，不必额外购买。
- **Sole Trader**：不向 Companies House 注册、无注册办公室概念，最简单，适合刚起步的小商家。

**⚠️ 法律风险边界（重要）**：
- **不要替客户选择或担保注册地址的合法性**。你仅做模板注入（把客户提供的地址填进 `registeredAddress` 字段），适当地址由**客户提供并负责**。模板/文档中可提示「须为 ECCTA 合规的适当地址」，但不替客户做法律判断。
- **GDPR / 隐私政策 / Cookie（英国）**：
  - `inject-privacy.mjs` 已自动注入隐私政策页，但内容为**占位模板**，客户须补充真实条款
  - 交付清单须提醒客户：英国 GDPR 下需有真实隐私政策 + Cookie 同意机制（模板站目前无 Cookie 同意弹窗，若用分析工具需补）
  - 见 §11 待办「合规交付清单」

---

## 8. 质量闸门 `validate-sites.mjs`

**位置**：部署流水线「构建前」一步（fail-fast）。

**校验内容**（逐站，站点列表来自 `build-clean.sh` 的 `PROJS`，单一事实源）：
1. JSON 合法可解析
2. 必填字段齐全合规：`name` / `slug` / `template`
3. JSON 里引用的 `./images/*` 在 `assets/<slug>/` 真实存在

**阻断逻辑**：任一不满足 → 退出码 1 → 整个 Actions job 失败 → **不构建、不部署**，残缺内容绝不上线。

**孤儿站点自动发现（v0.3 新增；v0.5 改为【软阻断】）**：
- 脚本额外扫描 `examples/*.json`，找出「同时具备 `template` + 非空 `slug`」却**未纳入 `PROJS`** 的 JSON
- 这类文件「看起来该部署却不会被构建」。默认**软阻断**：打印 ⚠️ 并 `exit 1`，令 Actions job 失败（fail-fast），避免「忘了加 PROJS 直接 push 漏部署」
- **临时放行**：本地 `node validate-sites.mjs --allow-orphans`，或在 `deploy.yml` 经 `workflow_dispatch` 勾选 `allow_orphans`（仅限确认无误时）
- 测试夹具（batch-sample / profix-test / test-new-templates）因 slug 为空，自动排除、不误报

**单一事实源提醒**：`validate-sites.mjs` 与 `build-clean.sh` 开头均有醒目 ⚠️ 注释，强调「改站点须同步 PROJS」。

---

## 9. 已知坑与经验沉淀（FAQ）

| 现象 / 坑 | 原因 | 解法 |
|---|---|---|
| `Minified React error #62` | JSX 里 `style="..."` 写成字符串，必须是对象 `style={{}}` | 用对象写法；`inject-privacy.mjs` 已改为对象 |
| 构建报成功但页面是旧的 / 缺内容 | 预览服务器锁 `dist/` 导致 `rmdir` 失败（EBUSY 假成功） | 重建前关掉预览服务；`build-clean.sh` 加时间戳校验 |
| 部署成功但页面缺图 | `generate.mjs` 图片目录缺失时静默跳过 | §8 校验闸门拦截 |
| 改了图页面没变 | 浏览器/CDN 缓存同名旧图 | 截图 URL 加 `?v=<md5前8位>` 内容哈希（§2 已落地） |
| `git add -A` 删不掉被 gitignore 的旧文件 | `-A` 因 gitignore 跳过 tracked 删除 | 用 `git add -u` 或 `git rm --cached` |
| `push` 报 `workflow scope` / 认证失败 | PAT 缺 workflow scope；或密码登录已禁用 | 改用 SSH（§6） |
| 标准 22 端口 SSH 连不上 | 国内网络屏蔽 22 | 走 `ssh.github.com:443`（§6 已配） |
| 新增站点没被部署 | 忘了把新 JSON 加入 `build-clean.sh` 的 `PROJS` | §8 孤儿站点告警会提示；记得同步 PROJS |

---

## 10. 已闭环的「流程成熟度四缺口」回顾

这是当初分析「咱们的流程还缺什么」的结论，现已全部闭环：

| 编号 | 缺口 | 状态 | 闭环方式 |
|---|---|---|---|
| 三.1 | 全手动四步 build→copy→commit→push | ✅ | GitHub Actions 自动化 |
| 三.2 | 部署前无自检闸门（部署完才 grep） | ✅ | `validate-sites.mjs` 在构建前拦截 |
| 三.3 | 双仓库 + 手动 copy 易漏 | ✅ | 单仓库 + Actions 自动部署 |
| 三.4 | 无客户接入流程（手工改 JSON） | ✅ | `onboard.mjs` + `onboarding.html` 标准化接入 |
| 四.1 | 注册地址字段语义不清 | ✅ | 你拍板走 Sole Trader；Ltd/Sole Trader 字段已区分 |
| 四.2 | 2 个旧 PAT 待吊销 | ✅ | 已吊销 + 切 SSH，远程 URL 干净 |

**额外收尾**：截图内容哈希防缓存（§9）+ 清理 9 个早期根目录旧站点（已从 git 索引移除）+ 孤儿站点自动发现（§8）+ 本文档 git 化（§3）。

---

## 11. 待迭代优化清单

> 标签含义：`[难度/收益]` —— 难度：低/中/高；收益：低/中/高。**非必需**，按优先级排。已完成项标注 ✅ 与版本；未完成项标注「预计完成版本」（估算，非承诺）。

| 项 | 难度/收益 | 状态 | 预计完成版本 | 负责人 |
|---|---|---|---|---|
| 自定义域名 / DNS / SSL / 客户交接 SOP | 低/高 | ✅ 已完成（v0.4，SOP 就绪；代码执行待真实英国客户签约） | —（SOP 已交付） | AI（文档）/ 你（执行） |
| onboarding 工具增强（图片上传/base64、单站构建、/preview、缺图提醒、自动写 PROJS） | 低/高 | ✅ 已完成（v0.3；v0.4 自动写 PROJS；v0.5 加固） | — | AI |
| 文档维护规则（README 回链单一事实源） | 低/中 | ✅ 已完成（v0.4） | — | AI |
| 合规交付清单 | 低/中 | ✅ 已完成（v0.4） | — | AI |
| SEO 基础（og:image / sitemap / robots / SITE_BASE_URL） | 中/高 | ✅ 已完成（v0.4） | — | AI |
| 部署后通知（Slack / Telegram） | 低/中 | ✅ 已完成（v0.4，需配 secrets） | — | AI（代码）/ 你（配 secrets） |
| 孤儿站点软阻断（validate 默认 exit 1，可 override） | 低/中 | ✅ 已完成（v0.5） | — | AI |
| onboard.mjs 自动写 PROJS 加固（备份 + bash -n + 还原） | 低/中 | ✅ 已完成（v0.5） | — | AI |
| custom-domain 形态 B（子路径重定向）补全 | 低/中 | ✅ 已完成（v0.5） | — | AI |
| GitHub Pages 监控建议（仓库大小/构建时长） | 低/中 | ✅ 已完成（v0.5，建议写入 deploy.yml） | — | AI（建议）/ 你（落实阈值） |
| GITHUB_TOKEN 权限最小化（附录 B） | 低/低 | ✅ 已完成（v0.5，deploy.yml 已最小权限） | — | AI |
| deploy.yml 依赖缓存（setup-node cache + 一次性安装复用） | 中/中 | ✅ 已完成（v0.6） | — | AI |
| 客户自助内容后台（Decap CMS + GitHub OAuth） | 中/高 | ✅ 已完成（v0.8：gen-decap-config.mjs 自动生成全 10 站字段映射、100% 覆盖防丢字段；admin/ 发布到 /demo-sites/admin/；docs/cms.md 就绪；演示站 OAuth App 已注册并填 client_id 激活，/demo-sites/admin/ 可登录编辑；真实客户按生产模型各自注册） | v0.8 | AI（脚手架+映射）/ 你（OAuth 注册+启用） |
| i18n 策略明确化 | 低/中 | ✅ 已完成（默认，无需改动） | — | AI |
| 图片文件名哈希扩展（全图片 ?v=） | 低/低 | ✅ 已完成（v0.8：generate.mjs 注入时给所有图片路径加 `?v=<构建版本>`，每次部署不同、对 CMS 保存自愈） | v0.8 | AI |
| **增量构建（只重建变更站，跳过未变更站 + 门户）** | 中/高 | 🔲 待做（站点增多后提速；v0.6 缓存已缓解安装，但全量 `build-clean.sh` 仍随站点数线性变慢） | v0.9 | AI |
| 新增行业模板 SOP（命名/必含字段/SEO 隐私 CMS checklist/测试） | 低/中 | ✅ 已完成（v0.9，见本节 SOP + `templates/README.md`） | v0.9 | AI |
| 监控仪表盘（UptimeRobot + GitHub Issues 客户站点健康看板） | 低/中 | ✅ 已落地（v0.9.3：自建 `health-check.mjs` + `.github/workflows/health-check.yml` 每天定时查全站 200/挂载点/title，失败自动开/更 Issue、恢复自动关；UptimeRobot 外部探测 SOP 见 `docs/monitoring.md`，你手动加监测点） | v0.9.3 | AI（自建+SOP）/ 你（UptimeRobot 注册） |
| 定价两档（建站含 CMS 自助 £590 一次性 / 年度呵护 £390 年） | 低/中 | ✅ 已落地（v0.9.2，进攻型初始 £ 基准见 `docs/pricing.md`；首客交付后复盘重定） | v0.9.2 | 你（定价）/ AI（文档） |
| 自动化 UI 测试（构建后冒烟检查） | 中/中 | ✅ 已落地（v0.9.3：`smoke-test.mjs` 校验每站产物含挂载点/JS/title 非空壳，接进 `deploy.yml` Assemble 之后阻断坏部署）；Playwright 逐像素**视觉回归**留待站点数 >15 或有真实客户再上 | v0.9.3（冒烟）/ v1.0+（视觉回归） | AI |
| **共享视觉手法系统（Hero+视觉库）** | 低/中 | ✅ 已落地（v0.9.4：从 20 个旧站抽取设计手法沉淀为 `src/components/visual.tsx`（HeroBackdrop/StatsStrip/GradientText/GlassCard/ConfettiBg/Eyebrow），`generate.mjs` 注入 `VISUAL_CSS`（particles/breathe-ring/gradient-text 等）+ `copyDir` 拷贝组件；7 套模板 hero 注入发光背景+呼吸环+粒子、流光标题，咖啡/瑜伽加指标条；restaurant 保留原生等效手法；全 `currentColor`+`color-mix` 主题自适应，亮暗模板通用） | v0.9.4 | AI |
| 多语言准备（onboarding.html 英文版，未来英国客户直用） | 低/中 | ⏸ 暂缓（决策 2026-07-14）：交付包已英文化、`onboarding.html` 是**你（owner）自用**的中文接入工具、客户不直接接触，故现无实际英文消费者。**触发条件**：出现要自助填料的英国直客、或把接入工具开放给客户时，再补英文版（约半天工作量） | 触发后 | AI |

---

### 新增行业模板 SOP（标准化起点）

> 目的：让「做新行业站」可复制、可 Review，避免每次从零摸索。模板库索引见仓库根 `templates/README.md`（指向 `src/<template>/`，不物理复制避免漂移）。

**1. 命名规范**
- 模板名（即 `data.template` 值）：全小写英文、行业语义清晰，如 `restaurant` / `yoga` / `law`；不与现有 8 套重名。
- 站点 slug（`data.slug`）：全词小写连字符，如 `sotto-sotto` / `breath`；避免缩写（见附录 A）。
- 源文件：`examples/<slug>.json`；组件：`src/<template>/`（含 `App.tsx` + `business-data.ts`）。

**2. 必须包含的字段清单（至少）**
- 结构性（必填，被 `validate-sites.mjs` 与 Decap 校验）：`name` / `slug` / `template`。
- 业务基础：`tagline` / `aboutParagraphs[]` / `phone` / `address` / `email`（如适用）。
- 内容区块（按行业）：菜单 / 服务 / 作品集 / 评价 / 营业时间 / 预订方式 等。
- 图片引用：统一 `./images/<file>` 约定，对应 `assets/<slug>/`。

**3. SEO / 隐私 / CMS 配置 checklist**
- SEO：`seo.{title,description}` 填（否则回退 pageTitle/tagline）；`generate.mjs` 会自动注入 og:/canonical/sitemap。
- 隐私：`inject-privacy.mjs` 会自动注入隐私/发票/合同页；如 Ltd 客户需填 `registeredAddress`。
- CMS：新站启用自助后台时，跑 `gen-decap-config.mjs` 重新生成 `admin/config.yml`（自动 100% 覆盖字段，防保存丢字段）；`template`/`slug` 会被设为 hidden+required。
- 图片：真实图放 `assets/<slug>/`；`?v=` 哈希由 `generate.mjs` 自动加，覆盖同名即刷新。

**4. 测试验证步骤**
- `node validate-sites.mjs` 校验通过（无缺字段 / 缺图 / 孤儿告警）。
- `node generate.mjs "./examples/<slug>.json"` 单站构建成功出 `dist/index.html`。
- 本地预览（onboard.mjs `/preview/<slug>/` 或 `python -m http.server`）。
- 加入 `PROJS`（用 onboard.mjs 生成会自动写；手动加见 §8）。
- `git add -u && git commit && git push` → Actions 全量校验 + 构建 + 部署，确认线上 200。

---

## 12. 常用命令速查

```bash
# ── 进入工程（依赖 §3 的 alias gs）──
gs

# ── 接入新客户 ──
node onboard.mjs                      # 打开 http://localhost:4321/ 填表生成 examples/<slug>.json

# ── 本地构建 ──
node generate.mjs "./examples/<site>.json"   # 单站
bash build-clean.sh                          # 全量 10 站

# ── 部署 ──
git add -u && git commit -m "..."     # 提交（改/删跟踪文件用 -u）
git push origin main                  # SSH 推送，触发 Actions 自动部署

# ── 验证 ──
ssh -T git@github.com                 # 验证 SSH 连通
curl -sI https://lcclicheng.github.io/demo-sites/<slug>/   # 验证线上可达
node validate-sites.mjs               # 本地手动跑校验闸门（含孤儿站点告警）

# ── 本地预览 ──
python -m http.server 8088 --directory output/<slug>/dist

# ── 清理构建产物（重建前常用）──
rm -rf output public
```

---

## 13. 与 AI 助手协作规范

**定位**：AI 助手（本项目当前即本会话 AI；用户也可能用 Grok 等其他 AI）是你流程中的**正式一环**。把协作标准化、可追溯，能显著提升效率与一致性。

### 我可以高效帮你做的事
- **生成 / 优化新模板组件**：基于现有 8 套行业模板（`src/<template>/`）衍生新变体或新行业 UI。
- **Review 新 JSON 数据合规性与完整性**：审查 `examples/<slug>.json` 的缺字段 / 结构问题（对照 `validate-sites.mjs` 逻辑与字段规范）。
- **起草客户邮件、交付材料、合同条款**：按 `docs/delivery-handover.md` 模板填充「第 X 客户交付包」。
- **分析 validate / Actions 报错日志**：定位部署失败根因（缺图、缺字段、校验闸门、SSH 限流等）。
- **生成新行业 CMS 配置块**：用 `gen-decap-config.mjs` 或手写，给新站补全 Decap `admin/config.yml` 字段映射。
- **优化 SEO 文案、隐私政策模板**：og:/sitemap/robots 文案、`inject-privacy.mjs` 注入内容。
- **批量处理图片描述 / 命名**：图片路径、alt 文本、文件名规范化。

### 使用提示
- **提供具体上下文**：贴 JSON 片段、错误日志、客户需求，越具体产出越准。
- 「帮我生成 `{{slug}}` 客户的交付包」→ 我按 `docs/delivery-handover.md` 填充。
- 「Review 这个新站」→ 我走 `docs/delivery-checklist.md` 逐项核对。
- 「基于 restaurant 模板生成一个 yoga 新变体」→ 我参考 `src/restaurant/` 结构给出差异实现。
- 「分析这次 Actions 失败」→ 贴 run 日志，我定位根因并给修复步骤。

### 协作红线（务必遵守）
- 私钥 / Client Secret / 真实客户敏感信息**绝不提交 git**，也不写入会被公开的 config。
- 法律判断（地址合规、隐私条款）由客户提供，AI 只做模板注入，不替客户做法律担保。
- 重大改动（换模板、加板块、改字段结构）改完务必重跑校验与构建。

---

## 附录 A：slug 命名约定

- 规则：小写字母 / 数字 / 连字符，如 `sotto-sotto`、`vault`
- **历史不一致（已修复 v0.5）**：`creme-dessert` 源曾用 slug `cr-me`（CRÈME 缩写）、`vault-hotel` 曾用 `the-vault`，与其余全词 slug 风格不同；已于 2026-07-14 统一为 `creme`、`vault`（同步改了 `generate.mjs` 的 `THEMES` key、门户链接、本文档）
- **新增建议**：统一用全词小写连字符（如 `creme-dessert`、`vault-hotel` 风格）
- **旧 slug 的 301 重定向（真实客户场景必做）**：演示期门户无稳定外链，旧 URL 失效影响不大；但若真实客户已对外分享过旧 slug（如 `the-vault`），需做 301 跳转，否则分享链接 404、SEO 权重流失。
  - **GitHub Pages 子路径不支持 `_redirects`**（那是 Netlify 语法）。可用以下任一方式：
    1. **占位跳转页（推荐，零成本）**：在 `public/<旧slug>/index.html` 放一个 `<meta http-equiv="refresh" content="0; url=/demo-sites/<新slug>/">` + 前端 `location.replace()` 的兜底页；在 `deploy.yml` 组装阶段复制该页即可（不影响其他站）。虽非严格 301（是 200 + meta refresh），但用户 / 爬虫都能跳转。
    2. **自定义域名侧 301**：若客户已用自定义域名（见 `custom-domain.md` 形态 A / B），在其 DNS / Cloudflare 配一条 301 转发规则，把旧 slug 路径重定向到新 slug 路径（最干净，标准 301）。
  - 备注：本仓库当前 10 站 slug 均为首次设定，无历史旧 slug 需重定向；此方案仅作未来改名时的标准动作。

## 附录 B：安全清单（部署相关）

- [ ] SSH 私钥（`~/.ssh/id_ed25519_github`）**绝不提交 git**
- [ ] 定期轮换 SSH 密钥（建议每年），旧公钥从 GitHub 移除
- [ ] GitHub Pages 站点公开，交付前提醒客户：电话/地址等信息对外可见
- [ ] 远程 URL 不含明文 PAT（当前为 SSH，已干净）
- [ ] 两个旧 PAT（ghp_f0EM… / ghp_gyrX…）已吊销
- [ ] **`GITHUB_TOKEN` 权限最小化**（`deploy.yml` 顶部 `permissions:` 块）：
  - 仅授予本次部署必需的最小权限：`contents: read` + `pages: write` + `id-token: write`
  - **不要**图省事写 `permissions: write-all` 或 `contents: write`（本仓库不需要 push 回自身）
  - `id-token: write` 仅用于 OIDC 发布 Pages，属最小必要；若将来不用 Pages OIDC 可去掉
  - 原理：GitHub 自动注入的 `GITHUB_TOKEN` 默认范围随仓库设置，显式声明可收紧，降低令牌泄漏后的影响面

---

*版本记录：v0.1（2026-07-14 初版）→ v0.2（2026-07-14 审查修订：交付后维护流程、路径去硬编码、GitHub Pages 限制、孤儿站点自动发现、合规/法律风险、SEO/健壮性、文档维护规则、难度标签）→ v0.3（2026-07-14 onboarding 工具增强：图片上传接口、生成后自动单站构建、/preview/<slug>/ 本地预览、缺失图片提醒）→ v0.4（2026-07-14：SEO 基础/og:image/sitemap/robots、部署后 Slack/Telegram 通知、合规交付清单文档、自定义域名 SOP 文档、onboarding 自动写 PROJS、README 回链单一事实源）→ v0.5（2026-07-14：slug 统一重命名 cr-me→creme、the-vault→vault，同步 THEMES 主题 key、门户链接、文档）→ v0.6（2026-07-14：部署依赖缓存 —— setup-node cache:'npm' + generate.mjs 改为「工程根一次性 npm ci + 各站点符号链接复用 node_modules」，10 站只装 1 次并命中 CI npm 缓存）→ v0.7（2026-07-14：客户自助 CMS 脚手架 —— Decap CMS + GitHub OAuth，admin/ 发布到 /demo-sites/admin/，完整映射 sotto-sotto 全部字段防保存丢字段，docs/cms.md 写清 OAuth 注册/逐站启用/生产模型/图片处理/安全防坑）→ v0.8（2026-07-14：客户自助 CMS 全量落地 —— gen-decap-config.mjs 自动生成全 10 站字段映射 100% 覆盖防丢字段；图片 ?v= 防缓存；演示站 /admin 保留公开作展示）→ v0.9（2026-07-14：流程标准化规范 v1 —— 交付标准化包 docs/delivery-handover.md、模板库索引 templates/README.md + 新增行业模板 SOP、交付后第7天反馈循环 clients/ + §5.10、AI 协作规范 §13、中低优先待办 监控/定价/自动化测试/多语言）→ v0.9.1（2026-07-14：定价三套餐落地 —— 基础建站 £490 / +CMS 自助启用 £790 / +年度支持 £1,290/年，初始报价基准，首客交付后复盘重定，见 docs/pricing.md）→ v0.9.2（2026-07-14：定价改进攻型两档 —— 建站含 CMS 自助 £590 一次性 / 年度呵护 £390/年，见 docs/pricing.md）→ v0.9.3（2026-07-14：监控 + 轻量冒烟落地 —— health-check.mjs + health-check.yml 每天定时查全站 200/挂载点/title、失败自动开/更 Issue、恢复自动关；smoke-test.mjs 校验每站产物非空壳接进 deploy.yml 阻断坏部署；UptimeRobot 外部探测 SOP 见 docs/monitoring.md）→ v0.9.4（2026-07-14：共享视觉手法系统落地 —— 从 20 个旧站抽取 Hero+视觉库沉淀为 src/components/visual.tsx 与 generate.mjs 的 VISUAL_CSS，7 套模板注入发光背景+呼吸环+粒子+流光标题、咖啡/瑜伽加指标条，restaurant 保留原生等效手法）→ v0.9.5（2026-07-14：共享视觉手法延展到区块层 —— GlassCard 注入 trades 评价卡作磨砂玻璃面板、ConfettiBg 注入 dessert 下单区作点阵纹理，Eyebrow 因各模板已手写 kicker+分隔线暂不强制使用）。后续迭代请直接修改本文档并更新本行版本号与日期。*
