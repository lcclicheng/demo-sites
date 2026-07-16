# Goals（当前目标）

## 进行中 / 近期
- **真实商家替换（步骤2）**：9 真实站现用占位 / 臆测数据（H1 高危，已加免责横幅过渡）；外联取真图 / 核实电话 / 营业时间 / 评价后替换。首批 4 家高风险发送包就绪（`docs/outreach-batch-1.md`）。
- **首个真实客户签约** → 实测 Vercel 客户站部署（`DEPLOY_TARGET=vercel`，需 `VERCEL_TOKEN`）。
- **增量构建**：只重建变更站 + 门户，未变更跳过（`build-clean.sh` 随站点数线性变慢）。
- **Playwright 逐像素视觉回归**：站点 >15 已满足，可启用（真实商家迁 sectioned 前需回归保护）。

## 战略
- 从「建站项目」→「AI Website Factory」：AI Intake（步骤3 NL→JSON）降级为**上线后增值服务**（LLM 选 OpenAI / DeepSeek，key 留 env 占位）。
- 提升 MRR：B 档年维护 + 增项（自定义域名 / 多语言 / 深度 SEO）。
- 文档 MDD 化：`docs/workflow.md`(57KB) 拆为各主题文件（见 `docs/index.md`）。
