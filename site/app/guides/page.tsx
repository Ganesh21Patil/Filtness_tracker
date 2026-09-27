import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import PageHeader, { PageBand } from "../../components/PageHeader";
import GuideCard from "../../components/GuideCard";
import guideTrainer from "../../public/images/guide-trainer.jpg";
import guideLaptop from "../../public/images/guide-laptop.jpg";
import guideW2 from "../../public/images/guide-w2.jpg";
import guideThreshold from "../../public/images/guide-threshold.jpg";
import guideQbi from "../../public/images/guide-qbi.jpg";
import heroTrainer from "../../public/hero-trainer.jpg";

export const metadata: Metadata = {
  title: "Guides | TrainerLedger",
  description: "Plain-language guides on personal trainer taxes: deductions, 1099 vs W‑2, and quarterly deadlines.",
};

const guides: { title: string; summary: string; href: string; image: StaticImageData }[] = [
  { title: "Personal trainer tax deductions", summary: "Understand the line between personal spending and expenses connected to running your training business.", href: "/guides/personal-trainer-tax-deductions", image: guideTrainer },
  { title: "1099 vs W‑2 for personal trainers", summary: "See the difference between W‑2 wages and 1099 income, and why hybrid trainers need to watch Social Security withholding.", href: "/guides/1099-vs-w2-personal-trainers", image: guideW2 },
  { title: "Quarterly tax deadlines for fitness pros", summary: "The four IRS due dates for estimated tax payments, and what happens if you miss one.", href: "/guides/quarterly-tax-deadlines-fitness-pros", image: guideLaptop },
  { title: "What the new $2,000 1099 threshold means for trainers", summary: "Fewer 1099 forms doesn't mean less taxable income — why 2026's higher reporting threshold is a trap worth knowing about.", href: "/guides/1099-threshold-2026", image: guideThreshold },
  { title: "Section 179 and your equipment purchases", summary: "How to deduct the full cost of training equipment the year you buy it, instead of depreciating it over time.", href: "/guides/section-179-equipment", image: heroTrainer },
  { title: "The minimum QBI deduction, explained", summary: "2026's new guaranteed $400 QBI deduction, and where the real calculation gets more complex than a flat 20%.", href: "/guides/minimum-qbi-deduction", image: guideQbi },
];

export default function GuidesIndex() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand>
        <PageHeader
          eyebrow="The trainer ledger"
          title="Guides"
          lede="Straightforward, plain-language guides for trainers, coaches, and gym professionals — updated for 2026."
        />
      </PageBand>

      <section className="pb-20 sm:pb-24">
        <div className="shell grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <GuideCard key={g.href} title={g.title} summary={g.summary} href={g.href} image={g.image} as="h2" />
          ))}
        </div>
      </section>
    </main>
  );
}
