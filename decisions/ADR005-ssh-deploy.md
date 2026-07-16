# ADR005 · 部署走 SSH（443），不用 PAT

- **Status**: Accepted
- **Decision**: 部署用 SSH（`ssh.github.com:443`）+ `GITHUB_TOKEN`，不依赖个人 PAT / `workflow` scope。
- **Reason**: 国内标准 22 端口被墙；SSH 不受 scope 限制，且无需 PAT 明文。
- **备选**: HTTPS + PAT（带 workflow scope）—— 旧 PAT 吊销后此路死。
- **影响**: WorkBuddy 内 `git push` 须 `dangerouslyDisableSandbox:true` 才能让 ssh 读到 `~/.ssh/config` 走 443。
- **See**: memory/core/constraints.md(部署认证 / push 沙箱), docs/workflow.md(§6)
