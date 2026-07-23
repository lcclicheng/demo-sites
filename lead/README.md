# Lead Memory · 线索长期记忆系统

> **P0 必补项**（FifthStar OS 审计报告 2026-07-23）。
> 每个商家 = 一个**长期资产目录** `lead/<slug>/`，让半年后重新触达不丢上下文。
> 这是原系统最大缺口之一：之前只有 `fifthstar-leads.json` 一条扁平记录，没有"这个商家我们聊过什么、网站什么样、评价怎么回"的纵深记忆。

## 目录结构

```
lead/
├── _template/              ← 6 文件骨架（系统模板，入库）
│   ├── profile.json           canonical 业务档案（符合 contracts/business-profile.schema.json）
│   ├── website-analysis.md     官网/SEO 分析（每次重看追加）
│   ├── review-analysis.md      评价声誉分析（Google 评分/未回/三草稿状态）
│   ├── outreach-history.md     外联动作时间线（发送/回复/跟进）
│   ├── conversation.md         真实对话原样留存（邮件往来/要点）
│   └── opportunity.md          商业机会判断 + 升级路径 + 风险
├── init-lead.mjs           ← 生成器（读 fifthstar-leads.json → 实例化 P0x）
├── README.md               ← 本文件
├── mcewan-fraser-legal/    ← 实例化（真实数据，gitignored）
├── optimal-solicitors/
├── the-meat-shack/
├── delhi-wala-food/
├── brown-turner-ross/
└── sabz-solicitors-llp/
```

## 与 Data Contracts 的关系

- `profile.json` = `business-profile.schema.json` 的一个**实例**（id + name 必填，其余可选）。
- `init-lead.mjs` 从真实 `fifthstar-leads.json` 读取，做**键名兼容映射**（ownerEmail→channels.email，stars/reviews→reputation.*），不改动源文件。
- 当线索 `stage` 进入 `won`，从 `profile.json` 派生 `customer-system/<slug>/` 客户档案（见 customer.schema.json）。

## 生成命令

```bash
node lead/init-lead.mjs          # 仅 P0x 热线索（6 家 Track A 无官网）
node lead/init-lead.mjs --all    # 全部非 excluded 线索
node lead/init-lead.mjs --dry    # 预览不写
```

## 铁律

- ⚠️ **`lead/<slug>/` 含真实商家 PII（邮箱/GBP 数据），已被 `.gitignore` 忽略，不进公开仓库。** 仅 `_template/`、`README.md`、`init-lead.mjs` 入库。
- 真实数据零失真：profile.json 的评分/评价数/邮箱必须来自 `fifthstar-leads.json`，不得虚构。
- 追加不覆盖：analysis/history/conversation 文档一律在末尾追加新记录，保留历史脉络。
