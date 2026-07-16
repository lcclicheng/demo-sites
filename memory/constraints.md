# Constraints（技术约束）

- **静态站边界**：GitHub Pages 跑不了 AI 客服 / 发邮件 / 抓实时评论；serverless 需 Vercel（`deploy/vercel/` + `api/contact.js`）。
- **部署认证**：SSH `ssh.github.com:443`（国内 22 端口被墙）；`GITHUB_TOKEN` 部署，无明文 PAT。`workflow` 文件提交也不需 PAT scope。
- **UK 合规**：VAT 阈值 £85,000/年（报价 ex VAT）；ECCTA 2024 禁纯 PO Box 注册办公室（须「适当地址」）；GDPR / PECR 需真实隐私政策 + Cookie 同意。
- **单仓库 + PROJS 事实源**：`lcclicheng/demo-sites` 单仓库 + Actions；`build-clean.sh` 的 `PROJS` 数组是唯一构建事实源，新增站必同步（否则孤儿闸门阻断）。
- **图片**：`assets/<slug>/` → 拷进 `dist/images/`；JSON 引用 `./images/*`；目录缺失时 `generate.mjs` 静默跳过（靠 `validate-sites.mjs` 拦截）。图片 URL 带 `?v=<md5前8位>` 防缓存。
- **安全删除守卫**：本地 build 前用 `mv` 移旧产物（rename 非 delete），勿 `rm`——WorkBuddy 沙箱会拦 `generate.mjs` 的 `fs.rmSync`。
- **交付物纯英文**：客户交付包正文纯英文（UK 客户）；中文仅允许出现在文件顶部 HTML 注释块（AI 内部填充说明，不渲染、不发给客户）。
- **push 需沙箱放行**：WorkBuddy 内 `git push` 须 `dangerouslyDisableSandbox:true` 才能让 ssh 读到 `~/.ssh/config` 走 443。
