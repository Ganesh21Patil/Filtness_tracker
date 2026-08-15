# Build Prompts: Personal Trainer / Fitness Coach Tax Calculator

Two self-contained prompts. Paste Prompt 1 into Claude Code (or ChatGPT) first to get the calculation engine right, review the output numbers against a manual example, then paste Prompt 2 to build the site around it.

---

## PROMPT 1 — Calculation Engine

```
I'm building a free web-based tax calculator for self-employed personal
trainers and fitness coaches in the US. Build the calculation logic as a
standalone, well-commented JavaScript/TypeScript module (no UI yet) that I
can later wire into a Next.js form. Accuracy matters more than anything
else here — this is financial content people will rely on.

CONTEXT
Personal trainers commonly fall into three situations, and the calculator
must support all three:
1. Pure 1099 / self-employed (private clients, own studio, online coaching)
2. Pure W-2 employee at a gym (not a real target user, but may appear if
   they're checking a side hustle)
3. Hybrid: W-2 wages from a gym PLUS 1099 self-employment income from
   private clients — this is very common and most generic calculators get
   it wrong by treating the two income types as if they were unrelated.

INPUTS
- Filing status: single / married filing jointly (start with just these two)
- Annual W-2 wages (optional, default 0)
- Federal income tax already withheld from W-2 wages (optional, default 0)
- Gross 1099 / self-employment training income for the year
- Business deductions, broken into these specific categories (each its own
  input field, not a single lump "expenses" box):
  - Certifications & continuing education (NASM, ACE, ISSA, NSCA renewals, CEUs)
  - Liability insurance premiums
  - Gym rental / booth fees / revenue share paid to a studio
  - Equipment (weights, bands, mats, wearables, etc.)
  - Coaching software & apps (Trainerize, TrueCoach, My PT Hub, scheduling,
    payment processing fees, Zoom, etc.)
  - Business mileage (miles driven — calculate the deduction using the
    current IRS standard mileage rate, store this rate in a config object
    so it's easy to update yearly)
  - Branded apparel (logo'd clothing only — add a UI note that non-branded
    workout clothes are NOT deductible)
  - Marketing (website, social ads, business cards)
  - Home office (simple square-footage-based simplified method)
  - Other / miscellaneous (catch-all)

CALCULATION LOGIC (implement exactly, step by step)
1. Net self-employment profit = gross 1099 income − sum of all deduction
   categories above.
2. SE-taxable income = net SE profit × 92.35%.
3. Social Security portion of SE tax: 12.4% of SE-taxable income, but ONLY
   on the portion of the combined Social Security wage base (store as a
   config constant, currently $184,500 for 2026 — flag this must be
   updated annually) that is NOT already used up by W-2 wages. i.e., if
   W-2 wages already meet or exceed the wage base, this portion is $0.
4. Medicare portion of SE tax: 2.9% of ALL SE-taxable income (no cap).
5. Additional Medicare surtax: 0.9% on the amount by which COMBINED wages
   + SE-taxable income exceeds $200,000 (single) or $250,000 (married
   filing jointly) — store thresholds as config constants.
6. Total SE tax = Social Security portion + Medicare portion + Additional
   Medicare surtax portion.
7. Half of the SE tax (the "employer-equivalent" portion) is an
   above-the-line deduction against income.
8. Qualified Business Income (QBI) deduction: 20% of net SE profit (after
   the half-SE-tax deduction), as a simplified estimate — add a visible
   note that this simplified version does NOT account for income
   phase-out thresholds, specified service trade limits, or W-2
   wage/property limits, and that high earners should get this checked
   by a CPA.
9. Taxable income = W-2 wages + net SE profit − half-SE-tax deduction −
   QBI deduction − standard deduction (store 2026 standard deduction
   amounts as config constants: single and married; itemizing is out of
   scope for v1).
10. Apply the 2026 federal marginal tax brackets (store as a config array
    of {bracket_start, rate} so it's a one-file update each year) to get
    federal income tax owed.
11. Total estimated tax liability = federal income tax + total SE tax.
12. Amount already covered = federal tax withheld from W-2 (input #2).
13. Remaining amount owed = total liability − amount already covered
    (floor at 0).
14. Quarterly payment = remaining amount owed ÷ 4, with due dates:
    April 15, June 15, September 15, and January 15 of the following year.
15. Add a "safe harbor" note function: paying the lesser of 90% of this
    year's estimated tax, or 100% (110% if prior-year AGI was over
    $150,000) of last year's total tax, avoids an underpayment penalty —
    surface this as an explanatory tooltip, don't require prior-year data
    for v1.

OUTPUT
Return a structured object with: net SE profit, total SE tax (with the SS
and Medicare portions broken out), federal income tax, total liability,
remaining amount owed after W-2 withholding, and the per-quarter payment
amount with due dates.

Store every tax-year-specific number (wage base, bracket thresholds,
standard deduction, mileage rate, surtax thresholds) in a single exported
config object at the top of the file, clearly labeled "UPDATE ANNUALLY,"
so refreshing for next tax year is a one-file edit.

Write 3-4 unit tests with realistic numbers (e.g., a trainer with $45,000
in 1099 income and typical deductions; a hybrid trainer with $30,000 W-2 +
$20,000 1099) so I can sanity-check the math before building UI on top of it.
```

---

## PROMPT 2 — Site Structure & Features

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
