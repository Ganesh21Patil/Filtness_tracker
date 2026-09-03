import Link from "next/link";

export default function GuideDeadlines() {
  return (
    <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-brand-600 hover:underline mb-6 inline-block">&larr; Back to Calculator</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Quarterly Tax Deadlines for Fitness Pros</h1>
        <div className="prose prose-brand max-w-none text-gray-600">
          <p>The IRS requires self-employed individuals to pay taxes four times a year. Missing these can result in underpayment penalties.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
