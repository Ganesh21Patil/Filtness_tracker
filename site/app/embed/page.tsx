import Link from "next/link";
import Calculator from "../../components/Calculator";
import { Wordmark } from "../../components/Logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embeddable Tax Calculator | TrainerLedger",
  robots: { index: false, follow: true }, // avoid duplicate-content indexing of the bare embed
};

// Bare-bones page meant to be iframed onto other sites. Header/Footer hide
// themselves on this route (see components/Header.tsx and Footer.tsx).
export default function Embed() {
  return (
    <main className="aurora min-h-screen flex-1 bg-ink px-4 py-6 sm:px-6 sm:py-8">
      <Calculator embed />
      <p className="mt-6 text-center text-xs text-dusk">
        Powered by{" "}
        <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center font-semibold text-offwhite underline-offset-4 hover:underline">
          <Wordmark />
        </Link>
      </p>
    </main>
  );
}
