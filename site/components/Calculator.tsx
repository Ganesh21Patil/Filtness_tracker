"use client";

import React, { useState } from "react";
import { calculateTaxes, TaxInputs, FilingStatus } from "../lib/calculator";

export default function Calculator() {
  const [inputs, setInputs] = useState<TaxInputs>({
    filingStatus: "single",
    w2Wages: 0,
    w2Withheld: 0,
    gross1099: 0,
    deductions: {
      certs: 0,
      liabilityIns: 0,
      gymRent: 0,
      equipment: 0,
      software: 0,
      mileage: 0,
      apparel: 0,
      marketing: 0,
      homeOffice: 0,
      other: 0,
    },
  });

  const sanitizeNumber = (val: any) => {
    const num = Number(val);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const handleInputChange = (field: keyof TaxInputs, value: any) => {
    const finalValue = field === "filingStatus" ? value : sanitizeNumber(value);
    setInputs((prev) => ({ ...prev, [field]: finalValue }));
  };

  const handleDeductionChange = (field: keyof TaxInputs["deductions"], value: any) => {
    setInputs((prev) => ({
      ...prev,
      deductions: { ...prev.deductions, [field]: sanitizeNumber(value) },
    }));
  };

  const results = calculateTaxes(inputs);

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Form Inputs */}
      <div className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* Basic Info */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. The Basics</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
              <select
                value={inputs.filingStatus}
                onChange={(e) => handleInputChange("filingStatus", e.target.value as FilingStatus)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
              </select>
            </div>
          </div>
        </section>

        {/* W-2 Income */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. W-2 Income (Gym Paycheck)</h2>
          <p className="text-sm text-gray-500 mb-4">If you are an employee at a gym, enter your wages here. If you are 100% independent, leave this at 0.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual W-2 Wages ($)</label>
              <input
                type="number"
                min="0"
                value={inputs.w2Wages || ""}
                onChange={(e) => handleInputChange("w2Wages", Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Already Withheld ($)</label>
              <input
                type="number"
                min="0"
                value={inputs.w2Withheld || ""}
                onChange={(e) => handleInputChange("w2Withheld", Number(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 bg-gray-50 border"
                placeholder="0"
              />
            </div>
          </div>
        </section>

        {/* 1099 Income */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. 1099 / Self-Employment Income</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Training Income ($)</label>
            <p className="text-xs text-gray-500 mb-2">Total money you collected from private clients or your own studio before any expenses.</p>
            <input
              type="number"
              min="0"
              value={inputs.gross1099 || ""}
              onChange={(e) => handleInputChange("gross1099", Number(e.target.value))}
              className="w-full rounded-lg border-brand-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-4 bg-brand-50 border text-lg font-semibold text-brand-900"
              placeholder="0"
            />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Did you deduct these?</h3>
          <p className="text-sm text-gray-600 mb-4 font-medium">Most trainers miss these deductions, let's find yours. Enter your annual expenses below.</p>
          
          <div className="space-y-4">
            <DeductionInput
              label="Certifications & CEUs"
              hint="NASM, ACE, renewals. Typical: $200-$800/yr"
              value={inputs.deductions.certs}
              onChange={(v) => handleDeductionChange("certs", v)}
              tooltipText="Professional certifications, continuing education, and training expenses may qualify when they are related to maintaining or improving your current business skills. Eligibility depends on your situation."
            />
            <DeductionInput
              label="Liability Insurance"
              hint="Most trainers pay $150-$300/year"
              value={inputs.deductions.liabilityIns}
              onChange={(v) => handleDeductionChange("liabilityIns", v)}
              tooltipText="Business liability insurance used to protect your training business may generally qualify as a business expense."
            />
            <DeductionInput
              label="Gym Rental / Revenue Split"
              hint="Booth fees or % paid to the studio"
              value={inputs.deductions.gymRent}
              onChange={(v) => handleDeductionChange("gymRent", v)}
              tooltipText="Include the portion of gym or studio rental costs you pay to operate your training business."
            />
            <DeductionInput
              label="Equipment"
              hint="Weights, bands, wearables for client use"
              value={inputs.deductions.equipment}
              onChange={(v) => handleDeductionChange("equipment", v)}
              tooltipText="Business-use equipment such as weights, resistance bands, mats, or other training gear may qualify. Keep records showing business use."
            />
            <DeductionInput
              label="Coaching Software & Apps"
              hint="Trainerize, TrueCoach, Zoom, payment fees"
              value={inputs.deductions.software}
              onChange={(v) => handleDeductionChange("software", v)}
              tooltipText="Software used to run or support your training business may qualify, such as scheduling, client-management, programming, or coaching platforms."
            />
            <DeductionInput
              label="Business Mileage"
              hint="Miles driven between client locations (not commute)"
              value={inputs.deductions.mileage}
              onChange={(v) => handleDeductionChange("mileage", v)}
              prefix="miles"
              tooltipText="Generally, include qualifying business miles such as travel between clients or to off-site training locations. Normal commuting may not qualify."
              learnMoreLink="/guides/personal-trainer-tax-deductions#mileage"
            />
            <DeductionInput
              label="Branded Apparel"
              hint="Only clothing with your logo is deductible"
              value={inputs.deductions.apparel}
              onChange={(v) => handleDeductionChange("apparel", v)}
            />
            <DeductionInput
              label="Marketing"
              hint="Website hosting, ads, business cards"
              value={inputs.deductions.marketing}
              onChange={(v) => handleDeductionChange("marketing", v)}
            />
            <DeductionInput
              label="Home Office Deduction"
              hint="Simplified estimate based on dedicated sq footage"
              value={inputs.deductions.homeOffice}
              onChange={(v) => handleDeductionChange("homeOffice", v)}
            />
            <DeductionInput
              label="Other Expenses"
              hint="Catch-all for miscellaneous business costs"
              value={inputs.deductions.other}
              onChange={(v) => handleDeductionChange("other", v)}
            />
          </div>
        </section>
        
        {/* Placeholder Ad Slot (for future AdSense) */}
        <div className="w-full p-4 border-2 border-dashed border-gray-200 bg-gray-50 text-center rounded-xl my-6 flex items-center justify-center min-h-[100px]">
          <span className="text-gray-400 text-sm font-medium">Advertisement Slot (Future)</span>
        </div>
      </div>

      {/* Right Column: Sticky Results */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-6 bg-dark text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-brand-100 border-b border-gray-700 pb-3">Your Tax Estimate</h2>
          
          <div className="space-y-4 flex-grow">
            <ResultRow label="Net Self-Employment Profit" value={results.netSeProfit} highlight />
            <div className="pt-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">Self-Employment Tax Breakdown</p>
              <ResultRow label="Social Security" value={results.seTax.socialSecurity} sub />
              <ResultRow label="Medicare" value={results.seTax.medicare} sub />
              {results.seTax.additionalMedicare > 0 && (
                <ResultRow label="Additional Medicare" value={results.seTax.additionalMedicare} sub />
              )}
              <ResultRow label="Total SE Tax" value={results.seTax.total} bold />
            </div>
            
            <div className="pt-2 border-t border-gray-700">
              <ResultRow label="Federal Income Tax" value={results.federalTax} bold />
            </div>
            
            <div className="pt-4 border-t border-gray-700 mt-2">
              <ResultRow label="Total Estimated Liability" value={results.totalLiability} />
              {inputs.w2Withheld > 0 && (
                <ResultRow label="W-2 Tax Already Withheld" value={-inputs.w2Withheld} sub />
              )}
            </div>
          </div>

          <div className="mt-8 bg-brand-600 rounded-xl p-5 text-center shadow-inner">
            <p className="text-sm text-brand-100 mb-1 font-medium">Estimated Amount Owed</p>
            <p className="text-4xl font-extrabold text-white mb-4">${results.amountOwed.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            
            <div className="bg-brand-700/50 rounded-lg p-3">
              <p className="text-xs text-brand-100 uppercase tracking-wide font-bold mb-2">Quarterly Payments</p>
              <p className="text-2xl font-bold text-white mb-2">${results.quarterlyPayment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-brand-100">
                <span className="bg-brand-700 px-2 py-1 rounded">Apr 15</span>
                <span className="bg-brand-700 px-2 py-1 rounded">Jun 15</span>
                <span className="bg-brand-700 px-2 py-1 rounded">Sep 15</span>
                <span className="bg-brand-700 px-2 py-1 rounded">Jan 15</span>
              </div>
            </div>
            {/* TODO: Downloadable quarterly payment calendar feature stub */}
            <div className="mt-3 text-xs text-brand-200 hover:text-white cursor-pointer underline decoration-brand-400 underline-offset-2">
              Download Calendar (.ics) (Coming Soon)
            </div>
          </div>
          
          {/* TODO: LLC vs S-Corp savings indicator feature stub */}
          {results.netSeProfit > 80000 && (
             <div className="mt-4 p-3 border border-brand-500/30 rounded-lg bg-brand-900/40 text-xs text-center text-brand-200">
               💡 You're earning enough that an S-Corp might save you money. (Comparison coming soon)
             </div>
          )}

          <p className="text-xs text-gray-500 mt-6 text-center">
            This is an estimate for planning purposes, not formal tax advice.
          </p>
        </div>
      </div>
    </div>
  );
}

function DeductionInput({ label, hint, value, onChange, prefix = "$", tooltipText, learnMoreLink }: { label: string; hint: string; value: number; onChange: (val: number) => void; prefix?: string; tooltipText?: string; learnMoreLink?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-gray-200 transition-colors relative group">
      <div className="flex-1 flex items-start">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-800">{label}</label>
          <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
        </div>
        {tooltipText && (
          <div 
            className="relative ml-2 flex-shrink-0"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button 
              type="button" 
              onClick={() => setShowTooltip(!showTooltip)} 
              className="text-gray-400 hover:text-brand-600 focus:outline-none focus:text-brand-600 p-1 rounded-full transition-colors"
              aria-label={`More information about ${label}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            
            {showTooltip && (
              <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-gray-600 bg-white border border-gray-100 rounded-lg shadow-lg right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 transition-opacity animate-in fade-in zoom-in-95 duration-150">
                <p className="leading-relaxed">{tooltipText}</p>
                {learnMoreLink && (
                  <a href={learnMoreLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                    Learn more &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative w-full sm:w-32 flex-shrink-0">
        {prefix === "$" && <span className="absolute left-3 top-2.5 text-gray-400 font-medium">$</span>}
        <input
          type="number"
          min="0"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 bg-gray-50 border text-gray-900 font-medium ${prefix === "$" ? "pl-7" : "pr-12"}`}
          placeholder="0"
        />
        {prefix !== "$" && <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-sm">{prefix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, sub, bold, highlight }: { label: string; value: number; sub?: boolean; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center ${sub ? "text-gray-400 text-sm pl-2" : highlight ? "text-brand-300 font-semibold" : bold ? "font-semibold text-white" : "text-gray-200"}`}>
      <span>{label}</span>
      <span>{value < 0 ? "-" : ""}${Math.abs(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
    </div>
  );
}
