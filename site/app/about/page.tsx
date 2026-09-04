import Link from "next/link";

export default function About() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-[#17162a] p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-violet-focus hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">About &amp; methodology</h1>

        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p>This calculator is a free tool built for self-employed personal trainers, gym contractors, and fitness coaches in the US.</p>

          <div>
            <h2 className="font-serif text-2xl text-[#17162a] mb-3">Methodology &amp; sources</h2>
            <p>Our calculations are based on the latest available IRS guidelines for the 2026 tax year. Here is how we calculate your estimate:</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li><strong className="text-[#17162a]">Self-employment tax:</strong> Calculated at 15.3% on 92.35% of net earnings. Social Security portion (12.4%) is capped at the 2026 wage base of $184,500. (Source: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" className="text-violet-focus hover:underline font-medium">IRS SE Tax</a>)</li>
              <li><strong className="text-[#17162a]">Standard mileage rate:</strong> We use the standard IRS mileage rate for business driving (67 cents per mile). (Source: <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" className="text-violet-focus hover:underline font-medium">IRS Mileage Rates</a>)</li>
              <li><strong className="text-[#17162a]">Federal income tax:</strong> We apply the 2026 federal marginal tax brackets to your estimated taxable income after accounting for the standard deduction ($15,000 Single / $30,000 Married) and the simplified QBI deduction.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-[#17162a] mb-3">Disclaimer</h2>
            <p><strong className="text-[#17162a]">This is an estimate for planning purposes, not tax or legal advice.</strong> We strongly recommend consulting with a certified public accountant (CPA) or enrolled agent (EA) before filing your taxes or making final estimated tax payments, especially if you have complex business structures or high income that may trigger additional rules.</p>
          </div>

          <p className="text-sm text-[#8b869c] font-medium border-t border-[#e2deeb] pt-4">Last updated: August 2026</p>
        </div>
      </div>
    </main>
  );
}
