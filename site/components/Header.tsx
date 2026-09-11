"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import Logo from "./Logo";
import { button } from "./ui";
import { CloseIcon, MenuIcon } from "./icons";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/deductions", label: "Deductions" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

// Pages that already are the calculator: the header CTA would point at itself.
const CALCULATOR_ROUTES = [
  "/calculator",
  "/deductions",
  "/calculators/quarterly-tax-calculator-personal-trainers",
  "/calculators/personal-trainer-deduction-finder",
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
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the full-screen mobile menu is open it behaves like a modal: body
  // scroll is locked, everything outside the header is inert (Tab can't wander
  // behind the overlay), and Escape closes it and returns focus to the toggle.
  useEffect(() => {
    if (!menu) return;
    document.body.style.overflow = "hidden";
    const header = headerRef.current;
    const outside = Array.from(document.body.children).filter((el) => !el.contains(header));
    outside.forEach((el) => el.setAttribute("inert", ""));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      outside.forEach((el) => el.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
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

  const onCalculator = CALCULATOR_ROUTES.includes(pathname);
  const firstName = user?.user_metadata?.full_name?.split(" ")?.[0] || user?.email?.split("@")[0];

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled ? "border-white/10 bg-ink/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      {/* Fixed height on purpose: animating padding on a sticky (in-flow)
          header shifted the whole page 24px the moment you scrolled. Only the
          background changes now. */}
      <div className="shell flex h-[72px] items-center justify-between">
        <Logo />

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
          {!onCalculator && (
            <Link href="/calculator" className={`${button({ variant: "inverse", size: "md" })} hidden sm:inline-flex`}>
              Try the calculator
            </Link>
          )}
          <button
            ref={toggleRef}
            type="button"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/20 text-offwhite transition-colors hover:bg-white/10 md:hidden"
          >
            {menu ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      {menu && (
        <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col bg-ink px-8 pt-28 pb-10 md:hidden motion-safe:animate-[fade-in_180ms_ease-out]">
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
          {!onCalculator && (
            <Link href="/calculator" className={button({ size: "lg", full: true })}>
              Try the calculator
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
