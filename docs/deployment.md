<!--
  主题文件：部署、认证与本地开发
  来源：由 docs/workflow.md（v1.1.0）§4（本地/部署流程）+ §6 部署与认证 + 附录B 安全清单拆分而来（MDD 拆分，2026-07-16）
  维护：本文件是「部署 / 认证 / 本地构建 / 安全」主题的单一事实源；动部署流程须同步此处。
-->

# 部署、认证与本地开发

> MDD 主题文件 · 索引见 `docs/index.md` · 一册通读见 `docs/PROJECT-OVERVIEW.md`
> 相关：架构见 `docs/architecture.md`｜接客户见 `docs/onboarding.md`｜决策见 `decisions/ADR001-use-github-pages.md`、`decisions/ADR005-ssh-deploy.md`

---

## 1. 本地开发流程（改模板 / 看效果）

```bash
gs   # 进入工程根目录 gh-pages-build（依赖 architecture.md §3 的 alias）

# 改单个站（如调试 sotto-sotto）
node generate.mjs "./examples/sotto-sotto.json"

# 全量干净重建（真实 safe-delete 守卫保护，逐个时间戳校验）
bash build-clean.sh

# 本地预览（构建后在 output/<slug>/dist 起静态服务，端口自定）
python -m http.server 8088 --directory output/sotto-sotto/dist
```

> ⚠️ 本地预览服务器会锁定 `dist/` 目录，重建前务必先关掉，否则会触发 EBUSY 假成功（见下方 §4 FAQ）。
> ⚠️ **安全删除守卫（真实机制）**：`generate.mjs` 在删除 `output/<slug>/` 前会校验 `projectName` 合规（`^[a-z0-9][a-z0-9-]*$`）且 `outputDir` 必须严格落在 `output/` 内，否则 `process.exit(1)` 拒绝删除——防止 `slug`/`name` 异常（如 `".."`）让 `rmSync` 递归误删整个工程。重置 output 用 `mv output ../oldbuild_<时间戳>`（rename 非 delete）再 `mkdir -p output` 即可；**禁用 `rm -rf output/*`**。CI（Actions）同样走此守卫。旧文档描述的 `SAFE_DELETE_BULK_CONFIRM_REQUIRED` 沙箱守卫**并不存在**，系文档错误，已于 2026-07-19 修正（见 `CHANGELOG.md`）。

---

## 2. 部署流程（push → Actions 自动上线）

```bash
gs
git add -u                 # 改已有跟踪文件用 -u（删 gitignore 旧文件也要用 -u，非 -A）
git commit -m "..."
git push origin main      # 走 SSH，无需 PAT
```

- **Actions 已具备并发控制**（`deploy.yml` 中 `concurrency` 组，避免并行部署互相覆盖）。
- **Actions 失败怎么看**：GitHub 仓库 → Actions 标签 → 看对应 run 的日志。校验闸门报错会明确告诉你「哪个站、缺什么」。
- **部署依赖缓存已落地（v0.6）**：`setup-node` 已加 `cache: 'npm'`（缓存键取根 `package-lock.json`）；`generate.mjs` 改为「工程根一次性 `npm ci` + 各站点符号链接复用 `node_modules`」，10 站只真正安装 1 次并命中 CI 的 npm 缓存，构建显著提速。

---

## 3. 部署与认证：SSH（443 通道）

**已根治的认证方案**。背景：GitHub 已禁用密码登录；且推送「新增/修改 workflow 文件」的 PAT 必须带 `workflow` scope，极易踩坑。改用 SSH 彻底绕开（决策见 `decisions/ADR005-ssh-deploy.md`）。

**本机已配置**（无需再操作）：
- 密钥：`~/.ssh/id_ed25519_github`（无密码，个人项目够用）
- `~/.ssh/config`：`github.com` → `ssh.github.com:443`（标准 22 端口被墙，走 443）
- 远程已切 SSH：`git@github.com:lcclicheng/demo-sites.git`

**若换机器 / 重新配置**：生成密钥 → 把公钥加到 GitHub（Settings → SSH and GPG keys → New SSH key）→ 复制 `~/.ssh/config` 这段配置。

**验证连通**：`ssh -T git@github.com`（返回 `Hi lcclicheng!` 即成功；退出码 1 是正常的，GitHub 不提供 shell）。

> ⚠️ **WorkBuddy Bash 沙箱坑**：WorkBuddy 默认沙箱会拦截读取 `~/.ssh/config`，导致 `git push` 时 ssh 回退到默认 `github.com:22`（被墙）报 `Connection refused`。**解法**：在 WorkBuddy 内执行 git push（或任何走 ssh config 的 git 操作）时，必须给 Bash 工具传 `dangerouslyDisableSandbox:true`。

