# Playbook · SEO（搜索引擎优化）

> 执行型 SOP。详细见 `docs/seo.md`。角色：seo。
> 铁律：**不编造 hours / googleRating**；内容生成直接引用 `knowledge/<行业>/` 不重新思考。

## 步骤
1. **结构化数据**：给新站加 `seo:{title,description}`（在 `examples/<slug>.json`）。`gen-seo.mjs` 在 CI 自动生成 `sitemap.xml` / `robots.txt` / JSON-LD。
2. **自定义域名**：设 `SITE_BASE_URL` 环境变量，让 sitemap 用客户域名而非 `/demo-sites/` 子路径。
3. **行业内容**：从 `knowledge/<行业>/`（seo / copy / faq）取素材，不凭空写。
4. **Blog（可选）**：走 `docs/blog-pipeline.md` 脚手架，不在此文件展开。
5. **上线核对**：`robots.txt` 可访问、`sitemap.xml` 含新 slug、JSON-LD 无报错（Google Rich Results 测）。

## 退出标准
- [ ] `seo.description` 已填且非占位
- [ ] `sitemap.xml` 含新 slug
- [ ] JSON-LD 校验通过
- [ ] 无编造 hours / rating
