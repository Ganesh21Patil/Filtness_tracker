import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";
import guideTrainer from "../../../public/images/guide-trainer.jpg";

export const metadata: Metadata = {
  title: "Personal Trainer Tax Deductions Explained | TrainerLedger",
  description: "The most common business deductions for independent personal trainers and fitness coaches, explained in plain language.",
};

export default function GuideDeductions() {
  return (
    <ArticleShell
      breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: "Tax deductions" }]}
      title="Personal trainer tax deductions explained"
      image={guideTrainer}
    >
      <p>As a 1099 independent contractor, you only pay taxes on your <strong>profit</strong>, not your gross revenue. Deductions lower your profit, which lowers your tax bill. Here are the most common deductions for fitness professionals.</p>
      {/* Content abbreviated for stub */}
    </ArticleShell>
  );
}
