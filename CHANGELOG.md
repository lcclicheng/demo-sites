# CHANGELOG

> 自动化维护（state-sync 回写），不抄进 docs（Fact only once）。

- 2026-07-22 · **feature — FifthStar 获客融合重构（v0.3 统一冷钩子 + A/B 分叉后移）** — 据用户拍板「融合方案」重构 `products/fifthstar/dual-track-copy-framework.md`（v0.2→v0.3）+ `outreach/send-outreach.mjs`（v2→v3）：
  - **首触冷钩子统一**：全体商户（无论有无官网）首触走同一封邮件——钩子统一为「免费 3 条 Google 评价回复草稿」（内联正文）；Subject 统一 `I drafted replies to your 3 latest Google reviews — free, [Name]`；原 A/B 两套首触合并为 §4 统一首触，开场仅按 track 差一句（有站=网站观察 `[OBSERVATION]` / 无站=「无站、点击没处落」）。
  - **A/B 分叉后移**：有无官网的分叉（A=无站→£590 建站楔子；B=有站→£29/£79 订阅+widget）从首触移到**回信后/跟进阶段**（§5 重构为「跟进阶段 A/B 分叉」+ §7 跟进序列 day10 加 A/B 分支）；首触不再提建站/订阅差异。
  - **线索打标降级为跟进路由**：`has_website` 等字段仍导出，但 `autoTag()` 算出的 `track` 仅用于回信后分叉与 A/B 付费转化追踪（§9 KPI 新增「A/B 分叉付费率」），不再决定首触模板。
  - **脚本落地**：`send-outreach.mjs` 删 `buildBodyA/buildBodyB` 分支，新增 `buildBodyUnified()/buildSubjectUnified()`（全体商户走统一首触）；保留 Track B 人工 `observation` 闸门（§0 #1 / §5.3）；语法校验 + `--dry-run` 双 track 渲染验证通过（Track A 无站开场 / Track B 真实观察开场均正确，复数字 `europeans`→`businesses` 修正）。
  - **获客更 lean**：单钩子 + 单路由（has-site?→A/B），同批商户首触文案同源、合规更稳、A/B 转化率可在跟进阶段干净对比；现有 25 家线索池（19A+6B）已体现融合捕获，无需重构。
  - 待办：真实发送需 `SMTP_PASS` + 用户手动填 B 观察；`outreach/` 整目录 gitignored，源仓仅 `dual-track-copy-framework.md` 跟踪并随本次提交，脚本留本地。

- 2026-07-22 · **feature — FifthStar 工程层 D1–D3 落地（widget / 邀评 / 样例自检）** — 据 `dual-track-copy-framework.md` §10 与战略扩展「已有站→声誉层订阅」落代码：
  - **D1 官网 review widget（§10 #7 已交付）**：新增 `products/fifthstar/widget/review-widget.html`（自包含 embed 片段 + Light/Dark 预览，`currentColor`/`color-mix` 主题自适应、仅真实公开评价、不删差评）+ `widget-delivery-sop.md`（合规 + 首页摆放位置 + Wix/Squarespace/WordPress/Shopify 等粘贴步骤 + 失败回退）。嵌入 JS 语法校验通过。
  - **D2 邀评系统（半自动文件版）**：新增 `products/fifthstar/review-request/templates.md`（9 行业话术 + 合规 + QR 卡规范）+ `gen-request.mjs`（输入 商家名/城市/行业/GBP 链接 → 输出 个性化求评邮件 + 短信 + 可打印 QR 卡 HTML；行业语气表 + 别名映射；SMS 超 160 字告警）。样例跑通（email 371B / SMS 151B / QR 卡生成）。
  - **D3 样例生成工程化验证**：为 `generate_sample.py` 加 `--self-test` 离线模式，覆盖 `normalize_drafts` 全部历史畸形返回形状（raw / json_object / 双编码字符串 / markdown fence / 内嵌 prose / 数组内字符串元素 / 垃圾 / 空串）9/9 通过；真实 API 调用仍待 `DEEPSEEK_API_KEY` 实跑验证。
  - 合规：三者均守住 §0 红线（真实评价、不 incentivize、人工发送、退订/GDPR 由发送脚本承担）。

