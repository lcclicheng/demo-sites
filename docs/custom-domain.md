# 自定义域名 / DNS / SSL / 客户交接 SOP

> 适用场景：**真实英国客户签约、要拥有自己的域名**（如 `sottosotto.co.uk`）时执行。
> 演示期用 GitHub Pages 子路径 `https://lcclicheng.github.io/demo-sites/<slug>/` 即可，无需此流程。
> 配套 `workflow.md` §11「自定义域名」项；相对路径（`base: './'`）已兼容，切换域名基本开箱即用。

---

## 0. 两种部署形态（先决定）

| 形态 | 适用 | 做法 |
|---|---|---|
| **A. 每客户独立仓库 / 部署** ✅ 推荐 | 单站长期运营、要根域名（`sottosotto.co.uk`） | 把该站 `dist` 单独部署到客户仓库 / 客户域名根路径，CNAME 放根 |
| **B. 复用本仓库子路径** | 仅想用自有域名指向现有演示站 | 客户域名用**重定向 / 子域**指向 `/demo-sites/<slug>/`；CNAME 仍指向 GitHub Pages，OG 链接保持子路径 |

> 形态 A 更干净（客户有独立站点与仓库，便于后续自助 / 迁移）；本 SOP 以形态 A 为主线。

---

## 1. 注册域名

- 客户自己注册，或你代注册后把**管理账号 + 续费日期**交接给客户。
- 英国常用：`.co.uk` / `.uk`（Nominet 管理）、`.com`。选客户品牌名。
- ⚠️ 提醒客户：域名 renewal 遗忘会导致站点掉线，交接时强调续费责任。

---

## 2. 生成 CNAME 文件

部署产物根目录放一个 `CNAME` 文件，内容仅一行：客户域名（如 `sottosotto.co.uk`）。
- 形态 A：在单站 `dist/` 根放 `CNAME`，随部署上传。
- 形态 B：在 `public/` 根放 `CNAME`（即 `/demo-sites/` 根）。
- GitHub Pages 读到 CNAME 会自动把该域名绑到这个 Pages 站点。

---

## 3. DNS 配置（在客户域名注册商 / DNS 控制台）

**Apex（根域名，如 `sottosotto.co.uk`）** —— 用 A 记录指向 GitHub Pages 四个 IP：
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
**www 子域** —— CNAME 指向 `<你的用户名>.github.io`（如 `lcclicheng.github.io`）。
> 若 DNS 提供商支持 **ALIAS / ANAME**（如 Cloudflare、DNSimple），apex 也可用 ALIAS 指向 `<用户名>.github.io`，更省心。

---

## 4. GitHub Pages 绑定 + SSL

1. 仓库 → Settings → Pages → Custom domain 填入客户域名 → Save。
2. 勾选 **Enforce HTTPS**（SSL 证书由 GitHub Pages **自动签发**，需等 DNS 生效、通常几分钟到 24h）。
3. 等待 Pages 显示「Your site is published at https://客户域名」。

---

## 5. 修正站点内的绝对链接（SEO）

- 设环境变量 `SITE_BASE_URL=https://客户域名` 后跑 `generate.mjs` / `gen-seo.mjs`，使 `og:url`、canonical、`sitemap.xml` 指向客户域名而非 GitHub 子路径。
- 模板全部用相对路径，无需改 JSX。

---

## 6. 验证上线

```bash
curl -sI https://客户域名/          # 期望 HTTP/2 200，且为 HTTPS
curl -sI https://客户域名/sitemap.xml
# 社交卡片调试器验证 OG 图与描述
```

---

## 7. 客户交接

- 交付：域名管理账号、DNS 控制台权限、续费日期、GitHub 仓库 / Pages 设置权限。
- 提醒：隐私政策与 Cookie 同意需客户自行完善真实条款（见 `delivery-checklist.md`）。
- 后续改内容：仍由你（owner）改 JSON + 重建部署；若客户频繁自改，未来再做轻量 CMS（见 `workflow.md` §11）。

---

*本 SOP 随 `workflow.md` 维护。ECCTA / Nominet / GitHub Pages 政策变动时请同步更新。*
