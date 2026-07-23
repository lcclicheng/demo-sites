#!/usr/bin/env node
/**
 * init-lead.mjs — Lead Memory 初始化器
 *
 * 读取 outreach/fifthstar-leads.json（真实事实源），为符合条件的热线索
 * 在 lead/<slug>/ 下生成 6 文件长期资产（profile.json + 5 个 .md）。
 *
 * 设计：
 *  - 零破坏：不改动 fifthstar-leads.json 本身。
 *  - 兼容真实键名：ownerEmail → online_presence.channels.email；stars/reviews → reputation.*。
 *  - 仅实例化 P0x（id 匹配 /^P\d+/ 且 status !== 'excluded'），即 6 家 Track A 无官网热线索。
 *  - 可用 --all 实例化全部非 excluded 线索；--dry 只打印不写。
 *
 * 用法：
 *   node lead/init-lead.mjs            # 仅 P0x 热线索
 *   node lead/init-lead.mjs --all      # 全部非 excluded
 *   node lead/init-lead.mjs --dry      # 预览
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEADS = path.join(ROOT, 'outreach', 'fifthstar-leads.json');
const TPL = path.join(__dirname, '_template');
const OUT = __dirname;

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ALL = args.includes('--all');

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// 读模板骨架（.md 文件直接复制，profile.json 由 lead 数据生成）
function readTplMD(file) {
  return fs.readFileSync(path.join(TPL, file), 'utf8');
}

function buildProfile(lead) {
  const stage = lead.status === 'sent' ? 'contacted'
    : lead.status === 'replied' ? 'replied'
    : lead.status === 'paid' ? 'won'
    : 'lead';
  return {
    id: lead.id,
    name: lead.name,
    industry: lead.industry,
    template: null,
    slug: null,
    location: {
      city: lead.city || '',
      area: lead.area || '',
      country: 'GB',
      postcode: ''
    },
    online_presence: {
      hasWebsite: !!lead.hasWebsite,
      websiteUrl: lead.hasWebsite ? null : null,
      widgetPresent: !!lead.widgetPresent,
      channels: {
        googleBusinessProfile: true,
        facebook: false,
        instagram: '',
        email: lead.ownerEmail || ''
      }
    },
    reputation: {
      googleRating: (typeof lead.stars === 'number') ? lead.stars : null,
      reviewCount: (typeof lead.reviews === 'number') ? lead.reviews : null,
      lastOwnerReplyDays: (typeof lead.lastReplyDays === 'number') ? lead.lastReplyDays : null,
      sentiment: 'unknown'
    },
    sales: {
      track: lead.track || null,
      leadScore: null,
      status: lead.status,
      channel: lead.channel || null,
      onePager: lead.onePager || '',
      observation: lead.observation || null,
      verified: lead.verified || '',
      source: 'manual'
    },
    stage,
    website: null,
    customer: null,
    _source: { origin: 'manual', osmId: null, fetchedAt: null }
  };
}

function fillTpl(tpl, lead, slug) {
  return tpl
    .replace(/<Business Name>/g, lead.name)
    .replace(/<slug>/g, slug)
    .replace(/<X\.X>/g, (typeof lead.stars === 'number') ? String(lead.stars) : '?')
    .replace(/<N>/g, (typeof lead.reviews === 'number') ? String(lead.reviews) : '?')
    .replace(/<YES\/NO>/g, lead.hasWebsite ? 'YES' : 'NO')
    .replace(/<url 或 "无">/g, lead.hasWebsite ? '(待补 URL)' : '无')
    .replace(/<文件名 或 "未生成">/g, lead.onePager || '未生成');
}

function main() {
  if (!fs.existsSync(LEADS)) {
    console.error('❌ 找不到', LEADS);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(LEADS, 'utf8'));
  const leads = data.leads || [];
  const targets = leads.filter(l => {
    if (l.status === 'excluded') return false;
    if (ALL) return true;
    return /^P\d+/.test(l.id || '');
  });

  console.log(`目标线索：${targets.length} 条${ALL ? '（--all）' : '（P0x 热线索）'}${DRY ? ' [DRY]' : ''}`);

  const mdFiles = [
    'website-analysis.md',
    'review-analysis.md',
    'outreach-history.md',
    'conversation.md',
    'opportunity.md'
  ];

  for (const lead of targets) {
    const slug = slugify(lead.name);
    const dir = path.join(OUT, slug);
    console.log(`→ ${lead.id} ${lead.name}  =>  lead/${slug}/`);
    if (DRY) continue;
    fs.mkdirSync(dir, { recursive: true });
    // profile.json（由真实数据映射生成，符合 business-profile.schema.json）
    fs.writeFileSync(
      path.join(dir, 'profile.json'),
      JSON.stringify(buildProfile(lead), null, 2) + '\n',
      'utf8'
    );
    // 5 个 .md 骨架（填充真实已知事实）
    for (const f of mdFiles) {
      const filled = fillTpl(readTplMD(f), lead, slug);
      fs.writeFileSync(path.join(dir, f), filled, 'utf8');
    }
  }
  if (!DRY) console.log(`\n✅ 已实例化 ${targets.length} 个 lead/ 目录（含真实商家数据，已被 .gitignore 忽略）`);
}

main();
