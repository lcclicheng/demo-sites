# FifthStar · 免费样例生成流程（外联钩子生产 SOP）

> 目的：把"免费帮你写 3 条评价回复稿"这个冷外联钩子，**低成本、可复制**地生产出来，接进 `FifthStar_冷外联模板.md` 模板 A 的 `→ [link]`。
> 全程零客户依赖：商户还没付钱，你先拿出真东西。

---

## 流程总览

```
1. 拿到商户最近 3 条 Google 评价（文本）
        │ 来源：商户自己从 GMB 后台复制 / 你手动从 GMB 页抄 / SerpAPI 抓公开评价
        ▼
2. 跑生成器 generate_sample.py  → 3 条英式回复草稿（JSON）
        │ 输入 reviews.json（stars + text），输出 3 条
        ▼
3. 渲染成一页 one-pager（HTML→PDF / 或直接贴邮件）
        │ 见 FifthStar_样例演示.html
        ▼
4. 挂链接 / 附 PDF，接进模板 A 的 "→ [link to free sample]"
```

---

## Step 1 · 获取 3 条评价

三种方式，按成本升序：
- **A. 商户提供（最干净）**：外联时被问"样例呢？"→ 请对方把最近 3 条评价文案发你（首触邮件已请对方回 "yes" 发样例）。
- **B. 手动抄（首触前就能做）**：打开商户 GMB 页，抄最近 3 条评价文本 + 星数。用于"主动寄出样例"钩子。
- **C. SerpAPI / 第三方（规模化）**：用 SerpAPI 的 `google_maps` 接口按 place_id 拉公开评价，批量生产。MVP 阶段不必上，手动足够。

> 只取**公开评价文本**，不涉及顾客个人数据 → GDPR 风险最低。商户授权后我们再处理更多。

---

## Step 2 · 生成草稿

`generate_sample.py`（同目录，纯 stdlib；**实际已适配 DeepSeek，用 `DEEPSEEK_API_KEY`**；`DEEPSEEK_MODEL` 可改）：

```bash
export DEEPSEEK_API_KEY="sk-..."
# reviews.json = [{"stars":5,"text":"..."},{"stars":3,"text":"..."},{"stars":4,"text":"..."}]
python generate_sample.py reviews.json > drafts.json
```

- 模型默认 DeepSeek `deepseek-chat`（便宜够用），`DEEPSEEK_MODEL` 可改。
- 系统提示已写死英式语气规则：夸奖真诚具体、差评具体致歉不辩解、不承诺赔补偿、1–3 句、无 emoji 无套话、像本地老板而非机器人。
- 输出严格 JSON 数组，3 条，顺序对应输入。

**质量关（必做）**：AI 出稿后**人工扫一眼**——换掉任何"我们希望这封信找到你 well"之类套话；确认差评回复没有过度承诺。你就是最后一道质量闸。

---

## Step 3 · 渲染 one-pager

- 把 3 条"评价 + 回复草稿"排成一页（参考 `FifthStar_样例演示.html`）。
- 顶部：商户名 + "3 free reply drafts from FifthStar"。
- 每条约：原始评价（星 + 文）→ 下方你的草稿。
- 导出 PDF 或存成网页链接，挂进模板 A 的 `→ [link]`。

---

## Step 4 · 接进外联

模板 A 第③段"我已代你写好 3 条" + `→ [link]` 指向 this one-pager。商户打开看到**自己家评价的真回复稿**，回复率远高于"卖你个工具"。

---

## 成本 & 节奏（MVP）

- 单次生成 ≈ £0.001（deepseek-chat 极便宜），人力 2–3 分钟/家。
- 每天发 15–25 家 → 每天生产 15–25 份样例。前 100 家 ≈ 半周到一周。
- 样例领取率 → £39 Reputation 转化，是这套打法的核心漏斗指标（在追踪表里记）。

---

## 演示（看效果）

`FifthStar_样例演示.html` —— 用线索清单里真实商户 **The Spärrows**（曼城独立餐厅）演示：3 条示例评价（5★/3★/4★）→ 3 条生成草稿，排版即"你会寄给商户的那一页"。评价为演示用途，真实外联时替换为该商户实际评价。
