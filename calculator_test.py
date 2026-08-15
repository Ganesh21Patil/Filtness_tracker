import json

# CONFIG
CONFIG = {
    "TAX_YEAR": 2026,
    "SS_WAGE_BASE": 184500,
    "MILEAGE_RATE": 0.67,
    "SURTAX_THRESHOLDS": {
        "single": 200000,
        "married": 250000
    },
    "STANDARD_DEDUCTIONS": {
        "single": 15000,
        "married": 30000
    },
    "FEDERAL_BRACKETS": {
        "single": [
            {"start": 609350, "rate": 0.37},
            {"start": 243725, "rate": 0.35},
            {"start": 191950, "rate": 0.32},
            {"start": 100525, "rate": 0.24},
            {"start": 47150, "rate": 0.22},
            {"start": 11600, "rate": 0.12},
            {"start": 0, "rate": 0.10}
        ],
        "married": [
            {"start": 731200, "rate": 0.37},
            {"start": 487450, "rate": 0.35},
            {"start": 383900, "rate": 0.32},
            {"start": 201050, "rate": 0.24},
            {"start": 94300, "rate": 0.22},
            {"start": 23200, "rate": 0.12},
            {"start": 0, "rate": 0.10}
        ]
    }
}

def calculate_taxes(inputs):
    # 1. Net SE profit
    deductions_sum = (
        inputs["deductions"]["certs"] +
        inputs["deductions"]["liabilityIns"] +
        inputs["deductions"]["gymRent"] +
        inputs["deductions"]["equipment"] +
        inputs["deductions"]["software"] +
        (inputs["deductions"]["mileage"] * CONFIG["MILEAGE_RATE"]) +
        inputs["deductions"]["apparel"] +
        inputs["deductions"]["marketing"] +
        inputs["deductions"]["homeOffice"] +
        inputs["deductions"]["other"]
    )
    net_se_profit = max(0, inputs["gross1099"] - deductions_sum)

    # 2. SE-taxable income
    se_taxable_income = net_se_profit * 0.9235

    # 3. Social Security portion
    wage_base_remaining = max(0, CONFIG["SS_WAGE_BASE"] - inputs["w2Wages"])
    ss_tax = min(se_taxable_income, wage_base_remaining) * 0.124

    # 4. Medicare portion
    medicare_tax = se_taxable_income * 0.029

    # 5. Additional Medicare surtax
    surtax_threshold = CONFIG["SURTAX_THRESHOLDS"][inputs["filingStatus"]]
    combined_income = inputs["w2Wages"] + se_taxable_income
    amount_over_threshold = max(0, combined_income - surtax_threshold)
    surtax = amount_over_threshold * 0.009

    # 6. Total SE tax
    total_se_tax = ss_tax + medicare_tax + surtax

    # 7. Half of SE tax
    half_se_tax = total_se_tax / 2

    # 8. QBI deduction
    net_after_half_se = max(0, net_se_profit - half_se_tax)
    qbi_deduction = net_after_half_se * 0.20

    # 9. Taxable income
    standard_deduction = CONFIG["STANDARD_DEDUCTIONS"][inputs["filingStatus"]]
    taxable_income = max(0, inputs["w2Wages"] + net_se_profit - half_se_tax - qbi_deduction - standard_deduction)

    # 10. Federal income tax
    brackets = CONFIG["FEDERAL_BRACKETS"][inputs["filingStatus"]]
    federal_tax = 0
    remaining_income = taxable_income
    
    for bracket in brackets:
        if remaining_income > bracket["start"]:
            taxable_in_bracket = remaining_income - bracket["start"]
            federal_tax += taxable_in_bracket * bracket["rate"]
            remaining_income = bracket["start"]

    # 11. Total estimated tax liability
    total_liability = federal_tax + total_se_tax

    # 12-13. Remaining amount owed
    amount_owed = max(0, total_liability - inputs["w2Withheld"])

    # 14. Quarterly payment
    quarterly = amount_owed / 4

    return {
        "netSeProfit": round(net_se_profit, 2),
        "seTax": {
            "socialSecurity": round(ss_tax, 2),
            "medicare": round(medicare_tax, 2),
            "additionalMedicare": round(surtax, 2),
            "total": round(total_se_tax, 2)
        },
        "federalTax": round(federal_tax, 2),
        "totalLiability": round(total_liability, 2),
        "amountOwed": round(amount_owed, 2),
        "quarterlyPayment": round(quarterly, 2)
    }

scenarios = [
    {
        "name": "Scenario A: Low-income pure 1099",
        "inputs": {
            "filingStatus": "single",
            "w2Wages": 0,
            "w2Withheld": 0,
            "gross1099": 45000,
            "deductions": {
                "certs": 500,
                "liabilityIns": 200,
                "gymRent": 3000,
                "equipment": 800,
                "software": 300,
                "mileage": 1000, 
                "apparel": 200,
                "marketing": 500,
                "homeOffice": 0,
                "other": 100
            }
        }
    },
    {
        "name": "Scenario B: High-income pure 1099 (Additional Medicare surtax)",
        "inputs": {
            "filingStatus": "single",
            "w2Wages": 0,
            "w2Withheld": 0,
            "gross1099": 230000,
            "deductions": {
                "certs": 1000,
                "liabilityIns": 300,
                "gymRent": 5000,
                "equipment": 2000,
                "software": 1000,
                "mileage": 5000, 
                "apparel": 500,
                "marketing": 2000,
                "homeOffice": 1500,
                "other": 500
            }
        }
    },
    {
        "name": "Scenario C: Hybrid W-2 + 1099 (Combined near SS wage base)",
        "inputs": {
            "filingStatus": "single",
            "w2Wages": 160000,
            "w2Withheld": 30000,
            "gross1099": 40000,
            "deductions": {
                "certs": 800,
                "liabilityIns": 250,
                "gymRent": 0,
                "equipment": 500,
                "software": 200,
                "mileage": 0, 
                "apparel": 100,
                "marketing": 0,
                "homeOffice": 0,
                "other": 150
            }
        }
    },
    {
        "name": "Scenario D: Married filing jointly (same numbers as A)",
        "inputs": {
            "filingStatus": "married",
            "w2Wages": 0,
            "w2Withheld": 0,
            "gross1099": 45000,
            "deductions": {
                "certs": 500,
                "liabilityIns": 200,
                "gymRent": 3000,
                "equipment": 800,
                "software": 300,
                "mileage": 1000, 
                "apparel": 200,
                "marketing": 500,
                "homeOffice": 0,
                "other": 100
            }
        }
    }
]

results = []
for s in scenarios:
    r = calculate_taxes(s["inputs"])
    results.append({"name": s["name"], "inputs": s["inputs"], "output": r})

print(json.dumps(results, indent=2))
