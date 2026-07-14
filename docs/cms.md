# 客户自助内容后台（Decap CMS）· v0.8

> 版本：v0.8 ｜ 更新：2026-07-14 ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 配套：`admin/index.html` + `admin/config.yml`（仓库内脚手架）；`deploy.yml` 已把 `admin/` 发布到线上 `/demo-sites/admin/`。
> 关联：`workflow.md` §5.9（交付后维护流程）、§11（客户自助 CMS 已完成 v0.8，全 10 站自动映射）。

> 🌐 **演示站 `/admin` 已激活并公开**：`client_id` 已填入并注册 OAuth App，`https://lcclicheng.github.io/demo-sites/admin/` 任何人都能打开、且**能用你的 GitHub 账号登录编辑**（你本人有仓库写权限）。它既是能力展示、也可作获客卖点；真实客户请走下方「生产模型」（独立仓库 + 协作者隔离），**勿在演示仓库给客户写权限**。

---

## 1. 这是什么 / 为什么是 Decap

你的站是**静态站（Vite 构建 → GitHub Pages）**，内容来自 `examples/<slug>.json`，由 Actions 在 push 时重建部署。
客户想自助改菜单 / 照片 / 文案，最契合的行业标准方案就是 **Decap CMS**（原 Netlify CMS，开源、免费）：

- 客户在 `/admin` 登录 → 可视化表单编辑 `examples/<slug>.json` → 保存即 `commit` 到仓库 `main`
- 提交触发 Actions → 自动重建 → 站点上线。**你完全不用手动改 JSON / 重建 / 部署**
- 认证用 **GitHub OAuth**，权限随仓库（协作者才能改），无需你自建服务器

> 为什么不用「自研表单后台」：Decap 已解决 OAuth、表单渲染、Git 提交、预览、回滚等全部环节；自研要重造轮子且同样要解决认证。见 `workflow.md` §11 方案对比。

---

## 2. 架构与数据流

```
客户浏览器 /admin (Decap UI)
      │  登录（GitHub OAuth）
      ▼
examples/<slug>.json  ──commit──▶  GitHub repo main  ──push 触发──▶  Actions
                                                                     │ validate → build → deploy
                                                                     ▼
                                                          站点自动更新（GitHub Pages）
```

- `admin/config.yml` 决定「哪些文件、哪些字段可编辑、用什么控件」
- 编辑的是**源 JSON**，和 `onboard.mjs` 生成的文件是同一份；Decap 与 onboarding 工具互不冲突（都是改 `examples/<slug>.json`）
- ⚠️ 改完**不用**你再 `git push`：Decap 的提交本身就是一次 push，Actions 会自动重跑

---

## 3. 一次性激活：注册 GitHub OAuth App（你做一遍，全站复用）

`admin/config.yml` 里的 `backend.client_id` **已填入并激活**（你注册的 OAuth App Client ID：`Ov23lifKVTnpwVMYhl3r`），`/demo-sites/admin/` 已可登录编辑。下面是**给真实客户在其独立仓库启用时**的标准注册步骤（演示站已激活，客户仓库需各自注册 OAuth App）：

1. 打开 GitHub → 右上角头像 → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. 填：
   - **Application name**：`demo-sites CMS`（随意）
   - **Homepage URL**：`https://lcclicheng.github.io/demo-sites/`
   - **Authorization callback URL**：`https://lcclicheng.github.io/demo-sites/admin/`
     （必须精确等于 Decap 所在页面 URL，含结尾 `/admin/`）
3. 创建后拿到 **Client ID**（和 Client Secret）。🔒 **本方案只用 Client ID，Client Secret 永远不要写进 `config.yml`**——它是前端公开加载的，写进去会泄露；Secret 留空即可，无需提交
4. 编辑客户仓库的 `admin/config.yml`，把 `client_id` 填入客户自己的 Client ID（演示站已填好，无需再改）：
   ```yaml
   backend:
     name: github
     repo: <客户仓库名>
     branch: main
     base_url: https://api.github.com
     auth_scope: repo
     client_id: "客户仓库的 Client ID"   # 🔒 只填 ID；绝不填 Client Secret
   ```
5. `git add -u && git commit && git push origin main` —— Actions 重新部署后，该仓库的 `/admin` 即可用对应 GitHub 账号登录编辑。

> 权限说明：`auth_scope: repo` 表示该 GitHub 账号需对 `lcclicheng/demo-sites` 有**写权限**才能保存。当前仓库只有你本人有写权限 → 只有你能登录编辑。把某客户加为仓库**协作者**即可让他也能改（见 §6 生产模型）。

---

## 4. 客户使用流程（启用后）

