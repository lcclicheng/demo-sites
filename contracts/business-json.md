# Contract · Business JSON（`examples/<slug>.json`）

> **身份**：每站的「业务摄入文件」，Git 跟踪、无数据库（ADR002）。`generate.mjs` 读取它生成静态站。
> **权威源**：`generate.mjs`（PROJS 驱动）+ `onboard.mjs`（录入助手）。**加载优先级**：P4。
> **单一事实源**：`build-clean.sh` 的 `PROJS` 数组 = 要构建的站点列表；新增站点必须同步 PROJS（手动或 `onboard.mjs` 自动写）。

## 1. 顶层结构

```jsonc
{
  "template": "sectioned",        // 必填：组合器模板（或 8 套行业模板之一，如 "restaurant"）
  "slug": "sectioned-demo",       // 必填：输出目录名 = PROJS 键名 = URL /demo-sites/<slug>/
  "name": "The Hartwell",         // 必填：站名
  // —— 以下全部可选，结构同 contracts/section-data.md 的 SectionedData ——
  "subtitle": "...", "tagline": "...", "established": "2019",
  "street": "...", "postcode": "...", "phone": "...", "email": "...",
  "heroLine1": "...", "heroStats": [{"val":"4.8","label":"Google Rating","stars":true}],
  "sections": [{"type":"hero"}, ...],   // 可选组合覆盖
  "menu": [...], "story": {...}, "gallery": [...], "reviews": [...],
  "faqs": [...], "team": [...], "booking": {...}, "hoursDetail": {...},
  "footer": {...}, "instagram": "...", "seo": {"description":"..."},
  // —— 真实商家来源元数据（uk-biz-finder 导出，可选） ——
  "_source": { "origin": "osm" | "companies-house", "osmId": "...", "fetchedAt": "ISO" }
}
```

## 2. 字段约束

| 项 | 规则 |
|---|---|
| `template` | 必填。`"sectioned"` 或 8 套行业模板名（`restaurant/coffee/salon/dessert/yoga/law/hotel/trades`）。 |
| `slug` | 必填。仅 `[a-z0-9-]`；须出现在 `PROJS`；等于 `assets/<slug>/` 图片目录名。 |
| `name` | 必填（SectionedData 顶层必填）。 |
| 其余字段 | 全可选，结构见 `section-data.md`。缺字段的 section 自动跳过。 |
| `hoursDetail` | **禁止编造营业时间**（SEO 角色硬约束）；真实商家用非规范文本（如 `"wedFri":"12:00—22:00"`）。 |
| `googleRating` / `googleReviews` | 真实值或留空；不得虚构评分。 |
| `_source` | 真实商家可选元数据对象（`origin` / `osmId` / `fetchedAt`）。`generate.mjs` 合规注入已兼容该格式（v1.1.0）。 |

## 3. 校验闸门

- `validate-sites.mjs`：缺图 / 缺必填字段（name/slug/template）的残缺站**阻断部署**。
- `smoke-test.mjs`：CI 内校验每站产物非空壳。
- PROJS 与 examples 不一致 → 构建告警。

## 4. 新增一个站（最小步骤）

1. 复制 `examples/sectioned-demo.json` → `examples/<slug>.json`，填必填 + 所需 section 字段。
2. `build-clean.sh` 的 `PROJS` 加 `<slug>`（或跑 `node onboard.mjs` 自动写）。
3. `node generate.mjs "./examples/<slug>.json"` 本地预览，或 `bash build-clean.sh` 全量。
4. 推送 → Actions 自动校验 → 构建 → 部署到 `/demo-sites/<slug>/`。

## 5. 与 SectionedData 的关系

- `business-json` = 落在磁盘的「摄入实例」；`section-data` = 它的「字段 Schema」。
- AI Intake（步骤 3）上线后，将直接输出带 `sections` 的 SectionedData JSON，无需手填。
