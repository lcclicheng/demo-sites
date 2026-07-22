# Fifth Star · Review-Request Template Bank (early, file-based)

> **What this is.** A semi-manual system to help a merchant *ask* their own customers
> for Google reviews — the other half of the reputation engine (the widget *shows* reviews;
> this *collects* them). Early stage: **you (Ethan) generate the copy + a printable QR card
> from `gen-request.mjs`, and the merchant sends it by hand.** No auto-bulk, no incentives.
>
> Generated assets live in `products/fifthstar/review-request/gen-request.mjs`.

---

## 0. Rules (compliance — read before sending anything)

1. **One ask, voluntary.** Customers opt in by scanning/clicking. Never auto-send to a bought
   list. The merchant sends to people they actually served.
2. **No incentives.** Do not offer discounts/entries for reviews (Google policy). A plain
   "if you enjoyed it, a review helps" is fine.
3. **Personalise.** Use the customer's first name when the merchant has it; otherwise a
   generic warm opener. Never blast identical mass mail.
4. **Link to the real review URL.** Use the merchant's Google review-compose link
   (`https://search.google.com/local/writereview?placeid=…` or `https://g.page/…/review`).
5. **Keep it short.** Email ≤ 90 words. SMS ≤ 160 chars. The QR card does the talking.
6. **Frequency.** One request per visit. Don't re-ask the same customer weekly.

---

## 1. Per-industry email templates

> Brackets `[ ]` are filled by `gen-request.mjs`. Each tone is tuned so it doesn't sound
> like a marketing blast. Swap the flavour line per industry.

### Restaurant / Cafe
```
Subject: Hope the [dish] hit the spot, [Name]?

Hi [Name],

Glad you came by [BusinessName] in [City] — hope the [dish] landed well.

If the evening was good to you, a quick Google review is the kindest thing
you can do for a small kitchen. Takes a minute:
[reviewUrl]

No worries at all if not. Thanks for the table,
[OwnerName]
```
**Flavour line (pick one):** "the Sunday roast", "the cappuccino", "the window table", "the birthday cake we made".

### Salon / Barbers
```
Subject: Loving the new look, [Name]?

Hi [Name],

Great having you in at [BusinessName] — hope you're still loving the [cut/colour].

If you'd recommend us, a Google review helps new clients find the chair:
[reviewUrl]

That's it from me — enjoy the fresh look,
[OwnerName]
```

### Law firm
```
Subject: Were we able to help, [Name]?

Hi [Name],

Thank you for trusting [BusinessName] with your matter. If the outcome worked
for you, a short Google review helps others in [City] find dependable advice:
[reviewUrl]

We appreciate it,
[OwnerName]
```

### Yoga / Wellness
```
Subject: How's the practice feeling, [Name]?

Hi [Name],

Lovely to see you at [BusinessName]. If the studio's been a good place to land,
a Google review helps others find their way to the mat:
[reviewUrl]

Namaste,
[OwnerName]
```

### Hotel / Hospitality
```
Subject: Hope you slept well at [BusinessName]

Hi [Name],

Thank you for staying with us in [City]. If your time with us felt right, a
Google review is the best thank-you you can give the team:
[reviewUrl]

Safe travels,
[OwnerName]
```

### Trades / Home services
```
Subject: All sorted at your place, [Name]?

Hi [Name],

Glad we could get the [job] done right at your [City] home. If the work held up,
a Google review helps a local tradesman keep the diary full:
[reviewUrl]

Cheers,
[OwnerName]
```

### Florist / Bakery (gentle)
```
Subject: Hope it made someone's day, [Name]?

Hi [Name],

Thanks for the order from [BusinessName]. If the [bouquet/bake] landed well,
a Google review helps a small shop like ours keep going:
[reviewUrl]

Warmly,
[OwnerName]
```

### Default (any other trade)
```
Subject: Thanks for visiting [BusinessName]

Hi [Name],

Really glad you chose [BusinessName] in [City]. If we got it right, a Google
review helps more locals find us:
[reviewUrl]

Thanks,
[OwnerName]
```

---

## 2. SMS / WhatsApp short ask (≤160 chars)

```
Hi [Name] 👋 thanks for visiting [BusinessName]! If you enjoyed it, a quick Google review really helps: [reviewUrl] — [OwnerName]
```
Keep one emoji max, or none for law/trades. The `[reviewUrl]` should be the short `g.page` link.

---

## 3. Printable QR counter card

`gen-request.mjs` emits `qr-card.html` — an A6 print card:

- Business name + a one-line warm prompt ("Loved your visit? Tap to leave a Google review").
- A QR code encoding the review URL (so phone camera → review box opens).
- The short URL printed beneath as a fallback.

**Print tips for the merchant:** 2-up on A4, card stock, place by the till / on the table /
at the reception desk. One card per physical touchpoint.

---

## 4. Using the generator

```bash
node gen-request.mjs \
  --name "The Copper Kettle" \
  --city "Manchester" \
  --industry restaurant \
  --review-url "https://g.page/the-copper-kettle/review" \
  --owner "Ethan" \
  --dish "Sunday roast" \
  --out ./out/copper-kettle
```

Outputs into `--out`:
- `request-email.md` — personalised email (industry tone applied)
- `request-sms.txt` — short ask
- `qr-card.html` — printable QR card

Then the merchant copies the email/SMS and sends by hand; prints the QR card.

> **v1 dependency note:** the QR image uses `api.qrserver.com` (free, no key) at print time.
> Replace with a self-hosted/embedded QR generator before relying on it offline.
