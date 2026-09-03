import Link from "next/link";

export default function GuideDeductions() {
  return (
    <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-brand-600 hover:underline mb-6 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">&larr; Back to Calculator</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Personal Trainer Tax Deductions Explained</h1>
        <div className="prose prose-brand max-w-none text-gray-600">
          <p>As a 1099 independent contractor, you only pay taxes on your <strong>profit</strong>, not your gross revenue. Deductions lower your profit, which lowers your tax bill. Here are the most common deductions for fitness professionals.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
