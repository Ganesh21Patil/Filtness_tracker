/**
 * UPDATE ANNUALLY
 * Tax year constants and config for the personal trainer tax calculator.
 *
 * 2026 figures verified against:
 * - IRS Rev. Proc. 2025-32 (2026 brackets, standard deduction) — irs.gov
 * - SSA 2026 wage base announcement — $184,500
 * - IRS mid-year mileage rate announcement, July 13, 2026 (72.5¢ Jan 1–Jun 30,
 *   76¢ Jul 1–Dec 31 — a rare mid-year adjustment; the last one was in 2022)
 * - One Big Beautiful Bill Act / Public Law 119-21 (OBBBA), Section 70105:
 *   permanent QBI deduction, $400 minimum QBI deduction for taxpayers with
 *   >= $1,000 of QBI who materially participate, QBI phase-in range widened
 *   to $75,000 (single) / $150,000 (MFJ) starting at $201,750 / $403,500
 */
export const TAX_CONFIG = {
  TAX_YEAR: 2026,
  SS_WAGE_BASE: 184500, // Update annually
  // The IRS made a rare mid-year adjustment for 2026 (announced Jul 13, 2026).
  MILEAGE_RATE_H1: 0.725, // Jan 1 – Jun 30, 2026
  MILEAGE_RATE_H2: 0.76, // Jul 1 – Dec 31, 2026
  SURTAX_THRESHOLDS: {
    // Fixed by statute since 2013 — not inflation-adjusted.
    single: 200000,
    married: 250000,
  },
  STANDARD_DEDUCTIONS: {
    single: 16100,
    married: 32200,
  },
  FEDERAL_BRACKETS: {
    single: [
      { start: 640600, rate: 0.37 },
      { start: 256225, rate: 0.35 },
      { start: 201775, rate: 0.32 },
      { start: 105700, rate: 0.24 },
      { start: 50400, rate: 0.22 },
      { start: 12400, rate: 0.12 },
      { start: 0, rate: 0.10 },
    ],
    married: [
      { start: 768700, rate: 0.37 },
      { start: 512450, rate: 0.35 },
      { start: 403550, rate: 0.32 },
      { start: 211400, rate: 0.24 },
      { start: 100800, rate: 0.22 },
      { start: 24800, rate: 0.12 },
      { start: 0, rate: 0.10 },
    ],
  },
  // Simplified QBI model — see note at the qbiDeduction calculation below.
  QBI_MIN_DEDUCTION: 400,
  QBI_MIN_DEDUCTION_QBI_FLOOR: 1000, // must have >= this much QBI to get the floor
  QBI_PHASEOUT_START: {
    single: 201750,
    married: 403500,
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
    mileageH1: number; // miles driven Jan 1 – Jun 30, at MILEAGE_RATE_H1
    mileageH2: number; // miles driven Jul 1 – Dec 31, at MILEAGE_RATE_H2
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
  taxableIncome: number;
  /** True when income is high enough that the real QBI deduction involves
   *  phase-outs this simplified flat-20%-plus-floor model doesn't attempt. */
  qbiAboveSimpleThreshold: boolean;
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
  const mileageDeduction = d.mileageH1 * TAX_CONFIG.MILEAGE_RATE_H1 + d.mileageH2 * TAX_CONFIG.MILEAGE_RATE_H2;
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
  // Simplified: flat 20% of QBI, with the OBBBA $400 minimum (for taxpayers
  // with >= $1,000 of QBI who materially participate — true for essentially
  // every solo self-employed trainer this tool is built for).
  // Does NOT model the W-2 wage / UBIA phase-out that applies above
  // TAX_CONFIG.QBI_PHASEOUT_START — see qbiAboveSimpleThreshold below, which
  // flags that case so the UI can warn the user instead of silently
  // understating or overstating their real deduction.
  const netAfterHalfSe = Math.max(0, netSeProfit - halfSeTax);
  const qbiEligible = netAfterHalfSe >= TAX_CONFIG.QBI_MIN_DEDUCTION_QBI_FLOOR;
  const qbiDeduction = qbiEligible
    ? Math.max(TAX_CONFIG.QBI_MIN_DEDUCTION, netAfterHalfSe * 0.20)
    : netAfterHalfSe * 0.20;

  // 9. Taxable income
  const standardDeduction = TAX_CONFIG.STANDARD_DEDUCTIONS[inputs.filingStatus];
  const taxableIncome = Math.max(
    0,
    inputs.w2Wages + netSeProfit - halfSeTax - qbiDeduction - standardDeduction
  );

  const qbiAboveSimpleThreshold =
    inputs.w2Wages + netAfterHalfSe > TAX_CONFIG.QBI_PHASEOUT_START[inputs.filingStatus];

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
    taxableIncome: Number(taxableIncome.toFixed(2)),
    qbiAboveSimpleThreshold,
  };
}
