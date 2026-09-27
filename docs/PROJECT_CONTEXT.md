# TrainerLedger — Project Context

Handoff for a fresh development session. Reflects branch `redesign/premium-dark` (commit `590939c` plus the uncommitted design-audit rounds, 25 Sept 2026). `main` is still the pre-redesign site; the redesign is live only as a Vercel preview.
The branch `polish/refine` (and `stash@{0}`) holds an alternative, unreviewed "de-slop" pass that removes the glass and decorative type. It was set aside when the owner chose to keep this look.

---

## What it is

A free US tax estimator for self-employed personal trainers and fitness coaches. It covers SE tax, federal income tax, QBI, deductions, and quarterly payments. No signup needed; the calculation runs entirely in the browser. Optional Google sign-in lets users save estimates.

- **Live:** https://filtness-tracker.vercel.app
- **Repo:** `Ganesh21Patil/Filtness_tracker`, branch `main`
- **The app lives in `site/`.** Everything at the repo root outside `site/` is legacy (see Known issues).

## Tech stack

| | |
|---|---|
| Framework | Next.js **14.2.3** App Router, React 18, TypeScript |
| Styling | Tailwind CSS 3.4, no component library |
| Fonts | DM Sans (`--font-sans`, UI) + DM Serif Display (`--font-serif`, display and figures), plus two decorative-only faces: Barlow Condensed (`--font-condensed`, painted-wall slogans) and Nothing You Could Do (`--font-script`, handwritten notes). All via `next/font` in `app/layout.tsx`, **only the weights/styles in use** (each is a file next/font preloads on every page); the decorative two use `preload: false` and are fetched only where they render (xl). Result: 2 font files / 54 KB on most pages, down from 8 / 148 KB |
| Auth + DB | Supabase (`@supabase/ssr`), Google OAuth only, Postgres with RLS |
| Hosting | Vercel via GitHub integration. **Root Directory = `site`**. Pushing to `main` auto-deploys in about 60s |
| Analytics | `@vercel/analytics` |
| Tests | None in `site/`. Verification is `npx tsc --noEmit` + `npm run build` + checking the running page |

Commands, run in `site/`: `npm run dev` (port 3000), `npm run build`, `npx tsc --noEmit`.
The Browser-pane dev server config is in `.claude/launch.json` (`fitness-tracker-site`).

## Directory map (`site/`)

```
lib/
  calculator.ts      ★ THE tax engine + TAX_CONFIG + BLS_TRAINER_WAGES + helpers
  faqs.ts            FAQ data (plain module — see RSC rule below)
  ics.ts             downloadQuarterlyIcs(): shared .ics export
  auth.ts            safeNext(), signInHref(), NEXT_COOKIE, SIGNED_IN_COOKIE, SAVE_INTENT_KEY, SIGN_IN_ERRORS
  dates.ts           nextDueDate(), dueIn(), startOfToday(): shared by the results panel and dashboard
  supabase/          config.ts (isSupabaseConfigured), client.ts, server.ts
components/
  Calculator.tsx     Main guided calculator (client). `embed` prop for iframe mode
  Dashboard.tsx      /dashboard breakdown (client)
  Faq.tsx            Accessible accordion (client)
  Header.tsx         Skip link, nav, account menu / sign-in, mobile menu; hides itself on /embed
  AccountMenu.tsx    Signed-in avatar disclosure (saved estimates, breakdown, sign out)
  Footer.tsx         CTA band + link columns; hides itself on /embed
  Toaster.tsx        toast("…", { action, tone }) — one short confirmation under the header
  RevealObserver.tsx Fades [data-reveal] content up once as it scrolls into view
  CalendarButton.tsx .ics download button with a "downloaded" confirmation
  SaveEstimateButton.tsx, EmbedSnippet.tsx, PageHeader.tsx (PageHeader + PageBand), ArticleShell.tsx
app/
  page.tsx           Homepage (hero, sections, <Faq/>, FAQPage JSON-LD)
  calculator/ deductions/     Standalone real pages (not anchors)
  dashboard/         noindex; not in sitemap
  saved-estimates/   Signed-in list + delete (layout.tsx holds its title; noindex)
  auth/sign-in/      Server page (reads ?next=&error=) + SignInCard.tsx (client)
  auth/callback/route.ts   Exchanges the OAuth code, returns to `next` (cookie or query, same-site only)
  embed/             Bare calculator for iframes (noindex, dark theme, sr-only h1)
  widget/            "Embed this on your site" page with snippet
  guides/*           6 SEO articles
  calculators/*      3 SEO landing pages (llc-vs-scorp = honest "coming soon")
  about/ privacy/ terms/ sitemap.ts robots.ts icon.tsx opengraph-image.tsx
middleware.ts        Refreshes Supabase session cookie
supabase/schema.sql  saved_estimates table + RLS policies
```

