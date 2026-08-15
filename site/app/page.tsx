import Calculator from "../components/Calculator";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-dark tracking-tight mb-4">
          Estimate your personal trainer taxes in 60 seconds
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Built for independent trainers, gym contractors, and hybrid coaches. Find the deductions most trainers miss and see exactly what you owe.
        </p>
      </div>

      <Calculator />

      {/* Trust Signals */}
      <div className="w-full max-w-3xl text-center mt-12 space-y-4">
        <p className="text-sm text-gray-500">
          Last updated for the 2026 tax year. <Link href="/about" className="text-brand-600 font-medium hover:underline">Read our methodology and IRS sources.</Link>
        </p>
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          Privacy first: No user data is stored or transmitted anywhere. All calculation happens locally in your browser. This tool provides an estimate for planning purposes, not formal tax or legal advice.
        </p>
      </div>
    </main>
  );
}
