// Swap the closed LA GROTTA -> La Piazza 1 (real, operating Bristol Italian, info@lapiazza1.co.uk)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const f = join(__dirname, 'examples', 'osteria-lua.json');
const o = JSON.parse(readFileSync(f, 'utf8'));
o.name = 'LA PIAZZA 1';
o.tagline = 'Family-run Italian cooking in the heart of Bristol — wood-fired pizza, fresh pasta, and a warm welcome since the 1990s.';
o.location = 'Bristol, UK';
o.street = 'Bristol';
o.registeredAddress = 'Bristol, United Kingdom';
o.pageTitle = 'LA PIAZZA 1 — Italian Restaurant in Bristol';
o.heroBadge = 'Bristol · Family Run';
o.heroLine1 = 'Cooked';
o.heroLine2 = 'with love.';
o.email = 'info@lapiazza1.co.uk';
o.footerNote = '© LA PIAZZA 1. Crafted with care in Bristol.';
if (Array.isArray(o.infoTicker)) { const it = o.infoTicker.find(x => x.icon === 'MapPin'); if (it) it.text = 'Bristol'; }
o.screenshotsIntro = 'A warm room on St Augustine’s Parade — the hum of the kitchen, the clink of glasses, and the smell of wood smoke from the pizza oven.';
o.reservationNote = 'Tables up to 6 can book online. For larger parties or private hire, get in touch via the form.';
o._source = 'real-merchant';
writeFileSync(f, JSON.stringify(o, null, 2) + '\n', 'utf8');
console.log('swapped osteria-lua -> LA PIAZZA 1');
