import Link from "next/link";
import type { Metadata } from "next";
import EmbedSnippet from "../../components/EmbedSnippet";

export const metadata: Metadata = {
  title: "Embed This Calculator | TrainerLedger",
  description: "Add the free TrainerLedger tax calculator to your gym-business blog, certification site, or resource page — free, no signup, just a snippet.",
};

export default function Widget() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">For site owners</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-6">Embed this calculator on your site</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-offwhite/80 mb-10">
          Run a gym-business blog, certification program, or freelancer resource page? Drop this free tax calculator into your own page with one snippet. It stays free for your readers, no signup required, and links back to TrainerLedger.
        </p>

        <EmbedSnippet />

        <div className="mt-10 rounded-[28px] bg-cream text-inktext p-6 sm:p-8 shadow-[0_18px_50px_rgba(31,25,74,.1)]">
          <h2 className="font-serif text-2xl mb-3">A few notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-[#413d57] leading-relaxed">
            <li>The embed is the same real calculator and tax engine as the main site — same 2026 figures, kept in sync.</li>
            <li>All calculations still run entirely in the visitor&apos;s browser. Nothing is sent to us or to you.</li>
            <li>The embed includes a small &quot;Powered by TrainerLedger&quot; link — please keep it visible.</li>
            <li>Adjust the iframe&apos;s <code className="bg-white px-1 rounded">height</code> if the calculator looks cut off on your layout; it doesn&apos;t auto-resize.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