- 2026-07-21 · **feature — FifthStar 双分线冷外联落代码（A/B 分支 + 单一事实源）** — 据 `products/fifthstar/dual-track-copy-framework.md` v0.2（已审核通过）落地：
  - 新增 `outreach/fifthstar-leads.json` 为**单一事实源**（25 家曼城线索：19 A + 6 B 测试集），取代 `fifthstar-manchester.md` 的 markdown 表格解析；含 `track`/`hasWebsite`/`observation`/`verified` 等字段 + `autoTag()` 备用规则（§1）。
  - 重写 `outreach/send-outreach.mjs`（v2）按 `lead.track` 分支正文：A=§4.1 建站楔子、B=§5.1 声誉引擎（站点不动 + widget）；统一 `standard P.S.`（§6）；`List-Unsubscribe` 头 + `reply STOP` 脚注（§0 #2）。
  - **合规闸门**：Track B 发送前强制 `observation` 人工填（§0 #1 / §5.5），空则 BLOCKED（除非 `--skip-observation-check`）；每跑 `--cap` 默认 25（§0 #3 新发地址保守值）；`--track`/`--test`/`--manual`/`--dry-run`/`--self-test` 过滤与手动控制齐备。
  - 验证：JSON 解析 25/25；`--dry-run --track A` 19 封、`--track B` 6 封全文装配通过；B 观察占位提示 + 空观察 BLOCKED 闸门确认生效。待办：真实发送需 `SMTP_PASS` + 用户手动填 B 观察；本批改动未提交（待用户 review 后 commit/push，SSH 需 dangerouslyDisableSandbox）。

- 2026-07-20 · **feature (v0.10.1) — demo 页面全量 redesign pass（motionsites 思路启发）** — 修复「元素不搭」三类问题，全部 theme-agnostic、不引新引擎：
  - **模板错配修正（4 站）**：`capstone-law`→`law`、`love-yoga`→`yoga`、`atelier-salon`→`salon`、`mario-pizza`→`restaurant`（与同行业其余站统一模板；`generate.mjs` 按模板导出对应 `lawData/yogaData/salonData/restaurantData`，已构建验证）。
  - **每站招牌身份补全（19 站）**：原 `mood:{}` 的 19 个站（含上述 4 站）补 `mood:{sig:'on',...}` 按行业设 deco/hero/cta；至此全部 48 demo 站均有签名标识，统一展示体系。
  - **hero 氛围按行业分档（仅 sectioned）**：`components/sections/Hero.tsx` 加 `deriveBackdrop(sig)`——structural 行业(law/account/estate/hotel/trades)用 `HeroBackdrop variant="grid"` 建筑网格、关呼吸环/粒子；organic/neutral 行业用默认发光+呼吸环+粒子。`d.mood.backdrop:"grid"` 可强制网格。industry 模板各自已硬编码行业签名+背景，无需改动。属借 motionsites「氛围匹配行业」思路、纯用现有工具箱。
  - **澄清**：原审计标记的「hero 文案串味」(CLARITY/CONFIDENCE/RESULTS 出现在牙医/房产站) 为误报——该文案仅在 `heroLines` 数组（law 模板读取、对律所合适），而 sectioned 站用 `heroLine1/heroLine2`（st-giles/hampsons 已是行业合适文案），故未改动文案。
  - 验证：6 站抽样构建（forge-trades/mono-coffee/capstone-law/love-yoga/atelier-salon/mario-pizza）均成功；无类型/模板错误。
  - 文档同步：`docs/architecture.md` Mood 小节补 backdrop 寄存器、`AGENT-ONBOARDING.md` §4 补同述。

- 2026-07-16 · **feature (v4.1)** — 落地 MDD v4 自动化四件套：Router(playbooks/router.md,叠 min-context) + state-sync 脚本 + cross-sync playbook/脚本(并修 Laws 10→13 头体漂移) + ci-contracts 校验(workflow+脚本)

- 2026-07-19 · **security (约定防线 → 技术防线)** · commit `c2549a5` — 接手 agent 风险评审后，把 5 条「约定防线」升级为「技术防线」：
  - `generate.mjs`：加**真实 safe-delete 守卫**（替代原文档虚构的 `SAFE_DELETE_BULK_CONFIRM_REQUIRED`）——`rmSync` 前校验 `projectName` 合规(`^[a-z0-9][a-z0-9-]*$`)且 `outputDir` 严格落在 `output/` 内，否则 `process.exit(1)` 拒删，防 `slug=".."` 越界误删工程。
  - `build-clean.sh`：加**失败闸门**——构建失败 / dist 缺失计数，任一 >0 即 `exit 1`（不再假成功）；刻意不设 `set -e`（避免首个失败即中止循环、隐藏其余站点失败）。
  - `validate-sites.mjs`：加**重复构建目标检测**——遍历 PROJS 各 JSON 归一化 `projectName(slug||name)`，重复即 `exit 1`（防双事实源冲突线上丢站）。
  - `.githooks/pre-commit` + `deploy.yml`：**outreach 泄漏双防线**——本地钩子扫描暂存文件拦截 `outreach/business/business-kit/clients`（`clients/README.md` 例外）；CI 步骤 `git ls-files` 扫敏感目录兜底 `exit 1`。
  - `deploy.yml`：`upload-pages-artifact` 加 `retention-days: 30`（保留期可 Re-run 历史 Deploy 回滚）；`AGENT-ONBOARDING.md` 补 §11 回滚方案 + 修正虚构守卫描述。
  - 验证：`node --check` / `bash -n` 通过；safe-delete 守卫对 `".."` 拒删；`validate-sites.mjs` 实跑 45 站 exit 0；push 后线上 sitemap 46 条全 200 无漏站。
  - 注：本次**仅改 CI/守卫逻辑，未动站点 HTML**，线上内容与上一成功部署一致。

