// Plain module (deliberately NOT "use client") so both the server component
// that renders the FAQPage JSON-LD and the client accordion can import the
// same source. Exporting this array from the client component instead makes
// Next.js hand the server a client reference, and .map() throws at runtime.
export const faqs: [string, string][] = [
  ["Is this actually free?", "Yes. There's no signup, no paywall, and no email capture to see your estimate."],
  ["Is my data stored anywhere?", "No. Every calculation runs locally in your browser using JavaScript — nothing you type is sent to a server or saved unless you sign in and choose to save an estimate. See our privacy policy for details."],
  ["Which tax year does this use?", "2026 federal brackets, standard deductions, the Social Security wage base, and the standard mileage rate. We update these figures annually."],
  ["What if my income changes during the year?", "Come back and run it again. Estimated payments aren't locked in — if you pick up a block of new clients in spring or lose a few in the fall, redo the estimate and adjust what you send for the quarters you haven't paid yet."],
  ["Does this include state taxes?", "No. This is federal only: self-employment tax and federal income tax. Most states charge their own income tax on top of that, and a handful charge none. Check your state's rules separately, or ask a CPA who works in your state."],
  ["Is this official tax advice?", "No. This is a planning estimate, not formal tax or legal advice. Consult a CPA or enrolled agent before filing or making estimated payments — especially with complex income or high earnings."],
  ["What if I have both W-2 and 1099 income?", "Enter both. The calculator accounts for W-2 wages you already report, alongside your self-employment profit, when estimating your combined liability."],
];
