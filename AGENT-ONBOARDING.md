# AGENT-ONBOARDING · 项目接手指南（给协作智能体）

> 本文件让任何新接入的智能体在 5 分钟内接管本项目。**先读「0. 立刻要知道的 5 条铁律」，再读「当前状态」决定下一步。**
> 配套长期记忆：`D:\workbuddy项目\2026-07-07-09-02-15\.workbuddy\memory\MEMORY.md`（已自动注入）+ 每日日志 `2026-MM-DD.md`。
> 设计任务必须先加载 skill：`independent-site-design`（见 §6）。

---

## 0. 立刻要知道的 5 条铁律（防复踩，违反任一条都会出事故）

1. **线上 URL 用 `examples/<x>.json` 的 `slug` 字段，不是 `build-clean.sh` 的 PROJS key。**
   例如 `breath-yoga`→`/breath/`、`vault-hotel`→`/vault/`、`atelier-salon`→`/atelier/`、`creme-dessert`→`/creme/`、`forge-trades`→`/forge/`、`mario-pizza`→`/mario/`、`mono-coffee`→`/mono/`、`patisserie-v2`→`/patisserie/`、`chambers-law`→`/chambers/`。
   用 PROJS key 去核对线上会**误报 404**。核对线上一律用 `slug`。

2. **`build-clean.sh` 没有 `set -e`** —— 单站构建失败只打 `❌` 仍 `exit 0`，Actions 显示 `success` 却可能漏站。
   部署后**必须**核对 sitemap 实际条数 + 抽查若干站 HTTP 200，不能只看 Actions 绿勾。

3. **`generate.mjs` 有真实 safe-delete 守卫**：构建前校验 `projectName` 合规（`^[a-z0-9][a-z0-9-]*$`）且 `outputDir` 确实落在 `output/` 内，否则 `process.exit(1)` 拒绝删除。
   这防止 `slug`/`name` 异常（如 `".."`）让 `rmSync` 递归误删整个工程。重置 output 用 `mv output ../oldbuild_<时间戳>` + `mkdir output` 即可（rename 非 delete）。**禁用 `rm -rf output/*`**（既无必要也破坏守卫语义）。

4. **git push 走 SSH（`github.com` → `ssh.github.com:443`），WorkBuddy Bash 沙箱会拦截读 `~/.ssh/config`**。
   所有 `git push`（或任何走 ssh config 的 git 操作）**必须带 `dangerouslyDisableSandbox:true`**，否则回退 `github.com:22` 被墙报 `Connection refused`。SSH 公钥已注册，无需 PAT。

5. **`outreach/` 整目录 gitignored（含 30 家真实商家邮箱/发送排期）**——这是私有 CRM，**绝不可 `git add -A`**，否则真实邮箱泄漏到公开仓库。提交只加明确指定的文件。

---

## 1. 项目一句话定位

一人公司 **lcclicheng**，面向英国小商家（餐饮/沙龙/酒店/律所/瑜伽/家装/会计/牙科/房产/民宿等）做**高端建站**。
技术栈：**Vite + React18 + TS + Tailwind v3** 模板引擎 + 行业样板站；填内容一键生成、GitHub Pages **零服务器**部署。
仓库 `lcclicheng/demo-sites`（本地 `gh-pages-build/`）。SSH 推送触发 Actions：**校验 → 全量构建 → 组装 public/ → 冒烟测试 → 部署**。

---

## 2. 目录地图（只看有意义的，已排除构建产物）

