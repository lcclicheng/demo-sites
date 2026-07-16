# ADR001 · 用 GitHub Pages 作默认托管

- **Status**: Accepted
- **Decision**: 默认托管用 GitHub Pages（子路径 `/demo-sites/`），零服务器成本。
- **Reason**: 单人项目、纯静态站、零运维；Actions 自动部署；无需信用卡。
- **备选**: Vercel / Netlify（需账号、有 serverless）—— 仅**客户站**走 Vercel（步骤5 Deployment Adapter）。
- **影响**: 纯静态，无后端；AI 客服 / 邮件 / 实时评论需 Vercel 或第三方 embed（Calendly / UptimeRobot / 托管 widget）。
- **See**: memory/core/constraints.md(静态站边界), docs/deployment-adapter.md
