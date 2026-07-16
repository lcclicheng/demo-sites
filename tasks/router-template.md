# Router Template（轻量加载计划生成器）

> 每次新任务开场，AI 先填此模板输出加载计划，再执行。这是自动化任务 `tasks/todo/automation-router.md` 的当前手动实现（先路由、再加载、再执行）。
> 配合 `memory/boot.md` + `.ai/loading-protocol.md`。

## 用法

1. 识别我的角色 → 选 `.ai/<role>.md`（P0）。
2. 默认可加载 P0–P2（boot 清单）。
3. 判断任务是否触及 P3+：仅列**实际要读**的层（见 loading-protocol 展开表）。
4. 执行 Stop Rule 检查。

## 模板（复制到响应开头）

```
[Router] task="<一句话>"
  role=<architect|frontend|backend|seo|designer>
  P0-P2: boot.md 全量（必读）
  P3+按需: <decisions/ADR00X | contracts/theme | docs/deployment | knowledge/<行业> | ...>  ← 只列触及的
  Stop? <Y: P0-P2 已够，直接答 | N: 继续上面 P3+>
```

## 规则

- 不加 P3+ 除非任务明确触及（见 loading-protocol 展开表）。
- 输出后先执行 Stop Rule 检查再动手。
- 完成后按 `playbooks/` + `checklists/` 执行并回写 `state/` + `runtime/` + `events.log`。
