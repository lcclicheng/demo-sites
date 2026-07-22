# FifthStar 自定义域名配置指引（thefifthstar.co.uk · 国内注册 + Cloudflare DNS）

> 适用：把 FifthStar 官网从 GitHub Pages 子域 `https://lcclicheng.github.io/thefifthstar/`
> 绑定到自有域名 `https://thefifthstar.co.uk`。
> 仓库 `lcclicheng/thefifthstar` 已是 **main 分支 root 原生部署**（无 workflow / 无 gh-pages 分支），切换域名基本开箱即用。
> **DNS/SSL 用 Cloudflare**（免费 CDN/WAF + 自动托管）；**域名注册走国内云厂商（阿里云/腾讯云）**——当前银行卡不支持境外支付，Cloudflare/Porkbun/Namecheap 都刷不了。注册后在控制台把 NS 改到 Cloudflare 即可，DNS/SSL 配置与 Cloudflare 主线完全一致。

---

## 0. 当前状态（先看清）

| 项 | 状态 |
|---|---|
| 线上页 | `https://lcclicheng.github.io/thefifthstar/`（已部署 v3，含三批改动） |
| 自定义域名 `thefifthstar.co.uk` | **尚未注册**（2026-07-22 `nslookup` 返回 *Non-existent domain*） |
| 仓库 CNAME 文件 | 无（未绑自定义域名） |
| 部署形态 | 独立仓库 root 部署，无串台风险 |

---

## 1. 在国内云厂商注册 thefifthstar.co.uk（支付宝/微信付）

> 你的卡不支持境外支付，因此**不能**在 Cloudflare / Porkbun / Namecheap 注册。改用国内平台，付款走支付宝/微信/网银。DNS 与 SSL 仍用 Cloudflare（§3/§4）。

**1a. 选平台（已定：腾讯云）**
- ✅ **腾讯云（DNSPod）** `console.cloud.tencent.com/domain` —— 支持 `.co.uk`，**微信支付/QQ 钱包/网银**，不涉及境外卡，符合当前支付约束。
- （备选）阿里云（万网）`wanwang.aliyun.com` —— 支持 `.co.uk`，支付宝/微信/银联。流程与腾讯云一致，仅界面不同。

**1b. 注册步骤（腾讯云，你选的这条）**
1. 登录 **console.cloud.tencent.com** → 进入 **域名注册** 控制台 → 点「**新购域名**」→ 搜索 `thefifthstar.co.uk`。
   - 若 `.co.uk` 搜不到/不可注册（极少），备选 `thefifthstar.com`（流程完全一致）。
   - 可选勾选同时注册 `thefifthstar.uk` 防抢（非必须）。
2. **建域名信息模板（关键，过实名用）**：
   - 位置：域名注册控制台 → **信息模板** → 新建模板。
   - 主体类型选「**个人**」；填**你本人的真实信息**（姓名/证件号用你身份证，邮箱 `lic28790@gmail.com` 或你常用邮箱，地址填真实可联系地址）。
   - ⚠️ 腾讯云要求模板与账号实名一致才能过审，请用**真实身份**建模板（公开 WHOIS 会被隐私保护/Nominet redact，不影响 Ethan Li 对外品牌）。
   - 提交后做**实名认证**（个人上传身份证照片，通常几分钟~1 个工作日）。模板状态变「**已实名**」才能用于注册。
3. 回到购域名页，勾选 `thefifthstar.co.uk`，绑定刚建好的已实名模板 → 选年限（建议 **1–3 年**）→ **开启自动续费** → 结算。
4. 支付方式选 **微信支付**（或 QQ 钱包/网银）→ 扫码完成付款。
5. 注册成功 → 进入 **域名管理** 控制台看到 `thefifthstar.co.uk`（状态「注册中」→ 几分钟内变「正常」）。
   - `.uk` 无 residency 限制，中国地址完全 OK。

**1c. 把 DNS 交给 Cloudflare（关键一步）**
1. 先在 Cloudflare 加站点：登录 `dash.cloudflare.com` → **Add a Site** → 输入 `thefifthstar.co.uk` → 选 Free → 得到两个 NS（如 `xxx.ns.cloudflare.com` / `yyy.ns.cloudflare.com`）。
2. 回腾讯云 **域名管理** → 选 `thefifthstar.co.uk` → **更多操作 / 修改 DNS 服务器（Nameserver）** → 把 NS 改成上面两个 Cloudflare NS，删掉原厂 NS（如 `*.dnspod.net`）。
3. 保存。NS 全球生效通常几分钟~24h（用 `nslookup thefifthstar.co.uk` 看是否已是 Cloudflare 接管）。

> 之后所有 DNS 记录、SSL、Pages 绑定都到 Cloudflare 做（§3/§4/§5），与 Cloudflare 注册主线完全一致。

---

## 2. 让 GitHub 认识这个域名（CNAME）

两种方式，选其一：

**方式 A — 仓库根加文件（推荐，可版本管理）**
在 `lcclicheng/thefifthstar` 仓库根创建文件 `CNAME`，内容仅一行：
```
thefifthstar.co.uk
```
提交并推送。GitHub Pages 读到后自动绑该域名。

**方式 B — 仓库 Settings 填**
仓库 → **Settings → Pages → Custom domain** 填 `thefifthstar.co.uk` → Save（GitHub 会自动生成 `CNAME` 文件）。
> 若用 B，建议后续把自动生成的 `CNAME` 也提交进仓库，避免重建丢失。

---

## 3. Cloudflare DNS 记录（关键）

