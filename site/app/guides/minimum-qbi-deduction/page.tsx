import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Minimum QBI Deduction, Explained | TrainerLedger",
  description: "The One Big Beautiful Bill Act added a guaranteed $400 minimum QBI deduction for 2026. Here's who qualifies and how it helps lower-income trainers.",
};

export default function GuideQbiMinimum() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">The minimum QBI deduction, explained</h1>
        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p>The Qualified Business Income (QBI) deduction lets self-employed people deduct roughly 20% of their business profit before calculating income tax. It&apos;s been around since 2018 — but the One Big Beautiful Bill Act (OBBBA, signed July 2025) made it permanent and added something new starting in 2026: a guaranteed minimum.</p>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">The $400 floor</h2>
            <p>Starting in 2026, if you have at least $1,000 of qualified business income and you materially participate in your business — true for essentially every solo trainer running their own client practice — you&apos;re guaranteed a QBI deduction of at least $400, even if 20% of your actual profit would come out to less than that.</p>
            <p className="mt-3">This mainly helps trainers with a smaller side practice: someone with modest 1099 training income who&apos;d otherwise get a QBI deduction of, say, $150 (20% of $750 in profit) now gets the full $400 instead.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Where it gets more complex</h2>
            <p>The 20%-of-profit version of the deduction phases in limitations (based on W-2 wages paid and property owned by the business) once your taxable income passes $201,750 (single) or $403,500 (married filing jointly) for 2026 — a range widened by OBBBA from the previous $50,000/$100,000. Above those thresholds, the real calculation depends on factors this calculator&apos;s simplified model doesn&apos;t attempt to estimate, which is why we show a warning and point you to a CPA once you cross that line.</p>
          </div>

          <p>The calculator applies the $400 minimum automatically whenever it applies — you don&apos;t need to do anything to claim it.</p>

          <p className="text-sm text-[#8b869c] font-medium border-t border-[#e2deeb] pt-4">See also our <Link href="/about" className="text-accent-deep hover:underline">methodology</Link>, which documents exactly how the QBI figure is calculated. Last updated: September 2026.</p>
        </div>
      </div>
    </main>
  );
}
