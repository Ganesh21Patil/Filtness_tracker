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
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <h1 className="font-serif text-4xl sm:text-5xl tracking-[-.03em] mb-6">Privacy policy</h1>

        <div className="space-y-6 text-[#413d57] leading-relaxed">
          <p>TrainerLedger is built so your financial information never has to leave your device.</p>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">The claim that matters most</h2>
            <p><strong className="text-inktext">Your income, deductions, and tax estimate are never transmitted anywhere.</strong> Every calculation runs locally in your browser with JavaScript. We don&apos;t see your numbers, can&apos;t see your numbers, and have no server-side record of them — not in a database, not in a log, not anywhere.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">What stays on your device</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-inktext">Your calculator inputs.</strong> To save you re-entering everything on a return visit, the calculator saves your inputs to your browser&apos;s local storage — a mechanism built into your browser, not our servers. This data physically cannot leave your device: clearing your browser data or using a different browser/device removes it.</li>
              <li><strong className="text-inktext">Accounts.</strong> There&apos;s no signup, login, or account system of any kind.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">Analytics</h2>
            <p>We use Vercel Analytics to understand aggregate traffic — which pages get visited, roughly how many people, which country — so we know the site is being used and can improve it. It&apos;s cookieless and doesn&apos;t track you individually across sites. It has no access to your calculator inputs, filing status, income, or any number you type into the tool — those never leave your browser, as described above.</p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-inktext mb-3">What else is collected</h2>
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
