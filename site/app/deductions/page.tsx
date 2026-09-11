import Calculator from "../../components/Calculator";
import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Deductions | TrainerLedger",
  description: "Walk through the business deductions trainers miss most — certifications, mileage, equipment, and more — with live tax savings as you go.",
};

export default function DeductionsPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      {/* A short intro band: the old one pushed the form ~630px down on a phone. */}
      <section className="bg-ink px-6 pb-10 pt-8 sm:pb-14 sm:pt-12 lg:px-12">
        <PageHeader
          align="center"
          title="Deductions"
          lede="Most trainers miss at least one of these. Fill in your income below, then work through each deduction category — the calculator shows roughly what each one saves you as you go."
        />
      </section>

      <section className="bg-cream py-10 sm:py-16">
        <div className="shell">
          <Calculator />
        </div>
      </section>
    </main>
  );
}
