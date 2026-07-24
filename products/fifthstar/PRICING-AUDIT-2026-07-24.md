# Pricing v2 Copy Audit — 2026-07-24 (#431)

Hub page: `integrated-offer.html` (source) · synced to `_preview/index.html` + `thefifthstar-live/index.html`.

## Acceptance criteria — result

| Check | Result |
|---|---|
| No £590 residue (any HTML) | ✅ PASS — `grep £590` across all `*.html` = 0 matches |
| Four tiers consistent (Free/Reputation/Growth Partner/Growth Plus) | ✅ PASS — £0 / £39 / £79 / £149 identical across hero, ladder, pillars, pricing cards |
| Red-line copy present, no forbidden phrasing | ✅ PASS — "managed in one place" (H1) + "without upfront website costs" (hero lead) both present; no "free website £79/mo" phrasing anywhere (only "no upfront build fee" / "free GitHub Pages hosting", compliant) |
| Growth Partner "most popular" label | ✅ PASS — consistent on ladder + pricing card |

## Findings & fixes

### F1 · [HIGH → fixed] Annual price ignored the v2 annual discount
- Spec (MEMORY.md Pricing v2): annual discount **Reputation £390/yr · GP £790/yr · GP+ £1,490/yr** (~17% off monthly×12).
- Page showed annual = monthly×12 (**£468 / £948 / £1,788**) with zero discount — contradicting the spec.
- Coexisted with the first-year **welcome rate** (£29/£59/£119) without clarifying the relationship → visitor confusion.
- **Decision (user, 2026-07-24): Option C — both coexist + clarify copy.**
- **Fix:**
  1. Pricing cards' annual figures changed to the discounted **£390 / £790 / £1,490**, each with a `save ~17%` inline note.
  2. Merged the old standalone "First year with a site…" line (422) into the welcome-banner, which now states both rates explicitly:
     > Your first year is **Reputation £29/mo · GP £59/mo · GP+ £119/mo** — lower than our standard annual price. After year one, standard rates apply (£39/£79/£149/mo); pay annually and you save ~17% at **£390 / £790 / £1,490 per year**.
  3. Quarterly / 6-monthly cadences kept at monthly×N (spec defines discount for annual billing only).

### F2 · [LOW → fixed] Undefined "weekly report" term
- Pillar bullet (line 348) said GP includes a "weekly report", but every other section (ladder + pillar Reputation) uses **"monthly insights"**. Term undefined elsewhere.
- **Fix:** changed to "monthly insights" for consistency.

### F3 · [OPS flag, not a copy error] PayPal acceptance promise
- Line 436 promises "everything via PayPal, UK cards accepted, no account needed." This is a business-readiness dependency, not a copy defect.
- **Action needed (owner):** confirm FifthStar's PayPal Business account that receives GBP is live before this promise is relied upon in outreach.

## Files changed
- `products/fifthstar/integrated-offer.html` (source, committed)
- `products/fifthstar/_preview/index.html` (preview mirror, gitignored — synced for parity)
- `thefifthstar-live/index.html` (production, committed)

## Verification
- Source grep confirms: £390/£790/£1,490 + `save ~17%` present; £468/£948/£1,788 absent; "weekly report" absent; welcome-banner carries both welcome (£29/£59/£119) and standard-annual (£390/£790/£1,490) prices.
- Live: to be confirmed via `curl` after push + GitHub Pages rebuild.
