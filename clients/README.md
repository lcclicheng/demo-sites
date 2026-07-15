# 客户中心（CRM 起点）

> 每个真实客户一个目录，覆盖**全生命周期**，不是只存 feedback。
> 这是 V2「从一次性交付 → 持续运营（MRR）」的组织基础。

## 目录约定

```
clients/
  <slug>/
    info.json        # 合作元数据（档位/状态/续费/合同发票标记）—— 不是站点内容
    contract.md      # 服务合同（Markdown 源；PDF 由交付流水线渲染）
    invoice.md       # 发票
    feedback.md      # 交付后满意度调研 + 续费意向
    seo.md           # SEO 目标词 / 排名跟踪 / 博客计划
    analytics.md     # 部署 URL / PageSpeed / 流量 / 转化
    logo/            # 客户品牌资产
    assets/          # 客户真图（替换 Openverse 占位图后落点）
```

## 与 `examples/<slug>.json` 的关系

- `examples/<slug>.json` = **站点内容**（Hero/Menu/SEO/Schema…），喂给 `generate.mjs` 生成站。
- `clients/<slug>/info.json` = **合作元数据**（tier A/B、status、renewalDate、contractSigned…），喂给 CRM / 月报 / 续费提醒。
- 两者通过 `<slug>` 关联；`info.json.sourceExample` 指向对应 JSON。

## 用法

```bash
# 建空骨架
node scaffold-client.mjs <slug>

# 建带示例元数据的演示客户
node scaffold-client.mjs <slug> --demo
```

脚手架只建目录 + 模板文件，**不**动 `examples/`。填 `info.json` 与站点内容由 owner / AI 完成。

## 状态机（info.json.status）

```
intake → building → delivered → live → maintaining → renew
                                    ↑___________(B 档年费)___________↓
```

- `intake`：已接触 / 收资料中
- `building`：生成站点中
- `delivered`：交付包发出
- `live`：站点上线
- `maintaining`：B 档年度呵护中（月报 / 监控 / 小改）
- `renew`：续费流程中
