import Link from "next/link";

export default function Guide1099vsW2() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="text-brand-600 hover:underline mb-6 inline-block">&larr; Back to Calculator</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">1099 vs W-2 for Personal Trainers</h1>
        <div className="prose prose-brand max-w-none text-gray-600">
          <p>Many trainers are "hybrid" workers — they get a W-2 paycheck from a commercial gym, but also take private clients on the side (1099 income). Understanding how these interact is critical to not overpaying Social Security tax.</p>
          {/* Content abbreviated for stub */}
        </div>
      </div>
    </main>
  );
}
