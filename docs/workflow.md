# 建站系统流程文档（v0.2）

> 版本：v0.2 ｜ 更新：2026-07-14 ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 初版 v0.1 同日发布；本次依据审查意见修订：补充**交付后维护流程**、路径去硬编码、GitHub Pages 限制、孤儿站点自动发现、合规/法律风险、SEO/部署健壮性、文档维护规则、统一格式与难度标签。
> **定位**：本文档是系统的「单一事实来源」。任何重大改动（新增站点、改模板、动部署流程）须同步更新此处（见 §11 文档维护规则）。

---

## 0. 文档导航

| 你想做的事 | 跳到 |
|---|---|
| 整体了解这个系统是啥 | §1 项目概述 |
| 看代码怎么组织 / 路径约定 | §2 技术架构 / §3 目录结构与路径约定 |
| 接一个新客户（标准化流程） | §5 客户接入 SOP |
| **客户上线后想改内容怎么办** | **§5.9 交付后维护流程** |
| 本地改模板 / 看效果 | §4.1 本地开发流程 |
| 推送上线 | §4.3 部署流程 / §6 部署与认证 |
| **排查部署失败** | **§4.3 + §9 已知坑 FAQ** |
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
| examples/creme-dessert.json | dessert | cr-me | /demo-sites/cr-me/ |
| examples/forge-trades.json | trades | forge | /demo-sites/forge/ |
| examples/mario-pizza.json | restaurant | mario | /demo-sites/mario/ |
| examples/mono-coffee.json | coffee | mono | /demo-sites/mono/ |
| examples/patisserie-v2.json | dessert | patisserie | /demo-sites/patisserie/ |
| examples/sotto-sotto.json | restaurant | sotto-sotto | /demo-sites/sotto-sotto/ |
| examples/vault-hotel.json | hotel | the-vault | /demo-sites/the-vault/ |

> ⚠️ **slug 命名不一致（已知 quirk，暂不修）**：`cr-me` 取自 CRÈME 缩写，与其余全词 slug 风格不同。因已上线且 URL 固定，**改名会破坏外链**，故保留。新增站点建议统一用全词小写连字符（如 `creme-dessert` 风格）。详见附录 A。

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
| `docs/workflow.md` | **本文档（v0.2，git 跟踪）** | — |
| `README.md` | 旧版说明（已滞后，以本文档为准） | — |
| `inject-privacy.mjs` | 隐私/注册地址/发票/合同页注入器 | ✅ 辅助 |

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
- 可选优化（见 §11）：给 `setup-node` 加 npm 依赖缓存、部署后发通知。

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

5. **放实景图**：把客户餐厅/店铺的真实照片放到 `assets/<slug>/screenshot-1~3.jpg`（当前 Sotto 用的是 Openverse 免费授权占位图，交付客户前替换为真实照片）。

6. **生成**：点「生成」→ 自动写出 `examples/<slug>.json` → 工具给出构建/部署命令。

7. **构建 + 部署**
   ```bash
   bash build-clean.sh
   git add -u && git commit -m "feat: 新增 <slug> 站点"
   git push origin main
   ```

8. **交付客户**：发线上地址 + 说明（域名/DNS 自定义见 §11 待办）。

### §5.9 交付后维护流程（当前最大流程缺口 —— 已补）

**问题**：真实客户上线后，想改菜单 / 照片 / 地址 / 营业时间，怎么操作？

**当前机制（v0.2 明确写法）**：由**你（owner）手动改 JSON + rebuild + 部署**，客户不直接碰代码。
1. 客户通过微信 / 邮件把变更发你（新文案、新照片文件）
2. 你改对应 `examples/<slug>.json`（或图片覆盖 `assets/<slug>/`）
3. 重建并部署：
   ```bash
   bash build-clean.sh
   git add -u && git commit -m "chore(<slug>): 更新菜单/照片"
   git push origin main
   ```
4. 图片已带 `?v=<md5>` 内容哈希，覆盖同名文件后缓存自动失效，客户刷新即见新图

**为什么不让客户自助改（当前决策）**：
- 客户误改 JSON 会导致构建崩 / 页面残缺；当前由你把关最稳妥
- 若某客户**频繁**自改内容，未来再做轻量 CMS / 表单后台（见 §11 待办），不在当前范围

