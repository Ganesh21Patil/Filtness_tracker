"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname?.startsWith("/embed")) return null;

  return (
    <footer className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-8 px-6 py-12 text-sm text-offwhite/70 md:flex-row lg:px-12">
      <div>
        <Link href="/" className="rounded text-xl font-semibold text-offwhite">
          TrainerLedger
        </Link>
        <p className="mt-3 max-w-xs">A free tax estimate tool for independent personal trainers and fitness coaches.</p>
      </div>
      <div className="flex flex-col items-start gap-3 md:items-end md:text-right">
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-start md:justify-end">
          <Link href="/guides" className="rounded hover:text-offwhite">Guides</Link>
          <Link href="/about" className="rounded hover:text-offwhite">About</Link>
          <Link href="/widget" className="rounded hover:text-offwhite">Embed this tool</Link>
          <Link href="/privacy" className="rounded hover:text-offwhite">Privacy</Link>
          <Link href="/terms" className="rounded hover:text-offwhite">Terms</Link>
        </nav>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-start md:justify-end text-xs text-offwhite/50">
          <Link href="/calculators/quarterly-tax-calculator-personal-trainers" className="rounded hover:text-offwhite/80">Quarterly tax calculator</Link>
          <Link href="/calculators/personal-trainer-deduction-finder" className="rounded hover:text-offwhite/80">Deduction finder</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} TrainerLedger &middot; Privacy first</p>
      </div>
    </footer>
  );
}
