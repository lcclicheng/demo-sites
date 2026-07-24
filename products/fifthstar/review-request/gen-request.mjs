#!/usr/bin/env node
/**
 * gen-request.mjs — FifthStar review-request generator (early, file-based)
 *
 * Turns a merchant's details into three hand-off assets:
 *   request-email.md   personalised ask email (industry tone applied)
 *   request-sms.txt    short SMS / WhatsApp ask (<=160 chars)
 *   qr-card.html       printable A6 counter card with a QR to the review URL
 *
 * The merchant sends the email/SMS by hand and prints the QR card. No auto-bulk,
 * no incentives (see templates.md §0).
 *
 * Usage:
 *   node gen-request.mjs --name "The Copper Kettle" --city Manchester \
 *     --industry restaurant --review-url "https://g.page/.../review" \
 *     --owner Ethan --flavour "Sunday roast" --out ./out/copper-kettle
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── tiny arg parser (no deps) ──────────────────────────────────────────────
function parseArgs(argv) {
  const out = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true'
      out[key] = val
    }
  }
  return out
}

// ── industry tone table ────────────────────────────────────────────────────
// Each entry: subject + email body + default flavour. Aliases map variants in.
const TONES = {
  restaurant: {
    subject: (d) => `Hope the ${d.flavour} hit the spot, [Name]?`,
    flavourDefault: 'food',
    emoji: false,
    body: (d) => `Hi [Name],

Glad you came by ${d.name} in ${d.city} — hope the ${d.flavour} landed well.

If the evening was good to you, a quick Google review is the kindest thing you can do for a small kitchen. Takes a minute:
${d.reviewUrl}

No worries at all if not. Thanks for the table,
${d.owner}`,
  },
  cafe: {
    subject: () => `Hope the coffee hit the spot, [Name]?`,
    flavourDefault: 'cappuccino',
    emoji: false,
    body: (d) => `Hi [Name],

Great to have you at ${d.name} in ${d.city} — hope the ${d.flavour} was just right.

If you'd come back, a quick Google review helps a small cafe stay on the map:
${d.reviewUrl}

Thanks for the visit,
${d.owner}`,
  },
  salon: {
    subject: () => `Loving the new look, [Name]?`,
    flavourDefault: 'cut',
    emoji: false,
    body: (d) => `Hi [Name],

Great having you in at ${d.name} — hope you're still loving the ${d.flavour}.

If you'd recommend us, a Google review helps new clients find the chair:
${d.reviewUrl}

That's it from me — enjoy the fresh look,
${d.owner}`,
  },
  law: {
    subject: () => `Were we able to help, [Name]?`,
    flavourDefault: 'matter',
    emoji: false,
    body: (d) => `Hi [Name],

Thank you for trusting ${d.name} with your ${d.flavour}. If the outcome worked for you, a short Google review helps others in ${d.city} find dependable advice:
${d.reviewUrl}

We appreciate it,
${d.owner}`,
  },
  yoga: {
    subject: () => `How's the practice feeling, [Name]?`,
    flavourDefault: 'practice',
    emoji: false,
    body: (d) => `Hi [Name],

Lovely to see you at ${d.name}. If the studio's been a good place to land, a Google review helps others find their way to the mat:
${d.reviewUrl}

Namaste,
${d.owner}`,
  },
  hotel: {
    subject: (d) => `Hope you slept well at ${d.name}`,
    flavourDefault: 'stay',
    emoji: false,
    body: (d) => `Hi [Name],

Thank you for staying with us in ${d.city}. If your time with us felt right, a Google review is the best thank-you you can give the team:
${d.reviewUrl}

Safe travels,
${d.owner}`,
  },
  trades: {
    subject: () => `All sorted at your place, [Name]?`,
    flavourDefault: 'job',
    emoji: false,
    body: (d) => `Hi [Name],

Glad we could get the ${d.flavour} done right at your ${d.city} home. If the work held up, a Google review helps a local tradesman keep the diary full:
${d.reviewUrl}

Cheers,
${d.owner}`,
  },
  florist: {
    subject: () => `Hope it made someone's day, [Name]?`,
    flavourDefault: 'bouquet',
    emoji: false,
    body: (d) => `Hi [Name],

Thanks for the order from ${d.name}. If the ${d.flavour} landed well, a Google review helps a small shop like ours keep going:
${d.reviewUrl}

Warmly,
${d.owner}`,
  },
  bakery: {
    subject: () => `Hope the bake hit the spot, [Name]?`,
    flavourDefault: 'bake',
    emoji: false,
    body: (d) => `Hi [Name],

Thanks for choosing ${d.name}. If the ${d.flavour} went down well, a Google review helps a small bakery stay warm:
${d.reviewUrl}

Thanks for the support,
${d.owner}`,
  },
}

const ALIAS = { coffee: 'cafe', barbers: 'salon', wellness: 'yoga', hospitality: 'hotel', 'home-services': 'trades' }

function getTone(industry) {
  const key = (industry || '').toLowerCase()
  if (TONES[key]) return TONES[key]
  if (ALIAS[key]) return TONES[ALIAS[key]]
  // default
  return {
    subject: (d) => `Thanks for visiting ${d.name}`,
    flavourDefault: 'visit',
    emoji: false,
    body: (d) => `Hi [Name],

Really glad you chose ${d.name} in ${d.city}. If we got it right, a Google review helps more locals find us:
${d.reviewUrl}

Thanks,
${d.owner}`,
  }
}

// ── QR card (printable) ────────────────────────────────────────────────────
function qrCard(d) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=${encodeURIComponent(d.reviewUrl)}`
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Review card · ${d.name}</title>
<style>
  @page { size: A6; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  .card { width: 105mm; height: 148mm; margin: 0 auto; padding: 14mm 10mm;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; background: #fff; color: #1a1a1a; }
  .biz { font-size: 22px; font-weight: 800; letter-spacing: -.01em; margin: 0 0 6px; }
  .prompt { font-size: 14px; line-height: 1.35; margin: 0 0 16px; max-width: 78mm; color: #333; }
  .qr { width: 64mm; height: 64mm; border: 6px solid #fff; box-shadow: 0 0 0 1px #e3e3e3; }
  .qr img { width: 100%; height: 100%; display: block; }
  .url { font-size: 10.5px; margin-top: 14px; color: #555; word-break: break-all; max-width: 82mm; }
  .foot { font-size: 9px; margin-top: 8px; color: #999; }
  @media print { body { -webkit-print-color-adjust: exact; } }
</style></head>
<body>
  <div class="card">
    <p class="biz">${d.name}</p>
    <p class="prompt">Loved your visit? Tap to leave us a Google review — it takes a minute and means the world to a small ${d.city} business.</p>
    <div class="qr"><img src="${qr}" alt="QR code to leave a Google review"></div>
    <p class="url">${d.reviewUrl}</p>
    <p class="foot">Reputation help by FifthStar · thefifthstar.site</p>
  </div>
</body></html>`
}

// ── main ───────────────────────────────────────────────────────────────────
function main() {
  const a = parseArgs(process.argv)
  const name = a.name || a.business
  if (!name) { console.error('Missing --name "<Business Name>"'); process.exit(1) }
  if (!a['review-url']) { console.error('Missing --review-url "<Google review compose link>"'); process.exit(1) }

  const industry = a.industry || 'default'
  const tone = getTone(industry)
  const data = {
    name,
    city: a.city || 'your city',
    industry,
    reviewUrl: a['review-url'],
    owner: a.owner || 'the team',
    flavour: a.flavour || a.dish || tone.flavourDefault,
  }

  const email = `Subject: ${tone.subject(data)}\n\n${tone.body(data)}\n`
  const smsEmoji = tone.emoji ? ' 👋' : ''
  const sms = `Hi [Name]${smsEmoji} thanks for visiting ${name}! If you enjoyed it, a quick Google review really helps: ${data.reviewUrl} — ${data.owner}`

  const outDir = resolve(__dirname, a.out || `./out/${name.replace(/\s+/g, '-').toLowerCase()}`)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(resolve(outDir, 'request-email.md'), email, 'utf8')
  writeFileSync(resolve(outDir, 'request-sms.txt'), sms, 'utf8')
  writeFileSync(resolve(outDir, 'qr-card.html'), qrCard(data), 'utf8')

  console.log('Generated review-request assets in:')
  console.log('  ' + resolve(outDir, 'request-email.md'))
  console.log('  ' + resolve(outDir, 'request-sms.txt'))
  console.log('  ' + resolve(outDir, 'qr-card.html'))
  console.log(`\nTone: ${industry} · flavour: "${data.flavour}" · email ${email.length} chars · SMS ${sms.length} chars`)
  if (sms.length > 160) console.log('⚠ SMS exceeds 160 chars — may split into 2 messages.')
}

main()