**未来演进方向**：自定义域名 + 客户自助后台（见 §11「上线交付」项），让客户在自己域名下自助改部分内容，你只负责模板与运维。

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

**孤儿站点自动发现（v0.2 新增，非阻断告警）**：
- 脚本额外扫描 `examples/*.json`，找出「同时具备 `template` + 非空 `slug`」却**未纳入 `PROJS`** 的 JSON
- 这类文件「看起来该部署却不会被构建」，脚本会打印 ⚠️ 告警提示你把它加入 `PROJS`
- **不阻断部署**（exit 0），只是帮你发现「忘记同步 PROJS」的人为遗漏
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

> 标签含义：`[难度/收益]` —— 难度：低/中/高；收益：低/中/高。**非必需**，按优先级排。

- [低难度 / 高收益] **自定义域名 / DNS / SSL / 客户交接（「上线交付」环节）**：真实英国客户签约后，把 `/demo-sites/<slug>` 换成客户自己的域名（如 `sottosotto.co.uk`），配 DNS、开 SSL、交接给客户、后续改内容流程。模板加 CNAME 支持基本开箱即用（相对路径已兼容）。
- [低难度 / 高收益] **onboarding 工具增强（优先级最高痛点）**：
  - 加简单文件上传接口（如 multer），生成时自动创建 `assets/<slug>/` 并复制图片，消灭「第 5 步手动放图」
  - 生成后自动执行 `validate-sites.mjs` + 单站 `generate.mjs` + 提示预览命令
- [低难度 / 中收益] **文档维护规则**：每次重大改动必须同步更新本文档 + `README.md`（或让 `README.md` 直接指向本文档最新版，避免双份失真）。
- [低难度 / 中收益] **合规交付清单**：交付时附「隐私政策 / GDPR / Cookie 同意 / 注册地址合规」确认项，降低你的法律风险（见 §7）。
- [中难度 / 高收益] **SEO 基础**：模板补充 meta tags（title/description/OG）、自动生成 `sitemap.xml` 与 `robots.txt`（Vite 插件容易实现）。
- [低难度 / 中收益] **部署后通知**：Actions 部署成功/失败发 Slack / Email / Telegram，及时感知。
- [中难度 / 中收益] **deploy.yml 依赖缓存**：`setup-node` 加 `cache: 'npm'`；但当前每站独立 `npm install` 在 `output/<slug>`，需调整安装结构才能命中缓存（见 §2 限制）。
- [中难度 / 低收益] **客户自助内容后台（CMS）**：客户在自己域名下自助改部分内容（§5.9 未来方向）。
- [低难度 / 中收益] **i18n 策略明确化（当前默认）**：开发者/接入工具 UI 用中文，客户交付的演示站全英文（面向英国客户）。已在 §5 / 本文多处体现，无需改动，仅作显式记录。
- [低难度 / 低收益] **图片文件名哈希扩展**：当前仅 `screenshots` 字段有 `?v=` 哈希；若其他图片也中招，可统一给所有图片文件名加内容哈希。

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

## 附录 A：slug 命名约定

- 规则：小写字母 / 数字 / 连字符，如 `sotto-sotto`、`the-vault`
- **已知不一致**：`creme-dessert` 源的 slug 为 `cr-me`（取自 CRÈME 缩写），与其余全词 slug 风格不同
- **决策**：因 `cr-me` 已上线且 URL 固定，**改名会破坏外链**，故保留不改
- **新增建议**：统一用全词小写连字符；若未来要统一 `cr-me` → `creme`，需配 301 重定向或保留旧目录

## 附录 B：安全清单（部署相关）

- [ ] SSH 私钥（`~/.ssh/id_ed25519_github`）**绝不提交 git**
- [ ] 定期轮换 SSH 密钥（建议每年），旧公钥从 GitHub 移除
- [ ] GitHub Pages 站点公开，交付前提醒客户：电话/地址等信息对外可见
- [ ] 远程 URL 不含明文 PAT（当前为 SSH，已干净）
- [ ] 两个旧 PAT（ghp_f0EM… / ghp_gyrX…）已吊销

---

*版本记录：v0.1（2026-07-14 初版）→ v0.2（2026-07-14 审查修订：交付后维护流程、路径去硬编码、GitHub Pages 限制、孤儿站点自动发现、合规/法律风险、SEO/健壮性、文档维护规则、难度标签）。后续迭代请直接修改本文档并更新本行版本号与日期。*