- 2026-07-19 · **feature (v0.10) — 每站美感独立深化：Mood 系统** · commit `dfe516d` — 给 Day1–4 外联 20 个 demo 站加数据驱动个性层 `mood`（借三素材库思路原创实现，不复制原料、不硬编码色、theme-agnostic）：
  - `src/components/visual.tsx`：加 `MOODS`+`getMood()`(兜底默认) + `HeroBackdrop` 接 `mood`(deco) 调装饰密度 + 新增 `SignatureDivider` 第二招牌分隔条。
  - `generate.mjs` `VISUAL_CSS`：glow-blob 基础透明度移出内联（改类，mood 可调）+ `deco-*` 规则 + `.sig-divider` + `.mood-reveal`（含 `prefers-reduced-motion` 降级）。
  - `components/sections/Hero.tsx`：hero 构图 `center`/`asym`/`split`（asym 兼容旧 `designVariant:'B'`）+ Hero 底部插 `SignatureDivider` + `SignatureMark` 加 `mood-reveal` 微交互。
  - `components/sections/shared.tsx` `CtaButtons`：接 `cta` 切 `fill`/`outline`/`ghost`。
  - legacy 8 套模板仅在 `HeroBackdrop` 接 `mood={(d as any).mood?.deco}`（最小安全改动，不碰硬编码 CTA/布局；`as const` 类型用 `any` 兜底，缺 mood 的站点不报错）。
  - `examples/` 20 个 Day1–4 JSON 加 `mood`，同行业对（咖啡/瑜伽/法律/沙龙/甜点）刻意错开 deco/hero/cta 保证辨识度；其余 25 站缺省走 balanced/center/fill 默认，视觉不变。
  - 验证：3 站抽样构建（morris=sectioned-rich-asym、seddons=legacy-balanced-outline、foxglove=sectioned-split-ghost）成功；CSS 含 glow-blob/deco-rich/deco-minimal/sig-divider/mood-reveal；JS 编译 sig-divider+mood-reveal 入 bundle。
  - 文档同步：`AGENT-ONBOARDING.md` §4 + `docs/architecture.md` 新增 Mood 子系统小节（改动→文档映射见 §12）。

- 2026-07-20 · **feature (产品融合) — ReplyLocal 声誉管家并入建站项目** · commit `5b20377` — 把昨晚立项的「UK 商户 AI 声誉管家 / ReplyLocal」（**品牌后于 `1d4bc3d` 更正为 FifthStar**）作为**第二条产品线（冷启动楔子）**并入 gh-pages-build：
  - 资产移入 `products/reputation-manager/`（strategy.md 方案 / replylocal-landing.html 落地页 / outreach-template.md 外联模板 / case-research.md 案例依据 / README.md 索引）。
  - `docs/pricing.md`：新增「声誉管家订阅」档（免费样例 £0 / Starter £29/月 / Pro £79/月），定位为零客户冷启动楔子 + 月收入层，衔接 A/B/C 建站阶梯。
  - `business/product-matrix.md`（gitignored 本地）：新增「双产品线」框架（声誉管家楔子 + 建站主业务）与上升阶梯。
  - `business/README.md` + `docs/PROJECT-OVERVIEW.md`：定位更新为「建站 + 声誉管家」一体业务；目录结构补 `products/reputation-manager/`；§6 增 §6.6 声誉管家订阅。
  - 注：本次仅并入资产 + 文档，**未上线落地页、未改 Day1 外联钩子**（方案 3 待定项：产品名 / 首发垂直+城市 / 首档位 未拍板）。公开单一事实源 = pricing.md + PROJECT-OVERVIEW.md + products/。

- 2026-07-20 · **refactor (产品融合校正) — 品牌 ReplyLocal→FifthStar + 双仓独立** · commit `1d4bc3d` — 校正 `5b20377` 误用早期探索名、未含真实资产的问题：
  - `git mv products/reputation-manager → products/fifthstar`；删除 superseded `replylocal-landing.html`；拷贝真实 FifthStar 资产（outreach-template / sample-pipeline / generate_sample.py，来自 `2026-07-19-22-23-37/`）。
  - 修正 `strategy.md` / `README.md` 品牌与「待拍板」为已定（FifthStar / 曼城独立餐厅 / 免费+£29）。
  - 同步 `docs/pricing.md` + `docs/PROJECT-OVERVIEW.md` 引用（ReplyLocal→FifthStar，路径→products/fifthstar）；business 本地双文档同步。
  - 落实指令 C **双管齐下 / 双仓独立**：FifthStar 落地页由独立仓 `thefifthstar` 承载（curl 200），gh-pages-build 仅作内部策略源；建站轨照 `outreach/发送排期.md` 发，FifthStar 轨用 940 曼城线索另起。

