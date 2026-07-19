# CHANGELOG

> 自动化维护（state-sync 回写），不抄进 docs（Fact only once）。

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
