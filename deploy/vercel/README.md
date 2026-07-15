# Vercel 部署模板（客户站专用）

本目录是 **Deployment Adapter（步骤 5）** 的 Vercel 适配器配套模板。
demo 站仍留在 GitHub Pages，Vercel 用于**真实客户站**——每个客户一个独立 Vercel 项目、独立域名，且能跑 serverless 函数。

## 一键部署客户站

```bash
# 1) 构建某个客户站
node generate.mjs ./examples/<slug>.json

# 2) 部署到 Vercel（需 VERCEL_TOKEN 环境变量）
DEPLOY_TARGET=vercel VERCEL_TOKEN=xxxx node generate.mjs ./examples/<slug>.json --deploy
```

`generate.mjs` 会调用 `vercel deploy --prod --name <projectName> <distDir>`，
`<projectName>` 取 JSON 的 `slug`/`name` 自动清洗（小写 + 连字符）。

## 环境变量

| 变量 | 用途 |
|---|---|
| `VERCEL_TOKEN` | Vercel 个人访问令牌（Dashboard → Settings → Tokens）。**必填**，否则跳过部署 |
| `DEPLOY_TARGET` | 设为 `vercel` 启用 Vercel 适配器；默认 `cloudflare` |
| `SITE_BASE_URL` | 客户站点绝对地址（meta/OG/JSON-LD 用），如 `https://client.com` |

## serverless 函数（Vercel 的核心价值）

`api/contact.js` 是一个可直接 copied 进客户项目 `api/` 目录的 serverless 模板，
承载联系表单 / webhook。GitHub Pages 做不到这一点。

落地步骤（客户项目）：
1. 把 `api/contact.js` 复制到客户项目根 `api/contact.js`
2. 前端 `fetch('/api/contact', { method:'POST', body: JSON.stringify(...) })`
3. 如需真发邮件：`npm i resend`，在 Vercel 项目配置 `RESEND_API_KEY` / `OWNER_EMAIL`，取消文件内注释

未来扩展（步骤 10 Operation Agent）：同样的 `api/` 机制可加 `api/report.js`（定时生成周报）、
`api/chat.js`（AI 客服）、`api/booking.js`（预约 webhook）。

## vercel.json

`vercel.json` 是最小静态配置（无构建、干净 URL）。`vercel deploy <distDir>` 时会被读取。
若客户项目需要函数 + 构建，将此文件放到项目根并相应调整 `buildCommand` / `outputDirectory`。
