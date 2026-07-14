# 客户自助内容后台（Decap CMS）· v0.7 脚手架

> 版本：v0.7 ｜ 更新：2026-07-14 ｜ 作者：lcclicheng（一人公司 / 独立开发者）
> 配套：`admin/index.html` + `admin/config.yml`（仓库内脚手架）；`deploy.yml` 已把 `admin/` 发布到线上 `/demo-sites/admin/`。
> 关联：`workflow.md` §5.9（交付后维护流程）、§11（待办：客户自助 CMS 标记 v0.7 脚手架完成）。

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

`admin/config.yml` 里的 `backend.client_id` 现在是占位注释，所以 `/admin` 能打开但**登录会失败**（正常，不是 bug）。激活只需一次：

1. 打开 GitHub → 右上角头像 → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. 填：
   - **Application name**：`demo-sites CMS`（随意）
   - **Homepage URL**：`https://lcclicheng.github.io/demo-sites/`
   - **Authorization callback URL**：`https://lcclicheng.github.io/demo-sites/admin/`
     （必须精确等于 Decap 所在页面 URL，含结尾 `/admin/`）
3. 创建后拿到 **Client ID**（和 Client Secret，本方案只需 Client ID，Secret 可留空）
4. 编辑 `admin/config.yml`，把这一行取消注释并填入：
   ```yaml
   backend:
     name: github
     repo: lcclicheng/demo-sites
     branch: main
     base_url: https://api.github.com
     auth_scope: repo
     client_id: "这里填你的 Client ID"
   ```
5. `git add -u && git commit && git push origin main` —— Actions 重新部署后，`/admin` 即可用 GitHub 账号登录编辑。

> 权限说明：`auth_scope: repo` 表示该 GitHub 账号需对 `lcclicheng/demo-sites` 有**写权限**才能保存。当前仓库只有你本人有写权限 → 只有你能登录编辑。把某客户加为仓库**协作者**即可让他也能改（见 §6 生产模型）。

---

## 4. 客户使用流程（启用后）

1. 浏览器开 `https://lcclicheng.github.io/demo-sites/admin/`
2. 点「Login」→ 用 GitHub 账号授权
3. 左侧选站点（如 Sotto Sotto）→ 表单改名称 / 电话 / 菜单 / 关于 / 评价 / 营业时间等
4. 点「Publish」→ 立即 commit 到 `main` → 等 Actions 跑完（约数分钟）→ 刷新站点即见新内容

> 图片：当前脚手架把图片路径当作**字符串**编辑（如 `./images/screenshot-1.jpg`），不接 Decap 上传组件。客户可切换「引用哪张已存在的图」；要换真实照片仍由你（owner）把图覆盖进 `assets/<slug>/`（或未来启用上传，见 §7）。

---

## 5. 启用更多站点（recipe）

Decap 保存时**只写配置里出现的字段，未列出的 key 会被丢弃** —— 所以每个站点必须在 `config.yml` 里**完整映射其 JSON 的全部 key**（含结构性 `template` / `slug`），否则保存会丢字段、站点残缺甚至构建崩。

脚手架已**完整映射 `sotto-sotto`**（restaurant 模板）作为参考实现。要加别的站：

1. 用 Decap 的「`files:`」机制，在 `collections[0].files` 下**复制一份** `sotto-sotto` 的块
2. 改两处：`name` / `label`（显示名）、`file: "examples/<slug>.json"`
3. **关键**：把字段列表改成该站 JSON 的真实全部 key（不同模板字段不同！先用 Read 打开 `examples/<slug>.json` 核对每个 key，漏一个就会丢）
4. `git push` → 该站出现在 `/admin` 左侧

> 嫌逐个映射麻烦 / 怕漏字段？直接让我（AI）按该模板 JSON 生成完整字段块即可，准确无误。当前仅 `sotto-sotto` 已验证全量映射，其他 9 站**尚未**加入配置（避免误改丢字段）。

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

- ✅ **全量映射**：每个站点的 `config.yml` 字段必须覆盖其 JSON 全部 key（含 `template`/`slug`），否则保存丢字段 → 构建崩。脚手架的 `sotto-sotto` 已全量覆盖。
- ✅ **结构性字段勿改**：`template` / `slug` 决定构建与部署路径，UI 里标了「结构性·勿改」；真客户仓库里可直接从配置移除这两行（但移除后 Decap 保存会丢它们 → 所以要么保留、要么你线下改 JSON 时同步）。**最省心：保留、提醒客户别动。**
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

*本脚手架为 v0.7 起点：已接好 Decap + GitHub 后台、完整映射 sotto-sotto、写入 deploy 发布链路、文档就绪。真实客户逐个启用 + 注册 OAuth App 后即生产可用。*
