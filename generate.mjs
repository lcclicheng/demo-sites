#!/usr/bin/env node
/**
 * template-engine v2 — 四大功能合一
 * 
 * 1. 多模板支持: JSON 中 "template": "restaurant|coffee|salon|dessert"
 * 2. AI 生成 JSON: --ai "Blackpool Italian restaurant called Bella Vista"
 * 3. 批量生成:    --batch ./businesses.json (数组格式)
 * 4. Cf 自动部署: --deploy (需要 wrangler 已配置)
 * 
 * 用法:
 *   node generate.mjs ./examples/mario-pizza.json
 *   node generate.mjs ./examples/mario-pizza.json --deploy
 *   node generate.mjs --batch ./examples/batch.json
 *   node generate.mjs --ai "A pizza shop in Leeds called Mario's"
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const IS_BATCH = args.includes('--batch')
const IS_DEPLOY = args.includes('--deploy')
// 部署目标（步骤 5 Deployment Adapter）：cloudflare（默认）| vercel
const DEPLOY_TARGET = (process.env.DEPLOY_TARGET || 'cloudflare').toLowerCase()
const IS_AI = args.includes('--ai')

// ── 工具函数 ──────────────────────────────────

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return
  ensureDir(dest)
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name)
    if (e.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}
function replaceInFile(filePath, replacements) { let c=fs.readFileSync(filePath,'utf-8');for(const [s,r] of Object.entries(replacements))c=c.replaceAll(s,r);fs.writeFileSync(filePath,c,'utf-8')}

// ── 图片防缓存：给所有图片路径加 ?v=<构建版本> ──
// 匹配常见图片扩展名（忽略已有 query），确保换图后浏览器强制刷新。
// 每次部署 BUILD_VERSION 不同（CI 可传 env.BUILD_VERSION 固定某值）；运行时自愈——
// 即便 Decap CMS 保存把路径写回 JSON，下次生成仍会按新版本重加 ?v=。
const IMG_RE = /\.(jpe?g|png|webp|gif|avif|svg|bmp|ico)(\?.*)?$/i
const BUILD_VERSION = process.env.BUILD_VERSION || String(Date.now())
function addImgVersion(v, ver = BUILD_VERSION) {
  if (typeof v === 'string') {
    if (!IMG_RE.test(v)) return v
    const base = v.replace(/\?.*$/, '')
    return `${base}?v=${ver}`
  }
  if (Array.isArray(v)) return v.map(x => addImgVersion(x, ver))
  if (v && typeof v === 'object') {
    const o = {}
    for (const k of Object.keys(v)) o[k] = addImgVersion(v[k], ver)
    return o
  }
  return v
}

// ── 共享视觉手法 CSS（v0.9.4：从 20 个旧站抽取的设计系统，注入每模板 index.css） ──
// 全部用 currentColor + opacity / color-mix 实现亮暗主题自适应：
// 同一套类名在暗金餐厅模板与亮奶油咖啡模板上都能正确显示（tint 跟随宿主文字色）。
// 配套 React 组件见 src/components/visual.tsx。
const VISUAL_CSS = `
/* === Shared Visual Techniques (injected by generate.mjs) === */
.particles{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.particle{position:absolute;width:2px;height:2px;border-radius:9999px;background:currentColor;opacity:0;animation:drift 20s linear infinite}
.particle:nth-child(1){left:10%;top:18%;animation-delay:0s;animation-duration:17s}
.particle:nth-child(2){left:24%;top:62%;animation-delay:3s;animation-duration:21s}
.particle:nth-child(3){left:38%;top:30%;animation-delay:5s;animation-duration:16s}
.particle:nth-child(4){left:55%;top:72%;animation-delay:7s;animation-duration:23s}
.particle:nth-child(5){left:70%;top:14%;animation-delay:2s;animation-duration:19s}
.particle:nth-child(6){left:82%;top:52%;animation-delay:6s;animation-duration:20s}
.particle:nth-child(7){left:14%;top:82%;animation-delay:9s;animation-duration:18s}
.particle:nth-child(8){left:60%;top:40%;animation-delay:4s;animation-duration:22s}
.particle:nth-child(9){left:34%;top:8%;animation-delay:8s;animation-duration:15s}
.particle:nth-child(10){left:90%;top:24%;animation-delay:1s;animation-duration:24s}
.particle:nth-child(11){left:46%;top:90%;animation-delay:11s;animation-duration:20s}
.particle:nth-child(12){left:76%;top:84%;animation-delay:13s;animation-duration:17s}
@keyframes drift{0%{opacity:0;transform:translateY(0) translateX(0)}10%{opacity:.5}90%{opacity:.5}100%{opacity:0;transform:translateY(-90vh) translateX(40px)}}
.breathe-ring{position:absolute;width:20rem;height:20rem;border-radius:9999px;border:1px solid color-mix(in srgb,currentColor 12%,transparent);animation:breathe 6s ease-in-out infinite}
.breathe-ring.delay{animation-delay:3s}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.35);opacity:.1}}
.gradient-text{background:linear-gradient(100deg,currentColor,color-mix(in srgb,currentColor 35%,transparent),currentColor);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;animation:shiny 5s linear infinite}
@keyframes shiny{0%{background-position:-200% center}100%{background-position:200% center}}
.glass-card{background:color-mix(in srgb,currentColor 4%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid color-mix(in srgb,currentColor 14%,transparent)}
.confetti-dots{background-image:radial-gradient(color-mix(in srgb,currentColor 55%,transparent) 1px,transparent 1px);background-size:22px 22px;opacity:.5}
.bento-grid{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.bento-grid::before{content:'';position:absolute;inset:0;background-image:linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px);background-size:54px 54px;opacity:.05}
.shimmer-soft{animation:shimmer 3s ease-in-out infinite}
@keyframes shimmer{0%,100%{opacity:.25}50%{opacity:.6}}
`

// ── 编辑排版层（v0.9.9：从 20 个旧站提炼的编辑排版规律，统一 8 模板观感） ──
// 主题自适应：currentColor + color-mix，亮暗模板通用；显示级大标题已自带 leading-none/tight 不受影响。
const EDITORIAL_CSS = `
/* === Editorial Typography Layer (injected by generate.mjs, v0.9.9) === */
/* 全局正文放松行高：提升长文可读性（hero/section 大标题已自带 leading-none/tight，不受影响） */
body{line-height:1.7}
/* 阅读宽度：正文/导语限宽，避免文字拉满整行（≈65ch / ≈80ch） */
.measure{max-width:44rem}
.measure-lg{max-width:56rem}
/* 导语段落：section 标题下的引导段，略大于正文、保留模板文字色 */
.lead{font-size:1.125rem;line-height:1.6}
/* 发丝分隔线：独立元素 <hr class="rule"/>，或作为区块顶边 .section-rule */
.rule{height:1px;background:color-mix(in srgb,currentColor 14%,transparent);border:0;margin:0}
.section-rule{border-top:1px solid color-mix(in srgb,currentColor 10%,transparent)}
`

// ── 共享依赖安装（v0.6：一次性安装到工程根 node_modules，配合 CI 的 setup-node npm 缓存） ──
// 每个站点构建时复用根 node_modules（符号链接），避免每站重复 npm install（10 站只装 1 次）。
// CI 每次 runner 全新（checkout 不含 node_modules），故必跑一次 npm ci，但命中 ~/.npm 缓存极快；
// 本地若根 node_modules 已存在则直接复用。失败/缺锁时回退到本站 npm install（见 generateOne）。
let _sharedDepsReady = false
async function ensureSharedDeps() {
  if (_sharedDepsReady) return
  const rootNm = path.join(__dirname, 'node_modules')
  if (!fs.existsSync(rootNm)) {
    console.log('  📦 安装共享依赖(工程根, 一次性；命中 CI npm 缓存)...')
    execSync('npm ci', { cwd: __dirname, stdio: 'pipe' })
  }
  _sharedDepsReady = true
}

// 模板配置：每个模板需要复制哪些额外文件
const TEMPLATES = {
  // ── Noir · 暗黑金奢华餐厅 ──
  restaurant: {
    files: ['src/restaurant/App.tsx','src/restaurant/business-data.ts'], favicon: '🍽️',
    tailwind: 'restaurant',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;background:#0a0806;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent}@media (max-width:768px){input,select,textarea{font-size:16px}}::selection{background:rgba(200,164,92,0.3);color:#e8e0d0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0806}::-webkit-scrollbar-thumb{background:rgba(200,164,92,0.2);border-radius:2px}.particles{position:absolute;inset:0;overflow:hidden;pointer-events:none}.particle{position:absolute;width:2px;height:2px;background:#c8a45c;border-radius:50%;animation:drift 20s linear infinite;opacity:0}.particle:nth-child(1){left:10%;top:20%;animation-delay:0s;animation-duration:18s}.particle:nth-child(2){left:25%;top:60%;animation-delay:3s;animation-duration:22s}.particle:nth-child(3){left:40%;top:30%;animation-delay:5s;animation-duration:16s}.particle:nth-child(4){left:55%;top:70%;animation-delay:7s;animation-duration:24s}.particle:nth-child(5){left:70%;top:15%;animation-delay:2s;animation-duration:20s}.particle:nth-child(6){left:80%;top:50%;animation-delay:6s;animation-duration:19s}.particle:nth-child(7){left:15%;top:80%;animation-delay:9s;animation-duration:17s}.particle:nth-child(8){left:60%;top:40%;animation-delay:4s;animation-duration:21s}.particle:nth-child(9){left:35%;top:10%;animation-delay:8s;animation-duration:15s}.particle:nth-child(10){left:90%;top:25%;animation-delay:1s;animation-duration:23s}@keyframes drift{0%{opacity:0;transform:translateY(0)translateX(0)}10%{opacity:0.8}90%{opacity:0.8}100%{opacity:0;transform:translateY(-100vh)translateX(40px)}}.glow-ring{position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(200,164,92,0.4),transparent,rgba(200,164,92,0.15),transparent);-webkit-mask:linear-gradient(#fff 0 0)content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{abyss:'#0a0806',surface:'#14110d',gold:'#c8a45c','gold-light':'#e0c878',paper:'#e8e0d0',mute:'#8a8070'},fontFamily:{display:['"Playfair Display"','Georgia','serif'],body:['Inter','sans-serif']},animation:{float:'float 8s ease-in-out infinite','float-delayed':'float 10s ease-in-out 2s infinite',shimmer:'shimmer 3s ease-in-out infinite'},keyframes:{float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-24px)'}},shimmer:{'0%,100%':{opacity:'0.3'},'50%':{opacity:'0.7'}}}}},plugins:[]}`,
  },

  // ── MONO · brutalist 精品咖啡 ──
  coffee: {
    files: ['src/coffee/App.tsx','src/coffee/business-data.ts'], favicon: '☕',
    tailwind: 'coffee',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#fafaf9;color:#0d0d0c}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#fafaf9}::-webkit-scrollbar-thumb{background:#d4d4d0;border-radius:0}::selection{background:rgba(163,230,53,0.3)}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{paper:'#fafaf9',ink:'#0d0d0c',lime:'#a3e635',stone:'#78716c'},fontFamily:{display:['"DM Serif Display"','Georgia','serif'],body:['Inter','sans-serif']}}},plugins:[]}`,
  },

  // ── ATELIER · 编辑室美学沙龙 ──
  salon: {
    files: ['src/salon/App.tsx','src/salon/business-data.ts'], favicon: '💇',
    tailwind: 'salon',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#faf7f2;color:#3d1c3d}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#faf7f2}::-webkit-scrollbar-thumb{background:rgba(61,28,61,0.15);border-radius:2px}::selection{background:rgba(212,165,116,0.3)}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{ivory:'#faf7f2',plum:'#3d1c3d',gold:'#d4a574',blush:'#e8c4c4'},fontFamily:{display:['"Playfair Display"','Georgia','serif'],body:['Inter','sans-serif']}}},plugins:[]}`,
  },

  // ── PATISSERIE · 克制法式甜品 ──
  dessert: {
    files: ['src/dessert/App.tsx','src/dessert/business-data.ts'], favicon: '🧁',
    tailwind: 'dessert',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Lora","Georgia",serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#faf7f2;color:#1a1008}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#faf7f2}::-webkit-scrollbar-thumb{background:rgba(26,16,8,0.12);border-radius:2px}::selection{background:rgba(184,147,90,0.25)}.thread-pattern{background-image:repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(184,147,90,0.04)3px,rgba(184,147,90,0.04)4px);background-size:8px 8px}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{ivory:'#faf7f2',espresso:'#1a1008',gold:'#b8935a',cream:'#f5f0e8'},fontFamily:{display:['"Lora"','Georgia','serif'],body:['"Nunito"','sans-serif']}}},plugins:[]}`,
  },

  // ── BREATH · 禅意瑜伽 ──
  yoga: {
    files: ['src/yoga/App.tsx','src/yoga/business-data.ts'], favicon: '🧘',
    tailwind: 'yoga',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#f9faf7;color:#2d3a28}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f9faf7}::-webkit-scrollbar-thumb{background:rgba(77,87,69,0.15);border-radius:2px}::selection{background:rgba(52,211,153,0.25)}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{cream:'#f9faf7','sage-50':'#f3f4ed','sage-100':'#e8ebe0','sage-200':'#d4d8ce','sage-400':'#9ea893','sage-500':'#7f8a74','sage-600':'#66705c','sage-700':'#4d5745','sage-800':'#3a4234','sage-900':'#2d3a28',stone:'#f5f1ea',emerald:'#34d399'},fontFamily:{display:['"EB Garamond"','Georgia','serif'],body:['Inter','sans-serif']},animation:{breathe:'breathe 6s ease-in-out infinite','breathe-delay':'breathe 6s ease-in-out 3s infinite'},keyframes:{breathe:{'0%,100%':{transform:'scale(1)',opacity:'0.3'},'50%':{transform:'scale(1.3)',opacity:'0.1'}}}}},plugins:[]}`,
  },

  // ── CHAMBERS · 遗产律所 ──
  law: {
    files: ['src/law/App.tsx','src/law/business-data.ts'], favicon: '⚖️',
    tailwind: 'law',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Cormorant Garamond","Georgia",serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#fcfaf8;color:#0f172a}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#fcfaf8}::-webkit-scrollbar-thumb{background:rgba(184,134,11,0.18);border-radius:2px}::selection{background:rgba(184,134,11,0.25)}.pattern-stripes{background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(184,134,11,0.08)2px,rgba(184,134,11,0.08)4px);background-size:8px 8px}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{cream:'#fcfaf8',navy:'#0f172a',ink:'#1e293b',gold:'#b8860b',warm:'#f8f5f0'},fontFamily:{display:['"Cormorant Garamond"','Georgia','serif'],body:['Inter','sans-serif']}}},plugins:[]}`,
  },

  // ── THE VAULT · 老钱奢华民宿 ──
  hotel: {
    files: ['src/hotel/App.tsx','src/hotel/business-data.ts'], favicon: '🏨',
    tailwind: 'hotel',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#f9f6f0;color:#2d1f14}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f9f6f0}::-webkit-scrollbar-thumb{background:rgba(6,95,70,0.2);border-radius:2px}::selection{background:rgba(200,149,44,0.25)}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{cream:'#f9f6f0',emerald:'#0a2a1e',warm:'#2d1f14',gold:'#c8952c'},fontFamily:{display:['"Playfair Display"','Georgia','serif'],body:['Inter','sans-serif']}}},plugins:[]}`,
  },

  // ── FORGE · 工业蓝领 ──
  trades: {
    files: ['src/trades/App.tsx','src/trades/business-data.ts'], favicon: '🔧',
    tailwind: 'trades',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#f5f5f4;color:#1c1917}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#f5f5f4}::-webkit-scrollbar-thumb{background:rgba(217,119,6,0.25);border-radius:2px}::selection{background:rgba(217,119,6,0.2)}.grid-pattern{background-image:linear-gradient(rgba(28,25,23,0.04)1px,transparent 1px),linear-gradient(90deg,rgba(28,25,23,0.04)1px,transparent 1px);background-size:24px 24px}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{steel:'#f5f5f4',charcoal:'#1c1917',copper:'#d97706',rust:'#9a3412',concrete:'#e7e5e4',ink:'#171717'},fontFamily:{body:['Inter','sans-serif']}}},plugins:[]}`,
  },

  // ── SECTIONED · 组合器模板（Section Engine 入口，theme-agnostic）──
  // 不绑定任何行业：消费统一的 SectionedData 契约，按 data.sections（可选覆盖）
  // 或默认顺序渲染通用 section 组件（src/components/sections/*）。
  // 配色仅依赖 accent / surface / ink 三色，可通过 THEMES 逐站覆盖。
  sectioned: {
    files: ['src/sectioned/App.tsx', 'src/sectioned/business-data.ts'],
    favicon: '◈',
    tailwind: 'sectioned',
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    css: '@tailwind base;@tailwind components;@tailwind utilities;*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}body{font-family:"Inter",sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;-webkit-tap-highlight-color:transparent;background:#faf9f7;color:#1c1917}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#faf9f7}::-webkit-scrollbar-thumb{background:rgba(184,137,90,0.2);border-radius:0}::selection{background:rgba(184,137,90,0.25)}@media (max-width:768px){input,select,textarea{font-size:16px}}',
    twConfig: `/** @type {import('tailwindcss').Config} */export default{content:['./index.html','./src/**/*.{js,ts,jsx,tsx}'],theme:{extend:{colors:{surface:'#faf9f7',ink:'#1c1917',accent:'#b8895a'},fontFamily:{display:['"Playfair Display"','Georgia','serif'],body:['Inter','sans-serif']}}},plugins:[]}`,
  },
}

