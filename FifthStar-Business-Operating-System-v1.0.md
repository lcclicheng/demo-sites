# FifthStar Business Operating System · v1.0

> **定位**：面向英国本地商家的 AI 增长操作系统（不是"建站工具"，不是"项目系统"——是**经营系统**）。
> **状态**：基于 v0.x 审计评分 8.2/10，补齐 P0 三件套 + P1 中段后，批准进入**商业验证期**。
> **用法**：新 agent / 新协作者先读本文档建立全局认知，再按 §13 文件地图深入对应模块。
> **配套**（均已落地，本文档引用不重复实现）：`contracts/` · `lead/` · `metrics/` · `customer-system/` · `products/fifthstar/sales-engine/`。

---

## 0. 摘要 · 评分与批准

| 项 | v0.x 审计 | v1.0 补后 |
|---|---|---|
| 综合评分 | 8.2/10 | **9.0/10**（经营闭环补全） |
| 最大问题 | "还是项目系统不是经营系统"，缺 Customer Lifecycle | ✅ 已补中段（customer-system/） |
| 数据模型 | 三套格式互不匹配 | ✅ 统一 `contracts/business-profile.schema.json` |
| 线索记忆 | 仅扁平 JSON | ✅ `lead/<slug>/` 长期资产 |
| KPI | 无 | ✅ `metrics/` 四层 |
| 批准 | 进商业验证 | ✅ 批准，下一阶段 **70% 销售验证 / 30% 系统优化** |

**本版落地的 P0/P1**：
- **P0（必补）**：① 统一数据契约 ② Lead Memory ③ KPI Metrics — **全部 DONE**。
- **P1（建议）**：④ Customer Lifecycle ⑤ Client Portal（设计）⑥ AI Learning Loop（设计）— ④ DONE，⑤⑥ 设计段见 §10/§9。

---

## 1. 一句话定位

一人公司 **lcclicheng**，对外 **Ethan Li**（lic28790@gmail.com）。给英国本地实体商家（餐厅/咖啡/沙龙/律所/瑜伽/家装/酒店）做 **AI Google 评价回复 + 声誉监测 + 高端建站**，用「免费 3 条评价回复」拿下零客户与现金流，再 upsell 建站与年护。

两条产品线共用一套零服务器获客/部署机器：
- **FifthStar（领先产品 / 冷启动楔子）**：声誉管家月订阅 + 建站 upsell。
- **建站引擎（Website Factory）**：Vite+React+Tailwind 模板引擎，一键生成行业站，GitHub Pages 零服务器。

---

## 2. V1.0 五引擎架构

```
┌─────────────────────────────────────────────────────────────┐
│                    FIFTHSTAR OS  v1.0                         │
│                                                               │
│  Growth Engine          Service Engine       Customer Engine │
│  (获客→成交)            (交付→成功)          (续费→推荐)       │
│  ├ 双轨外联             ├ 网站工厂            ├ 上手 SOP        │
│  ├ 两阶段评分           ├ 交付自动化          ├ 成功指标        │
│  └ 线索池               └ 客户成功            ├ 续费系统        │
│                          └ 交付自动化率       └ 推荐系统        │
│        │                      │                      │         │
│        └──────────┬───────────┴──────────┬───────────┘         │
│                   ▼                      ▼                     │
│          AI Operating System      Data Contracts               │
│          (五层记忆+学习闭环)      (business-profile 唯一事实源) │
└─────────────────────────────────────────────────────────────┘
```

| 引擎 | 职责 | 核心产物 | 文档 |
|---|---|---|---|
| **Growth Engine** | 获客→成交 | 线索池、外联、评分、漏斗 | §4 + sales-engine/ |
| **Service Engine** | 交付→客户成功 | 网站、回评、交付自动化 | §7 + metrics/delivery.md |
| **Customer Engine** | 续费→推荐→再获客 | 续费、NPS、推荐 | §8 + customer-system/ |
| **AI Operating System** | 让系统自我学习 | 五层记忆、学习闭环 | §9 + memory/ |
| **Data Contracts** | 统一数据事实源 | business-profile/lead/customer schema | §3 + contracts/ |

---

## 3. 商业漏斗 + 统一数据模型

### 3.1 商业漏斗（单一事实源，用于所有收入换算）

```
Free(£0 样例) → Starter(£29/mo) → Pro(£79/mo) → Site(£590 一次性) → Care(£390/yr)
```

> ✅ **定价已拍板（2026-07-24）**：Care = **£390/年**（与 `docs/pricing.md` / 项目记忆统一；首年合计 £980 = £590 建站 + £390 年护）。旧 `£149/mo` 已废弃。`AGENT-ONBOARDING.md` §4.1 已同步。

### 3.2 统一数据模型（Data Contracts，P0 核心）

