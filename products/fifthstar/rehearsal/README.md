# FifthStar · 首客交付 SOP 预演（#322）

> 目的：在**还没有真实转化客户**时，先把 D1（官网 review widget 嵌入）与 D2（邀评系统）
> 两条交付链路跑通一遍，确认可交付、锁定剩余的唯一人工步骤。真实客户转化时直接填空即可。

## 已预演（2026-07-22 夜）

### D1 · 官网 review widget 嵌入（§10 #7）
- 源：`widget/review-widget.html` + `widget-delivery-sop.md`。
- 预演产物：`jadugar-delivery-preview.html` —— 以真实 B 线线索 **Jadugar (B01)** 预填 config
  （`businessName:"Jadugar"`、`googleUrl` 留 Place ID 占位），3 条评价为**明确占位**并带红色
  「REHEARSAL」横幅，提醒交付前替换为 Jadugar 真实公开评价。
- 已验证：embed snippet 结构与 `review-widget.html` 一致（currentColor/color-mix 主题自适应、
  IIFE 渲染、stars/rel/esc 逻辑），可直接发给商户粘贴。
- **唯一剩余人工步骤**：交付时抓 Jadugar 真实 GBP Place ID + 3–5 条真实公开评价（逐字、
  含真实 url+date），填进 config。不可虚构 / 不可删差评（§0 红线）。

### D2 · 邀评系统（半手动文件版）
- 源：`review-request/templates.md` + `review-request/gen-request.mjs`。
- 预演：虚拟商家 "The Copper Kettle"（Manchester / restaurant / Sunday roast）跑通 →
  生成 3 份资产：
  - `copper-kettle/request-email.md`（371 字符，行业语气已套）
  - `copper-kettle/request-sms.txt`（151 字符，<160 不拆分）
  - `copper-kettle/qr-card.html`（A6 可打印二维码卡，含 thefifthstar.site 落款）
- 已验证：行业语气表 + 别名映射 + SMS 长度告警均正常。

## 交付能力状态
- ✅ D1 widget：代码 + SOP + 预填模板就绪，首客只需填空真实评价。
- ✅ D2 邀评：生成器就绪，按 `gen-request.mjs --name … --city … --industry … --review-url …` 即可出包。
- ⏳ 真客户 field-test：等首位 Track B 转化客户，跑一次真实 D1（填真实评价）+ D2（真实商家信息）即闭环。

## 用法速查
```bash
# D2 出包（在 review-request/ 目录）
node gen-request.mjs --name "商家名" --city 城市 --industry 行业 \
  --review-url "https://g.page/.../review" --owner Ethan --flavour "招牌项" \
  --out ../rehearsal/<slug>

# D1 交付：复制 jadugar-delivery-preview.html → 改 businessName/googleUrl/3 条真实评价
#        → 把 EMBED SNIPPET START/END 之间 + config <script> 发给商户按其平台粘贴
```
