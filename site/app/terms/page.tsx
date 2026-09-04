import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Disclaimer | TrainerLedger",
  description: "TrainerLedger's terms of use and tax disclaimer: this tool provides planning estimates, not formal tax or legal advice.",
};

export default function Terms() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">Terms &amp; disclaimer</h1>

        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Not tax or legal advice</h2>
            <p>TrainerLedger is a free planning tool, not a substitute for professional advice. The estimates it produces are based on general 2026 federal tax rules and simplified assumptions — they don&apos;t account for every deduction, credit, state tax, or individual circumstance that might apply to you. Before filing a return or making an estimated tax payment, consult a certified public accountant (CPA) or enrolled agent (EA), particularly if you have a complex business structure, multiple income sources, or high income that may trigger additional rules.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">No warranty</h2>
            <p>This tool is provided &quot;as is,&quot; without warranty of any kind, express or implied. While we do our best to keep the underlying figures (tax brackets, standard deductions, the Social Security wage base, and the standard mileage rate) accurate and current for the 2026 tax year, we don&apos;t guarantee the results are free of errors or that they match what you&apos;ll ultimately owe.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Your responsibility</h2>
            <p>Any decisions you make based on estimates from this tool — including how much to set aside or when to make an estimated payment — are your own responsibility. TrainerLedger and its creators aren&apos;t liable for penalties, interest, or other consequences resulting from reliance on this tool.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Use of the site</h2>
            <p>You&apos;re free to use this calculator for your own personal or business tax planning. Please don&apos;t attempt to disrupt the site, scrape it at scale, or misrepresent its output as official IRS guidance.</p>
          </div>

          <p className="text-sm text-[#8b869c] font-medium border-t border-[#e2deeb] pt-4">Last updated: September 2026. See also our <Link href="/privacy" className="text-accent-deep hover:underline font-medium">privacy policy</Link>.</p>
        </div>
      </div>
    </main>
  );
}
