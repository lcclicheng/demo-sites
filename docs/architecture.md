<!--
  主题文件：技术架构与目录结构
  来源：由 docs/workflow.md（v1.1.0）§2 + §3 拆分而来（MDD 拆分，2026-07-16）
  维护：本文件是「架构 / 目录 / 路径约定」主题的单一事实源；改架构须同步此处。
-->

# 技术架构与目录结构

> MDD 主题文件 · 索引见 `docs/index.md` · 一册通读见 `docs/PROJECT-OVERVIEW.md`
> 相关：部署见 `docs/deployment.md`｜Section Engine 见 `docs/section-engine.md`｜决策见 `decisions/`

---

## 1. 技术栈与核心管线

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

**8 套行业模板**（`data.template` 字段决定用哪套 UI，主要用于真实商家垂直站 + 历史样板）：
`restaurant` / `coffee` / `salon` / `dessert` / `yoga` / `law` / `hotel` / `trades`
> 💡 curated 样板预设（10 站）已全部跑在 `sectioned` Section Engine（见 `docs/PROJECT-OVERVIEW.md` 站点表），不依赖这 8 套；新增客户站**优先走 `sectioned`**（统一数据契约 + AI 组合，见 `docs/section-engine.md`、`decisions/ADR004-section-engine.md`）。

**资产约定**：
- 图片源放在 `assets/<slug>/`（如 `assets/sotto-sotto/screenshot-1.jpg`）
- `generate.mjs` 把整个 `assets/<slug>/` 目录拷贝进 `dist/images/`
- JSON 里图片引用写相对路径 `./images/xxx.jpg`
- **坑**：图片目录缺失时 `generate.mjs` 会**静默跳过拷贝**（构建成功但页面缺图）——已被质量闸门（`validate-sites.mjs`）拦截

**部署架构**：单仓库 + GitHub Actions + GitHub Pages
- 仓库：`lcclicheng/demo-sites`（本地工程目录 `gh-pages-build`）
- 推送 `main` 分支 → Actions 自动「校验 → 全量构建 → 组装 → 部署」
- 部署用 `GITHUB_TOKEN`，不依赖任何个人 PAT（详见 `docs/deployment.md`）

---

## 2. GitHub Pages 限制注意事项（务必知悉）

GitHub Pages 是静态托管，有软限制，20 个站全静态打包后若图片未优化可能接近边界：
- **仓库大小**：建议 < 1 GB；单个 Pages 站点（含全部历史）软上限，图片多会吃空间
- **月带宽**：免费版约 100 GB/月（一般够用，但若某站图片巨大且流量高需注意）
- **构建时长**：Actions 单次 job 上限 6 小时（我们的构建远小于此）；Pages 自身不构建（只托管 Actions 产物）
- **建议**：
  - 图片用 WebP / 压缩后再放 `assets/<slug>/`（一张餐厅照压到 <300KB 为宜）
  - Vite 生产构建默认已压缩 JS；大站点可加 `build.rollupOptions` 代码分割
  - 若未来站点/图片暴涨，按业务拆多个仓库或换 Vercel/Netlify
  - **监控建议**（站点增多时务必加，避免悄悄触限）：
    - **仓库大小**：在 `deploy.yml` 加一步 `du -sh .` 与 `git count-objects -vH`，超过阈值（如 800MB）时**直接 `exit 1` 让该次部署变红失败**（比仅打印更显眼），并可在同一步 `curl` 发 Slack/Telegram 主动告警；也可接第三方仓库大小监控。
    - **Pages 带宽 / 构建时长**：GitHub 不提供原生带宽告警；可在 `deploy.yml` 记录每次构建耗时（`date +%s` 差值）并打印，时长异常增长即预示站点 / 图片膨胀。需要主动告警可接 Slack / Telegram。
    - **构建变慢应对**：单仓库全量 `build-clean.sh` 随站点数线性变慢；中期可改「增量构建」（只重建变更站，见 `docs/v2-roadmap.md`）或按业务拆多仓库（每个客户 / 行业一个仓库 + 各自 Actions），或迁移到 Vercel / Netlify 的分支预览。

