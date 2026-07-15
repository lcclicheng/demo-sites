# 行业知识库（Knowledge Base）

> V2 的核心数据资产。AI Agent（Intake / Copywriter / SEO）全部读取此处，而不是每次从零生成。
> 当前为 **AI 起草草稿**，需 owner 审阅校准后再作为正式知识。

## 目录约定

```
knowledge/
  <industry>/
    hero.md     # Hero 标题 / 副标题 / 品牌写法套路
    seo.md      # 本地 SEO 主词 + 长尾 + 推荐 Schema
    faq.md      # 行业 FAQ 模板库（直接进 FAQ section + FAQ Schema）
    cta.md      # 转化 CTA 模板（预订/来电/WhatsApp/询价）
  README.md     # 本文件
```

## 已被起草的行业

- [restaurant](./restaurant/) — 餐厅 / 咖啡简餐（模板 `restaurant`）
- [coffee](./coffee/) — 精品咖啡（模板 `coffee`）
- [law](./law/) — 律所（模板 `law`）

## 如何被 Agent 读取

Agent Pipeline（见 v2-roadmap.md 步骤 3–4）在生成某行业站点时：
1. **Intake Agent** 读 `<industry>/hero.md` + `faq.md` 填创意字段（tagline / about / faq）
2. **SEO Agent** 读 `<industry>/seo.md` 定关键词 + 吐 JSON-LD
3. **Copywriter Agent** 读 `<industry>/cta.md` 写转化文案

## 添加新行业

1. `mkdir knowledge/<industry>`
2. 复制 restaurant/ 下 4 个文件为模板
3. 用 AI 起草该行业内容 → owner 审 → 标记 `status: reviewed`（文件头）
4. 在 `generate.mjs` 的 `TEMPLATES` 注册对应版式（如需新模板）

## 状态约定（每个文件头）

```
status: draft      # AI 起草，待审
status: reviewed   # owner 校准，可作为正式知识
```
