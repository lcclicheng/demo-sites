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

## 形态 B 实施步骤（复用本仓库 /demo-sites/ 子路径）

**适用**：客户已有 / 想用自有域名，但不想独立部署，仅希望自有域名指向现有的 `https://lcclicheng.github.io/demo-sites/<slug>/`。

> ⚠️ **核心限制（必读）**：GitHub Pages 一个站点只能绑定**一个**自定义域名，且 CNAME 作用于整个 Pages 站点（即整个 `/demo-sites/`）。因此**不能**把 `public/` 根的 CNAME 设为客户域名（否则所有演示站都会用客户域名访问，互相串台）。形态 B 的正确做法是**在客户域名侧做重定向 / 转发**，而非在 GitHub Pages 侧绑客户域名。详见 `workflow.md` §2（GitHub Pages 限制）。

### B.1 子方案选择

| 子方案 | 做法 | 适合 |
|---|---|---|
| **B-a URL 转发 / 重定向（推荐）** | 客户域名 301 重定向到 GitHub 子路径 | 最简，不动 GitHub Pages 绑定 |
| **B-b 子域 CNAME** | `www.客户域名` CNAME → `lcclicheng.github.io`，落地页仍为 `/demo-sites/<slug>/` | 想保留客户域名在地址栏（路径仍带 `/demo-sites/<slug>`） |

### B.2 子方案 B-a：URL 转发（推荐，零成本）

1. 在客户域名注册商 / DNS 控制台开启 **URL Forwarding / 301 重定向**：
   - 源：`sottosotto.co.uk`（及 `www.sottosotto.co.uk`）
   - 目标：`https://lcclicheng.github.io/demo-sites/sotto-sotto/`
   - 类型：**301 永久重定向**（不要 302，否则 SEO 权重不传递）
2. 验证：`curl -sI https://sottosotto.co.uk/` 应返回 `HTTP/1.1 301` 且 `Location: https://lcclicheng.github.io/demo-sites/sotto-sotto/`
3. **apex 重定向注意事项**：裸域名（apex，如 `sottosotto.co.uk`）的「A 记录」**无法**做重定向。多数注册商（Namecheap、GoDaddy、Cloudflare）提供「域名转发」功能可对 apex 直接 301；若注册商不支持，改用 **Cloudflare Redirect Rules / Page Rules** 对 `sottosotto.co.uk/*` 做 301 到目标；**不要**把 apex A 记录指向 GitHub Pages 四个 IP 再指望跳转——那会绑定整个 demo-sites 站点，串台。

### B.3 子方案 B-b：子域 CNAME（保留客户域名在地址栏）

1. DNS：`www.sottosotto.co.uk` CNAME → `lcclicheng.github.io`
2. 访问 `https://www.sottosotto.co.uk/demo-sites/sotto-sotto/` 实际落到 GitHub Pages（CNAME 指向 github.io，路径 `/demo-sites/<slug>` 仍有效）
3. **GitHub Pages 对子路径 CNAME 的支持**：GitHub Pages 仅识别仓库 Pages 站点的**根** CNAME。若想让 `www.客户域名` 直接显示 `/demo-sites/<slug>` 内容而地址栏**不带** `/demo-sites`，需客户域名侧再做一次路径重写（如 Cloudflare Worker / 反向代理），超出本 SOP 范围。本方案下地址栏会保留 `/demo-sites/<slug>` 路径。
4. SSL：CNAME 指向 github.io 后，GitHub Pages 自动对该子域签发证书（需 DNS 生效）；若用 Cloudflare，可开「Full (strict)」。

### B.4 SEO 修正（形态 B）

- 因站点仍托管在 GitHub 子路径，**canonical / og:url / sitemap 仍指向 `https://lcclicheng.github.io/demo-sites/<slug>/`**（保持现状，**不要**改 `SITE_BASE_URL`）。
- 若客户强烈要求 SEO 权重归于自有域名，形态 B 不能满足（301 仅传递部分权重，canonical 仍是 GitHub），需升级到**形态 A**（独立部署 + 自定义域名 + `SITE_BASE_URL` 切换，见 §5）。
- 社交卡片调试器验证 OG 图与描述（指向 GitHub 子路径 URL 亦可正常抓取）。

### B.5 验证上线

```bash
curl -sI https://客户域名/                        # 期望 301 → Location: https://lcclicheng.github.io/demo-sites/<slug>/
curl -sI https://lcclicheng.github.io/demo-sites/<slug>/   # 期望 200
```

> 形态 B 是「低成本过渡」方案，适合演示 / 临时；长期运营建议升级形态 A（见 §1–§6）。另见 `workflow.md` 附录 A（slug 约定）与 §8（孤儿站点软阻断）。

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
