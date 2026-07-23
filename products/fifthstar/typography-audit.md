# 排版审计 · 咱们的页面是否适配国外（英国/西方）高端专业审美

> 目标市场：英国小商家（FifthStar 落地页 + gh-pages-build 示例站）。方向：高端、专业、零失误。
> 审计对象：`products/fifthstar/integrated-offer.html`（旗舰落地页）+ `gh-pages-build/src` 示例站模板（restaurant/salon/law…）。
> 调研依据：GOV.UK 风格指南、GOV.UK 内容原则（conventions）、Butterick《Practical Typography》(webtypography.net)、Morningstar 排版规范、1106design《25 Rules of Setting Type》、Cambridge 英式标点。

---

## 一、结论（一句话）

**地基已经很硬，硬伤几乎没有；差距在"打字机时代"的三处痕迹**——直引号/直撇号、英式单引号惯例、数字字形策略。这三处正是"看起来专业"和"看起来像打出来的不是设计出来的"的分水岭。修掉即达零失误高端。

---

## 二、咱们已经做对的（不要动）

| 项 | 现状 | 依据 |
|---|---|---|
| 字体 | Inter（正文）+ Playfair Display（标题）。两者都是 OpenType 完备的专业字体；Playfair 是高反差衬线 = 奢侈品/编辑级信号 | 高端编辑站通用组合 |
| 大写 kicker 字距 | `.eyebrow{letter-spacing:.22em;text-transform:uppercase}` ✓ | 研究：大写/小型大写必须加字距 |
| 正文行高与行长 | `line-height:1.7`、`.measure` 44rem / `.measure-lg` 56rem 限宽 ✓ | 研究：单行 45–75 字符最优 |
| 货币 | `£590` / `£29 / month` / 菜单 `£9.50`——£ 在前、句号小数、两位小数 ✓ | 英式 + 美式通用；正确 |
| 价格表数字对齐 | 模板 `fontVariantNumeric:'tabular-nums'`（line 455）✓ | 研究：表格/价格用等宽数字对齐 |
| 范围用 en dash | 模板 `£30–£150 per year`（line 579）✓ | 研究：范围用 en dash（8:00–17:00） |
| 从句断开用 em dash | `1844 — fair pricing`（line 725）✓ | 研究：em dash 断开从句，克制使用 |
| 无伪造数据 | 页面目前没有 "+47% 转化" 类编造大数 ✓ | 守咱们的"不伪造"铁律 |
| 英式第一人称口语 | "first-name terms" / "got away from us" / "that's on us" —— 自然英式语气 ✓ | 市场契合度高 |

---

## 三、差距（按严重度排序，含证据与修法）

### 🔴 1. 直引号 / 直撇号（最高优先级——"零失误高端"的硬伤）
所有缩写（you're / don't / we're / it's / here's / I'm / that's）和所有引用都用键盘直撇号 `'` 和直引号 `"`。

- **研究铁证**：1106design 规则 3——"Use true (curly) quotation marks and apostrophes. Using tick marks directly from the keyboard sends the message 'I don't care how this looks.'"；Morningstar 排版——"Avoid using straight quotes, artifacts from the typewriter era."
- **证据（FifthStar）**：line 312 `once you're happy`、342 `you're never a ticket`、367 `silent "we don't care"`、529 `"Thank you — …"`、706 `"yes, that's my business"`、725 `pay when you're happy`、773–777 FAQ 多处。
- **证据（示例站）**：`business-data.ts` line 116 `I\'m` / `nonna\'s`（渲染为直撇号）。
- **修法**：
  - 撇号 `'` → 右单引号 `’`（U+2019）。
  - 引号 `"` → 弯引号 `“` `”`（U+201C / U+201D）。
  - **英式主引用用单引号**（见下条）。

### 🟠 2. 英式单引号惯例（中高——locale 错配）
英国英语**主引用用单引号 `'…'`，双引号 `"…"` 仅用于引号内的引用**（GOV.UK 内容原则原文："The UK convention is for single quotation marks for quoted material with double quotation marks for a quote within a quote"）。咱们落地页目前主引用用双引号（line 367 / 529 / 706），是美式惯例。

