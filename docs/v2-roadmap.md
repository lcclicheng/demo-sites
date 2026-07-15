# V2 路线图 · 从「建站项目」到「AI Website Factory」

> 版本：v2.0-draft ｜ 起草：2026-07-16 ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 来源：用户战略复盘（10 处缺口）+ AI 难度评估。本文件为**规划**，不是已落地记录。

## 0. 核心判断

项目已不是「帮人做网站」，而是向 **AI 自动建站生产线（Website Factory）** 演进：一个人一年交付几百个网站。

现有系统其实已有「工厂骨架」（不是从零重建）：
- `generate.mjs` 双轴解耦：`THEMES`（主题）独立于 `TEMPLATES`（版式）
- `PROJS` 单一事实源、`?v=` 防缓存、合规注入、串行构建编排
- `src/components/visual.tsx` 已是 `currentColor+color-mix` 主题自适应组件库

所以 V2 = 在骨架上加 **组合（Section Engine）+ AI（Intake / Agent Pipeline / Knowledge Base）**，不是推倒重来。

## 1. 缺口与难度评级（真实代码状态）

| # | 缺口 | 真实状态 | 代码难度 | 最大风险不在代码而在 |
|---|---|---|---|---|
| 1 | MRR / Business System | 商业模式，非代码项 | — | 客户获取 + 定价 + 留存交付 |
| 2 | CRM `clients/` | 完全没有 | 低 | 无（纯目录约定+脚手架）|
| 3 | AI Intake（NL→JSON）| 目前靠 AI 手动做 | 中 | 结构化输出保真 + 创意字段质量 |
| 4 | Multi-Agent Pipeline | 无 | 中高（90% 可 prompt 链）| 过早上编排框架=过度工程 |
| 5 | Section Engine | 8 套手写 monolith | 中高 | 重构 8 模板 + generate.mjs |
| 6 | SEO Agent + Blog | 静态 SEO 已有 | 中 | 调度器 + 内容质量 |
| 7 | Deployment Adapter | 绑死 GitHub Pages | 中（关键石）| 需开 Vercel/CF 账号 |
| 8 | Knowledge Base | 无 | 中（易起步）| 行业知识策展质量 |
| 9 | Business Architecture 文档 | Delivery 有，其余无 | 低 | 纯战略思考 |
| 10 | Operation Agent | health-check 有 | 中（受数据约束）| Google/Business API OAuth |

## 2. 三个必须直说的工程事实

1. **30% 代码 / 70% 生意**：客户获取、定价档位、留存服务、API 账号归属、持续成本——是 owner 的活，代码支撑不了收入本身。
2. **静态站边界是真墙**：GitHub Pages 跑不了 AI 客服、发不了邮件、抓不了实时评论。要么第三方 embed（Calendly / 托管聊天 widget / UptimeRobot），要么先做 #7 接一个 serverless 目标（Vercel），要么用定时 GitHub Action（只需 secrets 放 API key）。
3. **别现在过度工程**：Multi-Agent 编排框架、4 平台 Deployment Adapter、自主爬 Google 的 Ops Agent 都 premature。先拿最小商业化闭环验证。

## 3. 落地顺序（按杠杆/成本比）

| 步 | 项 | 难度 | 理由 |
|---|---|---|---|
| 1 | CRM `clients/` 目录 + 脚手架脚本 | 低 | 立刻有客户中心，解锁其余所有项 |
| 2 | Knowledge Base `knowledge/` 起 3 行业草稿 | 中 | AI 起草 owner 审；喂饱 Intake/SEO Agent |
| 3 | AI Intake 脚本（NL→JSON）| 中 | 「一句话建站」MVP |
| 4 | SEO Agent：Blog 管道 + JSON-LD 自动注入 | 中 | 快赢，直接涨排名 |
| 5 | Deployment Adapter：先接 Vercel | 中 | 解锁 serverless，为聊天/月报铺路 |
| 6 | Section Engine | 中高 | 最后做，价值已被前 5 步验证 |

## 4. 当前进度

- [x] 步骤 1 启动：见 `clients/README.md` + `scaffold-client.mjs`
- [x] 步骤 2 完成：**8 行业全覆盖** `knowledge/{restaurant,coffee,salon,dessert,yoga,law,hotel,trades}/`（各含 hero/seo/faq/cta，共 32 文件 + README）
- [x] 步骤 4a 完成：**JSON-LD 自动注入**（`generate.mjs` 按 `template` 映射 Restaurant/Cafe/Bakery/HairSalon/Hotel/HealthClub/LegalService/HomeAndConstructionBusiness，仅取真实字段、`<` 转义、不编造 hours）
- [x] 步骤 4b 脚手架：见 `docs/blog-pipeline.md` + `blog/README.md` + `blog/_samples/`；LLM 生成与 `gen-blog.mjs` 渲染器留待上线后 / 步骤 6
- [ ] 步骤 3 AI Intake：降级为上线后增值服务（§5.1）
- [ ] 步骤 5 Deployment Adapter：需 owner 开 Vercel / Cloudflare 账号
- [ ] 步骤 6 Section Engine：最后做，价值已被前几步验证

## 5. 关键决策记录

### 5.1 LLM Provider（步骤 3 AI Intake 的前置）
- **决策（2026-07-16）**：AI Intake 的 LLM 选用 **OpenAI 家族** 或 **DeepSeek 家族**（二者择一，暂未定）。
- **key 处理**：先**留空 / env 占位**，不硬编码、不现在烧额度。
- **定位**：AI Intake（自然语言→JSON）属于**正式上线后给客户的增值服务**，不是当前阶段的开发任务——本期暂不实现调用逻辑，等业务跑起来再接入。
- **接口约定**：脚本按 **provider-agnostic** 设计（env 读 `LLM_API_KEY` + `LLM_BASE_URL` + `LLM_MODEL`），兼容 OpenAI 兼容接口与 DeepSeek，owner 填 key 即跑。
- **影响**：步骤 3 从「立即实现」降级为「接口预留 + 上线后启用」，不阻塞其余步骤。

### 5.2 其余待拍板项
- 步骤 5 Deployment Adapter 需 owner 开 **Vercel / Cloudflare** 账号（解锁 serverless 才能跑 AI 客服 / 月报邮件 / 排名巡检）。
- 步骤 4 SEO Agent + Blog 无外部依赖，可作下一步快赢。
