import { describe, it, expect } from "vitest";
import { calculateTaxes, TaxInputs } from "./calculator";

describe("Personal Trainer Tax Calculator", () => {
  it("Scenario A: Low-income pure 1099", () => {
    const inputs: TaxInputs = {
      filingStatus: "single",
      w2Wages: 0,
      w2Withheld: 0,
      gross1099: 45000,
      deductions: {
        certs: 500,
        liabilityIns: 200,
        gymRent: 3000,
        equipment: 800,
        software: 300,
        mileage: 1000,
        apparel: 200,
        marketing: 500,
        homeOffice: 0,
        other: 100,
      },
    };

    const results = calculateTaxes(inputs);

    // Mileage (1000 * 0.67 = 670)
    // Sum = 500 + 200 + 3000 + 800 + 300 + 670 + 200 + 500 + 0 + 100 = 6270
    // Net = 45000 - 6270 = 38730
    expect(results.netSeProfit).toBe(38730.0);
    expect(results.seTax.total).toBe(5472.37);
    expect(results.federalTax).toBe(1423.41);
    expect(results.amountOwed).toBe(6895.78);
    expect(results.quarterlyPayment).toBe(1723.95);
  });

  it("Scenario B: High-income pure 1099 (Additional Medicare surtax)", () => {
    const inputs: TaxInputs = {
      filingStatus: "single",
      w2Wages: 0,
      w2Withheld: 0,
      gross1099: 230000,
      deductions: {
        certs: 1000,
        liabilityIns: 300,
        gymRent: 5000,
        equipment: 2000,
        software: 1000,
        mileage: 5000,
        apparel: 500,
        marketing: 2000,
        homeOffice: 1500,
        other: 500,
      },
    };

    const results = calculateTaxes(inputs);
    expect(results.netSeProfit).toBe(212850.0);
    // Over threshold $200k surtax verification
    expect(results.seTax.total).toBeGreaterThan(0);
    expect(results.amountOwed).toBe(56144.61);
    expect(results.quarterlyPayment).toBe(14036.15);
  });

  it("Scenario C: Hybrid W-2 + 1099 (Combined near SS wage base)", () => {
    const inputs: TaxInputs = {
      filingStatus: "single",
      w2Wages: 160000,
      w2Withheld: 30000,
      gross1099: 40000,
      deductions: {
        certs: 800,
        liabilityIns: 250,
        gymRent: 0,
        equipment: 500,
        software: 200,
        mileage: 0,
        apparel: 100,
        marketing: 0,
        homeOffice: 0,
        other: 150,
      },
    };

    const results = calculateTaxes(inputs);
    expect(results.netSeProfit).toBe(38000.0);
    // SS wage base is 184,500. Remaining: 24,500.
    // SE taxable: 38,000 * 0.9235 = 35,093.
    // So SS tax should only apply to 24,500, capping out properly.
    expect(results.seTax.socialSecurity).toBe(3038.0); // 24500 * 0.124
    expect(results.amountOwed).toBe(8804.85); // after 30k w2 withheld
  });

  it("Scenario D: Married filing jointly (same numbers as A)", () => {
    const inputs: TaxInputs = {
      filingStatus: "married",
      w2Wages: 0,
      w2Withheld: 0,
      gross1099: 45000,
      deductions: {
        certs: 500,
        liabilityIns: 200,
        gymRent: 3000,
        equipment: 800,
        software: 300,
        mileage: 1000,
        apparel: 200,
        marketing: 500,
        homeOffice: 0,
        other: 100,
      },
    };

    const results = calculateTaxes(inputs);
    expect(results.netSeProfit).toBe(38730.0);
    expect(results.seTax.total).toBe(5472.37);
    // Married standard deduction is $30k, bringing taxable income very low.
    expect(results.federalTax).toBe(0.0); // taxable income < standard deduction
    expect(results.amountOwed).toBe(5472.37); // Only SE tax owed
  });
});