// ── 单项目生成 ────────────────────────────────

// ── 每站独立主题（全面差异化） ──────────────────
// 键名 = 项目输出目录名(projectName)。每个主题只声明与基础模板不同的 diff，
// 由 applyThemeReplace 对 css / twConfig 做精确字符串替换；html 仅在更换字体时提供完整字符串。
// 这样每站拥有独立美感，而模板 JSX 保持单一来源（便于后续统一修复）。
const THEMES = {
  // MONO · 精品咖啡 → 暖铜（由 coffee 模板 steel/charcoal/copper 迁移到 sectioned 三色系统）
  mono: {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#f6f3ef'"],
      ["ink:'#1c1917'", "ink:'#211b15'"],
      ["accent:'#b8895a'", "accent:'#c2772e'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#f6f3ef'],
      ['color:#1c1917', 'color:#211b15'],
      ['rgba(184,137,90,0.2)', 'rgba(194,119,46,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(194,119,46,0.25)'],
    ],
  },

  // ── 以下 9 个 slug 已迁移到 sectioned 三色基底（surface / ink / accent + Playfair/Marcellus/Fraunces）──
  // 旧行业基底(plum/gold/emerald/ivory/abyss...)的替换串在 sectioned 基底上不匹配，已重写为针对 surface/ink/accent。

  // ATELIER · 编辑室美学沙龙 → 暖陶土青铜 + Marcellus（区别于 vault 的 Fraunces、creme 的玫瑰）
  atelier: {
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Marcellus&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#faf6f1'"],
      ["ink:'#1c1917'", "ink:'#211b15'"],
      ["accent:'#b8895a'", "accent:'#c0896a'"],
      ["'\"Playfair Display\"'", "'\"Marcellus\"'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#faf6f1'],
      ['color:#1c1917', 'color:#211b15'],
      ['rgba(184,137,90,0.2)', 'rgba(192,137,106,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(192,137,106,0.25)'],
    ],
  },

  // BREATH · 禅意瑜伽 → 雾青绿（sectioned 三色基底）
  breath: {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#f5f8f6'"],
      ["accent:'#b8895a'", "accent:'#5fae9a'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#f5f8f6'],
      ['rgba(184,137,90,0.2)', 'rgba(95,174,154,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(95,174,154,0.25)'],
    ],
  },

  // CHAMBERS · 遗产律所 → 铂银（金→银，sectioned 三色基底）
  chambers: {
    twReplace: [
      ["accent:'#b8895a'", "accent:'#8c98a6'"],
    ],
    cssReplace: [
      ['rgba(184,137,90,0.2)', 'rgba(140,152,166,0.18)'],
      ['rgba(184,137,90,0.25)', 'rgba(140,152,166,0.25)'],
    ],
  },

  // CREME · 甜品(玫瑰马卡龙) → 玫瑰金 + 莓果深棕（sectioned 三色基底）
  'creme': {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#fdf6f4'"],
      ["ink:'#1c1917'", "ink:'#5a3a44'"],
      ["accent:'#b8895a'", "accent:'#e0a3b0'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#fdf6f4'],
      ['color:#1c1917', 'color:#5a3a44'],
      ['rgba(184,137,90,0.2)', 'rgba(224,163,176,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(224,163,176,0.25)'],
    ],
  },

  // FORGE · 工业蓝领 → 铁锈橙（sectioned 三色基底）
  forge: {
    twReplace: [
      ["accent:'#b8895a'", "accent:'#c2410c'"],
    ],
    cssReplace: [
      ['rgba(184,137,90,0.2)', 'rgba(194,65,12,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(194,65,12,0.25)'],
    ],
  },

  // MARIO · 披萨 → 暗黑 + 番茄红（sectioned 三色基底翻转 surface/ink 为高对比暗色）
  'mario': {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#14110d'"],
      ["ink:'#1c1917'", "ink:'#f5f0e8'"],
      ["accent:'#b8895a'", "accent:'#d9663f'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#14110d'],
      ['color:#1c1917', 'color:#f5f0e8'],
      ['rgba(184,137,90,0.2)', 'rgba(217,102,63,0.22)'],
      ['rgba(184,137,90,0.25)', 'rgba(217,102,63,0.28)'],
    ],
  },

  // PATISSERIE · 法式甜品(香槟金，区别于 creme 的玫瑰，sectioned 三色基底)
  patisserie: {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#fbf8f0'"],
      ["ink:'#1c1917'", "ink:'#5a4a2e'"],
      ["accent:'#b8895a'", "accent:'#c9a14a'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#fbf8f0'],
      ['color:#1c1917', 'color:#5a4a2e'],
      ['rgba(184,137,90,0.2)', 'rgba(201,161,74,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(201,161,74,0.25)'],
    ],
  },

  // SOTTO-SOTTO · 意大利餐厅(亮色奶油+陶土，区别于 mario 的暗黑，sectioned 三色基底)
  'sotto-sotto': {
    twReplace: [
      ["surface:'#faf9f7'", "surface:'#f7f1ea'"],
      ["ink:'#1c1917'", "ink:'#3a2e22'"],
      ["accent:'#b8895a'", "accent:'#c08457'"],
    ],
    cssReplace: [
      ['background:#faf9f7', 'background:#f7f1ea'],
      ['color:#1c1917', 'color:#3a2e22'],
      ['rgba(184,137,90,0.2)', 'rgba(192,132,87,0.25)'],
      ['rgba(184,137,90,0.25)', 'rgba(192,132,87,0.25)'],
    ],
  },

  // VAULT · 老钱民宿 → Fraunces + 古金（sectioned 三色基底）
  'vault': {
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:wght@400;500;600;700;900&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    twReplace: [
      ["accent:'#b8895a'", "accent:'#b8893f'"],
      ["'\"Playfair Display\"'", "'\"Fraunces\"'"],
    ],
    cssReplace: [
      ['rgba(184,137,90,0.2)', 'rgba(184,137,63,0.2)'],
      ['rgba(184,137,90,0.25)', 'rgba(184,137,63,0.25)'],
    ],
  },

  // ── 真实商家 demo 主题（v0.9.10：镜像模板精修观感，slug 与模板 demo 区分） ──
  'holborn-nails': {
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Marcellus&display=swap" rel="stylesheet" media="print" onload="this.media='all'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
    cssReplace: [
      ['background:#faf7f2', 'background:#faf6f1'],
      ['rgba(61,28,61,0.15)', 'rgba(91,74,82,0.12)'],
      ['rgba(212,165,116,0.3)', 'rgba(192,137,106,0.3)'],
    ],
    twReplace: [
      ["plum:'#3d1c3d'", "plum:'#5b4a52'"],
      ["gold:'#d4a574'", "gold:'#c0896a'"],
    ],
  },
  'ganache': {
    cssReplace: [
      ['background:#faf7f2', 'background:#fbf3f0'],
      ['rgba(26,16,8,0.12)', 'rgba(90,46,58,0.12)'],
      ['rgba(184,147,90,0.25)', 'rgba(176,106,130,0.22)'],
      ['rgba(184,147,90,0.04)', 'rgba(176,106,130,0.05)'],
    ],
    twReplace: [
      ["ivory:'#faf7f2'", "ivory:'#fbf3f0'"],
      ["espresso:'#1a1008'", "espresso:'#5a2e3a'"],
      ["gold:'#b8935a'", "gold:'#b06a82'"],
      ["cream:'#f5f0e8'", "cream:'#f7e9ec'"],
    ],
  },
  'indaba-yoga': {
    cssReplace: [
      ['rgba(52,211,153,0.25)', 'rgba(95,174,154,0.25)'],
    ],
    twReplace: [
      ["emerald:'#34d399'", "emerald:'#5fae9a'"],
    ],
  },
  'seddons-law': {
    cssReplace: [
      ['rgba(184,134,11,0.18)', 'rgba(140,152,166,0.18)'],
      ['rgba(184,134,11,0.25)', 'rgba(140,152,166,0.25)'],
      ['rgba(184,134,11,0.08)', 'rgba(140,152,166,0.08)'],
    ],
    twReplace: [
      ["gold:'#b8860b'", "gold:'#8c98a6'"],
    ],
  },
  'gower-hotel': {
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:wght@400;500;600;700;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
    cssReplace: [
      ['rgba(200,149,44,0.25)', 'rgba(184,137,63,0.25)'],
    ],
    twReplace: [
      ["gold:'#c8952c'", "gold:'#b8893f'"],
      ["'\"Playfair Display\"'", "'\"Fraunces\"'"],
    ],
  },
  'vale-hardware': {
    cssReplace: [
      ['rgba(217,119,6,0.25)', 'rgba(194,65,12,0.25)'],
      ['rgba(217,119,6,0.2)', 'rgba(194,65,12,0.2)'],
    ],
    twReplace: [
      ["copper:'#d97706'", "copper:'#c2410c'"],
      ["rust:'#9a3412'", "rust:'#7c2d12'"],
    ],
  },
  'papa-bruno': {
    cssReplace: [
      ['rgba(200,164,92,0.2)', 'rgba(217,102,63,0.22)'],
      ['rgba(200,164,92,0.3)', 'rgba(217,102,63,0.28)'],
      ['rgba(200,164,92,0.4)', 'rgba(217,102,63,0.4)'],
      ['rgba(200,164,92,0.15)', 'rgba(217,102,63,0.15)'],
      ['background:#c8a45c', 'background:#d9663f'],
    ],
    twReplace: [
      ["gold:'#c8a45c'", "gold:'#d9663f'"],
      ["'gold-light':'#e0c878'", "'gold-light':'#e8896a'"],
      ["paper:'#e8e0d0'", "paper:'#f4e3da'"],
      ["mute:'#8a8070'", "mute:'#a8897d'"],
    ],
  },
  'chinatown-bakery': {
    cssReplace: [
      ['background:#faf7f2', 'background:#fbf8f0'],
      ['rgba(26,16,8,0.12)', 'rgba(90,74,46,0.12)'],
      ['rgba(184,147,90,0.25)', 'rgba(201,161,74,0.22)'],
      ['rgba(184,147,90,0.04)', 'rgba(201,161,74,0.04)'],
    ],
    twReplace: [
      ["ivory:'#faf7f2'", "ivory:'#fbf8f0'"],
      ["espresso:'#1a1008'", "espresso:'#5a4a2e'"],
      ["gold:'#b8935a'", "gold:'#c9a14a'"],
      ["cream:'#f5f0e8'", "cream:'#f5efe0'"],
    ],
  },
}

