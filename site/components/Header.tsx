"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/#calculator", label: "Calculator" },
  { href: "/#deductions", label: "Deductions" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname?.startsWith("/embed")) return null;

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 lg:px-12">
      <Link href="/" className="flex items-center gap-2 rounded text-xl font-semibold tracking-tight text-offwhite">
        <span className="grid size-8 place-items-center rounded-full bg-accent text-ink">✦</span>
        TrainerLedger
      </Link>

      <nav
        className={`${menu ? "flex" : "hidden"} absolute left-6 right-6 top-20 flex-col gap-5 rounded-2xl border border-white/10 bg-panel p-6 text-sm md:static md:flex md:flex-row md:items-center md:gap-8 md:border-0 md:bg-transparent md:p-0`}
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMenu(false)} className="rounded text-offwhite/90 transition hover:text-offwhite">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/#calculator"
          className="hidden rounded-full bg-offwhite px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-accent sm:block"
        >
          Try the calculator
        </Link>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
          className="grid size-11 place-items-center rounded-full border border-white/20 text-offwhite md:hidden"
        >
          ☰
        </button>
      </div>
    </header>
  );
}
