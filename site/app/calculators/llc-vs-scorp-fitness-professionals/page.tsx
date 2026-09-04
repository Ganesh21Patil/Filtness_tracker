import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLC vs. S-Corp Calculator for Fitness Professionals | TrainerLedger",
  description: "A real LLC vs. S-Corp comparison is coming — we're holding off shipping the numbers until they've had CPA review.",
};

export default function LlcVsScorpPage() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">LLC vs. S-Corp calculator</h1>
        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p><strong className="text-inktext">This one&apos;s coming, but not yet.</strong> An LLC-vs-S-Corp comparison sounds simple on the surface — S-Corps can save self-employment tax on the portion of profit paid out as a distribution rather than salary — but getting the number right depends on &quot;reasonable compensation&quot; rules, payroll tax mechanics, state-level LLC/S-Corp fees that vary widely, and added filing complexity that a flat formula glosses over.</p>
          <p>We&apos;d rather ship nothing than ship a number that&apos;s confidently wrong, so this tool is waiting on real CPA review before it goes live — same standard we&apos;re holding the rest of this calculator to.</p>
          <p>In the meantime, our <Link href="/about" className="text-accent-deep hover:underline font-medium">methodology page</Link> explains exactly what the main calculator does and doesn&apos;t estimate, and our <Link href="/guides" className="text-accent-deep hover:underline font-medium">guides</Link> cover the deductions and deadlines that apply regardless of how your business is structured.</p>
        </div>
      </div>
    </main>
  );
}