- 2026-07-23 · **sync (FifthStar 落地页) — 线上仓 GSAP 动效 + 无障碍修复回灌源仓** · commit `7905020` — 用户在线下改了线上仓 `thefifthstar` 的 `index.html`（3 提交 `35e462c..de52bc6`：hero GSAP timeline + SplitText 标题逐字 + scroll reveals + a11y 修复 h4→h3 / 亮色 gold 对比 #9a7416→#8a6712 / nav 点击区 min-height:2.75rem），源仓 `integrated-offer.html` 未同步，下次从源仓构建会冲掉这些优化。本次把同等改动 port 回源仓 `products/fifthstar/integrated-offer.html`（已 `diff -w` 校验与线上内容完全一致，仅行尾 CRLF/LF 差异）。GSAP 走 jsDelivr CDN 3.13.0，含 reduced-motion / CDN 失败 / try-catch 三重兜底（任何失败都不隐藏内容）。
  - 提醒：页面由此引入 GSAP 外部依赖（此前为零依赖原生 CSS 动效），偏离"零依赖"原则但属可选增强；从源仓构建部署后线上与源仓即对齐，源仓重新成为唯一事实源。

- 2026-07-23 · **enhancement (FifthStar 落地页) — GSAP 动效精进 + 自托管** · 源仓 `b5ae4d8` / 线上仓 `280db07` — 在已回灌的 GSAP 版基础上做两件事：
  - **动效精进**：① hero 入场由 `.from` 改为 `.fromTo`，并在 `<head>` 内联脚本于绘制前给 hero 目标加 `gsap-hero` 类 + CSS `opacity:0` 预隐藏，彻底消除"先可见→再隐藏→再动画"的 FOUC 闪烁；② 新增 `document.fonts.ready → ScrollTrigger.refresh()`，修复 Playfair 字体异步加载后标题逐字(char split)的回流跳动；③ 给两处签名水印 `.sig-watermark` 加 ScrollTrigger `scrub` 轻微视差（纯装饰、无 FOUC）；④ SplitText 触发点 `top 85%`→`top 90%`，使逐字与父级 `.reveal` 渐显更协调。
  - **GSAP 自托管**：将 `gsap@3.13.0` 的 `gsap.min.js` / `ScrollTrigger.min.js` / `SplitText.min.js`（共 ~124KB）下载进 `products/fifthstar/vendor/`，页面 3 个 `<script src>` 由 jsDelivr CDN 改为本地相对路径 `vendor/...`。收益：零第三方请求、GDPR 干净、不怕 CDN 宕机、仍零服务器。三重兜底（reduced-motion / 脚本缺失 / try-catch）全保留；新增 `bail()` 在任一非动画退出路径移除 `gsap-hero` 类，确保 GSAP 失败或被禁用时 hero 始终可见（渐进增强）。
  - **部署说明**：FifthStar 不走 demo-sites 的 `deploy.yml`（那是给 10 个 example 站的），而是手动把 `integrated-offer.html`→`thefifthstar` 仓 `index.html`、并把 `vendor/` 一并拷入。本次已同步 `thefifthstar-live` 仓（`index.html` + `integrated-offer.html` 备份 + `vendor/`，`CNAME=thefifthstar.site` 不变）。
  - 提醒：自托管后页面仍为零运行时框架依赖，仅含 3 个静态 JS 文件；将来升级 GSAP 版本需重新下载覆盖 `vendor/` 三文件。

- 2026-07-23 · **enhancement (FifthStar 落地页) — noscript 兜底 + "How to pay" 段** · 源仓 `a3037fa` / 线上仓 `3ce4d4f` — 两项收尾：
  - **noscript 兜底**：`<head>` 内加 `<noscript><style>.reveal{opacity:1!important;transform:none!important;transition:none!important}</style></noscript>`。JS 禁用时所有 `.reveal` 渐显块直接可见，杜绝"无 JS 整页空白"。hero 因 `gsap-hero` 类只由 JS 添加、JS 关则不加，本就可见，无需额外处理。
  - **"How to pay" 段**：定价区（tiers 之下、pay-when-happy 横幅之上）新增收款方式说明卡——全走 PayPal，支持任意英国卡(Visa/Mastercard)/PayPal 余额、无需注册、邮件发账单、卡信息不经手我方；Starter/Pro 月付可随时取消、£590 一次性仅在预览满意后出账单。口吻自然（英文 Ethan 风、去 AI 化），与页面其余文案一致。
