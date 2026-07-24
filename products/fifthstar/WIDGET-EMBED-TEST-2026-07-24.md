# FifthStar · B 轨 widget 实际嵌入测试（#434）

> 日期：2026-07-24 · 任务 #434
> 范围：B 轨（Track B / Reputation £39）review widget 的真实嵌入测试 + AI 回评闭环演示

## 1. 目的

B 轨卖点是「GBP 评价监测 + AI 回评草稿」闭环，但此前线上资产只有「评价展示」widget
（`widget/review-widget.html`），且从未在一个**真实网页环境**里验证过嵌入渲染。本任务：
1. 构建一个可上线的模拟商户站演示页，**真实嵌入** review widget snippet；
2. 补上「AI 回评草稿」闭环组件（评价 → 草稿 → 采纳），补齐 B 轨卖点可视化；
3. 用 jsdom 实际加载页面跑 widget IIFE，断言渲染正确。

## 2. 交付物

- `products/fifthstar/reputation-demo/index.html`（源仓）— 模拟 "The Copper Kettle" 餐厅官网，
  真实嵌入 review widget + 自建「AI 回评草稿」闭环组件（纯前端交互：采纳/编辑/驳回）。
  已 port 到 `thefifthstar-live/reputation-demo/` → **线上 `https://thefifthstar.site/reputation-demo/`**。
- 演示页用 `currentColor`/`color-mix` 主题自适应，与现有 widget 视觉一致；顶部 DEMO 横幅明确标注非真实客户。

## 3. 测试方法与结果

用 `jsdom` 实际加载页面、`runScripts: dangerously` 跑 widget IIFE（非静态审查）。

### 3.1 演示页 `reputation-demo/index.html` — 7/7 PASS
| 项 | 结果 |
|---|---|
| widget 根含 `.fs-rw` 类 | PASS |
| 评价卡渲染数 == 4（maxReviews=4） | PASS（初测 0，修复后 4） |
| 首卡 aria-label `5 out of 5` | PASS |
| 归因链接指向 thefifthstar.site | PASS |
| config.businessName == The Copper Kettle | PASS |
| 回评闭环草稿存在 | PASS |
| 点击 Approve → 状态显示 | PASS |

### 3.2 两个源文件复测 — 均 PASS
- `widget/review-widget.html` → 4 张评价卡（修复前 0）
- `rehearsal/jadugar-delivery-preview.html` → 3 张评价卡（修复前 0）

## 4. 发现并修复的 BUG（关键）

**症状**：widget 在真实页面里渲染出**空卡（0 张评价）**，只有 FifthStar 署名脚注。

**根因**：`window.FIFTHSTAR_REVIEW_WIDGET` 的 config `<script>` 放在 widget IIFE **之后**，
而 IIFE 是**同步**读取 `window.FIFTHSTAR_REVIEW_WIDGET` 的——执行时 config 尚未赋值，
CFG 为 `{}`，`reviews` 为空 → 渲染空。

**影响范围**：不止演示页——`widget/review-widget.html` 与 `rehearsal/jadugar-delivery-preview.html`
两个源文件都是这个错误顺序，**所有 B 轨交付的 widget 都会渲染空**（商户粘进去看不到任何评价）。

**修复**：
1. 三个文件（演示页 + `review-widget.html` + `jadugar-delivery-preview.html`）把 config
   `<script>` 移到 EMBED SNIPPET **之前**。
2. 修正 `widget-delivery-sop.md` §1 步 4 的歧义注释（原写「above or below」，自相矛盾且实际
   放在 below 导致 bug）→ 明确「config **必须**放 snippet 之前，IIFE 同步读 CFG」。

## 5. 部署

- 源仓提交：`reputation-demo/` + 三个文件顺序修复 + 本测试报告。
- 线上仓：`thefifthstar-live/reputation-demo/` 经 port 部署 → `https://thefifthstar.site/reputation-demo/`。
- 线上 curl 复核（绕 Cloudflare `?v=`）：页面 200、含 `#fifthstar-reviews`、回评闭环 DOM 在位。

## 6. 结论

B 轨 widget 现在可真实嵌入并正确渲染，且补上了缺失的「AI 回评草稿」闭环演示。
**顺带修掉了一个会导致所有 B 轨交付失效的嵌入顺序 BUG**——这是本任务最大价值。
全站 B 轨交付链路（D1 widget 嵌入）现经实测可用。
