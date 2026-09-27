import Link from "next/link";
import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";
import guideThreshold from "../../../public/images/guide-threshold.jpg";

export const metadata: Metadata = {
  title: "What the New $2,000 1099 Threshold Means for Trainers | TrainerLedger",
  description: "The IRS raised the 1099‑NEC reporting threshold to $2,000 for 2026. Here's why that doesn't change what you owe — even if you get fewer tax forms this year.",
};

export default function Guide1099Threshold() {
  return (
    <ArticleShell
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: "The $2,000 1099 threshold" }]}
      title="What the new $2,000 1099 threshold means for trainers"
      image={guideThreshold}
      footer={
        <>
          See also: <Link href="/about">our methodology</Link> and the <Link href="/guides/personal-trainer-tax-deductions">deductions guide</Link>. Last updated: September 2026.
        </>
      }
    >
      <p>Starting with tax year 2026, clients and studios don&apos;t have to send you a Form 1099‑NEC unless they paid you $2,000 or more during the year — up from the old $600 threshold. Payment apps like Venmo, PayPal, and Stripe only issue a 1099‑K once you cross $20,000 <em>and</em> 200 transactions, reverting to the pre-2022 rule.</p>

      <div>
        <h2>Why this matters for you</h2>
        <p>If you have several private clients each paying you a few hundred dollars a year, you may receive noticeably fewer 1099 forms in 2027 (for the 2026 tax year) than you did before. That&apos;s an easy trap: it&apos;s tempting to assume that if nobody sent you a form, the money doesn&apos;t need to be reported.</p>
        <p className="mt-3"><strong>It does.</strong> U.S. tax law requires you to report all your self-employment income, regardless of whether anyone issues you a 1099. The reporting threshold only controls when a <em>payer</em> has to tell the IRS about a payment — it has no effect on your own obligation to report what you actually earned.</p>
      </div>

      <div>
        <h2>What to do about it</h2>
        <ul>
          <li>Keep your own record of every client payment — an invoice log, a spreadsheet, or your payment app&apos;s transaction history all work.</li>
          <li>Don&apos;t wait for 1099s to add up your income for the calculator or for your return. Total your own records instead.</li>
          <li>If a client pays you under $2,000 for the year, they may skip the 1099 — but the income is exactly as taxable as if they had sent one.</li>
        </ul>
      </div>
    </ArticleShell>
  );
}