- **修法**：主引用改单弯引号 `‘…’`（U+2018 / U+2019）；引用内再嵌套用双弯引号 `“…”`。
- 注意：这是**英式惯例**，不是普世正确；但因咱们明确打英国市场，应守英式。

### 🟡 3. 数字字形策略未声明（中——高级抛光）
研究（Butterick / webtypography.net）：正文用**旧式数字（old-style / text figures）**融入小写文本；表格/价格/统计用**齐线+等宽数字（lining + tabular）**。当前 CSS **没有声明 `font-variant-numeric`**，完全依赖字体默认。Inter 与 Playfair 都带 old-style + lining + tabular OpenType 特性，但没打开。

- **修法**：
  - 正文：`body{font-variant-numeric:oldstyle-nums}`（让 1844、29、79 等融入文本）。
  - 价格/统计：确保 `tabular-nums lining-nums`（模板价格表已有局部；FifthStar 的 `.price`/`.t-price`/`.step .price` 在 Playfair 下应显式加 `font-variant-numeric:tabular-nums lining-nums`）。
- 注：此项偏"内行才看得出"的抛光；不做不丢分，做则更贵气。

### 🟢 4. £ 与数字未防断行（低——小抛光）
价格可能断行成 `£\n590`。

- **修法**：`.price/.t-price/.step .price{white-space:nowrap}`，或写 `£&nbsp;590`。

---

## 四、面向未来的"防错"准则（写进内容/模板，避免再引入失误）

| 场景 | 英国/西方正确写法 | 错误写法 |
|---|---|---|
| 千位分隔 | `1,200`（逗号） | `1.200`（欧式，错）/ `1 200`（空格，英文本不该） |
| 小数 | `9.50`（句号） | `9,50`（欧式，错） |
| 货币 | `£590`（£ 在前，无空格或紧挨均可） | `590£` / `$590`（英镑市场） |
| 范围 | `£30–£150`、`9:00–17:00`（en dash） | `£30-£150`（hyphen） |
| 从句断开 | `1844 — fair pricing`（em dash，克制） | 一长串 hyphen |
| 百分号 | 英式传统 `20 %`（带空格）；现代英网常 `20%`。**二选一，全站一致** | `20%` 与 `20 %` 混用 |
| 日期 | `23 July 2026` 或 `23/07/2026`（英式日-月-年） | `07/23/2026`（美式月-日，英市场歧义） |
| 距离单位 | 英国道路用 **miles**（非 km） | 英国写 km 会显外行 |
| 温度/重量 | `°C`、`kg`（公制） | — |
| 引号 | 英式主引用 `'单'`、嵌套 `"双"` | 全用 `"双"`（美式） |
| 撇号/引号 | 弯的 `’` `“` `”` | 直的 `'` `"` |
| 省略号 | 真字符 `…`（U+2026） | 三个句点 `...` |

---

## 五、修复优先级建议

1. **必做（零失误硬指标）**：全局把直撇号 `’` + 直引号改弯引号；落地页主引用改英式单引号。→ 消除"打字机痕迹"。
2. **建议做（贵气抛光）**：声明 `font-variant-numeric`（正文 old-style、价格 tabular）；价格 `white-space:nowrap`。
3. **纪律（防回归）**：把第四节"防错准则"并入 `web-design-dispatcher` 的共享铁律 / 文案 SOP，新页面与所有外联邮件文案统一遵守。

---

## 六、适用范围说明

- FifthStar 落地页：上述 1–4 项全部适用，且因是面向英国商家的旗舰页，**英式单引号（第 2 项）尤其重要**。
- gh-pages-build 示例站：货币/小数点/en dash/等宽数字已正确（第 2 节已验证）；仅直撇号（数据文件 review 文本）与全局数字字形策略需补。
- 两处共用同一套视觉语言（`site-visual-language`），修法可在视觉层 CSS 统一落地，不必逐页改。
