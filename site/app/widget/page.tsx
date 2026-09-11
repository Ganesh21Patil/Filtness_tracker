import type { Metadata } from "next";
import EmbedSnippet from "../../components/EmbedSnippet";
import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Embed This Calculator | TrainerLedger",
  description: "Add the free TrainerLedger tax calculator to your gym-business blog, certification site, or resource page — free, no signup, just a snippet.",
};

export default function Widget() {
  return (
    <main className="flex-1 bg-ink px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="For site owners"
          title="Embed this calculator on your site"
          lede="Run a gym-business blog, certification program, or freelancer resource page? Drop this free tax calculator into your own page with one snippet. It stays free for your readers, no signup required, and links back to TrainerLedger."
          className="mb-10"
        />

        <EmbedSnippet />

        <div className="mt-10 rounded-card bg-cream text-inktext p-6 sm:p-8 shadow-card">
          <h2 className="font-serif text-2xl mb-3">A few notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-inksoft leading-relaxed">
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
