import Calculator from "../components/Calculator";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1 bg-gray-50 flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div id="calculator-top"></div>
      <div className="w-full max-w-4xl text-center mb-16 mt-6 sm:mt-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-dark tracking-tight mb-6 leading-tight">
          Estimate your personal trainer taxes in 60 seconds
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Built for independent trainers, gym contractors, and hybrid coaches. Find the deductions most trainers miss and see exactly what you owe.
        </p>
        <a
          href="#calculator"
          className="inline-flex items-center justify-center rounded-full bg-brand-500 hover:bg-brand-600 text-dark font-bold px-8 py-3.5 text-base shadow-md transition-colors"
        >
          Start My Estimate
        </a>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Free, no signup required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Updated for 2026 tax rates
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Nothing you enter is stored
          </span>
        </div>
      </div>

      <div id="calculator" className="w-full flex flex-col items-center scroll-mt-24">
        <Calculator />
      </div>

      {/* TRUST / SOCIAL PROOF */}
      <div className="w-full max-w-5xl mt-20 mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for trainers who want to keep more of what they earn.</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          TrainerLedger helps independent personal trainers understand their potential tax liability and identify common business deductions — without the spreadsheet headache.
        </p>

        {/* Feature / Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <p className="text-base font-bold text-gray-900 mb-1.5">Built specifically for trainers</p>
            <p className="text-sm text-gray-500">Every deduction category matches how personal trainers and coaches actually run their business.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <p className="text-base font-bold text-gray-900 mb-1.5">Nothing is stored</p>
            <p className="text-sm text-gray-500">All calculations run locally in your browser. Your numbers are never saved or transmitted.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <p className="text-base font-bold text-gray-900 mb-1.5">2026 IRS-accurate math</p>
            <p className="text-sm text-gray-500">Self-employment tax, brackets, and mileage rates reflect current IRS guidance for 2026.</p>
          </div>
        </div>

        {/* Customer Story Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 text-left flex flex-col md:flex-row items-center gap-8 md:gap-12 mx-auto max-w-4xl hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 relative rounded-2xl overflow-hidden shadow-inner">
            <Image 
              src="/trainer-testimonial.jpg" 
              alt="Marcus R." 
              layout="fill" 
              objectFit="cover"
            />
          </div>
          <div className="flex-1 relative">
            <svg className="absolute -top-4 -left-6 w-12 h-12 text-gray-100 transform -rotate-180" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            <p className="text-xl sm:text-2xl font-medium text-gray-800 leading-relaxed relative z-10">
              "TrainerLedger made it much easier to understand what I could potentially deduct as a self-employed trainer. I finally had a clearer picture of what I might owe instead of guessing."
            </p>
            <div className="mt-6">
              <p className="font-bold text-gray-900">Marcus R.</p>
              <p className="text-sm text-gray-500">Independent Personal Trainer · CPT</p>
              <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">Illustrative example</span>
            </div>
          </div>
        </div>

        {/* Small Social Proof Row */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-12 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Common trainer deductions</div>
          <div className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Simple tax estimate</div>
          <div className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Built for self-employed trainers</div>
        </div>
      </div>

      {/* EDUCATIONAL TAX HELP */}
      <div className="w-full max-w-5xl mt-16 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Not sure what counts as a business deduction?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get a little more context while you complete your estimate. Hover over each category's [?] icon in the calculator to understand what it generally covers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">What counts as a business expense?</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              Understand the difference between personal spending and expenses connected to running your training business.
            </p>
            <Link href="/guides/personal-trainer-tax-deductions" className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Explore deductions &rarr;</Link>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Business mileage explained</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              Learn which types of driving may qualify as business mileage and why keeping accurate records matters.
            </p>
            <Link href="/guides/personal-trainer-tax-deductions#mileage" className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Learn about mileage &rarr;</Link>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1099 trainer taxes explained</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              Understand the difference between your business income, expenses, self-employment tax, and federal income tax.
            </p>
            <Link href="/guides" className="text-sm font-semibold text-brand-600 group-hover:text-brand-700">Read the guide &rarr;</Link>
          </div>
        </div>
      </div>

      {/* ABOUT / CREDIBILITY */}
      <div className="w-full max-w-3xl text-center mb-24 bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why TrainerLedger?</h2>
        <p className="text-gray-600 mb-6">
          TrainerLedger is designed to make tax planning easier for independent personal trainers by turning complicated self-employment tax concepts into a simple, understandable experience.
        </p>
        <Link href="/about" className="inline-block text-brand-600 font-semibold hover:text-brand-700 hover:underline">About TrainerLedger &rarr;</Link>
      </div>

      {/* FINAL CTA */}
      <div className="w-full max-w-4xl text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Know your numbers before tax season.</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Estimate your potential tax liability and understand the deductions that may apply to your training business.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="#calculator-top" className="bg-brand-500 hover:bg-brand-600 text-dark font-bold py-3.5 px-8 rounded-full shadow-md transition-colors text-lg inline-block w-full sm:w-auto">
            Calculate My Taxes
          </a>
          <Link href="/guides" className="text-brand-600 font-semibold hover:text-brand-700 hover:underline inline-block mt-2 sm:mt-0">
            Explore the Guides &rarr;
          </Link>
        </div>
      </div>

      {/* Footer Details */}
      <div className="w-full max-w-3xl text-center border-t border-gray-200 pt-8 mt-4 space-y-4">
        <p className="text-sm text-gray-500">
          Last updated for the 2026 tax year. <Link href="/about" className="text-brand-600 font-medium hover:underline">Read our methodology and IRS sources.</Link>
        </p>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Privacy first: No user data is stored or transmitted anywhere. All calculation happens locally in your browser. This tool provides an estimate for planning purposes, not formal tax or legal advice.
        </p>
      </div>
    </main>
  );
}
