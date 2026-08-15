# Prompt: Site Structure & Features
### Personal Trainer / Fitness Coach Tax Calculator

Use this after the calculation engine (from the calculator-logic prompt) is built and tested. Paste the block below into Claude Code or ChatGPT.

```
Using the calculation engine we just built, create a Next.js (App Router)
+ Tailwind CSS website called [pick your name] — a free tax calculator
for self-employed personal trainers and fitness coaches. Fully
client-side, no backend, no database, no user accounts for v1. Deploy
target is Vercel.

DESIGN DIRECTION
Audience is fitness professionals, often checking this on a phone between
clients. Avoid the generic beige/navy "corporate finance tool" look —
aim for something with energy and warmth (confident color, clean bold
type) while still feeling credible for a money tool, not gimmicky.
Mobile-first: the calculator must be fully usable one-handed on a phone.

SITE STRUCTURE
- / — Home: one clear headline (e.g. "Estimate your personal trainer
  taxes in 60 seconds"), the calculator embedded above the fold, trust
  signals (methodology, last-updated date) below.
- /calculator — the flagship calculator (can also just live on the
  homepage for v1 — your call, but keep the URL /calculator reachable
  either way so it's linkable).
- /guides/personal-trainer-tax-deductions — explains each deduction
  category from the calculator in plain language.
- /guides/1099-vs-w2-personal-trainers — explains the hybrid-income
  situation and why it matters.
- /guides/quarterly-tax-deadlines-fitness-pros — due dates, safe harbor
  rule, what happens if you miss one.
- /about — methodology, IRS sources cited, last-updated date, and a clear
  disclaimer that this is an estimate, not tax/legal advice.

CORE CALCULATOR UI (v1 — build this first, nothing else)
1. Filing status selector (single / married filing jointly)
2. A toggle or two clearly separated sections: "W-2 income" (wages +
   withholding, optional) and "1099 / self-employment income"
3. The 1099 section walks through each deduction category as its own
   labeled input, framed as "Did you deduct these?" with a one-line
   description and a typical-range hint for each (e.g. "Liability
   insurance — most trainers pay $150-300/year") so users who don't know
   their exact numbers still get a useful estimate and learn what they
   might be missing.
4. A results panel showing: SE tax breakdown, federal income tax,
   total liability, and the quarterly payment schedule with due dates
   clearly laid out (this should feel like the payoff of the whole page).
5. A visible disclaimer near the results: "This is an estimate for
   planning purposes, not tax advice."

FEATURES FOR v1 (only these — resist scope creep)
- The hybrid W-2 + 1099 calculator above
- The "did you deduct these?" walkthrough framing (this is the
  differentiator vs. generic multi-profession calculator mills — make it
  feel tailored to trainers specifically, not a generic template)
- Mobile-first responsive layout
- Clean methodology/about page with IRS source citations and a visible
  "last updated" date for credibility

FEATURES TO STUB OUT BUT NOT BUILD YET (leave clear TODO comments /
placeholder components so they're easy to add later — do not build the
logic for these in v1)
- Downloadable quarterly payment calendar (PDF or .ics calendar file)
- A simple LLC vs. S-corp savings indicator for higher-earning users
- Email capture for a "personal trainer deduction checklist" PDF lead magnet

TECHNICAL NOTES
- Keep all tax-year constants imported from the single config file from
  the calculation engine — nothing hardcoded in components.
- Structure components so a second calculator (different persona) could
  be added later under /calculators/[slug] without restructuring the app.
- Add placeholder ad slot components (empty divs with clear labels) in
  reasonable, non-intrusive positions for future AdSense integration —
  don't wire up actual ad code yet.
- No user data should be stored or transmitted anywhere — all
  calculation happens in the browser. Say this explicitly on the page
  somewhere; it's a trust signal for a finance tool.
```