## Do-not-break list

1. **`lib/calculator.ts` is authoritative. Don't change tax logic during UI work.** Every 2026 figure in it was checked against primary sources (IRS Rev. Proc. 2025-32, SSA, the IRS mid-year mileage notice, OBBBA §70105). Change them only for verified corrections, and cite the source in the comment block. `calculateTaxes(inputs): TaxResults` is the single entry point; the UI must never re-derive tax math itself.
2. **Deduction "savings" figures are exact.** They come from finite differences: `calculateTaxes` is run with the field zeroed and `totalLiability` is diffed. An earlier marginal-rate approximation overstated savings by 53%. Don't reintroduce an approximation.
3. **`localStorage` keys:** `trainerledger-inputs-v2` (TaxInputs) and `trainerledger-worktype-v1`. The dashboard reads the inputs key. Renaming either wipes users' saved sessions.
4. **Embed mode (`<Calculator embed />`)** must stay anonymous and self-contained: no localStorage read/write, no sign-in link, no print button, no dashboard link, no Header/Footer.
5. **Saved estimates are frozen.** The `results` jsonb is stored at save time and displayed as-is, never recomputed against newer rules. There is deliberately no UPDATE RLS policy. The what-if slider is disabled for saved views.
6. **Supabase is optional at runtime.** Every auth surface checks `isSupabaseConfigured` / a null client and degrades gracefully. Keep that pattern.
7. **Env vars:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `site/.env.local` (gitignored) and in Vercel. They're baked in at build time, so a change needs a redeploy. Never commit real values. A template is in `.env.local.example`.
8. **Saving happens only on an explicit click.** The privacy policy promises numbers leave the browser only when the person presses Save. The "Sign in to save" round trip therefore only *points at* the Save button afterwards (scrolls to it, focuses it, shows a callout); it never saves by itself.
9. **Post-sign-in redirects go through `safeNext()`** (same-site paths only; never `//host` or a full URL). The OAuth `redirectTo` stays exactly `/auth/callback` — the address registered in Supabase's allow-list — and the return path rides in the short-lived `trainerledger-next` cookie.

## Design system

**"Midnight glass" (Sept 2026, branch `redesign/premium-dark`), refined by a five-phase design audit** (colour → layout → components → motion → sign-in; each area re-scored ≥ 9/10). A near-black navy ground, frosted glass cards, sky-cyan actions, blue light as atmosphere, gold for the brand, photography with one colour grade. Keep the look; keep the rules below, which are what raised it.

