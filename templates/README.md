# 行业模板库（Template Library）

> **本目录是「行业模板起点库」的索引与约定**，不是模板代码的物理副本。实际模板组件在 `src/<template>/`（见下表），这样避免复制导致与 `src/` 漂移。要起新行业，按下方「如何基于现有模板起一个新行业」操作。

## 现有 8 套模板（指向 `src/`）

| 模板名（`data.template`） | 行业 | 组件位置 | 示例数据（`examples/`） |
|---|---|---|---|
| `restaurant` | 餐饮 | `src/restaurant/` | `sotto-sotto.json` / `mario-pizza.json` |
| `coffee` | 咖啡 | `src/coffee/` | `mono-coffee.json` |
| `salon` | 沙龙 | `src/salon/` | `atelier-salon.json` |
| `dessert` | 甜品 | `src/dessert/` | `creme-dessert.json` / `patisserie-v2.json` |
| `yoga` | 瑜伽 | `src/yoga/` | `breath-yoga.json` |
| `law` | 律所 | `src/law/` | `chambers-law.json` |
| `hotel` | 酒店 | `src/hotel/` | `vault-hotel.json` |
| `trades` | 家装 / 维修 | `src/trades/` | `forge-trades.json` |

每套模板目录含：`App.tsx`（行业 UI 组件）+ `business-data.ts`（被 `generate.mjs` 注入业务数据的类型/结构）。具体字段由对应的 `examples/<slug>.json` 决定。

## 如何基于现有模板起一个新行业

1. **选最贴近的现有模板**（如新「酒吧」选 `restaurant`，新「健身房」选 `yoga`）。
2. **复制组件**：`src/<相近模板>/` → `src/<新模板名>/`，改 `App.tsx` 的行业文案与区块结构。
3. **复制示例数据**：一份 `examples/<slug>.json`，把 `template` 改成新模板名、`slug` 改成新 slug、填业务数据（字段清单见 `docs/workflow.md` §11「新增行业模板 SOP」）。
4. **注册主题**：在 `generate.mjs` 的 `THEMES` 映射加新键（键名必须 = slug 值，否则主题丢失）。
5. **走 SOP 验证**：字段 / SEO / 隐私 / CMS / 测试 五项 checklist（同上 §11），跑 `validate-sites.mjs` + 单站 `generate.mjs` 确认通过。

## 可复用的核心工具

- `generate.mjs` — 单站构建引擎（读 JSON → 注入 → vite build）
- `onboard.mjs` + `onboarding.html` — 客户接入填表生成（端口 4321）
- `gen-decap-config.mjs` — 自动生成 Decap CMS 字段映射（100% 覆盖防丢字段）
- `validate-sites.mjs` — 部署前校验闸门（缺图 / 缺字段 / 孤儿站点）
- `inject-privacy.mjs` — 隐私 / 注册地址 / 发票 / 合同页注入
- `src/components/visual.tsx` — **共享视觉手法库**（HeroBackdrop[default|grid] / StatsStrip / GradientText / GlassCard / ConfettiBg / SquareMonogram / Eyebrow），从 20 个旧站（`premium-*`/`bento-dashboard`/`vanguard-landing` 等）抽取沉淀；全 `currentColor`+`color-mix` 主题自适应，亮暗模板通用；构建时由 `generate.mjs` 注入 `VISUAL_CSS` + `copyDir` 拷贝进每站。全 8 套模板 hero 现已注入发光背景+呼吸环+粒子、流光标题（restaurant 在 v0.9.7 已补齐为最后一站：HeroBackdrop+GradientText，与其余 7 套一致；此前保留原生等效手法）；GlassCard 已实际用于 trades 评价卡片（信任区块磨砂面板）、ConfettiBg 已实际用于 dessert 下单区（点阵纹理）；SquareMonogram 已实际用于 salon 造型师/yoga 老师（方形首字母替代圆头像，editorial 编辑感）；HeroBackdrop variant="grid"（bento-dashboard 建筑感点阵网格）已用于 hotel hero；Eyebrow 因各模板已手写 kicker+分隔线，暂不强制使用

## 约定与红线

- **不物理复制 8 套到本目录**：避免与 `src/` 漂移；本目录只做索引 + SOP 起点。
- 8 套模板的「去敏干净 starter 副本」提取为独立包可作为后续优化（见 `docs/workflow.md` §11 待办），届时再评估是否落地。
- 新增 / 修改模板后务必同步 `build-clean.sh` 的 `PROJS`（用 `onboard.mjs` 生成会自动写）。
