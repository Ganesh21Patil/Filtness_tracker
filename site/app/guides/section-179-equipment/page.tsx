import Link from "next/link";
import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";
import heroTrainer from "../../../public/hero-trainer.jpg";

export const metadata: Metadata = {
  title: "Section 179 and Your Equipment Purchases | TrainerLedger",
  description: "How Section 179 lets personal trainers deduct the full cost of equipment the year they buy it, instead of depreciating it over several years.",
};

export default function GuideSection179() {
  return (
    <ArticleShell
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: "Section 179 and equipment" }]}
      title="Section 179 and your equipment purchases"
      image={heroTrainer}
      footer={
        <>
          This is general information, not tax advice — large equipment purchases and mixed personal/business use can get complicated. See also our <Link href="/about">methodology</Link>. Last updated: September 2026.
        </>
      }
    >
      <p>When you buy business equipment — weights, benches, resistance bands, a laptop for programming, wearables you use with clients — the default tax rule is that you&apos;d normally spread (&quot;depreciate&quot;) the cost over several years instead of deducting it all at once.</p>

      <div>
        <h2>Section 179 changes that</h2>
        <p>Section 179 of the tax code lets a business deduct the full cost of qualifying equipment in the year it&apos;s placed in service, instead of depreciating it. Combined with 100% bonus depreciation (made permanent under the One Big Beautiful Bill Act), almost every equipment purchase a small business like a solo training practice makes can be fully expensed the same year.</p>
        <p className="mt-3">In practice, this means: if you buy $1,200 of equipment for your training business this year, you can generally deduct the full $1,200 against this year&apos;s income — not $200/year over six years.</p>
      </div>

      <div>
        <h2>What counts</h2>
        <ul>
          <li>Weights, resistance bands, benches, mats, and other training equipment used in your business</li>
          <li>Wearables or tech you use to program and track client sessions</li>
          <li>A computer or tablet used primarily for your training business</li>
        </ul>
        <p className="mt-3">The equipment needs to be used more than 50% for business purposes. If you split use between personal and business, only the business-use portion qualifies.</p>
      </div>

      <p>Enter your total qualifying equipment spend in the <Link href="/deductions">Equipment field</Link> of the calculator — the tool already treats it as fully deductible the year you enter it, consistent with Section 179.</p>
    </ArticleShell>
  );
}
