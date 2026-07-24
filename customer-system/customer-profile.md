# Customer Profile · 客户档案结构

> 每个成交客户 = `customer-system/<slug>/` 目录（与 `lead/<slug>/` 平行，slug 一致）。
> 本文件定义其结构与 `contracts/customer.schema.json` 的对应关系。

## 字段（= customer.schema.json）

```jsonc
{
  "customerId": "CUS-P01",              // CUS-<businessId>
  "businessId": "P01",                   // FK → business-profile.id / lead/<slug>/profile.json
  "name": "McEwan Fraser Legal",
  "tier": "growth-partner",              // free|reputation|growth-partner|growth-plus
  "mrrGbp": 79,                          // 月常（reputation=39 / growth-partner=79 / growth-plus=149）
  "oneTimeGbp": 0,                       // 一次性：v2 无建站费（站含于 Growth Partner）；仅非常规 off-ramp 记
  "contractStart": "2026-08-01",
  "renewalDate": null,                   // Care/订阅填
  "services": [ { "type": "website", "status": "active", "startedAt": "2026-08-01" } ],
  "delivery": { "infoCollectPct": 90, "siteGenPct": 95, "seoPct": 80, "revisionPct": 50 },
  "success": { "reviewsReplied30d": 12, "ratingTrend": "up", "nps": 60, "lastTouchAt": "2026-08-15" },
  "referral": { "status": "none", "referredBusinessIds": [] }
}
```

## 派生规则

- 从 `lead/<slug>/profile.json` 复制 `id/name/industry/location/reputation`，加 `customer.*` 段。
- `stage` 在 `business-profile` 置为 `won` → `delivered` → `retained`。
- 档案目录建议文件：`profile.json`(本结构) + `success.md`(成功跟踪) + `renewal.md`(续费记录) + `referral.md`(推荐记录)。

## 隐私

- 含真实商家 PII，目录级 gitignored（见 `.gitignore` 的 `customer-system/**` 规则——首个客户落地时追加）。