// 对 base 字符串按 [old,new] 列表做全量替换；未命中的替换打印警告（便于发现模板改动导致的失配）
function applyThemeReplace(base, repls) {
  if (!repls) return base
  for (const [o, n] of repls) {
    if (!base.includes(o)) console.warn('  ⚠️ 主题替换未命中: ' + o)
    base = base.split(o).join(n)
  }
  return base
}

async function generateOne(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  const template = data.template || 'restaurant'
  if (!TEMPLATES[template]) { console.error(`❌ 未知模板: ${template}。可选: ${Object.keys(TEMPLATES).join(', ')}`); return null }

  let t = TEMPLATES[template]
  const projectName = (data.slug || data.name).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')
  // 应用每站独立主题（全面差异化）：覆盖 css / twConfig / html，不动 JSX
  if (THEMES[projectName]) {
    const th = THEMES[projectName]
    t = { ...t, html: th.html || t.html, css: applyThemeReplace(t.css, th.cssReplace), twConfig: applyThemeReplace(t.twConfig, th.twReplace) }
    console.log(`  🎨 应用独立主题: ${projectName}`)
  }
  const outputDir = path.resolve(__dirname,'output',projectName)

  console.log(`\n🔨 [${template}] ${data.name}`)
  if (fs.existsSync(outputDir)) fs.rmSync(outputDir,{recursive:true,force:true})
  ensureDir(outputDir)
  ensureDir(path.join(outputDir,'src'))

  // 基础文件
  const baseFiles = ['package.json','postcss.config.js','vite.config.ts','src/main.tsx']
  for (const f of baseFiles) { const s=path.join(__dirname,f);if(fs.existsSync(s)){ensureDir(path.dirname(path.join(outputDir,f)));fs.copyFileSync(s,path.join(outputDir,f))}}

  // 模板特定文件
  fs.writeFileSync(path.join(outputDir,'index.html'),t.html.replace('__TITLE__',data.pageTitle||data.name))
  fs.writeFileSync(path.join(outputDir,'src','index.css'),t.css + '\n' + VISUAL_CSS + '\n' + EDITORIAL_CSS)
  fs.writeFileSync(path.join(outputDir,'tailwind.config.js'),t.twConfig)
  for (const f of t.files) { const s=path.join(__dirname,f);if(fs.existsSync(s)){const d=path.join(outputDir,'src',path.basename(f));ensureDir(path.dirname(d));fs.copyFileSync(s,d)}}

  // 共享视觉组件（v0.9.4：HeroBackdrop / StatsStrip / GradientText / GlassCard / ConfettiBg）
  copyDir(path.join(__dirname,'src','components'),path.join(outputDir,'src','components'))

  // 拷贝项目专属图片资源（assets/<projectName>/ → public/images/，构建后访问 /images/xxx.jpg）
  const imgSrc = path.resolve(__dirname,'assets',projectName)
  if (fs.existsSync(imgSrc)) {
    const pubDest = path.join(outputDir,'public','images')
    ensureDir(pubDest)
    const imgs = fs.readdirSync(imgSrc)
    for (const f of imgs) fs.copyFileSync(path.join(imgSrc,f),path.join(pubDest,f))
    console.log(`  🖼️ 已拷贝 ${imgs.length} 张图片到 public/images/`)
  }

  // ⏩ SEO / OG / Twitter 社交卡片标签注入已移至下方「截图哈希之后」区块（确保 og:image 带 ?v 缓存哈希）

  // 需要调整 main.tsx 的 import 路径（从 ./App 改为对应模板）
  const mainTsx = fs.readFileSync(path.join(outputDir,'src','main.tsx'),'utf-8')
  fs.writeFileSync(path.join(outputDir,'src','main.tsx'),mainTsx,'utf-8')

  // 给截图图片追加内容哈希 query，彻底杜绝 CDN/浏览器缓存同名旧图（Sotto 曾中招）
  if (Array.isArray(data.screenshots)) {
    const { createHash } = await import('node:crypto')
    for (const s of data.screenshots) {
      if (s && typeof s.image === 'string') {
        const fname = s.image.split('?')[0].split('/').pop()
        const fpath = path.resolve(__dirname, 'assets', projectName, fname)
        if (fs.existsSync(fpath)) {
          const h = createHash('md5').update(fs.readFileSync(fpath)).digest('hex').slice(0, 8)
          s.image = s.image + (s.image.includes('?') ? '&' : '?') + 'v=' + h
        }
      }
    }
  }

  // ── SEO / OG / Twitter 社交卡片标签注入（放在截图哈希之后，og:image 自带 ?v 缓存哈希） ──
  const seoTitle = (data.seo && data.seo.title) || data.pageTitle || data.name || ''
  const seoDescRaw = (data.seo && data.seo.description) || data.tagline || (Array.isArray(data.aboutParagraphs) ? data.aboutParagraphs[0] : '') || data.name || ''
  const seoDesc = String(seoDescRaw).replace(/"/g, '&quot;').replace(/\s+/g, ' ').trim().slice(0, 200)
  // favicon: 品牌首字母 monogram（替换原模板 emoji，符合高端定位）
  const brandInitials = (data.name || data.slug || 'B')
    .replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/)
    .filter((w) => w && !['the', 'and', 'of', 'a', 'de', 'la', 'le'].includes(w.toLowerCase()))
    .slice(0, 2).map((w) => w[0].toUpperCase()).join('')
  const faviconFontSize = brandInitials.length > 1 ? 52 : 80
  const SEO_BASE = (process.env.SITE_BASE_URL || 'https://lcclicheng.github.io/demo-sites').replace(/\/$/, '')
  const siteUrl = `${SEO_BASE}/${projectName}/`
  // 社交分享图：优先 screenshots 第1张（已带 ?v 哈希），否则 assets 首图
  let ogImage = ''
  if (Array.isArray(data.screenshots) && data.screenshots[0] && data.screenshots[0].image) {
    const s = String(data.screenshots[0].image)
    ogImage = s.startsWith('http') ? s : siteUrl + s.replace(/^\.?\//, '')
  } else if (fs.existsSync(imgSrc)) {
    const first = fs.readdirSync(imgSrc).find((f) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
    if (first) ogImage = `${siteUrl}images/${first}`
  }
  const esc = (s) => String(s).replace(/"/g, '&quot;')

  // ── JSON-LD 结构化数据（LocalBusiness 子类，提升本地 SEO / 富结果）──
  // 仅取真实存在的字段，绝不编造；hours 等未规范化字段本期不注入，避免误导爬虫
  const SCHEMA_TYPE = {
    restaurant: 'Restaurant', coffee: 'Cafe', dessert: 'Bakery',
    salon: 'HairSalon', hotel: 'Hotel', yoga: 'HealthClub',
    law: 'LegalService', trades: 'HomeAndConstructionBusiness',
  }[template] || 'LocalBusiness'
  const _street = data.street || data.registeredAddress || ''
  const _locality = data.location || ''
  const _jsonLd = {
    '@context': 'https://schema.org',
    '@type': SCHEMA_TYPE,
    name: data.name || seoTitle,
    url: siteUrl,
    description: seoDesc,
    ...(data.phone ? { telephone: data.phone } : {}),
    ...(data.email ? { email: data.email } : {}),
    ...((_street || _locality) ? { address: {
      '@type': 'PostalAddress',
      ...(_street ? { streetAddress: _street } : {}),
      ...(_locality ? { addressLocality: _locality } : {}),
      addressCountry: 'GB',
    } } : {}),
    ...(data.priceRange ? { priceRange: data.priceRange } : {}),
    ...(ogImage ? { image: ogImage } : {}),
    ...(['trades', 'law', 'hotel'].includes(template) && _locality ? { areaServed: _locality } : {}),
  }
  const jsonLdTag = `<script type="application/ld+json">${JSON.stringify(_jsonLd).replace(/</g, '\\u003c')}</script>`
  const seoTags = [
    jsonLdTag,
    `<meta name="description" content="${seoDesc}"/>`,
    `<meta name="robots" content="index,follow"/>`,
    `<meta property="og:title" content="${esc(seoTitle)}"/>`,
    `<meta property="og:type" content="website"/>`,
    `<meta property="og:url" content="${esc(siteUrl)}"/>`,
    `<meta property="og:site_name" content="${esc(seoTitle)}"/>`,
    `<meta property="og:description" content="${seoDesc}"/>`,
    `<meta property="og:locale" content="en_GB"/>`,
    ogImage ? `<meta property="og:image" content="${esc(ogImage)}"/>` : '',
    ogImage ? `<meta property="og:image:alt" content="${esc(seoTitle)}"/>` : '',
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(seoTitle)}"/>`,
    `<meta name="twitter:description" content="${seoDesc}"/>`,
    ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}"/>` : '',
    `<link rel="canonical" href="${esc(siteUrl)}"/>`,
    `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%23000'/><text x='50' y='52' font-family='Georgia,serif' font-size='${faviconFontSize}' font-style='italic' text-anchor='middle' dominant-baseline='central' fill='%23fff'>${brandInitials}</text></svg>"/>`,
    `<script>window.addEventListener('scroll',function(){var b=document.getElementById('scrollTop');if(b)b.style.opacity=window.scrollY>600?'1':'0'})</script>`,
  ].filter(Boolean).join('')
  let htmlSeo = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8')
  htmlSeo = htmlSeo.replace('</head>', seoTags + '</head>')
  // 滚动到顶部按钮
  htmlSeo = htmlSeo.replace(
    '</body>',
    '<button id="scrollTop" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;border:none;background:rgba(0,0,0,0.7);color:white;font-size:20px;cursor:pointer;z-index:999;opacity:0;transition:opacity 0.3s;display:flex;align-items:center;justify-content:center">↑</button></body>'
  )
  fs.writeFileSync(path.join(outputDir, 'index.html'), htmlSeo, 'utf-8')

  // 生成 business-data.ts
  const varName = template==='coffee'?'coffeeData':template==='salon'?'salonData':template==='dessert'?'dessertData':template==='yoga'?'yogaData':template==='law'?'lawData':template==='hotel'?'hotelData':template==='trades'?'tradesData':'businessData'
  const versionedData = addImgVersion(data)
  fs.writeFileSync(path.join(outputDir,'src','business-data.ts'),`// auto-generated (BUILD_VERSION=${BUILD_VERSION})\n\nexport const ${varName} = ${JSON.stringify(versionedData,null,2)} as const\n`,'utf-8')

  // 更新 index.html 标题
  let html = fs.readFileSync(path.join(outputDir,'index.html'),'utf-8')
  html = html.replace('__TITLE__',data.pageTitle||data.name)
  fs.writeFileSync(path.join(outputDir,'index.html'),html,'utf-8')

  // ── 合规注入：仅真实商家站（_source==='osm' 或 OSM 对象）──
  // H1 未核实免责横幅 + H3 OSM/Openverse 署名（满足 ODbL §12.4 + CC BY 署名要求）
  // 兼容两种写法：① 既有 9 站用字符串 "osm"；② uk-biz-finder 导出用对象 {provider:'OpenStreetMap ...', ...}
  const isOsmSource = data._source === 'osm' ||
    (data._source && typeof data._source === 'object' && /openstreetmap/i.test(data._source.provider || ''))
  if (isOsmSource) {
    let finalHtml = fs.readFileSync(path.join(outputDir,'index.html'),'utf-8')
    const SHOWCASE_CONTACT = 'lic28790@gmail.com' // 真实接收 claim 请求的邮箱（H1 完全闭环）
    const banner = `<div id="showcase-banner" style="position:relative;z-index:1000;background:#faf3e0;color:#7a5b1e;font-size:12px;line-height:1.45;text-align:center;padding:7px 16px;font-family:system-ui,-apple-system,sans-serif;border-bottom:1px solid #e7d8b5">Showcase demo · Built from public OpenStreetMap data. Phone, opening hours &amp; reviews are <strong>unverified</strong> and shown for demonstration only. Business owners: <a href="mailto:${SHOWCASE_CONTACT}" style="color:#7a5b1e;text-decoration:underline">email us to claim this page or request removal</a>.</div>`
    const attr = `<div id="osm-attribution" style="margin-top:8px;padding:10px 16px;background:#f7f7f7;color:#888;font-size:11px;text-align:center;font-family:system-ui,-apple-system,sans-serif;border-top:1px solid #eee">Business data © OpenStreetMap contributors · Photos © Openverse (CC BY)</div>`
    finalHtml = finalHtml.replace('<div id="root"></div>', banner + '\n<div id="root"></div>')
    finalHtml = finalHtml.replace('</body>', attr + '\n</body>')
    fs.writeFileSync(path.join(outputDir,'index.html'),finalHtml,'utf-8')
    console.log('  🛡️ 注入未核实免责横幅 + OSM/Openverse 署名 (真实商家站)')
  }

  // ── 构建（v0.6：共享依赖 + 符号链接复用，避免每站重复 npm install） ──
  await ensureSharedDeps()
  const sharedNm = path.join(__dirname, 'node_modules')
  const siteNm = path.join(outputDir, 'node_modules')
  let useShared = false
  if (fs.existsSync(sharedNm) && !fs.existsSync(siteNm)) {
    try {
      // Windows 用 junction（无需管理员权限）；POSIX 用 dir 符号链接
      fs.symlinkSync(sharedNm, siteNm, process.platform === 'win32' ? 'junction' : 'dir')
      useShared = true
      console.log('  🔗 复用工程根 node_modules (符号链接)')
    } catch (e) {
      console.warn('  ⚠️ 符号链接失败，回退本站点 npm install: ' + (e && e.message))
    }
  }
  if (!useShared) {
    console.log('  📦 安装依赖...')
    execSync('npm install', { cwd: outputDir, stdio: 'pipe' })
  }
  console.log('  🔨 构建中...')
  execSync('npx vite build', { cwd: outputDir, stdio: 'pipe' })

  const distDir = path.join(outputDir,'dist')
  console.log(`  ✅ ${data.name} → ${distDir}`)

  return { name: data.name, projectName, outputDir, distDir }
}

// ── Cf 部署 ────────────────────────────────────

async function deployCf(distDir) {
  try {
    console.log('  ☁️ 部署到 Cloudflare Pages...')
    execSync(`npx wrangler pages deploy "${distDir}" --project-name=template-engine`,{stdio:'pipe'})
    console.log('  ✅ 部署完成')
    return true
  } catch(e) {
    console.log('  ⚠️ Cf 部署失败（wrangler 未安装或未配置）。手动将 dist 文件夹上传到 Cloudflare Pages 即可。')
    return false
  }
}

// ── Vercel 部署（客户站专用，解锁 serverless） ──
async function deployVercel(distDir, projectName) {
  try {
    if (!process.env.VERCEL_TOKEN) {
      console.log('  ⚠️ 未设置 VERCEL_TOKEN，跳过 Vercel 部署（请在环境/CI secret 中配置）。')
      return false
    }
    const name = (projectName || path.basename(path.dirname(distDir)))
      .toLowerCase().replace(/[^a-z0-9-]/g, '-')
    console.log(`  ▲ 部署到 Vercel（项目 ${name}）...`)
    execSync(
      `npx vercel deploy --prod --name "${name}" --token "${process.env.VERCEL_TOKEN}" "${distDir}"`,
      { stdio: 'pipe' }
    )
    console.log('  ✅ 部署完成')
    return true
  } catch (e) {
    console.log('  ⚠️ Vercel 部署失败（vercel CLI 未安装 / VERCEL_TOKEN 无效 / 项目名冲突）。手动运行 vercel deploy 即可。')
    return false
  }
}

// 部署分发：按 DEPLOY_TARGET 选择适配器（步骤 5）
async function deployTo(result) {
  if (DEPLOY_TARGET === 'vercel') return deployVercel(result.distDir, result.projectName)
  return deployCf(result.distDir)
}

// ── AI JSON 生成 ──────────────────────────────

function generateAiPrompt(description) {
  return `
You are generating a business-data.json for the template-engine. Based on this description, create a complete JSON config:

"${description}"

Choose the most appropriate template type from: restaurant, coffee, salon, dessert.

For a restaurant:
{
  "template": "restaurant",
  "name": "...",
  "subtitle": "Italian Restaurant",
  "tagline": "...",
  "established": "2015",
  "location": "City, UK",
  "street": "123 High Street, City",
  "phone": "+44 ...",
  "email": "...",
  "googleRating": "4.7",
  "googleReviews": "180+ reviews",
  "pageTitle": "...",
  "menuCategories": [
    { "category": "Starters", "items": [{ "name": "...", "desc": "...", "price": "£..." }] }
  ],
  "aboutTitle": "...",
  "aboutParagraphs": ["...","...","..."],
  "aboutStats": [{ "value": "...", "label": "..." }],
  "reviews": [{ "name": "...", "text": "...", "rating": 5 }],
  "reservationIntro": "...",
  "heroCta1": { "text": "View Menu", "href": "#menu" },
  "heroCta2": { "text": "Book a Table", "href": "#reservations" }
}

Output the raw JSON only, no markdown code fence, no explanation.`.trim()
}

// ── 主流程 ────────────────────────────────────

async function main() {
  // 模式 2: --ai
  if (IS_AI) {
    const aiIdx = args.indexOf('--ai')
    const description = args[aiIdx+1] || 'A family-run Italian restaurant in a UK tourist town'
    console.log('🤖 AI JSON 生成提示词:\n')
    console.log(generateAiPrompt(description))
    console.log('\n---\n将上述提示词复制到 AI 对话中，获取 JSON 后保存为 .json 文件，再运行:')
    console.log('  node generate.mjs ./your-business.json')
    return
  }

  // 模式 3: --batch
  if (IS_BATCH) {
    const batchIdx = args.indexOf('--batch')
    const batchFile = args[batchIdx+1]
    if (!batchFile || !fs.existsSync(batchFile)) { console.error('❌ 批量文件不存在'); return }
    const businesses = JSON.parse(fs.readFileSync(batchFile,'utf-8'))
    if (!Array.isArray(businesses)) { console.error('❌ 批量文件需为数组'); return }

    console.log(`📦 批量生成 ${businesses.length} 个项目...`)
    const results = []
    for (const biz of businesses) {
      // 临时写入单独 JSON
      const tmpFile = path.join(__dirname,'output','.tmp.json')
      ensureDir(path.join(__dirname,'output'))
      fs.writeFileSync(tmpFile,JSON.stringify(biz,null,2))
      const r = await generateOne(tmpFile)
      if (r) results.push(r)
    }
    // 清理
    const tmpFile = path.join(__dirname,'output','.tmp.json')
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)

    console.log(`\n✅ 批量完成: ${results.length}/${businesses.length} 个成功`)
    results.forEach(r => console.log(`   ${r.name} → ${r.distDir}`))

    // 批量部署
    if (IS_DEPLOY) {
      for (const r of results) await deployTo(r)
    }
    return
  }

  // 模式 1: 单项目生成
  const jsonPath = path.resolve(args[0])
  if (!fs.existsSync(jsonPath)) { console.error('❌ 文件不存在:',jsonPath); return }

  const result = await generateOne(jsonPath)
  if (!result) return

  console.log(`\n✨ ${result.name} 生成成功!`)
  console.log(`   部署文件: ${result.distDir}`)
  console.log(`   部署方式: ${DEPLOY_TARGET === 'vercel' ? 'Vercel (vercel deploy --prod)' : 'Cloudflare Pages'}`)

  if (IS_DEPLOY) await deployTo(result)
}

main().catch(console.error)
