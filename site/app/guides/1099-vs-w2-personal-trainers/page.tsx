import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";
import guideW2 from "../../../public/images/guide-w2.jpg";

export const metadata: Metadata = {
  title: "1099 vs W‑2 for Personal Trainers | TrainerLedger",
  description: "How hybrid trainers with both a gym W‑2 paycheck and private 1099 clients should think about Social Security withholding and taxes.",
};

export default function Guide1099vsW2() {
  return (
    <ArticleShell breadcrumbs={[{ label: "Guides", href: "/guides" }, { label: "1099 vs W‑2" }]} title="1099 vs W‑2 for personal trainers" image={guideW2}>
      <p>Many trainers are &quot;hybrid&quot; workers — they get a W‑2 paycheck from a commercial gym, but also take private clients on the side (1099 income). Understanding how these interact is critical to not overpaying Social Security tax.</p>
      {/* Content abbreviated for stub */}
    </ArticleShell>
  );
}
