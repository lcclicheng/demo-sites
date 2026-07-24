# FifthStar Sales Engine v1.0

> **AI 驱动的本地商家获客操作系统（Local Business Acquisition System）**
> 每天自动发现英国高潜力小商家 → AI 判断需求 → 个性化触达 → 沉淀 CRM → 转化为 FifthStar 客户。

## 定位

当前漏斗「客户发现 FifthStar → 咨询 → 成交」**流量不可控**。Sales Engine 改为：

```
AI寻找客户 → AI分析客户 → AI生成销售触达 → 客户回复 → 人工成交 → Website Factory交付
```

## 与现有架构的关系（FifthStar OS）

```
FifthStar OS
├── sales-engine       获客（本模块）
├── website-factory    交付（gh-pages-build 模板引擎）
├── reputation-engine  服务（£39/£79/£149 订阅 + 评价 widget）
└── client-system      管理（fifthstar-leads.json + 商家清单.md）
```

Website Factory 解决"如何低成本交付网站"；Sales Engine 解决"如何持续获得客户"。两者组合 = 一人公司的商业闭环。

## 零服务器铁律（继承自项目架构收敛期）

- v1.0 **全本地脚本 + JSON/MD**，不起任何后端 / 数据库 / 服务。
- v1.5 文档里写的 Postgres / 数据库，在本项目零服务器原则下**须重新评估**：优先用 JSON/MD 或本地 SQLite 文件，避免起服务。到 v1.5 时再决定。

## MVP 范围（v1.0，2 周）

做：
```
数据源(OSM) → business.json → AI评分 → 生成邮件 → 人工发送
```
不做：❌ 自动发送 ❌ 复杂 CRM 系统 ❌ Dashboard。

## 模块索引

| 文档 | 职责 |
|---|---|
| [architecture.md](architecture.md) | 六层架构 + 模块对应 + 演进路线 |
| [lead-schema.md](lead-schema.md) | 数据源 + business.json + 准入 + CRM 字段 |
| [scoring-rules.md](scoring-rules.md) | lead_score 两阶段评分规则 |
| [outreach-playbook.md](outreach-playbook.md) | 首触钩子 + Day0/3/7/14 序列 + 合规 |
| [daily-operation.md](daily-operation.md) | 日运营节奏 + Agent 角色 + 指标 |

## Pipeline 一览

```
行业 + 城市
  ↓  leads_scan2.py（OSM/Overpass）
50–200 商家/天
  ↓  qualification（有真实邮箱才进池）
  ↓  scoring（Stage1 自动 + Stage2 发送时补 rating）
Top 10 / 天
  ↓  outreach-playbook（3 条免费评价回复）
  ↓  Day0/3/7/14 跟进 + A/B 分叉
回复 → 月 3–5 客户（£79/mo Growth Partner 含免费建站，部分升 £149 Growth Plus）
  ↓  Feedback Loop：成交数据回流优化评分
```
