# Blog 管道（SEO Agent 组成部分 · 步骤 4b）

> 状态：**脚手架已立，LLM 内容生成留待正式上线后启用**（见 `docs/v2-roadmap.md` §5.1：provider = OpenAI / DeepSeek 家族，key 为 env 占位）。
> 本文件定义约定与未来渲染管线，不依赖 LLM 即可被人工撰写文章。

## 1. 目的

- **本地 SEO 杠杆**：Google 极爱新鲜、本地相关、原创长文。每周 1 篇行业+地区文章，直接拉升行业站排名。
- **客户留存素材**：月报可引用「本月发了 N 篇、预计带来 M 曝光」，支撑 MRR 续费叙事。
- 与 `knowledge/<行业>/seo.md` 的「博客选题」对齐，避免选题拍脑袋。

## 2. 内容存放约定

```
blog/
  <slug>/                 # 每个客户站一个目录，slug 与 examples/<slug>.json 一致
    <article-slug>.md     # 一篇文章一个文件
    ...
  _samples/               # 写法样例（不构建）
```

- 文章**归属客户站**：`blog/papa-bruno/weekly-pizza-york.md` 归 papa-bruno 站。
- 文件名即文章 slug；构建时生成 `output/<slug>/blog/<article-slug>/index.html`。

## 3. 文章 Frontmatter 规范

```markdown
---
title: "Top 10 Pizza Spots in York (2026)"
date: 2026-08-01
description: "A local's guide to the best Neapolitan and sourdough pizza in York."
tags: [pizza, york, local-guide]
author: "<客户名 / Ethan Li>"
---

正文 markdown …
```

- `title` / `date` / `description` 必填；`description` 复用为 `<meta name="description">` 与 OG。
- 正文用标准 markdown；图片放 `assets/<slug>/blog/`，相对路径引用。

## 4. 生成流程（未来）

```
knowledge/<行业>/seo.md 博客选题
        │
        ▼
[LLM · 上线后启用] 读客户真实信息(examples/<slug>.json) + 本地角度 → 起草 markdown
        │  （provider-agnostic：LLM_API_KEY / LLM_BASE_URL / LLM_MODEL，见 §5.1）
        ▼
blog/<slug>/<article>.md
        │
        ▼
[gen-blog.mjs · 待建] markdown → 静态 HTML 文章页 + blog/index.json
        │
        ▼
output/<slug>/blog/...  （随 CI 部署）
        │
        ▼
站点 Blog 区块 / 导航链接（随 Section Engine 步骤 6 接入 8 模板）
```

- **LLM 草稿**：上线后由 Intake/Copywriter Agent 复用同一 provider 配置生成；本期不实现调用。
- **渲染器 `gen-blog.mjs`**：本期未建（无内容可渲染，且文章页需接入 8 套 React 模板，留待步骤 6 Section Engine 一并做，避免重复改动）。

## 5. 守门规则（与全站一致）

- **只写真实本地事实**，不编造评分 / 评论 / 排名。
- 演示站文章（如有）沿用未核实免责横幅逻辑，真客户替换后去标。
- 不堆 emoji，标题公式复用 `knowledge/<行业>/hero.md` 反模式。
- 每篇 ≤ 800 词，含 1–2 个 `seo.md` 长尾词，自然不堆砌。

## 6. 当前进度

- [x] 约定与样例文档（本文件 + `blog/README.md` + `_samples/`）
- [ ] LLM 草稿（上线后，依赖 §5.1 provider key）
- [ ] `gen-blog.mjs` 渲染器（与步骤 6 Section Engine 一并做）