1. 浏览器开 `https://lcclicheng.github.io/demo-sites/admin/`
2. 点「Login」→ 用 GitHub 账号授权
3. 左侧选站点（如 Sotto Sotto）→ 表单改名称 / 电话 / 菜单 / 关于 / 评价 / 营业时间等
4. 点「Publish」→ 立即 commit 到 `main` → 等 Actions 跑完（约数分钟）→ 刷新站点即见新内容

> **演示期图片编辑方案（子路径部署下）**：当前脚手架把图片路径当作**字符串**编辑（如 `./images/screenshot-1.jpg`），不接 Decap 上传组件。客户在 `/admin` 里只能「切换引用哪张已存在的图」；要换真实照片，由你（owner）把新图覆盖进 `assets/<slug>/` 同名文件（图片已带 `?v=` 防缓存，覆盖后即刷新），再让客户在 CMS 里把路径指到新文件名。这比开放上传更稳，且规避子路径下 `public_folder` 错位 404。
>
> ⚠️ **强烈建议真实客户直接走「形态 A：独立仓库 + 根路径自定义域名」**（`custom-domain.md`）：根路径下 `public_folder: /images` 才正确，届时可在 CMS 启用图片上传（§7），客户自助传图、体验完整。演示仓库 `/demo-sites/<slug>/` 子路径的图片上传兼容性坑，都由此规避。

---

## 5. 全 10 站自动映射（已落地，无需手工加站）

> **重要口径统一（避免文档与代码脱节）**：`admin/config.yml` **当前已包含全部 10 个演示站**的完整字段映射，不再是「只有 `sotto-sotto`」。这是 `gen-decap-config.mjs` 脚本自动生成的（见下），**不是手写的**。

- Decap 保存时**只写配置里出现的字段，未列出的 key 会被丢弃** —— 所以每个站点必须在 `config.yml` 里**完整映射其 JSON 的全部 key**（含结构性 `template` / `slug`；后者已设为 `widget: hidden` + `required: true`，客户在 UI 看不到也改不了，保存时自动保留原值，彻底防误删导致构建崩）。
- 自动生成（单一事实源 = `build-clean.sh` 的 `PROJS`）：
  ```bash
  node gen-decap-config.mjs      # 解析 PROJS → 对每个 examples/<slug>.json 递归推断类型生成字段 → 写 admin/config.yml
  git commit -am "chore: 刷新 Decap 配置" && git push
  ```
  脚本内置**覆盖校验**：任一站 JSON 的 key 未被映射就中止写入（绝不输出残缺 config）。已验证 10 站字段覆盖 100%（44~67 字段/站）。
- **新增站点后**：把站加入 `PROJS` → 跑一次 `node gen-decap-config.mjs` → push，该站即出现在 `/admin` 左侧。无需手工复制字段块。
- ⚠️ 手工维护 `files:` 段极易漏字段导致保存丢键、构建崩；**统一走脚本生成**，`admin/config.yml` 头部已注明勿手改。

---

## 6. 生产模型（真实付费客户）

演示仓库 `demo-sites` 的 `/admin` 由你（owner）管理 demo 内容即可。给**真实客户**做自助后台，推荐：

- **每个客户一个独立 GitHub 仓库**（clone 本工程或精简模板），部署到客户**自己的自定义域名**（见 `custom-domain.md`）
- 客户域名根路径 `/` 提供站点 → Decap 的 `public_folder: /images` 图片路径才正确（演示仓库是 `/demo-sites/<slug>/` 子路径，绝对路径图片会错位，故脚手架用字符串路径规避）
- 把客户加为该客户仓库的**协作者**（或开一个仅该客户的 OAuth App），他只能改自己仓库 → 天然隔离，不会动到别人
- 客户仓库的 `admin/config.yml` 里 `repo` 改客户仓库名、`file` 指向该客户 JSON

这样：客户自助改内容 → 触发自己仓库的 Actions → 自己域名上线。**你只负责模板与运维**，契合 `workflow.md` §5.9 的「未来演进方向」。

---

## 7. 图片上传（进阶，可选）

当前为安全/兼容，图片用字符串路径、不接上传。若要客户直接传图：

- 在 `admin/config.yml` 顶部加（生产模型/根路径部署时）：
  ```yaml
  media_folder: "assets"        # 上传落盘到仓库 assets/
  public_folder: "/images"      # 内容里引用的 URL 前缀
  ```
- 把字段里的 `image` 从 `widget: string` 改为 `widget: image`
- 限制：仅当站点在根路径 `/` 提供时（`public_folder: /images` 才对）；演示仓库子路径场景请勿启用，否则图片 404
- 上传后 Decap 把图写进 `assets/`，`generate.mjs` 构建时拷进 `dist/images/`，自动上线

---

## 8. 安全与防坑清单

