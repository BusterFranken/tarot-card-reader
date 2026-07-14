# Fortune-teller Hero Image — Design Spec

**Date:** 2026-07-14
**Status:** Approved
**Branch:** `feature/fortune-teller-hero`

## Goal

Add a user-supplied pixel-art illustration (a fortune teller reading tarot by
candlelight) as a hero image on the app's landing screen, positioned between the
page title/subtitle and the "ask your question" textbox.

## Scope & placement

- Show the image **only on the opening `step === 'question'` screen**. It is not
  shown during shuffling, card reveals, or readings.
- Render it as the first child of the `space-y-6` container inside the
  `step === 'question'` block in `app/tarot/page.tsx` (before the "Your question"
  label, currently around line 615), so it sits between the subtitle and the
  question input.

## Asset

- Source: `~/Downloads/Gemini_Generated_Image_2vku592vku592vku.png`
  (2816×1536, ~7.1 MB) — too heavy to ship directly.
- Produce an optimized copy at **`public/fortune-teller.webp`**:
  - ~1400 px wide (displays at ≤ ~1050 px, so ample), aspect ratio preserved.
  - Target file size **< ~300 KB**, visually indistinguishable from the source.
- WebP chosen over PNG: universal browser support, far smaller for this art,
  no visible quality loss.

## Rendering

Use the existing `next/image` pattern (consistent with the card images, and
`unoptimized` so it does not consume Vercel Hobby's image-optimization quota
since the asset is pre-optimized):

```jsx
<div className="rounded-xl overflow-hidden shadow-lg mb-2">
  <Image
    src="/fortune-teller.webp"
    alt={t('heroImageAlt')}
    width={1400}
    height={764}
    className="w-full h-auto"
    priority
    unoptimized
  />
</div>
```

- `width`/`height` set the intrinsic ratio to prevent layout shift; `w-full h-auto`
  keeps it responsive on mobile.
- `rounded-xl` + `shadow-lg` seat it against the white card; the image already
  carries its own ornate border.
- `priority` because it is the above-the-fold hero (better LCP).
- Final `height` will be set to match the exact resized dimensions.

## Accessibility / i18n

Every visible string in this app is translated via `t()`. Add a `heroImageAlt`
key to the `tarot` namespace in all five locale files
(`messages/{en,nl,de,es,fr}.json`). English value:
> "A fortune teller reading tarot cards by candlelight in her caravan."
Other locales get equivalent translations.

## Out of scope (YAGNI)

No lightbox, no carousel/animation, no `next.config` changes, no changes to any
other step or component.

## Verification

Automated unit tests add no meaningful value for a presentational image insert.
Verify by:

1. `npm run build` completes successfully.
2. Run the dev server and confirm in-browser (screenshot) that the image renders
   correctly between the title and the question box on both desktop and mobile
   widths, and that it is absent once a reading starts.
