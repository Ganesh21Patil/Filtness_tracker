import Calculator from "../../../components/Calculator";
import type { Metadata } from "next";
import PageHeader, { PageBand } from "../../../components/PageHeader";
import summit from "../../../public/images/summit.jpg";

export const metadata: Metadata = {
  title: "Personal Trainer Deduction Finder | TrainerLedger",
  description: "Find the business deductions trainers miss most — certifications, liability insurance, mileage, equipment, and more — and see the estimated tax savings.",
};

export default function DeductionFinderPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Personal Trainer Deduction Finder",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Free tool that walks self-employed personal trainers through common business deductions and estimates the tax savings for each.",
  };

  return (
    <main className="flex-1 overflow-x-clip">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageBand photo={summit}>
        <PageHeader
          align="center"
          eyebrow="Free tool"
          title="Personal trainer deduction finder"
          lede="Certifications, liability insurance, gym rental splits, mileage, equipment, coaching software — most trainers miss at least one of these on their taxes. Walk through each category below and see roughly how much each one is worth in tax savings as you go."
        />
      </PageBand>

      {/* Overlaps the photo band's faded bottom edge. */}
      <section className="relative z-10 -mt-12 pb-16 sm:-mt-20 sm:pb-24">
        <div className="shell">
          <Calculator defaultDeductionsOpen />
        </div>
      </section>
    </main>
  );
}
