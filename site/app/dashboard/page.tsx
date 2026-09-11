import Dashboard from "../../components/Dashboard";
import PageHeader, { PageBand } from "../../components/PageHeader";

// Not in the sitemap on purpose: it renders one visitor's own numbers and has
// nothing for a crawler to index.
export const metadata = {
  title: "Your Breakdown | TrainerLedger",
  description: "A full breakdown of your estimated taxes: where your money goes, your quarterly plan, and your deduction picture.",
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand>
        {/* The dashboard is reached from the results panel, so its parent is the calculator. */}
        <PageHeader
          breadcrumbs={[{ label: "Calculator", href: "/calculator" }, { label: "Your breakdown" }]}
          title="What this actually means"
          lede="Your estimate, taken apart: where the money goes, how you compare, and what to do each quarter."
        />
      </PageBand>

      <section className="pb-20 sm:pb-24">
        <div className="shell max-w-6xl">
          <Dashboard />
        </div>
      </section>
    </main>
  );
}
