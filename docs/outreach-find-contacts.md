# 四家高风险商家 · 查找真实邮箱指南

> 目的：为 `outreach-recipients.json` 补齐四家**核实真实邮箱**。JSON（`examples/*.json`）里现有的 `email` 是 OSM/demo **占位、未核实，禁用**，仅作参考。
> 发送通道已就绪（Gmail SMTP 自测通过）。你核实到真实邮箱后，填进 `outreach-recipients.json` 的 `email` 字段，或发我代填，我即正式群发。

## 为什么必须你自己找
GMB / Facebook 留言无批量 API、需你本人账号，且自动化发会被判 spam 封号；邮件 API 自动发（已配好）需要**真实收件邮箱**。占位邮箱直接发会 bounce 或发错人。

## 四家精确信息

### 1. Indaba Yoga（瑜伽）
- 行业：Yoga & Wellness
- 地址：**18 Hayes Place, London NW1 1HJ**（Marylebone）
- 搜索词：`Indaba Yoga Marylebone`
- 优先渠道：Google 商家资料 → 官网 Contact → Instagram
- 占位邮箱（仅参考，禁用）：`breathe@indabayoga.co.uk`
- 预览链接：https://lcclicheng.github.io/demo-sites/indaba-yoga/

### 2. Seddons Solicitors（律师事务所）
- 行业：Solicitors
- 地址：**5 Portman Square, London W1H 9FL**（Marylebone）
- 搜索词：`Seddons Solicitors Portman Square`
- 优先渠道：Google 商家资料 → LinkedIn（律所常用）→ 官网 Contact
- 占位邮箱（仅参考，禁用）：`enquiries@seddons-solicitors.co.uk`
- 预览链接：https://lcclicheng.github.io/demo-sites/seddons-law/

### 3. Vale Hardware（五金店）
- 行业：Hardware · Keys · Repairs
- 地址：**8 Clifton Road, London W9 1SZ**（Maida Vale）
- 搜索词：`Vale Hardware Maida Vale`
- 优先渠道：Google 商家资料 → Facebook（社区店概率高）
- 占位邮箱（仅参考，禁用）：`hello@valehardware.co.uk`
- 预览链接：https://lcclicheng.github.io/demo-sites/vale-hardware/

### 4. Papa Bruno（西西里餐厅）
- 行业：Sicilian Restaurant
- 地址：**47 Marsham Street, London SW1P 3DP**（Westminster）
- 搜索词：`Papa Bruno Sicilian Westminster` 或 `Papa Bruno Marsham Street`
- 优先渠道：Google 商家资料 → Instagram（餐厅社媒活跃）→ Facebook
- 占位邮箱（仅参考，禁用）：`ciao@papabruno.co.uk`
- 预览链接：https://lcclicheng.github.io/demo-sites/papa-bruno/

## 通用查找步骤（每家都一样）

1. **Google 商家资料（最稳）**
   搜「商家全名 + postcode」（如 `Indaba Yoga NW1 1HJ`）→ 点开商家资料页。
   - 若资料页显示**官网**链接 → 点进去找 Contact / About 页拿真实邮箱。
   - 资料页本身可能直接显示邮箱（少数商家填了）。
2. **Facebook 主页**
   搜商家名 + 城市，认准「关于/地址」匹配上面 street 的官方页（有真实帖子/评论/打卡）。主页简介或「联系」标签常留邮箱。
3. **Instagram**
   搜名 + 地点，看 bio 是否留邮箱或「📧」联系方式。
4. **地址交叉核对（防找错同名店）**
   London 同名商家极多。任何页面的地址必须与上面 street **完全一致**才算核实通过；对不上就跳过。

## 找到后填回

把四个真实邮箱发我，或自己改 `gh-pages-build/outreach-recipients.json`：
```json
{ "slug": "indaba-yoga", "email": "这里填真实邮箱", ... }
```
改完告诉我，我立刻正式群发四家（Gmail SMTP，间隔 3s，自动加退订头、写发送日志）。
