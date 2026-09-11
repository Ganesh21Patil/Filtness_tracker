import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal Trainer Tax Deductions Explained | TrainerLedger",
  description: "The most common business deductions for independent personal trainers and fitness coaches, explained in plain language.",
};

export default function GuideDeductions() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-card shadow-card">
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-inktext mb-6">Personal Trainer Tax Deductions Explained</h1>
        <div className="space-y-4 text-inksoft leading-relaxed">
          <p>As a 1099 independent contractor, you only pay taxes on your <strong className="text-inktext">profit</strong>, not your gross revenue. Deductions lower your profit, which lowers your tax bill. Here are the most common deductions for fitness professionals.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