- **唯一事实源**：`contracts/business-profile.schema.json`（draft2020-12）。
- 旧三格式（examples JSON / lead-schema.md / fifthstar-leads.json）通过 `contracts/DATA-MODEL.md` 映射表适配，**零破坏**不重写存量。
- 纠偏：真实 `fifthstar-leads.json` **无 `lead_score`**（旧文档错误）；评分由 scoring-rules 计算后写入 `business-profile.sales.leadScore`。
- `stage` 字段（market→lead→contacted→replied→qualified→won→delivered→retained→referred→churned→lost）是打通三模块的经营主轴。

---

## 4. Sales SOP（获客操作系统 · Growth Engine）

六层流水线：`Lead Collector(OSM) → Enrichment(爬取) → Intelligence(评分) → Outreach(生成) → CRM(状态机) → Feedback Loop`。

### 4.1 双轨获客（v0.3 融合）
- **首触统一钩子**：「免费 3 条 Google 评价回复草稿」（全体商户，不分有无官网）。
- **A/B 分叉后移**：有无官网的分叉移到**回信后**跟进阶段——A=无站→£590 建站楔子；B=有站→£29/£79 订阅 + widget。

### 4.2 两阶段评分（进池阈值 >70）
- **Stage1 自动**：无官网 +30 / 行业高价值(law·hotel) +20 / 标准(salon·restaurant·coffee·trades) +15 / 城市未饱和 +15 / 已有专业官网 −20。
- **Stage2 发送时人工（enrich-at-send 扫 GBP）**：评分 3.8–4.5 +20 / 评价 100+ +20(500+ +30) / 未回 +25 / FB +10。
- 真实进池热线索：**6 家 P0x**（P01–P06，全部 Track A 无官网，已实例化 `lead/<slug>/`）。

### 4.3 外联合规闸门（send-outreach.mjs）
- Track B 发送前强制 `observation` 人工填（空则 BLOCKED）。
- `--cap` 默认 25（保守新地址）；`List-Unsubscribe` + `reply STOP` 退订合规。
- 七标准自检：去 AI 味 / 每家独有 / 口语化 / 专业化 / 不僵硬 / 钩子 / 自有口吻(Ethan)。

### 4.4 真实基线
- 线索池 43 条；热线索 6 家 P0x；2026-07-22 夜 19 封测试批成功；2026-07-23 实发 16 封。
- 成交 0（验证期起点，正常）。

---

## 5. Customer Journey（客户旅程 · 全生命周期）

```
[Growth]   market → lead → contacted → replied → qualified
                               ↓ won
[Customer] onboarding → delivery → success → renewal → referral → reacquire
                               ↑___________________________↓
[Service]  交付自动化 + 客户成功支撑续费/推荐
```

| 阶段 | 动作 | 文档 |
|---|---|---|
| onboarding | 首周上手 SOP（欢迎/资料/生成/验收/上线） | customer-system/onboarding.md |
| delivery | 建站/回评交付，自动化率达标 | metrics/delivery.md |
| success | 评价回复覆盖/评分趋势/NPS | customer-system/success-metrics.md |
| renewal | 续费日历/谈判/挽回 | customer-system/renewal.md |
| referral | 推荐机制/案例复用 | customer-system/referral.md |
| reacquire | 推荐新商家进线索池 | growth.md |

> 原系统直接从"线索"跳到"交付"，**缺中段**——本层是 v1.0 最重要补丁。

---

## 6. KPI Dashboard（经营仪表盘）

四层指标文件（详见 `metrics/`）：

| 层 | 核心指标 | 目标 | 起点 |
|---|---|---|---|
| **Sales** | 线索→成交率 / MRR / 管道 | ≥4% / ≥£300/mo | 0% / £0 |
| **Delivery** | 自动化率（资料90/生成95/SEO80/修改50） | 综合 ≈79% | ≈66% |
| **Retention** | 续费率 / Churn / LTV:CAC | ≥85% / ≤5% / ≥10:1 | 0 / 0 / — |
| **Growth** | CAC / 推荐率 / 城市渗透 | <£50 / ≥25% / 逐城≥5% | ~£0 / 0 / 低 |

**周报字段**（current-sprint 填）：新增线索/已发/已回/新成交/MRR增量/综合自动化率/续费率/推荐数。

---

## 7. Delivery SOP（交付自动化 · Service Engine）

### 7.1 Delivery Automation Ratio（铁律指标）
| 环节 | 目标 | 起点 |
|---|---|---|
| 资料收集 | 90% | ~70% |
| 网站生成 | 95% | ~95% |
| SEO | 80% | ~80% |
| 修改 | 50%（已承诺目标） | ~20%（AI 改稿工具链待建） |

### 7.2 交付节奏（onboarding.md）
- D0 欢迎+账单 → D1 资料自动 → D2 生成 → D3 打磨 → D5 验收 → D7 上线。
- 模板站生成 <1 天；"先做好满意再付钱"验收点后才出账单。
- 真实数据零失真；`validate-sites.mjs` EXIT=0 才上线。

