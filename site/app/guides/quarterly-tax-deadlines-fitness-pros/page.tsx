import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";
import guideLaptop from "../../../public/images/guide-laptop.jpg";

export const metadata: Metadata = {
  title: "Quarterly Tax Deadlines for Fitness Pros | TrainerLedger",
  description: "The four IRS estimated tax deadlines self-employed fitness professionals need to know, and what happens if you miss one.",
};

export default function GuideDeadlines() {
  return (
    <ArticleShell
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: "Quarterly deadlines" }]}
      title="Quarterly tax deadlines for fitness pros"
      image={guideLaptop}
    >
      <p>The IRS requires self-employed individuals to pay taxes four times a year. Missing these can result in underpayment penalties.</p>
      {/* Content abbreviated for stub */}
    </ArticleShell>
  );
}