```
gh-pages-build/
├── AGENT-ONBOARDING.md      ← 本文件（agent 接手总纲）
├── generate.mjs             ★ 模板引擎主入口：node generate.mjs ./examples/<slug>.json 单站构建；含 THEMES / VISUAL_CSS 注入
├── build-clean.sh           ★ 全量构建脚本：PROJS 唯一事实源，循环构建 45 站 + dist 校验（无 set -e，见铁律2）
├── gen-seo.mjs              sitemap/SEO 生成（按 PROJS 全量列，含未构建成功者——故 sitemap 条数≠实际上线数，见铁律2）
├── validate-sites.mjs       部署前校验门（本地先跑，EXIT=0 才 push）
├── health-check.mjs / smoke-test.mjs   P3 监控 / 部署后冒烟
├── vite.config.ts / tailwind.config.js / postcss.config.js  构建配置
├── README.md / CHANGELOG.md / PROJECT-OVERVIEW.md / index.html(门户) / .gitignore / .nojekyll
├── .ai/                     AI 协作规范（ai-guidelines/loading-protocol/architect/designer/frontend/backend/seo）
├── .github/workflows/       deploy.yml(主管线) / consistency-check.yml / health-check.yml
├── docs/                    最终版文档系统（27 篇 + 项目运营手册.html）；过程稿暂留未清
├── business/        🔒 BOS 业务运营框架（10 篇，gitignored）
├── business-kit/    🔒 客户交付模板工具包（合同/提案/隐私政策/话术/定价，gitignored）
├── checklists/      部署/新客户/发布 3 个检查清单
├── clients/         🔒 客户档案（仅 sotto-sotto 样例；feedback 等 gitignored）
├── contracts/       Schema 单一事实源（business-json/section-data/theme）
├── decisions/       6 个 ADR（ADR001~006：GitHub Pages / JSON 源 / Tailwind v3 / section-engine / SSH / 无自助 CMS）
├── deploy/vercel/   Vercel 备选部署（vercel.json + api/contact.js）
├── knowledge/       8 行业文案库（coffee/dessert/hotel/law/restaurant/salon/trades/yoga，各 hero/cta/faq/seo）
├── memory/          MDD v4 状态层（core 稳定 / runtime 易变）
├── outreach/        🔒 外联 CRM 完整系统（整目录 gitignored，见铁律5）
├── playbooks/       7 个操作手册（cross-sync/deploy/maintenance/new-client/release/router/seo）
├── scripts/         校验/同步脚本（check-contracts/cross-sync-check/state-sync）
├── src/             ★ 模板引擎源码（见 §5）
├── state/           6 个运行时状态文件
├── tasks/           任务追踪（done/7 · todo/3 · router-template）
├── templates/       模板库说明 README
├── examples/        ★ 45 个站点 JSON（构建事实源，含 slug 字段——见铁律1）
├── assets/          11 家商家图片（og.jpg 等）
└── blog/            博客管线（README + 样例）

uk-biz-finder/       （同级，独立工具）英国商家批量搜索（Overpass/OSM），非本仓库
```

🔒 = gitignored（客户/内部/隐私数据，不进公开仓库）。

---

## 3. 构建 / 部署流程（唯一正确路径）

**事实源**：`build-clean.sh` 里的 `PROJS` 数组 = 全站重建唯一清单（当前 45 站）。
**站点内容源**：`examples/<slug>.json`（每个站一个，含 `slug`/`businessType`/`name`/`theme`/`signature` 等）。

- **单站构建**：`node generate.mjs ./examples/<slug>.json` → 产物 `output/<slug>/dist/`
- **全量构建**：`bash build-clean.sh`（循环 PROJS；构建后 grep `output/<slug>/dist/assets/*.css` 确认成功——因铁律2 假阳性）
- **本地校验**：`node validate-sites.mjs`（EXIT=0 才能 push）
- **部署**：仅 `git add` 指定源文件（**绝不 -A**）→ `git commit` → `git push origin main`（**必须 `dangerouslyDisableSandbox:true`**）→ Actions 自动跑完上线
- **线上核对**：取各站 `slug` 拼 `https://lcclicheng.github.io/demo-sites/<slug>/`，查 HTTP 200 + 抽查 CSS 含 `sig-watermark`（招牌系统标记）

> 本地 `output/`、`node_modules/`、`public/`、`build-logs/` 全 gitignored；你本地改的是**源文件**，Actions 从源重建。

---

## 4. 视觉系统（已落地，遵守 theme-agnostic）

