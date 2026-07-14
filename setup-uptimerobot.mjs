#!/usr/bin/env node
/**
 * setup-uptimerobot.mjs — 一键批量创建 UptimeRobot 监测点（P3 外部层补充）
 *
 * 作用：读取仓库 PROJS（单一事实源）算出全部线上地址（门户 + admin + 10 站），
 *       调用 UptimeRobot v2 API 批量创建 HTTP 监测点（5 分钟粒度）。
 *       - 同名监测点已存在则跳过（幂等，可重复跑）
 *       - 不带 API Key 或加 --dry-run：只打印将创建的清单，不调 API
 *
 * 前置：在 UptimeRobot → My Settings → API Settings 创建 Read/Write API Key（免费版可用）
 *
 * 用法：
 *   node setup-uptimerobot.mjs                      # 需先设 UPTIMEROBOT_API_KEY 环境变量，真实创建
 *   node setup-uptimerobot.mjs --dry-run            # 只列清单，不创建
 *   UPTIMEROBOT_API_KEY=urXXXX node setup-uptimerobot.mjs
 *
 * 依赖：Node 18+ 全局 fetch
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = (process.env.BASE_URL || 'https://lcclicheng.github.io/demo-sites').replace(/\/+$/, '');
const API_KEY = process.env.UPTIMEROBOT_API_KEY || '';
const DRY_RUN = process.argv.includes('--dry-run');
const API = 'https://api.uptimerobot.com/v2';

/** 从 build-clean.sh 解析 PROJS（单一事实源） */
function loadProjList() {
  const sh = fs.readFileSync(path.join(__dirname, 'build-clean.sh'), 'utf-8');
  const m = sh.match(/PROJS=\(\s*([^)]*)\)/);
  if (!m) throw new Error('无法从 build-clean.sh 解析 PROJS 列表');
  return m[1].split(/\s+/).filter(Boolean);
}

function toSlug(d) {
  return (d.slug || d.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** 构造监测点清单：门户 + admin + 各站 */
function buildMonitors() {
  const projs = loadProjList();
  const list = [
    { name: 'Portal (demo-sites)', url: `${BASE_URL}/` },
    { name: 'CMS Admin', url: `${BASE_URL}/admin/` },
  ];
  for (const proj of projs) {
    const jsonPath = path.join(__dirname, 'examples', `${proj}.json`);
    let slug = proj;
    try {
      const d = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      slug = toSlug(d) || proj;
    } catch {
      /* 读不到就用 proj 名 */
    }
    list.push({ name: slug, url: `${BASE_URL}/${slug}/` });
  }
  return list;
}

async function api(method, params) {
  const res = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: API_KEY, format: 'json', ...params }),
  });
  return res.json();
}

/** 取现有监测点 friendly_name 集合，用于幂等跳过 */
async function existingNames() {
  const data = await api('getMonitors', { limit: 50 });
  if (data.stat !== 'ok') return new Set();
  return new Set((data.monitors || []).map((m) => m.friendly_name));
}

async function main() {
  const monitors = buildMonitors();
  console.log(`📡 UptimeRobot 批量创建：拟建 ${monitors.length} 个监测点 @ ${BASE_URL}\n`);
  for (const m of monitors) console.log(`  • ${m.name.padEnd(20)} ${m.url}`);

  if (DRY_RUN) {
    console.log('\n🔍 --dry-run：仅列出，未调用 API。设置 UPTIMEROBOT_API_KEY 后重跑即真实创建。');
    return;
  }
  if (!API_KEY) {
    console.error('\n❌ 未设置 UPTIMEROBOT_API_KEY。请先创建 API Key 后运行：');
    console.error('   UPTIMEROBOT_API_KEY=urXXXX node setup-uptimerobot.mjs');
    console.error('   或加 --dry-run 仅预览清单。');
    process.exit(1);
  }

  const existing = await existingNames();
  console.log(`\n🚀 开始创建（已存在同名将跳过）…`);

  let created = 0, skipped = 0, failed = 0;
  for (const m of monitors) {
    if (existing.has(m.name)) {
      console.log(`  ⏭️  跳过已存在：${m.name}`);
      skipped++;
      continue;
    }
    try {
      const data = await api('addMonitor', {
        type: 1, // HTTP(s)
        url: m.url,
        friendly_name: m.name,
        interval: 300, // 免费版最小 5 分钟
      });
      if (data.stat === 'ok') {
        console.log(`  ✅ 已创建：${m.name}`);
        created++;
      } else {
        console.error(`  ❌ 失败：${m.name} — ${data.error?.message || JSON.stringify(data)}`);
        failed++;
      }
    } catch (e) {
      console.error(`  ❌ 请求异常：${m.name} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✅ 完成：创建 ${created} / 跳过 ${skipped} / 失败 ${failed}（共 ${monitors.length}）`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error('💥 脚本异常：', e.message);
  process.exit(1);
});
