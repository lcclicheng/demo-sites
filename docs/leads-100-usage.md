# 商家线索库使用说明

> 来源：2026-07-17 用多个并行子代理（WebSearch）批量采集的真实英国小商家。
> **主数据文件（最新，优先用）：`gh-pages-build/leads-all.json`**（170 家，含精准人群 70 家）
> 历史文件：`leads-100.json`（首批 100 家宽泛线索，已并入主库）
> 目的：后续**专注做 demo**，不用再花时间找商家——直接从这份库里挑名字。

---

## 数据概览（leads-all.json）

- **总数：170 家**，覆盖 9 个行业。
- **精准人群 `segment:"precise"`：70 家** —— 即"有公开邮箱 + 没有自己独立网站"的商家（仅 GMB/目录/第三方平台/FB 页 + 通用邮箱）。**优先做 demo / 直接发信的名单。**
  - 按行业：yoga 9 · law 9 · hardware 1 · restaurant 10 · coffee 8 · salon 8 · dessert 8 · hotel 8 · bakery 8
  - ⚠️ hardware 极少（仅 1 家）：英国独立五金店几乎全部已有自有网站，或只在目录留电话/表单无邮箱，严格过滤下挖不出——属真实市场情况。
- **其余 100 家**：首批宽泛线索（多数已有网站，或邮箱待查 `emailStatus:"unknown"`）。
- 地理分布分散（伦敦/曼城/布里斯托/爱丁堡/利兹/利物浦/布莱顿/格拉斯哥/牛津/约克/卡莱尔/普利茅斯 等小城也覆盖）。

每条字段：

```json
{
  "id": "L001",
  "slug": "trika-yoga-yoga",        // 用于 demo 目录名，已确保唯一
  "name": "Trika Yoga",
  "industry": "yoga",               // 决定用哪个模板
  "city": "Bristol",
  "source": "https://trikayoga.co.uk/",  // 可验证来源（Google Maps/官网/目录）
  "email": "unknown",               // 公开邮箱；unknown=待查
  "emailStatus": "unknown",         // found / unknown
  "note": "独立工作室...",
  "status": "lead"                  // lead → demo → sent → replied → live → cold
}
```

---

## 后续怎么做 demo（每天 5 个）

1. **挑商家**：从 `leads-100.json` 里按顺序（或按行业/城市挑）取 5 条 `status: "lead"` 的。
2. **做 demo**：按 `industry` 选对应模板，套 `name`/`city`/真实内容，部署成预览站（流程见 `references/replace-sop.md`）。
   - 把该条 `status` 改为 `"demo"`。
3. **查邮箱（发信前）**：
   - `emailStatus: "found"` 的直接用 `email` 字段。
   - `emailStatus: "unknown"` 的：打开 `source` 链接，找官网 contact / GMB 显示的邮箱；查到就填进 `email` 并改 `emailStatus: "found"`，查不到则回退 GMB 留言 / 电话（不硬发）。
4. **发信**：拼进 `outreach-send-now.json`（只要真实邮箱的），走每日发送窗口（北京 16:00–18:00，见 `docs/outreach-daily-schedule.md`）。
   - 发完把 `status` 改为 `"sent"`，首触日记当天。
5. **跟进 / 成单**：按 4/10/14 天节奏跟进，有回复转 `"replied"` → 替换上线 `"live"`；14 天无回复标 `"cold"`。

> 提示：本库只是**线索**，名称和来源已核实真实存在，但 `email`/`note` 是子代理一次性快照，做 demo 和发信前请再以 `source` 链接核一次（尤其邮箱和营业状态），避免发给已歇业或找错同名店。

---

## 与已有流程的衔接

- 发送脚本：`uk-biz-outreach/scripts/send-outreach.mjs`（读 recipients.json，留 `List-Unsubscribe` 合规头）
- 每日节奏：`docs/outreach-daily-schedule.md`
- 替换上线：`uk-biz-outreach/references/replace-sop.md`
- 转化模板：`uk-biz-outreach/references/email-templates.md`
- 追踪表：`uk-biz-outreach/references/tracker.md`

---

## 数据来源免责

100 家均为 2026-07-17 联网检索到的真实商家；子代理可能偶有信息偏差（如歇业未更新、邮箱失效）。**正式外联前务必以 `source` 链接二次核实**。本库供内部选商使用，不直接对外发送。
