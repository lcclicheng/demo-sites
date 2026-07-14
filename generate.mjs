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
const IS_AI = args.includes('--ai')

// ── 工具函数 ──────────────────────────────────

function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }) }
function replaceInFile(filePath, replacements) { let c=fs.readFileSync(filePath,'utf-8');for(const [s,r] of Object.entries(replacements))c=c.replaceAll(s,r);fs.writeFileSync(filePath,c,'utf-8')}

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
}

// ── 单项目生成 ────────────────────────────────

// ── 每站独立主题（全面差异化） ──────────────────
// 键名 = 项目输出目录名(projectName)。每个主题只声明与基础模板不同的 diff，
// 由 applyThemeReplace 对 css / twConfig 做精确字符串替换；html 仅在更换字体时提供完整字符串。
// 这样每站拥有独立美感，而模板 JSX 保持单一来源（便于后续统一修复）。
const THEMES = {
  // ATELIER · 编辑室美学沙龙 → 暖陶土青铜 + Marcellus（区别于 law/hotel 的金+Playfair）
  atelier: {
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Marcellus&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    cssReplace: [
      ['background:#faf7f2', 'background:#faf6f1'],
      ['rgba(61,28,61,0.15)', 'rgba(91,74,82,0.12)'],
      ['rgba(212,165,116,0.3)', 'rgba(192,137,106,0.3)'],
    ],
    twReplace: [
      ['plum:\'#3d1c3d\'', 'plum:\'#5b4a52\''],
      ['gold:\'#d4a574\'', 'gold:\'#c0896a\''],
    ],
  },

  // BREATH · 禅意瑜伽 → 雾青绿（区别于其他绿调）
  breath: {
    cssReplace: [
      ['rgba(52,211,153,0.25)', 'rgba(95,174,154,0.25)'],
    ],
    twReplace: [
      ['emerald:\'#34d399\'', 'emerald:\'#5fae9a\''],
    ],
  },

  // CHAMBERS · 遗产律所 → 铂银（金→银，去掉"老钱金"雷同）
  chambers: {
    cssReplace: [
      ['rgba(184,134,11,0.18)', 'rgba(140,152,166,0.18)'],
      ['rgba(184,134,11,0.25)', 'rgba(140,152,166,0.25)'],
      ['rgba(184,134,11,0.08)', 'rgba(140,152,166,0.08)'],
    ],
    twReplace: [
      ['gold:\'#b8860b\'', 'gold:\'#8c98a6\''],
    ],
  },

  // CR-ME · 甜品(玫瑰马卡龙) → 玫瑰金 + 莓果深棕
  'cr-me': {
    cssReplace: [
      ['background:#faf7f2', 'background:#fdf6f4'],
      ['rgba(26,16,8,0.12)', 'rgba(107,58,74,0.12)'],
      ['rgba(184,147,90,0.25)', 'rgba(224,163,176,0.25)'],
      ['rgba(184,147,90,0.04)', 'rgba(224,163,176,0.04)'],
    ],
    twReplace: [
      ['ivory:\'#faf7f2\'', 'ivory:\'#fdf6f4\''],
      ['espresso:\'#1a1008\'', 'espresso:\'#6b3a4a\''],
      ['gold:\'#b8935a\'', 'gold:\'#e0a3b0\''],
      ['cream:\'#f5f0e8\'', 'cream:\'#fbeef0\''],
    ],
  },

  // FORGE · 工业蓝领 → 铁锈橙（区别于 mario 的番茄红）
  forge: {
    cssReplace: [
      ['rgba(217,119,6,0.25)', 'rgba(194,65,12,0.25)'],
      ['rgba(217,119,6,0.2)', 'rgba(194,65,12,0.2)'],
    ],
    twReplace: [
      ['copper:\'#d97706\'', 'copper:\'#c2410c\''],
      ['rust:\'#9a3412\'', 'rust:\'#7c2d12\''],
    ],
  },

  // MARIO · 披萨(暗黑金 → 暗黑+番茄红)
  'mario-s-pizzeria': {
    cssReplace: [
      ['rgba(200,164,92,0.2)', 'rgba(217,102,63,0.22)'],
      ['rgba(200,164,92,0.3)', 'rgba(217,102,63,0.28)'],
      ['rgba(200,164,92,0.4)', 'rgba(217,102,63,0.4)'],
      ['rgba(200,164,92,0.15)', 'rgba(217,102,63,0.15)'],
      ['background:#c8a45c', 'background:#d9663f'],
    ],
    twReplace: [
      ['gold:\'#c8a45c\'', 'gold:\'#d9663f\''],
      ['\'gold-light\':\'#e0c878\'', '\'gold-light\':\'#e8896a\''],
      ['paper:\'#e8e0d0\'', 'paper:\'#f4e3da\''],
      ['mute:\'#8a8070\'', 'mute:\'#a8897d\''],
    ],
  },

  // PATISSERIE · 法式甜品(香槟金，区别于 cr-me 的玫瑰)
  patisserie: {
    cssReplace: [
      ['background:#faf7f2', 'background:#fbf8f0'],
      ['rgba(26,16,8,0.12)', 'rgba(90,74,46,0.12)'],
      ['rgba(184,147,90,0.25)', 'rgba(201,161,74,0.22)'],
      ['rgba(184,147,90,0.04)', 'rgba(201,161,74,0.04)'],
    ],
    twReplace: [
      ['ivory:\'#faf7f2\'', 'ivory:\'#fbf8f0\''],
      ['espresso:\'#1a1008\'', 'espresso:\'#5a4a2e\''],
      ['gold:\'#b8935a\'', 'gold:\'#c9a14a\''],
      ['cream:\'#f5f0e8\'', 'cream:\'#f5efe0\''],
    ],
  },

  // SOTTO-SOTTO · 意大利餐厅(亮色奶油+陶土，区别于 mario 的暗黑)
  'sotto-sotto': {
    cssReplace: [
      ['background:#0a0806', 'background:#f7f1ea'],
      ['rgba(200,164,92,0.2)', 'rgba(192,132,87,0.25)'],
      ['rgba(200,164,92,0.3)', 'rgba(192,132,87,0.25)'],
      ['rgba(200,164,92,0.4)', 'rgba(192,132,87,0.4)'],
      ['rgba(200,164,92,0.15)', 'rgba(192,132,87,0.15)'],
      ['background:#c8a45c', 'background:#c08457'],
    ],
    twReplace: [
      ['abyss:\'#0a0806\'', 'abyss:\'#f7f1ea\''],
      ['surface:\'#14110d\'', 'surface:\'#fffaf3\''],
      ['gold:\'#c8a45c\'', 'gold:\'#c08457\''],
      ['\'gold-light\':\'#e0c878\'', '\'gold-light\':\'#d9a878\''],
      ['paper:\'#e8e0d0\'', 'paper:\'#3a2e22\''],
      ['mute:\'#8a8070\'', 'mute:\'#8a7a6a\''],
    ],
  },

  // THE VAULT · 老钱民宿 → Playfair 换 Fraunces + 古金
  'the-vault': {
    html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:wght@400;500;600;700;900&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'"/><title>__TITLE__</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    cssReplace: [
      ['rgba(200,149,44,0.25)', 'rgba(184,137,63,0.25)'],
    ],
    twReplace: [
      ['gold:\'#c8952c\'', 'gold:\'#b8893f\''],
      ['\'"Playfair Display"\'', '\'"Fraunces"\''],
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
  fs.writeFileSync(path.join(outputDir,'src','index.css'),t.css)
  fs.writeFileSync(path.join(outputDir,'tailwind.config.js'),t.twConfig)
  for (const f of t.files) { const s=path.join(__dirname,f);if(fs.existsSync(s)){const d=path.join(outputDir,'src',path.basename(f));ensureDir(path.dirname(d));fs.copyFileSync(s,d)}}

  // 拷贝项目专属图片资源（assets/<projectName>/ → public/images/，构建后访问 /images/xxx.jpg）
  const imgSrc = path.resolve(__dirname,'assets',projectName)
  if (fs.existsSync(imgSrc)) {
    const pubDest = path.join(outputDir,'public','images')
    ensureDir(pubDest)
    const imgs = fs.readdirSync(imgSrc)
    for (const f of imgs) fs.copyFileSync(path.join(imgSrc,f),path.join(pubDest,f))
    console.log(`  🖼️ 已拷贝 ${imgs.length} 张图片到 public/images/`)
  }

  // 注入 OG 标签 + favicon + scroll-to-top
  let htmlOut = fs.readFileSync(path.join(outputDir,'index.html'),'utf-8')
  const ogTags = `<meta property="og:title" content="${(data.pageTitle||data.name).replace(/"/g,'&quot;')}"/><meta property="og:type" content="website"/><meta property="og:description" content="${(data.tagline||'').replace(/"/g,'&quot;').slice(0,200)}"/><meta name="description" content="${(data.tagline||'').replace(/"/g,'&quot;').slice(0,200)}"/><link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${t.favicon||'●'}</text></svg>"/><script>window.addEventListener('scroll',function(){var b=document.getElementById('scrollTop');if(b)b.style.opacity=window.scrollY>600?'1':'0'})</script>`
  htmlOut = htmlOut.replace('</head>', ogTags + '</head>')
  // Add scroll-to-top button before </body>
  htmlOut = htmlOut.replace('</body>', '<button id="scrollTop" onclick="window.scrollTo({top:0,behavior:\'smooth\'})" style="position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;border:none;background:rgba(0,0,0,0.7);color:white;font-size:20px;cursor:pointer;z-index:999;opacity:0;transition:opacity 0.3s;display:flex;align-items:center;justify-content:center">↑</button></body>')
  fs.writeFileSync(path.join(outputDir,'index.html'),htmlOut,'utf-8')

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

  // 生成 business-data.ts
  const varName = template==='coffee'?'coffeeData':template==='salon'?'salonData':template==='dessert'?'dessertData':template==='yoga'?'yogaData':template==='law'?'lawData':template==='hotel'?'hotelData':template==='trades'?'tradesData':'businessData'
  fs.writeFileSync(path.join(outputDir,'src','business-data.ts'),`// auto-generated\n\nexport const ${varName} = ${JSON.stringify(data,null,2)} as const\n`,'utf-8')

  // 更新 index.html 标题
  let html = fs.readFileSync(path.join(outputDir,'index.html'),'utf-8')
  html = html.replace('__TITLE__',data.pageTitle||data.name)
  fs.writeFileSync(path.join(outputDir,'index.html'),html,'utf-8')

  // 构建
  console.log('  📦 安装依赖...')
  execSync('npm install',{cwd:outputDir,stdio:'pipe'})
  console.log('  🔨 构建中...')
  execSync('npx vite build',{cwd:outputDir,stdio:'pipe'})

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
      for (const r of results) await deployCf(r.distDir)
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
  console.log('   部署方式: 将 dist 上传到 Cloudflare Pages')

  if (IS_DEPLOY) await deployCf(result.distDir)
}

main().catch(console.error)
