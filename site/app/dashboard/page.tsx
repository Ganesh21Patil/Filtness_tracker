import Link from "next/link";
import Dashboard from "../../components/Dashboard";

// Not in the sitemap on purpose: it renders one visitor's own numbers and has
// nothing for a crawler to index.
export const metadata = {
  title: "Your Breakdown | TrainerLedger",
  description: "A full breakdown of your estimated taxes: where your money goes, your quarterly plan, and your deduction picture.",
  robots: { index: false, follow: true },
};

export default function DashboardPage() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/calculator"
          className="mb-6 inline-flex min-h-[44px] items-center rounded font-semibold text-accent-deep hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          &larr; Back to calculator
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">Your breakdown</p>
        <h1 className="mb-10 mt-4 font-serif text-4xl tracking-[-.03em] text-offwhite sm:text-5xl">
          What this actually means
        </h1>

        <Dashboard />
      </div>
    </main>
  );
}
