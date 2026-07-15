# Deployment Adapter（步骤 5）

> V2 路线图第 5 步。目标：把「部署」从写死 GitHub Pages 抽象成可切换的适配器，
> 让真实客户站能落到 **Vercel**（解锁 serverless，支撑 AI 客服 / 表单 / 月报 / 预约），
> 而不动既有的 GitHub Pages demo 流水线。

## 为什么是 Vercel 而不是 GitHub Pages

| 能力 | GitHub Pages | Vercel |
|---|---|---|
| 纯静态托管 | ✅ | ✅ |
| 自定义域名 + 免费 SSL | ⚠️ 需自有域名 | ✅ 开箱 |
| Serverless 函数（表单/AI/月报） | ❌ 纯静态 | ✅ `api/` |
| 边缘网络 / 性能 | 一般 | 优 |
| 构建缓存 | 无 | 有 |

结论：**demo 站留 GitHub Pages（零成本、零配置），客户站走 Vercel（能跑服务端逻辑，是 MRR 运营层的基石）。**

## 适配器设计

`generate.mjs` 已从单点 `deployCf` 泛化为分发器：

```js
const IS_DEPLOY  = args.includes('--deploy')          // 触发开关
const DEPLOY_TARGET = (process.env.DEPLOY_TARGET || 'cloudflare').toLowerCase()

async function deployTo(result) {
  if (DEPLOY_TARGET === 'vercel') return deployVercel(result.distDir, result.projectName)
  return deployCf(result.distDir)                      // 默认 Cloudflare
}
```

- `--deploy` 仍是从 CLI 触发部署的总开关（向后兼容）。
- `DEPLOY_TARGET` 选适配器：`cloudflare`（默认）| `vercel`。
- `deployVercel` 调 `vercel deploy --prod --name <projectName> <distDir>`，`<projectName>` 自动清洗。

### 为什么没做「部署 19 站 demo 到 Vercel」

用户决策（2026-07-16）：**仅客户站适配器**。demo 镜像到 Vercel 会创建一个公开的 `demo-sites` 项目、
且每次 push 都要重 build 19 站，收益低、暴露面大。客户站是「一对一独立项目」，适配器天然契合。

## 客户站部署流程

```bash
# 构建
node generate.mjs ./examples/<slug>.json
# 部署到 Vercel（VERCEL_TOKEN 必填）
DEPLOY_TARGET=vercel VERCEL_TOKEN=xxxx node generate.mjs ./examples/<slug>.json --deploy
```

配套模板见 `deploy/vercel/`：
- `vercel.json` —— 最小静态配置
- `api/contact.js` —— serverless 联系表单模板（证明 Vercel 核心价值）
- `README.md` —— 落地步骤

## Serverless 是 MRR 的钥匙

GitHub Pages 跑不了任何服务端代码，所以「AI 客服 / 表单入库 / 月度报告邮件 / 排名巡检」在纯静态站上
要么靠第三方 embed，要么根本做不了。Vercel 的 `api/` 让这些**全部可自建**，且成本极低（按调用计费）。
步骤 10（Operation Agent）的周报、步骤 4 的 SEO 监控、未来的 AI 客服都依赖这一层。

## 待办 / 下一步

- [ ] 首个真实客户签约后，跑一次 `DEPLOY_TARGET=vercel` 实测（需用户填 `VERCEL_TOKEN`）。
- [ ] 步骤 6（Section Engine）落地后，客户项目结构确定，再把 `api/` 接入构建产物。
- [ ] Cloudflare 适配器保留作备选（用户已有 Cloudflare 选项，无需新增工作）。
