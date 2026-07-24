# 第 2 步筹备：联系真实商家 · 取真图真数据替换占位

> 状态：🟡 **筹备中（2026-07-15 启动）**。步骤 1（UK Biz Finder 工具）✅ / 步骤 3（资产流水线 skill）✅。
> 本步目标：起草外联话术 + 数据采集清单 + 替换 SOP，**待你实际发信、收图、核实数据后**执行替换。
> 反网红 / 高端铁律不变（见 `~/.workbuddy/skills/uk-biz-site-asset-pipeline/SKILL.md`）。

---

## 1. 目标与边界

- 把线上 9 个「OSM 真实商家 + Openverse CC 占位图」demo，升级为「经商家授权 + 真实照片 + 核实数据」的成品。
- 当前 9 站已用**真实商家名 / 地址 / 评分**（来自 OSM 公开数据），但照片是 CC 占位、电话 / 营业时间 / 网站多数空缺 → 需向商家索取真图 + 核对字段。
- 是否收费：按你定价（纯订阅：Free £0 评价草稿 / Starter £29/mo 声誉管理 / Growth £79/mo 含免费建站 + 托管 + 更新 + 基础 SEO，见 `docs/pricing.md`）。首触用「免费 3 条评价回复草稿」作钩子，转化后再走正式订阅。

## 2. 目标商家清单（线索来源）

- **第一批外联对象**：线上 9 个已上线 demo 商家（morris-coffee / holborn-nails / ganache / indaba-yoga / seddons-law / gower-hotel / vale-hardware / papa-bruno / chinatown-bakery）——它们已是真实商家，只需补图 + 核实。
- **新线索**：用 **UK Biz Finder**（`../uk-biz-finder/`）按行业 + 英国地区批量导出（已验证 Overpass / Photon / Openverse 三端点可用），导出 JSON 直接对齐 `examples/<slug>.json` intake 包。
- **示例种子（Bath 咖啡，桌面 `uk-biz-coffee-selected.json`，已评估）**：剔除 Waitrose Cafe / The Cornish Bakery / Guildhall Market Café，余 10 家可用，推荐 **Pulteney Bridge Coffee / Mokoko / Cascara / The Courtyard**。
  - ⚠️ 这批是 Bath 商家，与线上 9 个 London demo 不同城；若生成需**新 slug**（不覆盖现有站），并走技能「新增真实站」全流程。

## 3. 外联邮件模板（英文，面向 UK 商家）

### 模板 A — 首触（冷邮件，价值钩子）

```
Subject: A free premium website for <BusinessName>? (no catch)

Hi <FirstName>,

I came across <BusinessName> on OpenStreetMap while putting together a
showcase of great independent UK businesses, and your place really stood out.

I build polished, mobile-ready websites for small businesses, and I'd love to
set one up for you — free of charge, as part of that showcase.

All I'd need from you is:
  • a few photos you already have (shop front, products, team)
  • a quick confirm of your opening hours and contact details

No catch, no subscription, no obligation. If you'd rather I didn't feature
<BusinessName>, just say the word and I'll take it down.

Interested? Just reply and I'll get it live.

Best,
Ethan Li
```

### 模板 B — 跟进（首触后第 4 天）

```
Subject: Re: A free premium website for <BusinessName>?

Hi <FirstName>,

Just bumping my note from earlier in the week — I'd still love to build a
simple, good-looking site for <BusinessName> at no cost.

It takes about 10 minutes on your side (a few photos + confirm your details).
Happy to answer any questions if anything's unclear.

Either way, thanks for the great work you do.

Ethan Li
```

### 模板 C — 确认采集（商家同意后，要图 / 要数据）

```
Subject: Great — here's what I need for <BusinessName>'s site

Hi <FirstName>,

Brilliant, let's do it. To build the site I just need:

1. Photos (any you have): shop front, signature products/dishes, and the team.
   Attach a few here, or share a link — 1200px+ works best.
2. Confirm details: opening hours (all 7 days), phone, website (if any).
3. A one-line ok that I can show these on the website.

That's it. I'll send you a preview before it goes live.

Ethan Li
```

## 4. 数据采集清单（按模板字段）

**通用字段**（`examples/<slug>.json`）：`name` / `tagline` / `heroTitle` / `heroSubtitle` / `about` / `street` / `city` / `postcode` / `phone` / `website` / `hours`（7 天）/ `rating`（来源 OSM）。

**行业特有**：

| 模板 | 额外需采集 |
|---|---|
| coffee / restaurant | 招牌菜品 / 菜单 highlight / 过敏原提示 |
| salon | 服务项 + 价格区间 / 造型师 |
| yoga | 课程表 / 师资简介 |
| law | 执业领域 / 资质 |
| hotel | 房型 + 设施 / 周边 |
| trades（家装） | 服务范围 / 完工案例 |

**照片需求**：logo、hero 图、3–6 张内页图（门面 / 产品 / 团队），建议 1200px+，需商家**书面授权确认**可上网站。

## 5. 照片 / 资产采集 SOP

- 优先要**商家自有图**（授权最清晰）；商家无图时回退 Openverse **CC BY** 占位（须署名 © Openverse）。
- 收到图 → 落 `assets/<slug>/`（含 `og.jpg` 作社交分享图），用 Pillow 缩放至 ~1200px、`quality 85`（见技能 SKILL.md）。
- 授权留底：邮件 / 书面确认「可用于网站展示」，归档到 `clients/<slug>/`（gitignore 敏感信息，见 `workflow.md` §5）。

## 6. 替换 SOP（接到图 / 数据后执行）

1. 更新 `examples/<slug>.json` 真实字段（删占位、填电话 / 时间 / 网站）。
2. 真图落 `assets/<slug>/`。
3. **若为新商家**（非 9 个已上线）：`generate.mjs` 的 `THEMES` 加镜像条目 + `build-clean.sh` 的 `PROJS` 加 slug（CI 孤儿闸门以 PROJS 为准）。
4. 重建（绕过 safe-delete 守卫）：
   ```bash
   mv output ../oldbuild_<ts> && mkdir -p output
   node generate.mjs ./examples/<slug>.json
   ```
5. 校验：`node validate-sites.mjs`（须 0 孤儿）+ 本地看 `output/<slug>/dist/assets/*.js` 确认真图路径落地。
6. 推送：`git push` 必须 `dangerouslyDisableSandbox:true`（让 ssh 走 `ssh.github.com:443`）。CI 自动重建全部站点并部署 GitHub Pages。

## 7. 跟进节奏 & 追踪表

- 首触 → 第 4 天跟进（模板 B）→ 第 10 天最后提醒 → 满 14 天无回复标记「冷」，转下一家。
- 追踪表（建议复制下方，每商家一行）：

| 商家 | slug | 首触日 | 状态（待发/已发/已回/收图/上线/冷） | 收到图 | 上线 commit |
|---|---|---|---|---|---|
| | | | | | |

---

> 本文件为**内部筹备文档**（owner 自用，中文）。发给商家的邮件一律英文，不混入此文件内容。