`src/components/visual.tsx` 是共享视觉核心，**所有组件不得硬编码品牌色**：
- 用 `currentColor` + `color-mix` 跟随主题（每个站 THEMES 覆盖 `accent`，亮暗/多品牌色通用）。
- **招牌签名系统**（本项目的 IP）：17 个行业 SVG motif（`brew/breath/monogram/confetti/plate/sheen/forge/grid/pulse/bloom/aperture/paw/page/key/ledger/smile/razor`），全部 `stroke="currentColor"`；`deriveSignature(d)` 自动映射（优先 `signature` 字段）；`HeroBackdrop` 有 `signature` 水印层；sectioned 站另有焦点 `SignatureMark`。
- `generate.mjs` 的 `VISUAL_CSS` 注入 11 个招牌 keyframes（float/breathe/spin/sweep/twinkle/rise/draw/bloom/bob/steam）+ `prefers-reduced-motion` 降级。
- ❌ 禁止 JSX 内联 `<style>` 逃避 THEMES 替换（换肤不生效且泄漏旧色进共享模板站）。

---

## 5. src/ 模板源码结构

```
src/
├── main.tsx / App.tsx / business-data.ts / index.css
├── coffee/ dessert/ hotel/ law/ restaurant/ salon/ trades/ yoga/   8 个 legacy 行业模板（各 App.tsx + business-data.ts，有专属调色板）
├── sectioned/        ★ 新统一范式（26 站），3 色系统 surface/ink/accent + 共享 visual.tsx，逐站 THEMES 覆盖 accent
└── components/
    ├── visual.tsx        ★ 招牌签名系统（17 motif + deriveSignature + SignatureMark/SignatureMotif + HeroBackdrop 水印）
    └── sections/         12 区块（Hero/Footer/Menu/Gallery/Booking/Faq/Reviews/Story/Team/Location/Instagram/InfoBar）+ shared.tsx/types.tsx/index.tsx
```
> 改动视觉/招牌：优先改 `visual.tsx` + `generate.mjs` 的 `VISUAL_CSS` + `components/sections/Hero.tsx`，再按 §3 重建部署。

---

## 6. 设计任务必用 skill：`independent-site-design`

**所有「建站 / 重做页面 / 设计落地页 / 参考 motionsites·react-bits·uiverse」类任务，先加载此 skill。**
四层融合：①编辑型主题无关视觉语言 ②每页招牌 signature motif 系统（§4）③三个设计素材库（motionsites 布局提示词 / react-bits 动效组件 / uiverse 原子控件，以 query 命令引用、不复制数据）④gh-pages-build 构建部署集成。

**铁律 7（差异化、禁止直接复制）**：三素材库**只作灵感源**——motionsites 借布局模式/节奏、react-bits 借动效思路、uiverse 借结构骨架，全部按本 skill 视觉语言**重写实现**，最终产出**完全差异化、原创**，肉眼上不应认出是某素材库条目的复制品。判定标准：能认出复制品即违规。

---

## 7. 当前状态（2026-07-19，接手后从哪继续）

**✅ 已完成**
- 45 个 demo 站全部带主题自适应招牌 motif，已部署上线（Actions run #78 success）。
- 独立站设计 skill（融合三素材库 + 本项目视觉沉淀 + 差异化铁律）已建并校验 valid。
- 项目文档已归类收敛：根目录散落旧文档/草稿脚本删清，13 个 oldbuild trash + 20 个早期原型目录删清，`business-kit` 归位 `gh-pages-build/` 并 gitignore，`outreach/` 整目录 gitignore（修复泄漏隐患）。
- 30 家外联池：邮箱核实 **27 家可直接发 + 3 家待 GMB**（SERENITY / PEDN OLVA / THE SYCAMORE）。SERENITY、PEDN OLVA 的 GMB 留言体已写（`outreach/GMB留言体_SERENITY_PEDNOLVA.md`）。
- 本地未 push 的 commit：`d20962b`（.gitignore 收紧）、`ab006e9`（删草稿脚本 + 运营手册归位）——只动忽略/文档，**push 安全、不会动线上站点**，但会触发一次 45 站重建（可接受）。

**🟡 进行中 / 待办（接手即办）**
- **外联发送启动**：排期 07-20~07-23 发 Day1–4 前 20 家（5 家/天，手动分散发）；07-24 起核完 #21–30 后续发 C 类。
  - Day1(07-20)：KAFFEINE(邮)/**SERENITY(GMB留言)**/PRESTAT(邮)/INDABA(邮)/SEDDONS(邮)
  - Day2(07-21)：SUNDARA/RED LION/TWISTED SISTER/**CLAREMONT(官网 Cloudflare 拦截，需人工复核)**/TABITHA'S
  - Day3(07-22)：**PEDN OLVA(GMB留言)**/LA PIAZZA 1/MANCHESTER PLUMBING/BLUE BIRD/BRIGHTON FLOWER
  - Day4(07-23)：MR BEARDMORES/SIMFIT/BLUE SKY/HAIR AND HOUNDS/LITTLE APPLE
