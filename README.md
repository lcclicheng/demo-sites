# 英国小商家高端演示站生成器

为英国小商家（餐饮 / 沙龙 / 酒店 / 律所 / 瑜伽 / 家装等）生成高端品牌演示站。
基于 **Vite + React 18 + TypeScript + Tailwind v3**，由模板引擎生成多站点，部署到 GitHub Pages 子路径 `/demo-sites/`。

> 📘 **完整系统文档（单一事实源）：[`docs/workflow.md`](./docs/workflow.md)**
> 架构、目录、客户接入 SOP、部署与认证、质量闸门、合规风险、待迭代清单都在那里。本文档仅作入口，重大改动以 `docs/workflow.md` 为准。

## 配套文档

- [`docs/workflow.md`](./docs/workflow.md) — 系统总文档（单一事实源）
- [`docs/delivery-checklist.md`](./docs/delivery-checklist.md) — 合规交付清单（隐私 / GDPR / Cookie / 注册地址）
- [`docs/custom-domain.md`](./docs/custom-domain.md) — 自定义域名 / DNS / SSL / 客户交接 SOP
- [`docs/cms.md`](./docs/cms.md) — 客户自助内容后台（Decap CMS + GitHub OAuth）启用与隔离模型
- [`docs/delivery-handover.md`](./docs/delivery-handover.md) — 客户交付标准化包（欢迎邮件 / 合规签字 / 维护手册 / 支持条款 / 发票）
- [`docs/monitoring.md`](./docs/monitoring.md) — 客户站点健康看板（Actions 定时健康检查自动开 Issue + UptimeRobot 外部探测 SOP）
- [`docs/pricing.md`](./docs/pricing.md) — 报价与套餐（£ 定价基准：基础建站 / +CMS 自助 / 年度支持）

## 快速开始

```bash
# 本地接入新客户（填表生成 examples/<slug>.json + 自动构建 + 预览）
node onboard.mjs          # 打开 http://localhost:4321/

# 本地单站构建
node generate.mjs "./examples/<site>.json"

# 全量干净重建 10 站
bash build-clean.sh

# 部署（SSH 推送触发 Actions 自动上线）
git add -u && git commit -m "..." && git push origin main
```

## 关键说明

- 部署用 **GitHub Actions + `GITHUB_TOKEN`**，不依赖任何明文 PAT；SSH 认证见 `docs/workflow.md` §6。
- `build-clean.sh` 的 `PROJS` 数组是「要构建的站点」**单一事实源**；新增站点由 `onboard.mjs` 自动写入，手动新增也务必同步。
- 部署前校验闸门 `validate-sites.mjs` 拦截缺图 / 缺字段的残缺站。
- SEO 索引文件（`sitemap.xml` / `robots.txt`）由 `gen-seo.mjs` 在 CI 内自动生成；可用 `SITE_BASE_URL` 环境变量指定自定义域名。
- 旧版 `copy-to-ghpages.sh` 已废弃（合并单仓库后由 Actions 自动部署，不再手动 copy）。
