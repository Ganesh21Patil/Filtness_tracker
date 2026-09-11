import type { Metadata } from "next";
import EmbedSnippet from "../../components/EmbedSnippet";
import PageHeader, { PageBand } from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Embed This Calculator | TrainerLedger",
  description: "Add the free TrainerLedger tax calculator to your gym-business blog, certification site, or resource page — free, no signup, just a snippet.",
};

export default function Widget() {
  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand>
        <PageHeader
          eyebrow="For site owners"
          title="Embed this calculator on your site"
          lede="Run a gym-business blog, certification program, or freelancer resource page? Drop this free tax calculator into your own page with one snippet. It stays free for your readers, no signup required, and links back to TrainerLedger."
        />
      </PageBand>

      <section className="pb-20 sm:pb-24">
        <div className="shell max-w-4xl">
          <EmbedSnippet />

          <div className="glass mt-6 rounded-card p-6 sm:p-8">
            <h2 className="type-title text-offwhite">A few notes</h2>
            <ul className="prose-dark mt-4 list-disc space-y-2 pl-5 marker:text-accent">
              <li>The embed is the same real calculator and tax engine as the main site — same 2026 figures, kept in sync.</li>
              <li>All calculations still run entirely in the visitor&apos;s browser. Nothing is sent to us or to you.</li>
              <li>The embed includes a small &quot;Powered by TrainerLedger&quot; link — please keep it visible.</li>
              <li>Adjust the iframe&apos;s <code>height</code> if the calculator looks cut off on your layout; it doesn&apos;t auto-resize.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
