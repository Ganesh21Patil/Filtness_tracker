"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/deductions", label: "Deductions" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/guides") return pathname === "/guides" || pathname.startsWith("/guides/");
  return pathname === href;
}

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname() ?? "/";
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the full-screen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  // Track auth state — inert (user stays null forever) until Supabase is configured.
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname.startsWith("/embed")) return null;

  const firstName = user?.user_metadata?.full_name?.split(" ")?.[0] || user?.email?.split("@")[0];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[padding,background-color,backdrop-filter,border-color] duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink/80 backdrop-blur-md py-3" : "border-b border-transparent bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 rounded text-xl font-semibold tracking-tight text-offwhite">
          <span className="grid size-8 place-items-center rounded-full bg-accent text-ink">✦</span>
          TrainerLedger
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link key={link.href} href={link.href} className="group relative py-1 rounded text-offwhite/90 transition hover:text-offwhite">
                {link.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-0.5 w-full origin-left bg-accent transition-transform duration-200 motion-reduce:transition-none ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {isSupabaseConfigured && (
            user ? (
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/saved-estimates" className="rounded text-sm text-offwhite/60 hover:text-offwhite">
                  Hi, {firstName}
                </Link>
                <button type="button" onClick={signOut} className="rounded text-sm text-offwhite/80 hover:text-offwhite">
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/sign-in" className="hidden rounded text-sm text-offwhite/80 hover:text-offwhite sm:block">
                Sign in
              </Link>
            )
          )}
          <Link
            href="/calculator"
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
            {menu ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      {menu && (
        <div className="fixed inset-0 z-40 flex flex-col bg-ink px-8 pt-28 pb-10 md:hidden motion-safe:animate-[fade-in_180ms_ease-out]">
          <nav className="flex flex-1 flex-col justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-serif text-4xl tracking-[-.02em] ${isActive(pathname, link.href) ? "text-accent-light" : "text-offwhite"}`}
              >
                {link.label}
              </Link>
            ))}
            {isSupabaseConfigured && (
              user ? (
                <>
                  <Link href="/saved-estimates" className="font-serif text-4xl tracking-[-.02em] text-offwhite">
                    Saved estimates
                  </Link>
                  <button type="button" onClick={signOut} className="text-left font-serif text-4xl tracking-[-.02em] text-offwhite">
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/auth/sign-in" className="font-serif text-4xl tracking-[-.02em] text-offwhite">
                  Sign in
                </Link>
              )
            )}
          </nav>
          <Link
            href="/calculator"
            className="w-full rounded-full bg-accent py-4 text-center text-base font-semibold text-ink"
          >
            Try the calculator
          </Link>
        </div>
      )}
    </header>
  );
}
