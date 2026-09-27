import Calculator from "../../components/Calculator";
import type { Metadata } from "next";
import PageHeader, { PageBand } from "../../components/PageHeader";
import summit from "../../public/images/summit.jpg";

export const metadata: Metadata = {
  title: "Deductions | TrainerLedger",
  description: "Walk through the business deductions trainers miss most — certifications, mileage, equipment, and more — with live tax savings as you go.",
};

export default function DeductionsPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand photo={summit}>
        <PageHeader
          align="center"
          eyebrow="Keep more of what you earn"
          title="Deductions"
          lede="Most trainers miss at least one of these. Fill in your income below, then work through each deduction category — the calculator shows roughly what each one saves you as you go."
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