**安全提醒（务必遵守）**：
- 🔑 **定期轮换 SSH 密钥**（如每年），旧公钥从 GitHub 移除
- 🚫 **绝不要把私钥**（`id_ed25519_github` 等）**提交进 git**；`.gitignore` 不覆盖 `~/.ssh`，但人工需警惕
- 🌐 **GitHub Pages 站点完全公开**：JSON 中的电话 / 地址等客户信息会公开可见。交付前提醒客户此点；对隐私敏感的客户未来可支持私有部署

---

## 4. 已知坑与经验沉淀（FAQ）

| 现象 / 坑 | 原因 | 解法 |
|---|---|---|
| `Minified React error #62` | JSX 里 `style="..."` 写成字符串，必须是对象 `style={{}}` | 用对象写法；`inject-privacy.mjs` 已改为对象 |
| 构建报成功但页面是旧的 / 缺内容 | 预览服务器锁 `dist/` 导致 `rmdir` 失败（EBUSY 假成功） | 重建前关掉预览服务；`build-clean.sh` 加时间戳校验 |
| 部署成功但页面缺图 | `generate.mjs` 图片目录缺失时静默跳过 | 质量闸门（§5）拦截 |
| 改了图页面没变 | 浏览器/CDN 缓存同名旧图 | 截图 URL 加 `?v=<md5前8位>` 内容哈希（generate.mjs 已落地） |
| `git add -A` 删不掉被 gitignore 的旧文件 | `-A` 因 gitignore 跳过 tracked 删除 | 用 `git add -u` 或 `git rm --cached` |
| `push` 报 `workflow scope` / 认证失败 | PAT 缺 workflow scope；或密码登录已禁用 | 改用 SSH（§3） |
| 标准 22 端口 SSH 连不上 | 国内网络屏蔽 22 | 走 `ssh.github.com:443`（§3 已配） |
| WorkBuddy push 报 `Connection refused` | 沙箱拦 `~/.ssh/config` 致回退 22 端口 | Bash 传 `dangerouslyDisableSandbox:true`（§3） |
| 新增站点没被部署 | 忘了把新 JSON 加入 `build-clean.sh` 的 `PROJS` | 孤儿站点告警会提示；记得同步 PROJS |
| 清空 output 报错 / 构建中止 | `projectName` 非法或 `outputDir` 越界触发真实 safe-delete 守卫 `exit 1` | 检查 JSON 的 `slug`/`name` 是否合规（`^[a-z0-9][a-z0-9-]*$`），勿用 `..` 等特殊值；重置用 `mv output ../oldbuild_时间戳` + `mkdir output` |

---

## 5. 质量闸门 `validate-sites.mjs`

**位置**：部署流水线「构建前」一步（fail-fast）。

**校验内容**（逐站，站点列表来自 `build-clean.sh` 的 `PROJS`，单一事实源）：
1. JSON 合法可解析
2. 必填字段齐全合规：`name` / `slug` / `template`
3. JSON 里引用的 `./images/*` 在 `assets/<slug>/` 真实存在

**阻断逻辑**：任一不满足 → 退出码 1 → 整个 Actions job 失败 → **不构建、不部署**，残缺内容绝不上线。

**孤儿站点自动发现（软阻断）**：
- 脚本额外扫描 `examples/*.json`，找出「同时具备 `template` + 非空 `slug`」却**未纳入 `PROJS`** 的 JSON
- 这类文件「看起来该部署却不会被构建」。默认**软阻断**：打印 ⚠️ 并 `exit 1`，令 Actions job 失败（fail-fast），避免「忘了加 PROJS 直接 push 漏部署」
- **临时放行**：本地 `node validate-sites.mjs --allow-orphans`，或在 `deploy.yml` 经 `workflow_dispatch` 勾选 `allow_orphans`（仅限确认无误时）
- 测试夹具（batch-sample / profix-test / test-new-templates）因 slug 为空，自动排除、不误报

**冒烟测试（v0.9.3）**：`smoke-test.mjs` 校验每站产物含挂载点/JS/title 非空壳，接进 `deploy.yml` Assemble 之后阻断坏部署。监控看板见 `docs/monitoring.md`。

### 5.2 安全加固防线（2026-07-19，约定防线 → 技术防线）

接手 agent 风险评审后，把 5 条「靠纪律约定」的防线升级为「代码/CI 强制」。commit `c2549a5`，详见 `CHANGELOG.md` 与 `AGENT-ONBOARDING.md` §11。

