import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What the New $2,000 1099 Threshold Means for Trainers | TrainerLedger",
  description: "The IRS raised the 1099-NEC reporting threshold to $2,000 for 2026. Here's why that doesn't change what you owe — even if you get fewer tax forms this year.",
};

export default function Guide1099Threshold() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">What the new $2,000 1099 threshold means for trainers</h1>
        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p>Starting with tax year 2026, clients and studios don&apos;t have to send you a Form 1099-NEC unless they paid you $2,000 or more during the year — up from the old $600 threshold. Payment apps like Venmo, PayPal, and Stripe only issue a 1099-K once you cross $20,000 <em>and</em> 200 transactions, reverting to the pre-2022 rule.</p>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Why this matters for you</h2>
            <p>If you have several private clients each paying you a few hundred dollars a year, you may receive noticeably fewer 1099 forms in 2027 (for the 2026 tax year) than you did before. That&apos;s an easy trap: it&apos;s tempting to assume that if nobody sent you a form, the money doesn&apos;t need to be reported.</p>
            <p className="mt-3"><strong className="text-inktext">It does.</strong> U.S. tax law requires you to report all your self-employment income, regardless of whether anyone issues you a 1099. The reporting threshold only controls when a <em>payer</em> has to tell the IRS about a payment — it has no effect on your own obligation to report what you actually earned.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">What to do about it</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Keep your own record of every client payment — an invoice log, a spreadsheet, or your payment app&apos;s transaction history all work.</li>
              <li>Don&apos;t wait for 1099s to add up your income for the calculator or for your return. Total your own records instead.</li>
              <li>If a client pays you under $2,000 for the year, they may skip the 1099 — but the income is exactly as taxable as if they had sent one.</li>
            </ul>
          </div>

          <p className="text-sm text-[#8b869c] font-medium border-t border-[#e2deeb] pt-4">See also: <Link href="/about" className="text-accent-deep hover:underline">our methodology</Link> and the <Link href="/guides/personal-trainer-tax-deductions" className="text-accent-deep hover:underline">deductions guide</Link>. Last updated: September 2026.</p>
        </div>
      </div>
    </main>
  );
}
