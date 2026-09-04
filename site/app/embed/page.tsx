import Link from "next/link";
import Calculator from "../../components/Calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embeddable Tax Calculator | TrainerLedger",
  robots: { index: false, follow: true }, // avoid duplicate-content indexing of the bare embed
};

// Bare-bones page meant to be iframed onto other sites. Header/Footer hide
// themselves on this route (see components/Header.tsx and Footer.tsx).
export default function Embed() {
  return (
    <main className="bg-cream text-inktext px-4 py-6 sm:px-6 sm:py-8">
      <Calculator />
      <p className="mt-6 text-center text-xs text-[#8b869c]">
        Powered by{" "}
        <Link href="/" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-deep hover:underline">
          TrainerLedger
        </Link>
      </p>
    </main>
  );
}
