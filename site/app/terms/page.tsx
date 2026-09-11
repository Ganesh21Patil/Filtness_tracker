import Link from "next/link";
import type { Metadata } from "next";
import ArticleShell from "../../components/ArticleShell";

export const metadata: Metadata = {
  title: "Terms & Disclaimer | TrainerLedger",
  description: "TrainerLedger's terms of use and tax disclaimer: this tool provides planning estimates, not formal tax or legal advice.",
};

export default function Terms() {
  return (
    <ArticleShell
      article={false}
      eyebrow="Legal"
      title="Terms & disclaimer"
      footer={
        <>
          Last updated: September 2026. See also our <Link href="/privacy">privacy policy</Link>.
        </>
      }
    >
      <div id="disclaimer" className="scroll-mt-24">
        <h2>Not tax or legal advice</h2>
        <p>TrainerLedger is a free planning tool, not a substitute for professional advice. The estimates it produces are based on general 2026 federal tax rules and simplified assumptions — they don&apos;t account for every deduction, credit, state tax, or individual circumstance that might apply to you. Before filing a return or making an estimated tax payment, consult a certified public accountant (CPA) or enrolled agent (EA), particularly if you have a complex business structure, multiple income sources, or high income that may trigger additional rules.</p>
      </div>

      <div>
        <h2>No warranty</h2>
        <p>This tool is provided &quot;as is,&quot; without warranty of any kind, express or implied. While we do our best to keep the underlying figures (tax brackets, standard deductions, the Social Security wage base, and the standard mileage rate) accurate and current for the 2026 tax year, we don&apos;t guarantee the results are free of errors or that they match what you&apos;ll ultimately owe.</p>
      </div>

      <div>
        <h2>Your responsibility</h2>
        <p>Any decisions you make based on estimates from this tool — including how much to set aside or when to make an estimated payment — are your own responsibility. TrainerLedger and its creators aren&apos;t liable for penalties, interest, or other consequences resulting from reliance on this tool.</p>
      </div>

      <div>
        <h2>Use of the site</h2>
        <p>You&apos;re free to use this calculator for your own personal or business tax planning. Please don&apos;t attempt to disrupt the site, scrape it at scale, or misrepresent its output as official IRS guidance.</p>
      </div>
    </ArticleShell>
  );
}
