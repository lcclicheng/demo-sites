# FifthStar Design Language v1.0

> **Premium Local Growth** — 高端但亲近的本地商业增长伙伴

**Status:** v1.0 · 2026-07-24 · single source of truth for every FifthStar-owned page
(Landing, Industry Demo Sites, Audit, Sales Engine, Customer Portal, future SaaS Dashboard)
and the 20-template industry system.

This document **supersedes** the earlier per-family free-accent approach (指令3). The earlier
experiment proved the need for one replicable master system — see *Resolved decisions* below.

---

## Resolved decisions (2026-07-24)

1. **Industry accent** — each industry keeps **one** trust-building accent (the 20% personality),
   retoned off "科技蓝 / 渐变紫 / 霓虹绿 / AI蓝紫". Fifth Gold `#D8B36A` is the **only** brand anchor
   (nav CTA, stars, eyebrow, badges, footer, brand mark).
2. **Typography** — **one** master system: **Playfair Display 600–700** (display) +
   **Inter 400** (body). The six per-family serifs from指令3 are retired; industry personality now
   rides on accent + motif + copy + image + spacing, *not* a different typeface.
3. **Pages** — **Hair Salon = golden Master template**. The other five category pages
   (+ the salon page itself) re-align to it. Every page = 80% core layout + 20% personality.
4. **Colour model** — **fixed all-dark**: every section uses FifthStar Black
   `#0C0A08` background (no ivory blocks). Warm Ivory `#F7F3EB` is reserved for
   inside-card surfaces (e.g. `.glass-card` light variant, future print/PDF) — **never
   as a section background**. Light text (`#F2ECE1` ink, `#A89E8C` mute) throughout.
   **No OS theme toggle.** *(Revised 2026-07-24: ivory body sections felt abrupt and
   broke the dark premium rhythm; all sections now sit on the same Black shell.)*

---

## Brand Position

**Core keywords:** Trust · Premium · Local Growth · Human Partnership · Quiet Confidence

**Do NOT:** AI-tech feel · Web3 futurism · cheap-builder feel
**Should feel like:** UK boutique consultancy + premium local business advisor + modern SaaS
**References:** Stripe · Linear · Notion · Soho House · Apple Business

Visual ratio: **60% Premium Brand · 30% Local Business · 10% Technology**

---

## 1. Colour tokens

| Token | Hex | Role |
|---|---|---|
| `--bg` (FifthStar Black) | `#0C0A08` | Header · Hero · Footer · Final CTA shell |
| `--ink` (Primary text) | `#F2ECE1` | Text on dark |
| `--mute` (Secondary text) | `#A89E8C` | Muted text on dark |
| `--ivory` (Warm Ivory) | `#F7F3EB` | Light sections · cards |
| `--ink-dark` | `#0C0A08` | Text on ivory |
| `--mute-dark` | `#6B6354` | Muted text on ivory |
| `--gold` (Fifth Gold) | `#D8B36A` | CTA · stars · eyebrow · badges · footer · mark — **CONSTANT** |
| `--accent` (industry) | per family | ring · alt tint · hero word · accent rule · motif — **20% only** |

**Forbidden:** 科技蓝 · 渐变紫 · 霓虹绿 · AI蓝紫 (they lower UK small-business trust).

**Industry accents (retoned, pending final sign-off in re-align):**
salon rose `#D27A99` · restaurant amber `#E8973A` · trades rust `#C0572C` ·
yoga sage `#6F9A78` · law deep slate `#3F5A73` (retoned from ink-blue) ·
hotel indigo `#5468A8` → to be confirmed it doesn't read "techy"; else drop to gold-only.

---

## 2. Typography

