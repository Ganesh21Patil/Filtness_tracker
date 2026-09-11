import type { Metadata } from "next";
import Breadcrumbs from "../../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Quarterly Tax Deadlines for Fitness Pros | TrainerLedger",
  description: "The four IRS estimated tax deadlines self-employed fitness professionals need to know, and what happens if you miss one.",
};

export default function GuideDeadlines() {
  return (
    <main className="flex-1 bg-ink px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <article className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-card shadow-card">
        <Breadcrumbs tone="light" items={[{ label: "Guides", href: "/guides" }, { label: "Quarterly deadlines" }]} />
        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] text-inktext mb-6">Quarterly Tax Deadlines for Fitness Pros</h1>
        <div className="space-y-4 text-inksoft leading-relaxed">
          <p>The IRS requires self-employed individuals to pay taxes four times a year. Missing these can result in underpayment penalties.</p>
          {/* Content abbreviated for stub */}
        </div>
      </article>
    </main>
  );
}
