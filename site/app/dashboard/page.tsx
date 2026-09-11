import Dashboard from "../../components/Dashboard";
import PageHeader from "../../components/PageHeader";

// Not in the sitemap on purpose: it renders one visitor's own numbers and has
// nothing for a crawler to index.
export const metadata = {
  title: "Your Breakdown | TrainerLedger",
  description: "A full breakdown of your estimated taxes: where your money goes, your quarterly plan, and your deduction picture.",
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="flex-1 bg-ink px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-3xl">
        {/* The dashboard is reached from the results panel, so its parent is the calculator. */}
        <PageHeader
          breadcrumbs={[{ label: "Calculator", href: "/calculator" }, { label: "Your breakdown" }]}
          title="What this actually means"
          className="mb-10"
        />

        <Dashboard />
      </div>
    </main>
  );
}
