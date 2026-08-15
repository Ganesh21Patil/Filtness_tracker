/**
 * UPDATE ANNUALLY
 * Tax year constants and config for the personal trainer tax calculator.
 */
export const TAX_CONFIG = {
  TAX_YEAR: 2026,
  SS_WAGE_BASE: 184500, // Update annually
  MILEAGE_RATE: 0.67, // Update annually
  SURTAX_THRESHOLDS: {
    single: 200000,
    married: 250000,
  },
  STANDARD_DEDUCTIONS: {
    single: 15000, // Projected for 2026
    married: 30000, // Projected for 2026
  },
  FEDERAL_BRACKETS: {
    single: [
      { start: 609350, rate: 0.37 },
      { start: 243725, rate: 0.35 },
      { start: 191950, rate: 0.32 },
      { start: 100525, rate: 0.24 },
      { start: 47150, rate: 0.22 },
      { start: 11600, rate: 0.12 },
      { start: 0, rate: 0.10 },
    ],
    married: [
      { start: 731200, rate: 0.37 },
      { start: 487450, rate: 0.35 },
      { start: 383900, rate: 0.32 },
      { start: 201050, rate: 0.24 },
      { start: 94300, rate: 0.22 },
      { start: 23200, rate: 0.12 },
      { start: 0, rate: 0.10 },
    ],
  },
};

export type FilingStatus = "single" | "married";

export interface TaxInputs {
  filingStatus: FilingStatus;
  w2Wages: number;
  w2Withheld: number;
  gross1099: number;
  deductions: {
    certs: number;
    liabilityIns: number;
    gymRent: number;
    equipment: number;
    software: number;
    mileage: number; // in miles, will be converted via MILEAGE_RATE
    apparel: number;
    marketing: number;
    homeOffice: number;
    other: number;
  };
}

export interface TaxResults {
  netSeProfit: number;
  seTax: {
    socialSecurity: number;
    medicare: number;
    additionalMedicare: number;
    total: number;
  };
  federalTax: number;
  totalLiability: number;
  amountOwed: number;
  quarterlyPayment: number;
}

/**
 * Calculates estimated tax liability for a personal trainer / fitness coach.
 * Handles pure 1099, pure W-2, and hybrid income situations.
 * @param inputs Tax calculation inputs including W-2 and 1099 income, and detailed deductions.
 * @returns Object containing calculated net profit, SE tax breakdown, federal tax, total liability, and quarterly payment estimates.
 */
export function calculateTaxes(inputs: TaxInputs): TaxResults {
  const d = inputs.deductions;

  // 1. Net self-employment profit
  const mileageDeduction = d.mileage * TAX_CONFIG.MILEAGE_RATE;
  const deductionsSum =
    d.certs +
    d.liabilityIns +
    d.gymRent +
    d.equipment +
    d.software +
    mileageDeduction +
    d.apparel +
    d.marketing +
    d.homeOffice +
    d.other;

  const netSeProfit = Math.max(0, inputs.gross1099 - deductionsSum);

  // 2. SE-taxable income
  const seTaxableIncome = netSeProfit * 0.9235;

  // 3. Social Security portion of SE tax
  const wageBaseRemaining = Math.max(0, TAX_CONFIG.SS_WAGE_BASE - inputs.w2Wages);
  const ssTax = Math.min(seTaxableIncome, wageBaseRemaining) * 0.124;

  // 4. Medicare portion of SE tax
  const medicareTax = seTaxableIncome * 0.029;

  // 5. Additional Medicare surtax
  const surtaxThreshold = TAX_CONFIG.SURTAX_THRESHOLDS[inputs.filingStatus];
  const combinedIncome = inputs.w2Wages + seTaxableIncome;
  const amountOverThreshold = Math.max(0, combinedIncome - surtaxThreshold);
  const surtax = amountOverThreshold * 0.009;

  // 6. Total SE tax
  const totalSeTax = ssTax + medicareTax + surtax;

  // 7. Half of the SE tax
  const halfSeTax = totalSeTax / 2.0;

  // 8. Qualified Business Income (QBI) deduction
  // Note: This is a simplified estimate and doesn't account for phase-outs or W-2/property limits.
  const netAfterHalfSe = Math.max(0, netSeProfit - halfSeTax);
  const qbiDeduction = netAfterHalfSe * 0.20;

  // 9. Taxable income
  const standardDeduction = TAX_CONFIG.STANDARD_DEDUCTIONS[inputs.filingStatus];
  const taxableIncome = Math.max(
    0,
    inputs.w2Wages + netSeProfit - halfSeTax - qbiDeduction - standardDeduction
  );

  // 10. Federal income tax
  const brackets = TAX_CONFIG.FEDERAL_BRACKETS[inputs.filingStatus];
  let federalTax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome > bracket.start) {
      const taxableInBracket = remainingIncome - bracket.start;
      federalTax += taxableInBracket * bracket.rate;
      remainingIncome = bracket.start;
    }
  }

  // 11. Total estimated tax liability
  const totalLiability = federalTax + totalSeTax;

  // 12 & 13. Remaining amount owed
  const amountOwed = Math.max(0, totalLiability - inputs.w2Withheld);

  // 14. Quarterly payment
  const quarterly = amountOwed / 4.0;

  return {
    netSeProfit: Number(netSeProfit.toFixed(2)),
    seTax: {
      socialSecurity: Number(ssTax.toFixed(2)),
      medicare: Number(medicareTax.toFixed(2)),
      additionalMedicare: Number(surtax.toFixed(2)),
      total: Number(totalSeTax.toFixed(2)),
    },
    federalTax: Number(federalTax.toFixed(2)),
    totalLiability: Number(totalLiability.toFixed(2)),
    amountOwed: Number(amountOwed.toFixed(2)),
    quarterlyPayment: Number(quarterly.toFixed(2)),
  };
}
