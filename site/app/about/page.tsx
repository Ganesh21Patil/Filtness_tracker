import type { Metadata } from "next";
import ArticleShell from "../../components/ArticleShell";

export const metadata: Metadata = {
  title: "About & Methodology | TrainerLedger",
  description: "How TrainerLedger calculates your estimate: 2026 IRS self-employment tax rules, standard mileage rate, and federal brackets, with sources cited.",
};

export default function About() {
  return (
    <ArticleShell
      article={false}
      eyebrow="How it works"
      title="About & methodology"
      footer="Last updated: September 2026 — corrected to 2026 figures (standard deduction, dual mileage rate, QBI minimum deduction, and 1099 thresholds under the One Big Beautiful Bill Act)."
    >
      <p>This calculator is a free tool built for self-employed personal trainers, gym contractors, and fitness coaches in the US.</p>

      <div>
        <h2>Methodology &amp; sources</h2>
        <p>Our calculations are based on the latest available IRS guidelines for the 2026 tax year. Here is how we calculate your estimate:</p>
        <ul className="mt-4">
          <li><strong>Self-employment tax:</strong> Calculated at 15.3% on 92.35% of net earnings. Social Security portion (12.4%) is capped at the 2026 wage base of $184,500. (Source: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes">IRS SE Tax</a>)</li>
          <li><strong>Standard mileage rate — two rates in 2026:</strong> The IRS made a rare mid-year adjustment, announced July 13, 2026. Miles driven Jan 1 – Jun 30 are deducted at 72.5¢/mile; miles driven Jul 1 – Dec 31 are deducted at 76¢/mile. The calculator asks for mileage from each half of the year separately so it can apply the correct rate to each. (Source: <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates">IRS Mileage Rates</a>)</li>
          <li><strong>Standard deduction:</strong> $16,100 (Single) / $32,200 (Married Filing Jointly) for 2026.</li>
          <li><strong>Federal income tax:</strong> We apply the 2026 federal marginal tax brackets (Rev. Proc. 2025-32) to your estimated taxable income after the standard deduction and a simplified QBI deduction.</li>
          <li><strong>QBI deduction:</strong> A simplified flat 20% of qualified business income, with the One Big Beautiful Bill Act&apos;s new $400 minimum deduction (for taxpayers with at least $1,000 of QBI who materially participate in their business). Above $201,750 (Single) / $403,500 (MFJ), the real QBI calculation involves W‑2 wage and property limits this simplified model doesn&apos;t attempt — the calculator flags this and recommends a CPA above that threshold.</li>
          <li><strong>1099 reporting thresholds:</strong> For 2026, Form 1099‑NEC is only required above $2,000 paid (up from $600), and Form 1099‑K only above $20,000 and 200 transactions. This doesn&apos;t change what&apos;s taxable — all your training income counts, whether or not you receive a form for it.</li>
          <li><strong>Equipment (Section 179):</strong> Qualifying business equipment can generally be deducted in full in the year purchased, rather than depreciated over time — reflected in the Equipment field.</li>
        </ul>
      </div>

      <div>
        <h2>What we deliberately don&apos;t estimate</h2>
        <p>The 2026 &quot;no tax on tips&quot; provision (up to $25,000) explicitly excludes self-employed individuals in Specified Service Trade or Business (SSTB) fields, and whether personal training counts as an SSTB &quot;health&quot; business is genuinely unsettled. Rather than guess, this calculator leaves it out entirely until there&apos;s clearer guidance or professional review.</p>
      </div>

      <div>
        <h2>Disclaimer</h2>
        <p><strong>This is an estimate for planning purposes, not tax or legal advice.</strong> We strongly recommend consulting with a certified public accountant (CPA) or enrolled agent (EA) before filing your taxes or making final estimated tax payments, especially if you have complex business structures or high income that may trigger additional rules.</p>
      </div>
    </ArticleShell>
  );
}
