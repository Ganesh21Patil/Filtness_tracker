import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TrainerLedger",
  description: "How TrainerLedger handles your data: nothing you enter is stored or transmitted. All calculations run locally in your browser.",
};

export default function Privacy() {
  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-cream text-inktext p-6 sm:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(31,25,74,.1)]">
        <Link href="/" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">Privacy policy</h1>

        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p>TrainerLedger is built so your financial information never has to leave your device.</p>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">What we don&apos;t collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-inktext">Your calculator inputs.</strong> Income, deductions, and filing status are calculated entirely in your browser with JavaScript. They are never sent to a server, never saved to a database, and disappear the moment you close or refresh the tab.</li>
              <li><strong className="text-inktext">Accounts.</strong> There&apos;s no signup, login, or account system of any kind.</li>
              <li><strong className="text-inktext">Cookies or local storage.</strong> The calculator doesn&apos;t set cookies or write to your browser&apos;s local storage to remember your numbers.</li>
              <li><strong className="text-inktext">Third-party analytics or ad trackers.</strong> As of this writing, the site runs no analytics, advertising, or tracking scripts. If that changes, this page will be updated first.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">What is collected</h2>
            <p>Standard web hosting infrastructure (this site is hosted on Vercel) may log basic technical information for any request — such as IP address, browser type, and timestamp — for security and performance purposes. This is routine for any website and isn&apos;t something TrainerLedger itself collects or has access to beyond typical hosting logs.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Fonts</h2>
            <p>This site uses Google-hosted typefaces (DM Sans, DM Serif Display), but they are downloaded once at build time and served from our own domain — your browser never makes a request to Google&apos;s servers to load them.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Links to other sites</h2>
            <p>Our guides link to external resources, including irs.gov. Once you leave TrainerLedger, that site&apos;s own privacy policy applies.</p>
          </div>

          <p className="text-sm text-[#8b869c] font-medium border-t border-[#e2deeb] pt-4">Last updated: September 2026</p>
        </div>
      </div>
    </main>
  );
}
