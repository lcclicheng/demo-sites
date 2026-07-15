# Blog 内容目录

每篇博客文章按客户站分目录存放，slug 与 `examples/<slug>.json` 一致。

```
blog/
  <slug>/
    <article-slug>.md
  _samples/
```

- 文章规范见 [`docs/blog-pipeline.md`](./blog-pipeline.md)（frontmatter / 生成流程 / 守门规则）。
- LLM 自动生成留待正式上线后（provider = OpenAI / DeepSeek 家族，key 为 env 占位，见 `docs/v2-roadmap.md` §5.1）。
- 渲染器 `gen-blog.mjs` 与 Section Engine（步骤 6）一并建设，避免重复改动 8 套模板。