---

## 3. 目录结构与路径约定

> **路径约定（重要）**：本项目文档**全文使用相对路径**，工程根目录统称 `gh-pages-build/`（即含 `generate.mjs` 的那一层）。
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
| `build-clean.sh` | 全量干净重建 20 站（含时间戳校验，防 EBUSY 假成功） | ✅ 核心 |
| `.github/workflows/deploy.yml` | CI 部署流水线（校验→构建→组装→Pages） | ✅ 核心 |
| `validate-sites.mjs` | **部署前自检闸门**（拦截缺图/缺字段的残缺站）+ 孤儿站点告警 | ✅ 核心 |
| `onboard.mjs` | 客户接入本地服务（端口 4321） | 🟡 工具 |
| `onboarding.html` | 通用 JSON 表单渲染器（替客户填表生成站点） | 🟡 工具 |
| `examples/*.json` | 20 个站点的业务数据（接入新客户改这里） | ✅ 数据源 |
| `src/<template>/` | 8 套行业模板的 React 组件 + App（真实商家垂直站 + 历史样板） | ✅ 核心 |
| `src/sectioned/` | Section Engine 组合器（curated 站统一架构，见 `docs/section-engine.md`） | ✅ 核心 |
| `src/components/visual.tsx` | 共享视觉手法系统（8 组件，从 20 旧站抽取） | ✅ 核心 |
| `assets/<slug>/` | 各站图片源（截图、菜品等） | ✅ 数据源 |
| `output/` | 本地构建产物（gitignore） | ❌ 忽略 |
| `public/` | Actions 组装用中间目录（gitignore） | ❌ 忽略 |
| `index.html` | 门户页（链接 20 个站） | ✅ |
| `README.md` | 入口说明（回链 docs/index.md 与 PROJECT-OVERVIEW） | — |
| `inject-privacy.mjs` | 隐私/注册地址/发票/合同页注入器 | ✅ 辅助 |
| `admin/index.html` + `admin/config.yml` | 客户自助 CMS 后台（Decap CMS + GitHub OAuth）；已降级为内部演示能力（见 `docs/cms.md`、`decisions/ADR006-no-cms-selfservice.md`） | 🟡 可选增项 |
| `gen-decap-config.mjs` | 从 `examples/*.json` 自动生成 `admin/config.yml` 全站字段映射（100% 覆盖、防保存丢字段） | 🟡 工具 |

### PROJS —— 站点清单单一事实源

```
PROJS=( atelier-salon breath-yoga chambers-law creme-dessert forge-trades
        mario-pizza mono-coffee patisserie-v2 sotto-sotto vault-hotel
        morris-coffee holborn-nails ganache indaba-yoga seddons-law
        gower-hotel vale-hardware papa-bruno chinatown-bakery sectioned-demo )
```

共 **20 站**（10 个 curated 样板预设【全部 sectioned】 + 9 个真实商家 demo【morris-coffee 已迁 sectioned、其余 8 个用行业模板】 + 1 个 sectioned-demo 引擎展示），是 `build-clean.sh` 的硬编码数组，是「要构建的站点」**单一事实源**（见 `decisions/ADR002-json-as-source-of-truth.md`）。`validate-sites.mjs` 以它为准；两处脚本开头均有醒目提醒注释。新增真实商家站须同步加进此数组，否则 CI 孤儿闸门会阻断部署（质量闸门详见 `docs/deployment.md`）。

---

*本主题文件由 `docs/workflow.md` v1.1.0 §2/§3 拆分（2026-07-16 MDD 重构）。站点清单与版本脉络以 `docs/PROJECT-OVERVIEW.md` 为准。*
