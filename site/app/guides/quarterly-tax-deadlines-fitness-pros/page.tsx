import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quarterly Tax Deadlines for Fitness Pros | TrainerLedger",
  description: "The four IRS estimated tax deadlines self-employed fitness professionals need to know, and what happens if you miss one.",
};

export default function GuideDeadlines() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-inktext mb-6">Quarterly Tax Deadlines for Fitness Pros</h1>
        <div className="space-y-4 text-[#413d57] leading-relaxed">
          <p>The IRS requires self-employed individuals to pay taxes four times a year. Missing these can result in underpayment penalties.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