- **待人工**：CLAREMONT 官网复核；SYCAMORE 走 GMB 拉邮箱（或跳过）。
- **后续模板**：B 类首触+4天 / C 类确认采集邮件，等首批回信后起草；商家同意后的替换上线；P0 真实回复校验 ICP。

---

## 8. 记忆系统（让 agent 持续对齐上下文）

- **自动注入**：`.workbuddy/memory/MEMORY.md`（项目长期记忆，含铁律/定价/视觉系统/部署坑）。
- **每日日志**：`.workbuddy/memory/2026-MM-DD.md`（追加式，不可覆盖）。
- **跨项目偏好**：`~/.workbuddy/MEMORY.md`（Ethan Li 署名、SSH 443 沙箱坑、文件全放 D 盘、MDD v4 等）。
- 新 agent 第一件事：读 `MEMORY.md` + 今日日志 + 本文件，再动手。

---

## 9. 常用命令速查

```bash
# 本地全量构建（产出 output/<slug>/dist）
cd gh-pages-build && bash build-clean.sh

# 单站构建
node generate.mjs ./examples/<slug>.json

# 部署前校验
node validate-sites.mjs

# 提交（只加指定文件，绝不 -A）
git add <具体文件...> && git commit -m "..."

# 推送（必须沙箱外，触发 Actions 部署）
git push origin main   # 调用时 dangerouslyDisableSandbox:true

# 线上核对（用 slug，不是 PROJS key）
curl -s -o /dev/null -w "%{http_code}" https://lcclicheng.github.io/demo-sites/<slug>/
```

---

## 10. 禁做清单（红线）

- ❌ `git add -A` / `git add .`（会泄漏 `outreach/` 真实邮箱 / 推上 `business-kit`）
- ❌ 用 PROJS key 去核对线上 URL（用 `slug`）
- ❌ 只看 Actions 绿勾就认为全站上线（必核 sitemap 条数 + 抽查 HTTP 200）
- ❌ `rm -rf output/*`（破坏守卫语义且危险）；重置用 `mv output ../oldbuild_<时间戳>` + `mkdir output`
- ❌ `git push` 不带 `dangerouslyDisableSandbox:true`（SSH 443 通道，沙箱拦截会 Connection refused）
- ❌ 设计任务直接复制 motionsites/react-bits/uiverse 的代码（必须差异化重写，见 §6 铁律 7）
- ❌ 在 JSX 内联 `<style>` 逃避主题替换
- ❌ 改动 `outreach/`、`business/`、`business-kit/`、`clients/`（私有数据，且 gitignored——改了也不进仓库，应在本地商定流程）

---

## 11. 部署回滚（#278：无回滚机制的技术防线）

GitHub Pages 部署是「覆盖式」——每次 push 都替换线上。以下三种回滚路径按速度排序：

1. **最快：revert 提交重推（推荐）**
   ```bash
   git revert <坏提交>          # 生成反向提交
   git push origin main          # 必须 dangerouslyDisableSandbox:true
   ```
   Actions 重新跑一遍（45 站重建，约数分钟），线上回到坏提交前状态。

2. **保留期内直接重跑旧部署（无需改源码）**
   Pages artifact 已设 `retention-days: 30`（deploy.yml）。仓库 **Actions → 选历史成功的 Deploy run → "Re-run all jobs"** 即可把那次产物重新部署上线，不动 git 历史。适合「源码没问题、只是本次构建抽风」。

3. **定点修源码再 push**
   已知坏在哪，直接改 `examples/<slug>.json` 或 `generate.mjs` 修好 → commit → push，等同回滚+修复。

> 防漏站：回滚/重部署后，**必须**核对 sitemap 实际条数 + 抽查若干站 HTTP 200（铁律2），不能只看 Actions 绿勾。
```