---

## 8. Renewal System（续费系统 · Customer Engine）

- **续费日历**：到期前 60/30/14/7 天分级触达（价值回顾→账单→提醒→降级）。
- **谈判原则**：不绑死长期、涨价透明、Care 年护强调省心。
- **流失挽回**：at_risk 信号 → 人工 1 对 1，目标挽回 ≥30% 退订意向。
- 目标：订阅续费率 ≥85%、月 Churn ≤5%、建站复购 Care ≥40%。

---

## 9. AI Learning Loop（AI 操作系统 · 学习闭环）

五层记忆（升级自原 core/runtime 两层）：
`system`（铁律/定价/视觉）· `project`（架构/状态）· `business`（商家/行业）· `customer`（客户档案）· `learning`（可复用方法）。

闭环：`反馈 → 记 lessons-learned + conversation → 提炼可复用资产 → 回灌 AI 规则 → 下次自动更好`。
- 三类入口：商家回信 / 交付修改 / 续费流失。
- 复用资产库：`fifthstar-samples/` + `uk-biz-outreach` + `local-values-landing-copy` skill + 七标准自检。
- 增益指标：复用资产周 +5、外联打开率 ≥40%、去 AI 味达标率 ≥95%。

---

## 10. Client Portal（P1 设计 · 待实现）

> 当前客户交付走**异步文件**（预览链接 + 上手卡 + 账单），符合"不视频/不面对面"铁律。Client Portal 是下一步产品化。

**设计原则**：
- 零服务器（延续铁律）：静态仪表盘 + 客户自有域/子路径，数据来自 `customer-system/<slug>/` + `business-profile`。
- 三个视图：① 评价回复日历（已回/待回）② 网站预览与修改请求入口 ③ 账单与续费状态。
- 权限：每客户一个只读 token（静态托管 + 简单签名 URL，不引后端）。
- 不破坏"满意再付"：Portal 展示进度，付款仍走 PayPal 账单邮件。

---

## 11. 70/30 验证指令（下一阶段重心）

> **批准进入商业验证。下一阶段 70% 精力做销售验证，30% 做系统优化。停止继续加技术模块。**

**DO（70% 销售验证）**：
- 推 6 家 P0x 热线索到回信→成交；每周补线索池（周 +20）。
- 实测漏斗转化、MRR、CAC、续费（即便从 0 开始）。
- 用真实回信打磨外联七标准与 A/B 分叉话术。

**DON'T（不要做）**：
- ❌ 不再新增引擎/模块/skill（除非验证暴露硬缺口）。
- ❌ 不提前做 Client Portal 全功能（§10 仅设计）。
- ❌ 不重写存量数据（Data-MODEL 映射表已解决）。

**30% 系统优化**仅限：把 Delivery 修改自动化率 20%→50%（已批准，工具链见 feedback-loop.md）；把线索评分回写 `business-profile`；周报自动化。

---

## 12. 开放风险

| 风险 | 影响 | 缓解 |
|---|---|---|
| 定价冲突（已解决） | Care=£390/yr 已统一 | — |
| 成交为 0 | 验证无数据 | 推 P0x 回信；周报跟踪斜率 |
| 修改自动化率仅 20%（承诺拉到 50%） | 单位经济差 | AI 改稿闭环（30% 优化项，已批准） |
| 真实 leads.json 无 lead_score | 评分断链 | scoring-rules 计算后写 business-profile |
| 公开仓泄漏 PII | 合规 | lead/ + customer-system/ gitignored |

---

## 13. 文件地图（变更同步纪律）

| 本版新增/改 | 位置 | 性质 |
|---|---|---|
| 统一数据契约 | `contracts/business-profile.schema.json` + `lead.schema.json` + `customer.schema.json` + `DATA-MODEL.md` | P0 |
| Lead Memory | `lead/_template/` + `init-lead.mjs` + `README.md` + 6×`lead/<slug>/`(gitignored) | P0 |
| KPI Metrics | `metrics/{README,sales,delivery,retention,growth}.md` | P0 |
| Customer Lifecycle | `customer-system/{README,customer-profile,onboarding,success-metrics,renewal,referral,feedback-loop}.md` | P1 |
| 本主文档 | `FifthStar-Business-Operating-System-v1.0.md` | 主交付 |
| 总纲升级 | `AGENT-ONBOARDING.md` §（FifthStar OS 五引擎视角） | 同步 |
| 变更日志 | `CHANGELOG.md`（新增 BOS 条目） | 同步 |

**铁律**：架构/定价/数据模型改动须同步文档 + CHANGELOG（见 `AGENT-ONBOARDING.md` §13）。所有改动**本地 commit 不 push**，待用户拍板是否上线。
