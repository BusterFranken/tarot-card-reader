# Fortune-teller Hero Image Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the user's pixel-art fortune-teller illustration as a hero image on the landing screen, between the title/subtitle and the question textbox.

**Architecture:** Pre-optimize the 7.1 MB source into a lightweight web asset in `public/`, then render it with the existing `next/image` pattern inside the `step === 'question'` block of `app/tarot/page.tsx`. Alt text added as a translated `heroImageAlt` key across all five locale files.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, next-intl, `sips` (macOS image tool).

## Global Constraints

- Image shown **only** on the `step === 'question'` landing screen — never on other steps.
- No `next.config.js` changes; no new npm dependencies.
- Every user-visible string uses `t()` (next-intl); alt text must be translated in all 5 locales: `messages/{en,nl,de,es,fr}.json`.
- **Asset-format deviation from spec:** spec specified WebP < 300 KB, but the local toolchain has no WebP encoder (`sips` cannot encode WebP; no cwebp/ImageMagick/Pillow/sharp). Substitute an optimized **JPEG, 1400px wide, quality 90 (~468 KB)** — achieves the same goal (7.1 MB → ~0.47 MB).

---

### Task 1: Create the optimized hero asset

**Files:**
- Create: `public/fortune-teller.jpg`

**Interfaces:**
- Produces: a static asset served at `/fortune-teller.jpg`, 1400×764, ~468 KB, referenced by Task 3.

- [ ] **Step 1: Convert + resize the source into `public/`**

```bash
cd /Users/busterfranken/demo-project
sips -s format jpeg -s formatOptions 90 --resampleWidth 1400 \
  "/Users/busterfranken/Downloads/Gemini_Generated_Image_2vku592vku592vku.png" \
  --out public/fortune-teller.jpg
```

- [ ] **Step 2: Verify dimensions and size**

```bash
sips -g pixelWidth -g pixelHeight public/fortune-teller.jpg
ls -lh public/fortune-teller.jpg | awk '{print $5}'
```
Expected: `pixelWidth: 1400`, `pixelHeight: 764` (±1), size < 600 KB.
Record the exact `pixelHeight` — it becomes the `height` prop in Task 3.

- [ ] **Step 3: Commit**

```bash
git add public/fortune-teller.jpg
git commit -m "feat: add optimized fortune-teller hero asset"
```

---

### Task 2: Add translated alt text to all locales

**Files:**
- Modify: `messages/en.json`, `messages/nl.json`, `messages/de.json`, `messages/es.json`, `messages/fr.json` (each: add a `heroImageAlt` key inside the `tarot` object)

**Interfaces:**
- Produces: translation key `tarot.heroImageAlt`, consumed by `t('heroImageAlt')` in Task 3.

- [ ] **Step 1: Add the key to each file's `tarot` namespace**

Insert alongside existing `tarot` keys (e.g., after `title`/`subtitle`), preserving valid JSON (trailing comma on the preceding line):

- `messages/en.json`: `"heroImageAlt": "A fortune teller reading tarot cards by candlelight in her caravan.",`
- `messages/nl.json`: `"heroImageAlt": "Een waarzegster die bij kaarslicht tarotkaarten leest in haar woonwagen.",`
- `messages/de.json`: `"heroImageAlt": "Eine Wahrsagerin, die bei Kerzenlicht in ihrem Wagen Tarotkarten liest.",`
- `messages/es.json`: `"heroImageAlt": "Una adivina leyendo cartas del tarot a la luz de las velas en su caravana.",`
- `messages/fr.json`: `"heroImageAlt": "Une diseuse de bonne aventure lisant les cartes de tarot à la lueur d'une bougie dans sa roulotte.",`

- [ ] **Step 2: Validate every locale file is still valid JSON**

```bash
cd /Users/busterfranken/demo-project
for f in messages/en.json messages/nl.json messages/de.json messages/es.json messages/fr.json; do
  node -e "const o=require('./$f'); if(!o.tarot||!o.tarot.heroImageAlt) throw new Error('missing heroImageAlt in $f'); console.log('$f OK')"
done
```
Expected: five `... OK` lines, no thrown errors.

- [ ] **Step 3: Commit**

```bash
git add messages/en.json messages/nl.json messages/de.json messages/es.json messages/fr.json
git commit -m "i18n: add heroImageAlt string for hero image"
```

---

### Task 3: Render the hero image on the landing screen

**Files:**
- Modify: `app/tarot/page.tsx` (insert as first child of the `space-y-6` div in the `step === 'question'` block, currently line 614)

**Interfaces:**
- Consumes: `/fortune-teller.jpg` (Task 1), `t('heroImageAlt')` (Task 2). `Image` is already imported (line 4); `t` already in scope (line 22).

- [ ] **Step 1: Insert the image markup**

Change:
```jsx
          {step === 'question' && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
```
to:
```jsx
          {step === 'question' && (
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <Image
                  src="/fortune-teller.jpg"
                  alt={t('heroImageAlt')}
                  width={1400}
                  height={764}
                  className="w-full h-auto"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
```
(Use the exact `pixelHeight` recorded in Task 1 Step 2 for `height`.)

- [ ] **Step 2: Build to verify it compiles and typechecks**

```bash
cd /Users/busterfranken/demo-project && npm run build
```
Expected: build completes, no TypeScript/ESLint errors.

- [ ] **Step 3: Visual verification in browser**

Start the dev server, open `http://localhost:3000`, and screenshot the landing screen. Confirm: the image sits between the title/subtitle and the "Your question" box; it is responsive (no horizontal overflow) at a mobile width; and it disappears after clicking "Begin reading."

- [ ] **Step 4: Commit**

```bash
git add app/tarot/page.tsx
git commit -m "feat: show fortune-teller hero image on landing screen"
```

---

## Self-Review

- **Spec coverage:** placement (Task 3) ✓; asset optimization (Task 1) ✓; `next/image` + rounded/shadow + priority (Task 3) ✓; translated alt in 5 locales (Task 2) ✓; verification via build + visual (Task 3) ✓. Deviation (JPEG vs WebP) documented in Global Constraints.
- **Placeholder scan:** none — all commands, code, and translation strings are literal.
- **Type consistency:** `heroImageAlt` key name matches between Task 2 and Task 3; asset path `/fortune-teller.jpg` matches between Task 1 and Task 3; `width`/`height` (1400/764) consistent with the resized asset.
