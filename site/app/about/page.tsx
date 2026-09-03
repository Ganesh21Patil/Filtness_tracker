import Link from "next/link";

export default function About() {
  return (
    <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-brand-600 hover:underline mb-6 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">&larr; Back to Calculator</Link>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">About & Methodology</h1>
        
        <div className="prose prose-brand max-w-none text-gray-600">
          <p>This calculator is a free tool built for self-employed personal trainers, gym contractors, and fitness coaches in the US.</p>
          
          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">Methodology & Sources</h2>
          <p>Our calculations are based on the latest available IRS guidelines for the 2026 tax year. Here is how we calculate your estimate:</p>
          <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>Self-Employment Tax:</strong> Calculated at 15.3% on 92.35% of net earnings. Social Security portion (12.4%) is capped at the 2026 wage base of $184,500. (Source: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes" className="text-brand-600 hover:underline">IRS SE Tax</a>)</li>
            <li><strong>Standard Mileage Rate:</strong> We use the standard IRS mileage rate for business driving (67 cents per mile). (Source: <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" className="text-brand-600 hover:underline">IRS Mileage Rates</a>)</li>
            <li><strong>Federal Income Tax:</strong> We apply the 2026 federal marginal tax brackets to your estimated taxable income after accounting for the standard deduction ($15,000 Single / $30,000 Married) and the simplified QBI deduction.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-800 mt-8 mb-3">Disclaimer</h2>
          <p><strong>This is an estimate for planning purposes, not tax or legal advice.</strong> We strongly recommend consulting with a certified public accountant (CPA) or enrolled agent (EA) before filing your taxes or making final estimated tax payments, especially if you have complex business structures or high income that may trigger additional rules.</p>
          
          <p className="mt-8 text-sm text-gray-400 font-medium border-t pt-4">Last Updated: August 2026</p>
        </div>
      </div>
    </main>
  );
}