- **Tokens:** `tailwind.config.ts`. Use named tokens only; **no ad-hoc hex values** in `app/` or `components/` (except `icon.tsx`/`opengraph-image.tsx`, the SVG stops in `Logo.tsx`, and Google's logo fills).
  - Ground and surfaces: `ink` `#05080f` (page), `ink2`, `panel` (opaque: menus, mobile bar, toasts), `deep`/`deep2`/`deep3`.
  - Text: `offwhite` → `haze` (secondary) → `dusk` (tertiary) → `fog` (captions). All ≥4.5:1 on ink and on glass.
  - `edge`: form-field boundaries (3:1). Decorative hairlines use `white/10`.
  - Colour roles: `accent` `#1fb6ff` is **the one action colour** (buttons, links via `accent-light`, key figures, SE-tax series). `electric` is atmosphere only (the `.glass-glow` edge light, aurora); never interactive. `violet` is the federal-tax chart series only. `gold` for the logo, tips and warnings. `danger` for errors.
  - Type sizes: `text-hint` 13px (helper and instructional text — the floor for anything you must read to use the page), `text-label` 14px, `text-field` 17px. `text-xs` (12px) only for uppercase labels, chart ticks, badges and legal fine print.
  - Radius by role: `rounded-card` 28px (top-level surfaces), `rounded-tile` 18px (cards inside a surface, menus), `rounded-control` 12px (inputs, callouts, list rows); `rounded-full` for buttons, chips, avatars.
- **Surfaces** (`globals.css`): `.glass` — white wash on translucent navy, hairline border, **no backdrop blur** (invisible on the plain ground, expensive on scroll). `.glass-glow` — the key surfaces only (calculator form, results panel, sign-in card, embed snippet, dashboard headline): same glass plus blur and the site's **one sanctioned glow**, a soft electric edge light. Glow budget: nothing else glows (no text-glow, no glowing icons or bars). Blur only where a surface floats over a photo (the two above, the hero card, the scrolled header).
  - Atmosphere: `.aurora` (blue light in section corners), `.streak` (a static diagonal beam; hidden below `md`, where only a stray fragment showed), `.divider-glow`. Decorative type: `.slogan` (rotated condensed caps), `.script-note` (handwriting) — both `aria-hidden`, never body copy. Hide decorative text below a breakpoint with **one `hidden xl:block` wrapper**, not `hidden` on each element: Chrome starts a font download for any styled element that uses the face, even a hidden one, but never styles the inside of a `display:none` parent.
  - Articles: `.prose-dark` styles plain `h2/p/ul/a/strong/code`. Container: `.shell` for every full-width band. Photos: `.photo-grade` on every photograph.
- **Components** (`components/ui.ts`, `icons.tsx`, `Tooltip.tsx`, `Logo.tsx`). Use these; don't hand-roll button or field classes.
  - Buttons: `button({ variant, size, full })` returns a class string (a button stays a `<button>`, navigation a `<Link>`). Variants: `primary` (accent pill — one per view), `secondary` (outline pill), `inverse` (light — header CTA, Google sign-in), `ghost`. Sizes: `sm` 40px, `md` 44px, `lg` 52px. Side padding is separate from size: `full` buttons get `px-4` (they're as wide as their column, so padding only clears the rounded ends); don't append a `px-*` override — Tailwind's order means the recipe's would win. Press: `active:scale-[.98]`.
  - Fields: `field`, `fieldLabel`, `fieldHint`, `fieldError`. Money inputs (`MoneyInput`, `DeductionInput` in `Calculator.tsx`) are `type="text" inputMode="decimal"` driven by `useAmountInput`: digits group with commas as you type ("65,000"), the caret keeps its place, deleting a comma deletes the digit beside it, pasted "$" is dropped, and the engine still receives a plain number string (so negative-value warnings work unchanged). Hints are wired with `aria-describedby`.
  - Icons: SVG only, from `icons.tsx` (24px grid, 1.75 stroke). Logo: gold four-point star (`STAR_PATH`, `fill-rule="evenodd"`) in a faint ring + wordmark "Trainer" / gold-gradient "Ledger". `STAR_PATH` also draws the favicon and OG image.
  - `Tooltip` is a toggletip (click pins, hover previews, Escape closes); `anchor="container"` inside cards. `CalendarButton` confirms the download for 4s and announces the next step. `EmbedSnippet` announces copy success; its code block is keyboard-scrollable. Dashboard `.range` slider: accent fill up to the thumb (`--fill`), focus ring on the thumb.
  - `toast()` (`Toaster.tsx`) for confirmations after an action: signed in/out, estimate saved (`action: { label: "View", href }`), estimate deleted, "Filled in typical trainer numbers" (`action: { label: "Undo", onClick }`); `tone: "error"` for failures. It pauses while hovered or focused (time to reach its button) and exits with `drop-out`.
  - The calculator's form card and results panel are container-query hosts; inner grids use `[@container(min-width:…)]:`.
- **Header & navigation** (`Header.tsx`): a "Skip to content" link is the first Tab stop (target: `#main`, the layout's content wrapper, `scroll-mt-[72px]`). The full nav shows from `lg`; below that (phones *and* tablets) the menu button opens a full-screen modal sheet (everything else `inert`, Escape closes, focus returns). The bar sits above the sheet (`relative z-50`) so the logo and close button stay visible. Nav items stay lit across their section (`NAV_SECTIONS`: `/dashboard` and the calculator landing pages → Calculator; the deduction finder → Deductions), with `aria-current="page"` on the page itself and `"true"` on its section. Signed out: "Sign in" (carries `next`); signed in: `AccountMenu` (initials avatar — no third-party image — with name/email, Saved estimates, Your breakdown, Sign out).
- **Page layouts.** Pick a template rather than hand-building a page.
  - *Homepage:* the header floats over the hero (`main` has `-mt-[72px]`). From `xl` the hero photo sits right at a fixed 3:2, starting where the copy column ends (`--media-left` in `.hero`), so the example card (real engine output, "Quarterly reserve" with a real %-of-income bar) never meets the headline; below `xl` the photo stacks under the copy. The trust row sizes to its content from `md` so it stays on one line. Bands: hero → deduction strip (real engine categories only) → calculator (intro row, then the calculator full width at every size; summit photo behind its lower half) → guides → FAQ → footer CTA band.
  - *Reading pages* (about, privacy, terms, guides, llc-vs-scorp): `<ArticleShell>`.
  - *App pages* (guides index, widget, dashboard, saved-estimates): `<PageBand width="max-w-…">` wrapping `<PageHeader>`, then content in `.shell` of the **same** max-width — the `width` prop keeps the title on the content's left edge.
  - *Photo-header pages* (calculator, deductions, the two `/calculators/*` pages, 404): `<PageBand photo={summit}>`. A shade pool anchored to the text block keeps every word at WCAG AA even over the brightest pixels (measured). `summit.jpg` had a baked-in star, its arc and mockup text painted out.
  - Photos live in `public/images/` (`hero-athlete.jpg` had a mockup card painted out). Breadcrumbs only where a real parent exists.
  - Route lists to keep in sync when adding a calculator landing page: `NO_CTA_ROUTES` (`Footer.tsx`), `CALCULATOR_ROUTES` and `NAV_SECTIONS` (`Header.tsx`).
- **Motion** (tokens in `tailwind.config.ts`, rules in `globals.css`): one easing, `ease-settle` `cubic-bezier(.22,1,.36,1)`; durations by role — 150ms hover/press/colour, ~200ms things that open, 320ms a panel arriving, 500ms+ only one-time entrances and data changes. Named animations: `animate-fade-in`, `rise-in`, `pop-in` (check marks), `drop-in` (menus, toasts), `drop-out` (exits: ease-in and quicker than entrances), `value-pop` (a changed number), `card-settle` (the hero card settles into its tilt once), `flash-ring` (a deep-linked field lights up twice). **Nothing loops** (only the skeleton pulse and spinner, while loading). Marketing content marked `data-reveal` fades up once via `RevealObserver`: only elements starting below the fold are hidden, only from script, so nothing is invisible without JS or blinks at load; never on the calculator. Bars ease to new widths. **Everything is `motion-safe:`/reduced-motion gated**, including `scroll-smooth`.
- **A11y conventions:** 44px touch targets, real `<button>`s with `aria-expanded`/`aria-controls` for disclosures, `role="img"` + `aria-label` on visual-only bars, `role="status"` for confirmations. axe-core 4.10 reports **0 violations** on every page (checked Sept 2026, with reduced motion so reveal content is included).
- **Focus ring** (`globals.css`): one cyan `--ring` outline everywhere. Components that draw their own ring use `focus:outline-none` plus a visible replacement.
- **Sticky needs a non-scrolling ancestor.** Page `<main>`s use `overflow-x-clip`, not `overflow-hidden`; the results panel uses `overflow-clip`.

## Current frontend behavior

- **Calculator** is a guided flow on *one page*, deliberately **not** a multi-step wizard. The results panel updates live.
  - Steps: numbered sections with progress indicators → a work-type question (independent / gym contractor / hybrid / studio owner) → a W-2 section shown only where relevant → 4–5 core deductions first, then a "show all" expander.
  - **Rule: a value that changes the estimate is never out of sight**, so the estimate always stays explainable. The deductions section is collapsed by default (owner's call, Sept 2026) and opens by default on `/deductions`, the deduction finder, and any `#deductions` link. While it's collapsed, every non-zero deduction shows as a chip with its amount. Inside the open section, a field holding a value is never hidden by the work-type filter.
  - Work type and filing status are both dropdowns (native `<select>`), side by side when the form card is wide enough.
  - Results panel: the quarterly figure with a **next-payment chip** ("Next payment due Jan 15, 2027 (in 109 days)", from `lib/dates.ts`; rendered only in the browser, so it's the visitor's today, never the build's; a due date counts as "today" all day), tax breakdown bar, per-deduction savings, `.ics` export, print (not in embed), save (signed in; re-enables when the numbers change after a save), and a "See the full breakdown" link to `/dashboard`. The form and results cards stretch to the same height; the results *contents* are sticky inside their card at `lg+` (`top-28` clears the 72px header; `top-6` in the embed). The card uses `overflow-clip`, never `overflow-hidden`, or the sticky child stops sticking. There is no copy-summary button (an earlier version of this doc said there was).
  - Config lives in the data arrays `WORK_TYPES`, `DEDUCTION_FIELDS`, `CORE_DEDUCTIONS`.
  - Deep links: `#deductions` opens the section; `#deduction-<key>` (each homepage deduction tile) also brings that field into view — switching to "all fields" if the work type filters it out — lights it (`flash-ring`) and focuses it on pointer devices (not on phones, where it would pop the keyboard).
  - "Not sure? Fill typical trainer numbers" offers **Undo** (toast) whenever it replaces numbers already typed, and does nothing if they're already the typical ones.
- **Dashboard** has six cards: headline (quarterly / annual / effective rate), where your money goes, BLS benchmark, deduction picture, quarterly plan (next/passed from `lib/dates.ts`, matching the results panel), and a one-variable what-if. Signed-in users can switch to a saved estimate; `/dashboard?estimate=<id>` (the "View breakdown" link on each saved estimate) opens that snapshot, falling back to the session for an id that isn't theirs.
- **FAQ:** accordion with the first item open and multiple allowed open. Height animates via the grid `0fr→1fr` trick.
- **Homepage:** the embed CTA section was removed on purpose. `/widget`, `/embed`, and the footer link remain.
- **Sign-in flow:** "Sign in" everywhere (never "Log in"). The sign-in page says what an account adds, that it's optional, and links Terms/Privacy; "Continue with Google" shows a spinner ("Opening Google…") and resets if you come Back from Google. Every sign-in link carries `next` (header: current page; results panel: `/#calculator` on the homepage; saved estimates: itself). Callback errors land back on the sign-in page with plain-language copy (`?error=cancelled|failed`). Already signed in → "You're signed in" with Continue / Saved estimates / Sign out. A successful sign-in sets `SIGNED_IN_COOKIE` for a minute; the header turns it into a "Signed in as …" toast (skipped when the round trip was "Sign in to save", which has its own callout). Saved estimates: delete asks first (focus on Keep, Escape keeps), list clears live on sign-out.

## Decisions already made (don't relitigate without the owner)

- Multi-page nav with real standalone `/calculator` and `/deductions` pages, not a single-page app with anchors.
- `/dashboard` is a separate route, noindex, and kept out of the sitemap. It's also left out of the header/footer nav: first-time visitors would hit an empty state, so the entry point is the link in the results panel.
- No Contact page. Google is the only auth provider.
- **Honesty rules for data:** there's no user base, so **never invent, simulate, or estimate peer or "average user" data.** Benchmarks must be real, published, and cited on screen. BLS (OEWS May 2025, SOC 39-9031) is shown with a plain on-screen caveat that it covers *employed* trainers, including part-time. Zero-value deduction categories are shown as *prompts*, never as "missed money" and never with a dollar figure.
- Not shipped on purpose: "no tax on tips" (SSTB ambiguity for trainers) and real LLC-vs-S-Corp numbers (need CPA review). The calculator shows an S-Corp hint with "comparison coming soon".
- Federal only: no state tax. The FAQ says so.
- The benchmark scale is fixed to the BLS range and does not stretch with income. That keeps the tick labels aligned with their markers.

## Complete

Core calculator + 2026 engine · guided flow · exact deduction savings · FAQ accordion · dashboard · Google auth · save/list/delete estimates · embed + widget · 6 guides + 3 calculator landing pages · sitemap/robots/OG image/JSON-LD · Vercel deploy.

## Known issues / cleanup

- **Stale duplicate engine at the repo root: `calculator-engine/calculator.ts`.** It uses 2025-era figures (mileage 0.67, standard deduction 15,000). **Don't use or import it.** Delete it or replace it with tests that target `site/lib/calculator.ts`.
- **`calculator-engine/node_modules` is committed** (~1,200 files). Remove it from git and add it to `.gitignore`.
- Other root legacy files: `index.html` (the old standalone page that once confused Vercel), `calc.rb`, `calculator_test.py`, `calc_output.json`, and a tracked `.DS_Store`. Prompt `.md` files are there for reference.
- **Stale comments** still say Supabase is "not live yet" or a "no-op today": `lib/supabase/config.ts`, `middleware.ts`, `.env.local.example`. Auth *is* live.
- There's no automated test suite for the engine or the UI.
- `siteUrl` is hardcoded in `layout.tsx`, `sitemap.ts`, and `robots.ts` (TODO: real domain).
- The signed-in flows (account menu, save-intent callout, saved-estimate delete, the saved view on `/dashboard`) were verified in isolation, not end to end with a real Google session.
- **Three guides are stubs** (one paragraph plus `{/* Content abbreviated for stub */}`): `personal-trainer-tax-deductions`, `1099-vs-w2-personal-trainers`, `quarterly-tax-deadlines-fitness-pros`. The homepage features all three, and the mileage tooltip's "Learn more" targets a `#mileage` anchor that doesn't exist yet.

## Limitations (by design)

Federal only (no state or local tax). Simplified QBI: flat 20% + $400 floor; above the phase-out threshold it flags `qbiAboveSimpleThreshold` instead of modeling W-2/UBIA limits. Standard deduction only. Single / married-filing-jointly only. It's a planning estimate, not tax advice. The disclaimer appears site-wide and must stay.

## Gotchas for verification

- **Don't export data from a `"use client"` file into a server component.** It becomes a client reference and fails at runtime ("Attempted to call map() from the server") even though `tsc` passes. Put shared data in `lib/`. **Always load the page, not just typecheck.**
- In the Browser pane, a **hidden pane reports `innerWidth: 0`** and doesn't advance CSS transitions, so layout measurements are garbage. Call `resize_window` with an explicit width (e.g. 360) before measuring, and reset it to `desktop` afterwards.
- `innerText` reflects CSS `text-transform`, so `uppercase` labels read as "HOW YOU COMPARE". Match case-insensitively.
- `/dashboard` content renders client-side from localStorage. `curl` only sees the shell. Seed `trainerledger-inputs-v2` in the browser to test it.

## Recommended next steps

1. Write the three stub guides (the homepage features all three; add the `#mileage` anchor).
2. Commit the design-audit rounds and open a PR from `redesign/premium-dark` (the owner reviews the Vercel preview first; pushing `main` deploys production).
3. Repo hygiene (low risk): untrack `calculator-engine/node_modules`, remove the stale root engine and legacy files, fix the stale Supabase comments.
4. Add a small engine test suite (vitest) against `site/lib/calculator.ts` so UI refactors can't silently change numbers.
5. Click-test the signed-in flows end to end with a real Google session.
