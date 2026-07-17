// build-leads-extra2.mjs — 追加补找的 restaurant 7 家
const extra = [
  {"name":"The Falstaff","industry":"restaurant","city":"Plymouth","source":"https://mysweetpub.co.uk/plymouth-devon/the-falstaff/2643","email":"lmg@live.co.uk","note":"传统酒吧，仅 mysweetpub/whatpub 目录，无独立网站，页列公开邮箱"},
  {"name":"The River View","industry":"restaurant","city":"Birkenhead","source":"https://theriverview-birkenhead.foodanddrinksites.co.uk","email":"theriverview1@outlook.com","note":"仅 foodanddrinksites 子域，无自有网站，Get In Touch 区明文邮箱"},
  {"name":"The Shabby Scholar","industry":"restaurant","city":"Carlisle","source":"https://mysweetpub.co.uk/carlisle-cumbria/the-shabby-scholar/24685","email":"theshabbyscholar@hotmail.co.uk","note":"酒吧列于 mysweetpub，无独立网站，目录页展示公开邮箱"},
  {"name":"The Royal Scot","industry":"restaurant","city":"Carlisle","source":"https://mysweetpub.co.uk/carlisle-cumbria/the-royal-scot/2076","email":"theroyalscot@hotmail.co.uk","note":"酒吧列于 mysweetpub，无独立网站，目录页展示公开邮箱"},
  {"name":"Red Lion","industry":"restaurant","city":"Newcastle under Lyme","source":"https://mysweetpub.co.uk/newcastle-under-lyme-staffordshire/red-lion/15308","email":"hkozlowski@live.co.uk","note":"酒吧列于 mysweetpub，website 仅指向 pubsgalore 目录，无独立站，公开邮箱"},
  {"name":"Secrets","industry":"restaurant","city":"Newcastle upon Tyne","source":"https://mysweetpub.uk/newcastle-upon-tyne-tyne-wear/secrets/23171","email":"secretsbarnewcastle@gmail.com","note":"Bar & Grill 列于 mysweetpub，website 仅指向新闻文章，无独立站，公开邮箱"},
  {"name":"The Blue Bell","industry":"restaurant","city":"York","source":"https://mysweetpub.uk/york-lancashire/the-blue-bell/13441","email":"bluebellyork@gmail.com","note":"约克最古老传统酒吧，列于 mysweetpub，无独立网站，公开邮箱"}
];

import { readFileSync, writeFileSync } from 'node:fs';
const base = JSON.parse(readFileSync('D:/workbuddy项目/2026-07-07-09-02-15/gh-pages-build/leads-all.json', 'utf8'));
let n = base.length;
const seen = {};
const out = extra.map((r) => {
  n += 1;
  const base_slug = r.name.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  let slug = base_slug + '-' + r.industry;
  if (seen[slug]) slug = base_slug + '-' + r.industry + '-' + (seen[slug]++);
  else seen[slug] = 1;
  return { id:'L'+String(n).padStart(3,'0'), slug, name:r.name, industry:r.industry, city:r.city, source:r.source, email:r.email, emailStatus:'found', hasOwnSite:false, note:r.note, status:'lead', segment:'precise' };
});
const all = [...base, ...out];
writeFileSync('D:/workbuddy项目/2026-07-07-09-02-15/gh-pages-build/leads-all.json', JSON.stringify(all, null, 2));
const slugs = all.map(x=>x.slug);
const precise = all.filter(x=>x.segment==='precise');
console.log('本次新增:', out.length, ' 主库总数:', all.length, ' 精准人群:', precise.length);
console.log('slug 唯一:', new Set(slugs).size === slugs.length);
