"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/#calculator", label: "Calculator" },
  { href: "/guides/personal-trainer-tax-deductions", label: "Guides" },
  { href: "/about", label: "About" },
];

function LogoMark() {
  return (
    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-500 text-dark">
      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          <LogoMark />
          TrainerLedger
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/#calculator"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-dark shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            Try the Calculator
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2.5 min-h-[44px] min-w-[44px] text-gray-300 hover:text-white md:hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t border-white/10 bg-dark px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block min-h-[44px] rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#calculator"
            onClick={() => setOpen(false)}
            className="mt-2 block min-h-[44px] rounded-full bg-brand-500 px-4 py-2.5 text-center text-sm font-bold text-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
          >
            Try the Calculator
          </Link>
        </div>
      )}
    </header>
  );
}
