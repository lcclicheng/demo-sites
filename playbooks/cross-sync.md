# Playbook · 跨项目同步（参考实现 ↔ 标准）

> **背景**：`gh-pages-build` 是 `MDD-STANDARD.md`（v4.1）的**参考实现**（living example）。当本仓库核心规则演进时，须同步回全局标准，否则标准会漂移落后、新项目套用时拿到旧规则。
> **配套**：`tasks/todo/automation-cross-sync.md`（本 playbook 的立项）+ `scripts/cross-sync-check.mjs`（轻量漂移检测，非阻断）。
> **约束**：标准保持**通用**（去项目名），参考实现保持**具体**（带本仓库路径）。不双向复制、不漂移（Law #1 Fact only once）。

## 触发时机

1. 本仓库 `memory/core/principles.md` 的 Architecture Laws 变更（增删铁律）。
2. `memory/core/loading-priority.md` / `memory/boot.md` / `.ai/loading-protocol.md` 的加载规则变更。
3. 重大 MDD 收敛完成（如第三轮/第四轮补齐）。
4. 每次提交前可跑 `node scripts/cross-sync-check.mjs` 自检「参考实现 ↔ 标准」是否还一致。

## 流程

```
1. 提取本仓库核心规则
   - memory/core/principles.md 的 Laws 列表（编号 + 标题）
   - memory/boot.md 的 1–7 步固定清单
   - docs/architecture-v4.md 的骨架（如变动）
   - .ai/loading-protocol.md 的 P3–P8 展开表

2. 比对全局标准
   - C:\Users\12102\.workbuddy\MDD-STANDARD.md
   - ~/.workbuddy/MEMORY.md 的「大型项目架构标准(MDD)」节
   - 逐段比对：Laws 数量/措辞、加载优先级、骨架树、自动化四方向

3. 同步（保持标准通用性）
   - 把本仓库新增/修正 merge 进标准（去掉项目特有路径与细节）
   - 更新 MEMORY.md 的 MDD 节（标注参考实现 commit）
   - 标准内部自检：Laws 段落标题的「N 条」必须与正文实际编号数一致（防止 10 条/13 条 这类头体不符）

4. 记录
   - 在 events.log 追加 [SYNC]
   - 标准文件变更单独提交（不混业务提交）
```

## 自检脚本

`scripts/cross-sync-check.mjs`：

- 解析 `principles.md` 的 Laws 段，统计实际编号数，与段落标题声明的「N 条」比对 → 头体不符即告警。
- 同样检查 `MDD-STANDARD.md`。
- 对比两者实际 Laws 数是否一致（参考实现 ↔ 标准）。
- 检查 `~/.workbuddy/MEMORY.md` 是否含 MDD 节且指向标准。
- 非阻断（exit 0，打印报告）；`--strict` 时不一致 exit 1（可接 CI）。
- 跨项目文件（标准 / MEMORY）在 Windows 本机存在时检查；CI（Linux）无该路径时自动跳过跨项目比对，仅做仓库内自检。

## 反模式

- ❌ 把本仓库的 `examples/` / `src/` 等具体路径写进通用标准。
- ❌ 只改标准不回验「标准内部头体一致」，留下 10 条/13 条 这类破绽。
- ❌ 双向复制导致 Fact only once 失效（标准说一套、实现说一套）。
