# Contract · Theme（Tailwind v3 主题契约）

> **身份**：站点视觉主题的唯一规范。组件**绝不**绑定品牌色，只消费三个语义色（ADR003）。
> **权威源**：`generate.mjs` 的 `THEMES` + 各模板 `twConfig` / `css`。**加载优先级**：P4（改主题/新增视觉时读）。
> **核心铁律**：theme-agnostic —— `currentColor + color-mix`，亮暗通用，反网红、反硬编码品牌色、反 emoji。

## 1. 语义三色（Tailwind v3 `theme.extend.colors`）

| 语义色 | 用途 | 约束 |
|---|---|---|
| `surface` | 页面 / 区块背景 | 浅色底（如 `#faf9f7`）；亮暗主题各自一套 |
| `ink` | 前景文字 | 近黑（如 `#1c1917`）；`text-ink/60` `/50` 作次级文字 |
| `accent` | 强调色（CTA / 图标 / 发丝线 / 装饰层） | **唯一允许「有彩色感」的色**；逐站经 `THEMES` 覆盖 |

- 装饰层用 `<div className="text-accent">` 包住 `HeroBackdrop` 等，使 `currentColor` 跟随强调色。
- 视觉手法库 `src/components/visual.tsx` 全部走 `currentColor + color-mix`，与 section 组件同一套哲学。

## 2. 字体（`theme.extend.fontFamily`）

| 键 | 值 | 用途 |
|---|---|---|
| `display` | 衬线（Playfair Display / Marcellus / Fraunces …） | 大标题、editorial 排版 |
| `body` | `Inter` | 正文 |

- 字体在 `html` 的 Google Fonts `<link>` 引入（generate.mjs 按模板/主题注入）。
- 切换衬线字体 = 改 `html` 字体链接 + `twConfig` 的 `display` 族名（如 atelier 用 Marcellus 替换 Playfair）。

## 3. 逐站差异：`THEMES`（不复制整份配置）

- `THEMES` 键 = 项目输出目录名（projectName / slug）。
- 每个主题只声明**与基础模板不同的 diff**，由 `applyThemeReplace` 对 `css` / `twConfig` 做精确字符串替换：
  - `twReplace`: `[["accent:'#b8895a'", "accent:'#c2772e'"], ...]`
  - `cssReplace`: `[['background:#faf9f7','background:#f6f3ef'], ...]`
  - 换字体时提供完整 `html` 字符串。
- 这样**模板 JSX 保持单一来源**（便于统一修复），每站拥有独立美感。

## 4. 禁止（违反即违背 ADR003）

- ❌ 在组件里写 `text-red-500` / `bg-[#xxxxxx]` 等具体色值。
- ❌ emoji 作图标（用 `lucide-react` 的 `icon` 名，如 `MapPin` / `Flame`）。
- ❌ 给某行业硬编码一套专属配色变量（旧 8 套做法，切 sectioned 后替换串不命中、主题静默丢失，已废弃）。

## 5. 新增一个站主题

1. 在 `generate.mjs` 的 `THEMES` 加 `<slug>: { twReplace:[...], cssReplace:[...], html? }`。
2. 只改 `accent` / `surface` / `ink` 三色 + `display` 字体族，复用基础模板 JSX。
3. 本地 `node generate.mjs "./examples/<slug>.json"` 预览，确认无硬编码残留。
