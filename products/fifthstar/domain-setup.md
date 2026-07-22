# FifthStar 自定义域名配置指引（thefifthstar.co.uk · Cloudflare 主线）

> 适用：把 FifthStar 官网从 GitHub Pages 子域 `https://lcclicheng.github.io/thefifthstar/`
> 绑定到自有域名 `https://thefifthstar.co.uk`。
> 仓库 `lcclicheng/thefifthstar` 已是 **main 分支 root 原生部署**（无 workflow / 无 gh-pages 分支），切换域名基本开箱即用。
> **注册商已定为 Cloudflare**（Registrar 一条龙：注册 + 托管 DNS + 免费 SSL/隐私），以下步骤以 Cloudflare 为主线。

---

## 0. 当前状态（先看清）

| 项 | 状态 |
|---|---|
| 线上页 | `https://lcclicheng.github.io/thefifthstar/`（已部署 v3，含三批改动） |
| 自定义域名 `thefifthstar.co.uk` | **尚未注册**（2026-07-22 `nslookup` 返回 *Non-existent domain*） |
| 仓库 CNAME 文件 | 无（未绑自定义域名） |
| 部署形态 | 独立仓库 root 部署，无串台风险 |

---

## 1. 在 Cloudflare Registrar 注册 thefifthstar.co.uk（一条龙）

1. 登录 **https://dash.cloudflare.com** → 左侧菜单 **Registrar**（或访问 https://domains.cloudflare.com ）。
2. 点 **Register domains** → 搜索 `thefifthstar.co.uk` → 加入购物车。
   - 可选同时注册 `thefifthstar.uk` 作备选（防止被抢 / 做重定向）。
3. 结算信息：
   - 注册人：**Ethan Li** / 邮箱 `lic28790@gmail.com`。
   - 地址：填真实可联系地址（**.uk 无 residency 限制**，海外地址可接受；Nominet 要求有效地址）。
   - **Auto-renew 默认开启**（防掉线，务必保留）。
4. 结算后域名出现在 Cloudflare，**自动建 Zone 并由 Cloudflare 托管 DNS** —— 无需手动改 NS，直接进入 §3。
5. WHOIS 隐私默认免费 redact（个人信息不公开）。

> Cloudflare Registrar 按批发价收费、无涨价续费、无追加销售，适合长期持有。

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

- [ ] 1. Cloudflare Registrar 注册 `thefifthstar.co.uk`（记续费日，auto-renew 开）
- [ ] 2. 仓库加 `CNAME`（`thefifthstar.co.uk`）并推送  **或**  Settings 填自定义域名
- [ ] 3. Cloudflare DNS 加 A 记录（四 IP）或 apex CNAME + www CNAME（灰云）
- [ ] 4. Cloudflare SSL/TLS 模式设为 **Full (strict)**
- [ ] 5. `nslookup` 确认解析生效
- [ ] 6. Settings → Pages → Custom domain 填 + Enforce HTTPS
- [ ] 7. `curl -sI` 验证 200 HTTPS
- [ ] 8. 浏览器硬刷新确认 v3 页 + OG 图正常

---

### 备选：若域名在别家注册（非 Cloudflare Registrar）

1. 在 Cloudflare 加 Zone `thefifthstar.co.uk` → 得到两个 NS（如 `xxx.ns.cloudflare.com` / `yyy.ns.cloudflare.com`）。
2. 去原注册商（Porkbun / Namecheap 等）把域名的 **Nameserver 改成 Cloudflare 给的 NS**。
3. 回到 §3 / §4 继续（DNS 记录与 SSL 设置完全相同）。

---

*本文件随 FifthStar 部署维护。Cloudflare / Nominet / GitHub Pages 政策变动时请同步更新。*