进入 **dash.cloudflare.com → 选中 thefifthstar.co.uk → DNS → Records**，添加：

| 类型 | Name | 内容 | 代理状态 |
|---|---|---|---|
| **A** | `@` | `185.199.108.153` | 仅 DNS（灰云）⚑ |
| **A** | `@` | `185.199.109.153` | 仅 DNS（灰云） |
| **A** | `@` | `185.199.110.153` | 仅 DNS（灰云） |
| **A** | `@` | `185.199.111.153` | 仅 DNS（灰云） |
| **CNAME** | `www` | `lcclicheng.github.io` | 仅 DNS（灰云） |

> ⚑ **首推"仅 DNS"（灰云）**：避免 Cloudflare 代理缓存 / 证书协商干扰 GitHub Pages 验证。确认 HTTPS 正常后，若想要免费 CDN/WAF，可再把云点橙（橙色代理对 GitHub Pages 静态站通常也 OK）。

**更省心的等价写法**（apex 直接用 CNAME，Cloudflare 自动扁平化）：
| 类型 | Name | 内容 |
|---|---|---|
| **CNAME** | `@` | `lcclicheng.github.io` |
| **CNAME** | `www` | `lcclicheng.github.io` |

> 二选一即可。CNAME 扁平化方案无需记四个 IP，推荐。

---

## 4. Cloudflare SSL/TLS 设置（致命，别错）

进入 **SSL/TLS → Overview → 加密模式**：
- ✅ 选 **Full (strict)**（GitHub Pages 自带有效证书，strict 最安全）
- 或 **Full**（亦可）
- ❌ **绝不能选 Flexible** —— GitHub Pages 强制 HTTPS，Flexible 会导致「重定向次数过多」死循环。

可选增强：**SSL/TLS → Edge Certificates → 开启 Always Use HTTPS**（自动 http→https）。

---

## 5. GitHub Pages 绑定 + Enforce HTTPS

1. 等 **DNS 生效**：Cloudflare 通常几秒~几分钟；用 `nslookup thefifthstar.co.uk` 确认已解析到 GitHub IP（或 CNAME 扁平化后解析到 GitHub）再继续。
2. 仓库 → **Settings → Pages → Custom domain** 填 `thefifthstar.co.uk` → Save。
3. 勾选 **Enforce HTTPS**。
   - SSL 证书由 GitHub Pages **自动签发**，需等 DNS 生效 + 证书下发（通常几分钟到 24h）。
   - 若 Save 报 "domain does not resolve"，说明 DNS 未生效，等一会儿重试。
4. 页面显示「Your site is published at https://thefifthstar.co.uk」即成功。

---

## 6. 验证上线

```bash
nslookup thefifthstar.co.uk              # 应解析到 185.199.10x.153（或 github.io）
curl -sI https://thefifthstar.co.uk/     # 期望 HTTP/2 200，且为 HTTPS
curl -sI https://www.thefifthstar.co.uk/ # 期望 200 或 301→根域名
```
浏览器硬刷新 `https://thefifthstar.co.uk` 应看到 v3 落地页（深色 / Playfair，含创始客户招募 + Ethan 头像 + "满意再付钱"承诺）。
用社交卡片调试器（LinkedIn Post Inspector / Facebook Debugger）验证 OG 图与描述已更新为新域名。

---

## 7. 注意事项 / 陷阱

- **SSL 模式必须 Full / Full(strict)**，Flexible 必死循环（§4）。
- **先 DNS 生效，再点 Enforce HTTPS**：否则 GitHub 校验失败反复报错。
- **GitHub Pages 单站点只能绑一个自定义域名**：thefifthstar 是独立仓，无串台风险；不要把此 CNAME 用到 demo-sites 仓。
- **apex 不能直接 301**：裸域名 A 记录只能指向 IP。想 `www`↔apex 互跳，在 GitHub Pages 的 Custom domain 设置里选「Redirect to apex」即可（GitHub 原生支持），无需注册商转发。
- **续费**：Auto-renew 已开；仍建议日历记续费日，域名掉了站点直接 404。
- **相对路径已兼容**：`index.html` 用相对路径引用 `ethan.jpg` 等资产，切换域名无需改代码（B2 部署已验证）。

---

## 8. 执行检查清单

- [ ] 1. 腾讯云（DNSPod）注册 `thefifthstar.co.uk`（微信付，自动续费开，已实名模板）
- [ ] 2. 仓库加 `CNAME`（`thefifthstar.co.uk`）并推送  **或**  Settings 填自定义域名
- [ ] 3. Cloudflare DNS 加 A 记录（四 IP）或 apex CNAME + www CNAME（灰云）
- [ ] 4. Cloudflare SSL/TLS 模式设为 **Full (strict)**
- [ ] 5. `nslookup` 确认解析生效
- [ ] 6. Settings → Pages → Custom domain 填 + Enforce HTTPS
- [ ] 7. `curl -sI` 验证 200 HTTPS
- [ ] 8. 浏览器硬刷新确认 v3 页 + OG 图正常

---

### 说明：注册商与 DNS 分离是常态

无论域名在阿里云、腾讯云、Cloudflare 还是别家注册，**只要把 Nameserver 指向 Cloudflare 的两个 NS（§1c）**，后续 DNS 记录（§3）、SSL（§4）、Pages 绑定（§5）都完全一样。本指引的 Cloudflare 部分不受"在哪注册"影响。

---

*本文件随 FifthStar 部署维护。Cloudflare / Nominet / GitHub Pages 政策变动时请同步更新。*
