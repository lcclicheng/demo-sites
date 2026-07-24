# FifthStar · Review Widget Delivery SOP

> **Purpose.** This is the early (manual, file-based) delivery playbook for the Track-B
> "reputation engine" offer. It produces a self-contained code snippet a merchant pastes
> into their **existing** website to show their real public Google reviews on the homepage.
> No FifthStar account, login, or monthly widget fee is required at this stage — it is a
> one-time deliverable included with the reputation setup.
>
> **Source file:** `products/fifthstar/widget/review-widget.html`
> (open it in a browser, use the Light/Dark toggle, screenshot, then send the merchant the
> snippet between the `EMBED SNIPPET START / END` markers).

---

## 0. Compliance rules (read before every delivery)

These are non-negotiable. A breach violates Google's review-display policy and erodes trust.

1. **Real reviews only.** Paste reviews that are publicly visible on the merchant's Google
   Business Profile *right now*. Never invent, translate, or reword a review's meaning.
2. **No deleting low stars.** Show the honest mix. Hiding a 3★ or 4★ review is deceptive and
   not allowed. (You may cap at 3–5 reviews total, but pick the most *recent* ones, not the
   most flattering.)
3. **No incentives.** Do not offer discounts, freebies, or entries for reviews — against
   Google's policy. The widget simply *displays* what customers already wrote.
4. **Link to source.** Every review's "on Google" link must point at the real review / Place ID.
5. **Editable fields only.** The merchant (or you) may change `title`, `businessName`,
   `googleUrl`, `accent`, `maxReviews`, and the `reviews` array. Nothing else.
6. **Attribution.** Leave `showAttribution: true` unless the merchant has a paid plan that
   removes it. (Early manual deliveries keep it on.)

---

## 1. Build the snippet for the merchant

1. Open `review-widget.html` in a browser.
2. Toggle **Light site** / **Dark site** and screenshot both — proves it adapts to their theme.
3. In the file, edit the `window.FIFTHSTAR_REVIEW_WIDGET = { … }` config block:
   - `businessName` → merchant's name.
   - `googleUrl` → their Google Business Profile / Place ID URL.
   - `reviews[]` → 3–5 **real, recent, public** reviews. Copy text verbatim. Use the real
     review URL for each `url`. Format `date` as `YYYY-MM-DD`.
   - `maxReviews` → how many to show (3–5).
   - `accent` → leave `""` so stars follow the page text colour. Only set a hex if the
     merchant explicitly wants fixed gold stars.
4. Copy **everything between** `EMBED SNIPPET START` and `EMBED SNIPPET END` (the `<div>` +
   `<style>` + `<script>`). This is what they paste. **The config `<script>` MUST go BEFORE
   the snippet** (i.e. earlier in the page) — the embed's IIFE reads
   `window.FIFTHSTAR_REVIEW_WIDGET` synchronously on load, so if the config sits *after* the
   snippet the widget renders empty. (Do not rely on "above or below" — it must be above.)

> **Tip:** keep the merchant's raw review text in `clients/<slug>/feedback.md` (gitignored)
> so you can re-issue the snippet if they change platforms.

---

## 2. Where it goes on the page (placement)

Send the merchant a screenshot with a rectangle around the recommended spot:

- **Best:** a dedicated **"Reviews" / "What our customers say"** section on the homepage,
  ideally **above the footer** and **within the first two screen-heights** if space allows.
- **Also good:** the homepage sidebar (on blog/article layouts) or directly under the hero
  on low-scroll service sites (salons, trades, law).
- **Avoid:** burying it on a sub-page only, or inside a carousel that hides it behind a click.

Rationale: the widget is a **trust anchor** — it should be seen without scrolling far. It
inherits the page's text colour, so it blends in on both light and dark themes.

---

## 3. Paste steps by platform

### Generic HTML / custom site
Paste the snippet (and the config `<script>`) into the homepage HTML where you want it to
appear. No build step needed.

### WordPress (block editor)
Add a **Custom HTML** block on the homepage → paste the snippet + config script → Update.

### Wix
Add a **HTML iframe / Embed** element (not the "HTML code" inside a text box) → paste the
snippet + config → position the element → Publish.

### Squarespace
`Edit` → add a **Code Block** → paste the snippet + config → set "Display source" off → Save.

### Shopify
`Online Store → Themes → Edit code →` paste into `index.liquid` (or a homepage section
liquid) at the desired position.

### GoDaddy / WiX-style builders
Look for **"Embed / HTML"** or **"Insert code"**; paste the snippet. If the builder strips
`<script>`, fall back to the static-card alternative (see §4).

---

## 4. Fallback when `<script>` is stripped

Some builders (and email signatures) strip inline `<script>`. For those, deliver a
**static HTML card block** instead: take the rendered output (open the preview, copy the
generated `.fs-rw-grid` HTML from devtools) and paste that markup alone — no script needed.
It will be a fixed snapshot; refresh it for the merchant every ~6 weeks.

---

## 5. Hand-off checklist (per merchant)

- [ ] `businessName` + `googleUrl` correct
- [ ] 3–5 reviews are **real, public, recent**, text verbatim
- [ ] Every review `url` points to the real source
- [ ] Low-star reviews NOT hidden
- [ ] No incentive language anywhere on the page
- [ ] Light + Dark screenshot sent showing placement
- [ ] Merchant confirmed it renders on their live site
- [ ] `showAttribution` left `true`

---

## 6. Out of scope (early stage)

- Live auto-sync from Google (would need the Places API + a backend). Not built yet.
- A hosted iframe / NiceJob-style managed widget. Parked until manual deliveries prove demand.
- Reply-to-review inside the widget. Replies stay a separate FifthStar service.