- ✅ **全量映射**：每个站点的 `config.yml` 字段必须覆盖其 JSON 全部 key（含 `template`/`slug`），否则保存丢字段 → 构建崩。当前 `admin/config.yml` 已由 `gen-decap-config.mjs` 自动生成**全部 10 站**的完整映射（100% 覆盖）。
- ✅ **结构性字段已隐藏防误改**：`template` / `slug` 已设为 `widget: hidden` + `required: true`——客户在 UI 看不到也改不了，保存时自动保留原值，从机制上杜绝误删导致构建崩。无需再靠「提醒别动」。
- ✅ **权限随仓库**：没被加为协作者的 GitHub 账号登录后无法保存 → 天然防外人改。
- 🔧 **草稿/审核（可选）**：想先审后发，可在 `config.yml` 顶部加 `publish_mode: editorial_workflow`（会走 PR 审核流程，单人可不加）。
- 🔧 **回滚**：Decap 每次保存都是一次 commit，GitHub 历史可随时 revert 到旧版本。

---

## 9. 验证 / 排错

| 现象 | 原因 | 解决 |
|---|---|---|
| `/admin` 打开但登录报错/无反应 | `client_id` 未填或 OAuth App 未注册 | 见 §3，填 Client ID 并 push |
| 登录后保存，站点字段变少/构建崩 | `config.yml` 漏映射该站某些 key | 按 §5 补全全部 key 后重推 |
| 图片 404（启用上传后） | 子路径部署下 `public_folder: /images` 错位 | 演示仓库勿启用上传；用字符串路径（§7） |
| 保存后线上没变 | Actions 还在跑（约数分钟）或失败 | 仓库 → Actions 看 run 日志；失败多为 JSON 结构问题 |

---

## 10. SEO / sitemap 自动更新（CMS 保存后无需手动处理）

客户在 `/admin` 保存 → 一次 commit 到 `main` → **Actions 自动重跑整条流水线**：

```
validate-sites.mjs → build-clean.sh（generate.mjs 重建所有站，OG/meta 从最新 JSON 重新注入）
                  → gen-seo.mjs（重新生成 sitemap.xml + robots.txt）
                  → deploy-pages
```

- **内容类改动（菜单/文案/营业时间/图片路径）**：构建时 `generate.mjs` 重新注入最新 JSON，SEO 元信息（title/description/og:*）与线上内容**自动同步**，无需你干预。
- **sitemap.xml**：每次部署由 `gen-seo.mjs` 从 `PROJS` 重新生成，站点 URL 列表始终正确（CMS 改内容不改变 slug，故 URL 不变；新增/下线站点时 sitemap 随之更新）。
- 结论：**CMS 保存后 SEO 与 sitemap 均自愈**，你不必为「内容更新后 SEO 滞后」担心；若线上没变，先等 Actions 跑完（约数分钟）再看。

---

## 11. 一页纸快速上手卡（发给启用 CMS 的客户）

> 把下面这段复制成一张卡，随交付发给客户即可。

```
【你的网站自助后台 · 快速上手】
① 打开：https://<你的域名>/admin/   （或演示站 https://lcclicheng.github.io/demo-sites/admin/）
② 点「Login with GitHub」→ 用你的 GitHub 账号授权
③ 左侧选你的站点 → 改名称 / 电话 / 菜单 / 文案 / 营业时间 / 评价
④ 点「Publish」→ 自动保存并上线（约几分钟，刷新即见）
⑤ 换照片？联系我（owner）发图，我放好你再在后台指到新图名
⑥ 遇到问题？随时微信/邮件找我。内容改动我都会帮你把关，放心改。
```

---

## 12. 未来扩展提示（可选）

- **图片上传进阶**：真实客户走「独立仓库 + 根域名」后，可在 `admin/config.yml` 加 `media_folder` / `public_folder: /images` 并启用 `widget: image` 让客户直接传图（见 §7）。
- **图床混合方案**：若仓库因图片膨胀变慢，可考虑 Cloudinary / GitHub 直接上传 的混合——CMS 上传落 Cloudinary 返回 URL，仓库只存链接，避免仓库体积失控。
- **依赖与安全监控**：在客户仓库开启 **GitHub Dependabot**（自动 PR 升级依赖）+ 利用仓库 **Insights / Actions 日志** 设阈值告警（仓库大小、构建时长），比仅打印更主动。
- **审核流程**：想先审后发，在 `admin/config.yml` 顶部加 `publish_mode: editorial_workflow`（走 PR 审核，单人可不加）。

---

*本文档随 `workflow.md` 维护，当前状态（v0.8）：Decap CMS 全 10 站自动映射（`gen-decap-config.mjs` 生成，100% 覆盖防丢字段）+ `template`/`slug` 已设 hidden+required + 图片 `?v=` 防缓存 + 演示站 OAuth 已激活；真实客户按 §6 生产模型各自注册 OAuth App 启用即生产可用。*