1. **`generate.mjs` 真实 safe-delete 守卫**（替代原文档虚构的 `SAFE_DELETE_BULK_CONFIRM_REQUIRED`）：`rmSync` 前校验 `projectName` 合规（`^[a-z0-9][a-z0-9-]*$`）且 `outputDir` 严格落在 `output/` 内，否则 `process.exit(1)` 拒删，防 `slug=".."` 越界误删工程。
2. **`build-clean.sh` 失败闸门**：循环逐个构建（有意不设 `set -e`，避免首个失败即中止、隐藏其余站点失败）；循环结束若发现**任何构建失败或 dist 缺失**，`exit 1` 让 Actions 变红——不再假成功漏站。
3. **`validate-sites.mjs` 重复构建目标检测**：遍历 PROJS 各 JSON 归一化 `projectName(slug||name)`，两站归一化到同一 `output/<slug>/` 即 `exit 1`，防双事实源冲突线上互相覆盖丢站。
4. **outreach 泄漏双防线**：
   - 本地 `.githooks/pre-commit` 钩子（已 `git config core.hooksPath .githooks` 激活）扫描暂存文件，命中 `outreach/business/business-kit/clients` 即中止提交（`clients/README.md` 例外放行）；
   - `deploy.yml` CI 步骤 `git ls-files` 扫敏感目录，命中即 `exit 1` 兜底——即便误 `git add -f` 也绝不会泄漏。
5. **回滚产物保留**：`deploy.yml` 的 `upload-pages-artifact` 已设 `retention-days: 30`，保留期内可 Re-run 历史 Deploy 回滚（路径见 `AGENT-ONBOARDING.md` §11）。

---

## 6. 附录：安全清单（部署相关）

- [ ] SSH 私钥（`~/.ssh/id_ed25519_github`）**绝不提交 git**
- [ ] 定期轮换 SSH 密钥（建议每年），旧公钥从 GitHub 移除
- [ ] GitHub Pages 站点公开，交付前提醒客户：电话/地址等信息对外可见
- [ ] 远程 URL 不含明文 PAT（当前为 SSH，已干净）
- [ ] 两个旧 PAT（ghp_f0EM… / ghp_gyrX…）已吊销
- [ ] **`GITHUB_TOKEN` 权限最小化**（`deploy.yml` 顶部 `permissions:` 块）：
  - 仅授予本次部署必需的最小权限：`contents: read` + `pages: write` + `id-token: write`
  - **不要**图省事写 `permissions: write-all` 或 `contents: write`（本仓库不需要 push 回自身）
  - `id-token: write` 仅用于 OIDC 发布 Pages，属最小必要；若将来不用 Pages OIDC 可去掉
  - 原理：GitHub 自动注入的 `GITHUB_TOKEN` 默认范围随仓库设置，显式声明可收紧，降低令牌泄漏后的影响面
- [ ] **私有目录泄漏双防线就位**：本地 `.githooks/pre-commit` 钩子（`core.hooksPath` 已设）拦截 `outreach/business/business-kit/clients` 暂存；`deploy.yml` CI 步骤 `git ls-files` 扫敏感目录兜底 `exit 1`。提交只用明确文件、绝不 `git add -A`/`-f`
- [ ] **回滚可用**：`deploy.yml` 的 Pages artifact 已设 `retention-days: 30`，保留期内可 Re-run 历史 Deploy 回滚（详见 `AGENT-ONBOARDING.md` §11）

---

## 7. 常用命令速查

```bash
# ── 进入工程（依赖 architecture.md §3 的 alias gs）──
gs

# ── 接入新客户（见 docs/onboarding.md）──
node onboard.mjs                      # 打开 http://localhost:4321/ 填表生成 examples/<slug>.json

# ── 本地构建 ──
node generate.mjs "./examples/<site>.json"   # 单站
bash build-clean.sh                          # 全量 45 站（PROJS 单一事实源）

# ── 部署 ──
git add -u && git commit -m "..."     # 提交（改/删跟踪文件用 -u）
git push origin main                  # SSH 推送，触发 Actions 自动部署

# ── 验证 ──
ssh -T git@github.com                 # 验证 SSH 连通
curl -sI https://lcclicheng.github.io/demo-sites/<slug>/   # 验证线上可达
node validate-sites.mjs               # 本地手动跑校验闸门（含孤儿站点告警）

# ── 本地预览 ──
python -m http.server 8088 --directory output/<slug>/dist

# ── 清理构建产物（重建前常用；真实守卫保护 output，重置用 rename 非 delete）──
mv output ../oldbuild_$(date +%s) && mkdir -p output   # 推荐：rename 非 delete，绕过守卫语义
# 禁用 rm -rf output/*（既无必要也破坏守卫语义）
```

---

*本主题文件由 `docs/workflow.md` v1.1.0 §4/§6/§8/§9/附录B 拆分（2026-07-16 MDD 重构）。*
