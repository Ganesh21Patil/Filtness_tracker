import Link from "next/link";
import type { Metadata } from "next";
import ArticleShell from "../../../components/ArticleShell";

export const metadata: Metadata = {
  title: "LLC vs. S-Corp Calculator for Fitness Professionals | TrainerLedger",
  description: "A real LLC vs. S-Corp comparison is coming — we're holding off shipping the numbers until they've had CPA review.",
};

export default function LlcVsScorpPage() {
  return (
    <ArticleShell
      article={false}
      breadcrumbs={[{ label: "Calculator", href: "/calculator" }, { label: "LLC vs. S-Corp" }]}
      title="LLC vs. S-Corp calculator"
    >
      <p><strong>This one&apos;s coming, but not yet.</strong> An LLC-vs-S-Corp comparison sounds simple on the surface — S-Corps can save self-employment tax on the portion of profit paid out as a distribution rather than salary — but getting the number right depends on &quot;reasonable compensation&quot; rules, payroll tax mechanics, state-level LLC/S-Corp fees that vary widely, and added filing complexity that a flat formula glosses over.</p>
      <p>We&apos;d rather ship nothing than ship a number that&apos;s confidently wrong, so this tool is waiting on real CPA review before it goes live — same standard we&apos;re holding the rest of this calculator to.</p>
      <p>In the meantime, our <Link href="/about">methodology page</Link> explains exactly what the main calculator does and doesn&apos;t estimate, and our <Link href="/guides">guides</Link> cover the deductions and deadlines that apply regardless of how your business is structured.</p>
    </ArticleShell>
  );
}
