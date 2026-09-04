import Calculator from "../../components/Calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deductions | TrainerLedger",
  description: "Walk through the business deductions trainers miss most — certifications, mileage, equipment, and more — with live tax savings as you go.",
};

export default function DeductionsPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <section className="bg-ink px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-4">Deductions</h1>
          <p className="text-lg leading-relaxed text-offwhite/80">
            Most trainers miss at least one of these. Fill in your income below, then work through each deduction category — the calculator shows roughly what each one saves you as you go.
          </p>
        </div>
      </section>

      <section className="bg-cream px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <Calculator />
        </div>
      </section>
    </main>
  );
}
