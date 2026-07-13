// 给每个 example JSON 加 slug 字段，锁定部署目录名（与门户 index.html 链接一致）
import fs from 'fs'
import path from 'path'

const dir = path.resolve('examples')
const map = {
  'atelier-salon.json': 'atelier',
  'breath-yoga.json': 'breath',
  'chambers-law.json': 'chambers',
  'creme-dessert.json': 'cr-me',
  'forge-trades.json': 'forge',
  'mario-pizza.json': 'mario',
  'mono-coffee.json': 'mono',
  'patisserie-v2.json': 'patisserie',
  'sotto-sotto.json': 'sotto-sotto',
  'vault-hotel.json': 'the-vault',
}

for (const [file, slug] of Object.entries(map)) {
  const p = path.join(dir, file)
  if (!fs.existsSync(p)) { console.log(`跳过(不存在): ${file}`); continue }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  if (data.slug === slug) { console.log(`已存在且一致: ${file} -> ${slug}`); continue }
  data.slug = slug
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  console.log(`已写入: ${file} -> slug="${slug}"`)
}
console.log('done')