- **Display:** Playfair Display, weight **600–700**. Used for H1/H2/H3 + brand wordmark.
- **Body:** Inter, weight **400**, `line-height: 1.7`.
- **Scale:**
  - H1 `clamp(2.5rem, 5vw, 4rem)` → 40–64px
  - H2 `clamp(1.875rem, 3.6vw, 2.5rem)` → 30–40px
  - H3 `1.5rem` → 24px
  - Body `1.125rem` → 18px
  - Small `.875rem` → 14px
- **Numerals:** tabular + lining for prices; oldstyle for body prose.
- **Editorial detail:** curly quotes / curly apostrophes, en-dash ranges, true ellipsis.

---

## 3. Layout

- **Max width:** `1200px` (`--maxw: 75rem`). Never wider.
- **Section padding:** `120px` top/bottom desktop (`--section-pad: 7.5rem`);
  `64px` mobile (`4rem`).
- Generous whitespace; editorial rhythm; no cramped grids.

---

## 4. Page blueprint (mandatory on every page)

There are **two distinct blueprints** depending on whose page it is. The shared
core is Hero + Problem + Solution + Proof; the tail differs.

### Blueprint A — FifthStar's own pages (landing, sales, about, sales engine)
This is the brand telling the *merchant* what FifthStar does. Use for the root
landing page, sales pages, the audit / pricing pages, and any page that exists
to convert a visitor into a FifthStar customer.

```
01 Hero         eyebrow → headline → support → primary CTA → trust indicator
02 Problem      "You are losing customers because:" 01 / 02 / 03
03 Solution     FifthStar method: Review → Website → Growth
04 Proof        Before → After → Result
05 Pricing      sell RESULTS, not features
06 Founder Trust  one-person company as an advantage
```

### Blueprint B — Merchant demo / showcase pages (`products/fifthstar/<industry>/`, `clients/<slug>/`)
This is a sample of what FifthStar *builds for a real merchant*. The audience is
the merchant's own customers, not FifthStar's prospects. **Never include Pricing
or Founder Trust on these pages** — those are FifthStar's brand concerns, not the
merchant's. The page is a single merchant's complete showcase. **Copy must be in
the merchant's own voice, not FifthStar's sales voice** — no "Get a free audit",
no "we" referring to FifthStar, no "review/website/growth" plumbing. The page
reads as a real shop's site, with FifthStar only mentioned in the footer credit.

```
01 Hero         eyebrow (provenance: location + est. year) → headline in the merchant's voice → lead in the merchant's voice → primary CTA (book / call / walk in) → trust row (★★★★★ + actual rating + hours)
02 The chair    three reasons the merchant is good at what they do (positive framing, not "the problem")
03 What to expect  the merchant's own process · 3 steps in their world
04 Words from the chair  3 testimonials with real-feeling attribution + the merchant's actual stat row (Google reviews / rating / years)
05 Visit us     merchant name · address · hours · phone · photo placeholder · signature services as chips
06 [Final CTA]  the merchant's CTA — call / email / walk in — not FifthStar's
```

The **hero-word watermark is the merchant's store name in a thin, single-line
letterhead stamp** (Playfair 300, ~1.3–1.8rem, `.42em` letter-spacing, uppercase,
low opacity, anchored to the bottom of the hero). It is a *brand stamp*, not a
background wall — the hero must breathe. **One line, never two; never
`Style` / `Taste` / generic industry words; the word size stays small and
decorative so the hero copy reads as the primary content.**

When a real merchant is onboarded, only the name + address + hours + phone +
services + photo + testimonials + stat numbers change — the entire shell and
copy structure stays.

*(Revised 2026-07-24: Blueprint B added; previously all pages ran on
Blueprint A which leaked FifthStar brand concerns into merchant demos.
Revised 2026-07-24: hero-word letterhead treatment + copy in merchant voice
only — never FifthStar sales voice.)*

---

Never open with technology. Always lead with the customer's world.

## 5. Card system

- **Radius:** `16px` (`--radius`).
- **Border:** `1px rgba(216,179,106,.16)` = gold 16% (`--line`).
- **Shadow:** `0 20px 60px rgba(0,0,0,.15)` (`--shadow`) — soft, never hard.
- No heavy drop shadows.

