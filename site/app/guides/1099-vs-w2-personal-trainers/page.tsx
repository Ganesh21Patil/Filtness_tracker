import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1099 vs W-2 for Personal Trainers | TrainerLedger",
  description: "How hybrid trainers with both a gym W-2 paycheck and private 1099 clients should think about Social Security withholding and taxes.",
};

export default function Guide1099vsW2() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-inktext mb-6">1099 vs W-2 for Personal Trainers</h1>
        <div className="space-y-4 text-[#413d57] leading-relaxed">
          <p>Many trainers are "hybrid" workers — they get a W-2 paycheck from a commercial gym, but also take private clients on the side (1099 income). Understanding how these interact is critical to not overpaying Social Security tax.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
