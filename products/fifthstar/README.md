# FifthStar · 声誉管家产品线（并入建站项目）

> 并入日期：2026-07-20 ｜ 品牌：**FifthStar**（"Lift your business to its fifth star"，hello@thefifthstar.site）
> 定位：**第二条产品线 / 冷启动楔子**——与 Website 建站共用一套获客与部署机器，先用「免费帮商户回 Google 评价」拿下零客户与现金流，再 upsell 到建站。
> **双仓独立（2026-07-20 决策）**：线上落地页由独立仓 `lcclicheng/thefifthstar` 承载（已部署，curl 实测 HTTP 200）；本目录仅作 gh-pages-build 内部策略源，不部署、不污染公开 demo 仓。

## 双管齐下模型（2026-07-20 指令 C）
- **轨 A · FifthStar（战略主线 / 冷启动楔子）**：用 940 家曼城独立餐厅线索（本地 CSV，不进公开仓），钩子=免费 3 条评价回复样例 → £29/月 Starter → £79/月 Pro → 信任后 upsell £590 建站 + £390/年 Care。城市饱和打法：Manchester→Birmingham→Leeds→Bristol→Liverpool→Edinburgh。
- **轨 B · 建站 demo（并行）**：`outreach/发送排期.md` 的 20 家 UK 商家，已建好 demo，按原排期发（Day1=5 家）；在双管齐下下作为建站 upsell 池 / 并行展示。

## 本目录资产（真实 FifthStar 资产）
| 文件 | 内容 |
|---|---|
| `strategy.md` | 立项方案（产品定义 / 楔子→建站阶梯 / MVP / 定价 / 30–90 天 / 风险红线） |
| `outreach-template.md` | 英文冷外联模板（6 段框架，钩子=免费 3 条评价回复样例；城市饱和打法） |
| `sample-pipeline.md` | 免费样例生成 SOP（拿评价→生成→渲染 one-pager→接进外联） |
| `generate_sample.py` | 样例生成器（适配 DeepSeek，需 `DEEPSEEK_API_KEY`，未实测） |
| `case-research.md` | 立项依据（80 例 Starter Story 数据深挖） |

## 外部真实资产（不进公开仓）
- 线上落地页：`https://thefifthstar.site/`（独立仓 `lcclicheng/thefifthstar`）
- 940 曼城线索：`2026-07-19-22-23-37/FifthStar_Manchester_leads.csv`（本地，gitignored）
- 样例演示页：`2026-07-19-22-23-37/FifthStar_样例演示.html`

## 与建站项目的关系
- **复用**：`uk-biz-outreach` 外联框架、`uk-biz-site-asset-pipeline` 资产流水线、Vite+React+Tailwind 引擎经验、GitHub Pages 零托管、A/B/C 定价调性、SSH 443 部署经验。
- **不重造**：获客 / 部署 / 定价 / 调性全部现成，只是多装一个更强的前端钩子 + 订阅引擎。

## 当前状态（2026-07-20）
品牌已定 **FifthStar**；落地页已上线（独立仓）；Day1 按**双轨并行**——建站轨照原排期发，FifthStar 轨今天另起（用 940 曼城线索）。下一步：跑通 `generate_sample.py` 真实样例 → 首发曼城批次。
