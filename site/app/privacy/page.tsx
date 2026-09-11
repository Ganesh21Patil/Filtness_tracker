import Link from "next/link";
import type { Metadata } from "next";
import ArticleShell from "../../components/ArticleShell";

export const metadata: Metadata = {
  title: "Privacy Policy | TrainerLedger",
  description: "How TrainerLedger handles your data: calculations run locally and are never transmitted unless you choose to sign in and save an estimate.",
};

export default function Privacy() {
  return (
    <ArticleShell
      article={false}
      eyebrow="Legal"
      title="Privacy policy"
      footer="Last updated: September 2026 — added the optional sign-in and saved-estimates sections above now that the feature is live, and listed the site's two decorative display fonts."
    >
      <p>TrainerLedger works two ways: use it anonymously and your numbers never leave your device, or sign in to save estimates for later — the choice is yours, and each mode does exactly what it says.</p>

      <div>
        <h2>If you don&apos;t sign in</h2>
        <p><strong>Your income, deductions, and tax estimate are never transmitted anywhere.</strong> Every calculation runs locally in your browser with JavaScript. We don&apos;t see your numbers, can&apos;t see your numbers, and have no server-side record of them — not in a database, not in a log, not anywhere.</p>
      </div>

      <div>
        <h2>What stays on your device</h2>
        <ul>
          <li><strong>Your calculator inputs.</strong> To save you re-entering everything on a return visit, the calculator saves your inputs to your browser&apos;s local storage — a mechanism built into your browser, not our servers. This data physically cannot leave your device: clearing your browser data or using a different browser/device removes it.</li>
        </ul>
      </div>

      <div>
        <h2>If you sign in and save an estimate</h2>
        <p>Signing in is entirely optional and only adds one thing: saving an estimate so you can come back to it later. Signing in uses Google, and we receive your name, email address, and profile picture from Google — standard information for any &quot;Sign in with Google&quot; button. We don&apos;t receive your Google password or access anything else in your Google account.</p>
        <p className="mt-3">When you click <strong>&quot;Save plan,&quot;</strong> the numbers on screen at that moment (your inputs and the resulting calculation, plus which tax year they used) are sent to our database and tied to your account. This is the only time your calculator numbers leave your browser, and it only happens when you explicitly click that button — never automatically. You can view and delete anything you&apos;ve saved anytime at <Link href="/saved-estimates">Saved Estimates</Link>. Deleting a saved estimate removes it permanently.</p>
        <p className="mt-3">Row-level security on our database means your saved estimates are only ever readable by your own account — not other users, and not visible to us through normal use of the app.</p>
      </div>

      <div>
        <h2>Analytics</h2>
        <p>We use Vercel Analytics to understand aggregate traffic — which pages get visited, roughly how many people, which country — so we know the site is being used and can improve it. It&apos;s cookieless and doesn&apos;t track you individually across sites. It has no access to your calculator inputs, filing status, income, or any number you type into the tool — those never leave your browser, as described above.</p>
      </div>

      <div>
        <h2>What else is collected</h2>
        <p>Standard web hosting infrastructure (this site is hosted on Vercel) may log basic technical information for any request — such as IP address, browser type, and timestamp — for security and performance purposes. This is routine for any website and isn&apos;t something TrainerLedger itself collects or has access to beyond typical hosting logs.</p>
      </div>

      <div>
        <h2>Fonts</h2>
        <p>This site uses Google-hosted typefaces (DM Sans, DM Serif Display, Barlow Condensed, and Nothing You Could Do), but they are downloaded once at build time and served from our own domain — your browser never makes a request to Google&apos;s servers to load them.</p>
      </div>

      <div>
        <h2>Links to other sites</h2>
        <p>Our guides link to external resources, including irs.gov. Once you leave TrainerLedger, that site&apos;s own privacy policy applies.</p>
      </div>
    </ArticleShell>
  );
}