---

## 6. Button system

- **Primary** — gold bg `#D8B36A`, text `#0C0A08`. (buy · consult · audit)
- **Secondary** — ghost, border gold 30%. (view case)
- **Max 2 CTAs per page.** No third button.

---

## 7. Animation (restrained, but polished)

**Allowed:** Fade-Up (`.reveal`) · Slow Gradient · Soft Glow · subtle hover micro-interactions
**Banned:** particles · 3D rotation · heavy / excessive motion
`prefers-reduced-motion` is respected (all motion disabled).

### Implemented motion (in `assets/base.css` + `assets/site.js`, shared across all pages)
These are the "premium, not flashy" details that make the page feel like Stripe / Linear / Apple
Business rather than a static brochure. All are additive and degrade gracefully if JS/GSAP fails.

- **Reveal staggered by section** — within each `section / header / .final`, `.reveal` elements
  fade-up in sequence (0.09s step) instead of all at once. Gives the page a composed rhythm.
- **Card hover lift** — `.glass-card` / `.ex-card` / `.cat-card` lift (−7px), gold border, deeper
  soft shadow, and a slight accent-tint shift on hover. *This was the missing "cheap" gap.*
- **Gold button sheen** — `.btn-gold` sweeps a soft light across on hover (`@keyframes sheen`).
- **Hero soft-glow follows pointer** — `.hero-glow` radial light tracks the cursor (Apple/Linear
  ambient light). Defaults to a static centred glow; only active when motion is allowed.
- **Count-up stats** — `[data-count]` numbers roll from 0 → target on scroll-in (eased, ~1.5s).
  Used in Proof sections. Always label demo numbers as `示例数据`.
- **Hero entrance + headline char reveal** — GSAP timeline (eyebrow→h1→lead→cta→trust) + SplitText
  masked char reveal on `h2`. Pre-paint hidden state only when motion allowed; never leaves content hidden.
- **Signature motif ambience** — breathe ring, sheen sweep, spark rise, breath pulse on the
  per-family focal emblem + watermark (no rotation per ban).

---

## 8. Industry template boundary

```
Core layout 80%  +  Industry personality 20%
```

All sites share: **Hero · Services · Reviews · Gallery · Contact**.
Variation is **only** in: image · copy · accent · section order.
Build ONE mother template; replicate it 100 times.

---

## 9. Image direction

Natural British local-business photography · warm daylight · editorial · authentic · premium.
**No** AI fake-smiling people · no over-commercial stock · no sci-fi scenes.
Salon: women beauticians, natural light, real interior.
Restaurant: owner, kitchen, customer interaction. Coffee: barista, craft, community.

---

## 10. FifthStar Design Checklist (every page must pass)

- **Brand** — looks like a UK premium business service, not a generic builder.
- **Conversion** — 5 seconds to know what's sold · clear CTA · trust element present.
- **Visual** — black / ivory / gold unified · ample whitespace · real images.
- **Business** — clear service value · obvious next action.

---

## 11. Token files (future React / SaaS Dashboard)

Mirror the CSS custom properties above in `design-system/`:
`colors.ts · typography.ts · spacing.ts · radius.ts · shadows.ts · components.ts`.
Example:

```ts
export const colors = {
  bg: "#0C0A08",
  gold: "#D8B36A",
  ivory: "#F7F3EB",
  ink: "#F2ECE1",
  mute: "#A89E8C",
};
```

---

## 12. AI page-generation rule (fixed prompt)

```
Design a FifthStar website.
Style: Premium local business growth partner.
Visual language: British luxury consulting, warm minimal,
black / ivory / gold palette.
Avoid: startup SaaS, cyberpunk, AI-futuristic.
Layout: large whitespace, editorial typography, trust-focused conversion.
```
