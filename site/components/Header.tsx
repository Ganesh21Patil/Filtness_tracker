"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import Logo from "./Logo";
import { button } from "./ui";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./icons";

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
  // Transitions switch on after the first frame. Loading a page already
  // scrolled used to fade the header in over content for 300ms.
  const [animateHeader, setAnimateHeader] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    const frame = requestAnimationFrame(() => setAnimateHeader(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
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
      className={`sticky top-0 z-50 w-full border-b ${animateHeader ? "transition-[background-color,backdrop-filter,border-color] duration-300" : ""} ${
        scrolled ? "border-white/[.08] bg-ink/75 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      {/* Fixed height on purpose: animating padding on a sticky (in-flow)
          header shifted the whole page 24px the moment you scrolled. Only the
          background changes now. The calculator's observer assumes 72px. */}
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-9 text-sm md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded py-2 font-medium transition-colors hover:text-offwhite ${active ? "text-offwhite" : "text-haze"}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-accent shadow-[0_0_12px_rgba(31,182,255,.8)] transition-transform duration-200 motion-reduce:transition-none ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {isSupabaseConfigured && (
            user ? (
              <div className="hidden items-center gap-4 sm:flex">
                <Link href="/saved-estimates" className="rounded text-sm text-dusk hover:text-offwhite">
                  Hi, {firstName}
                </Link>
                <button type="button" onClick={signOut} className="rounded text-sm text-haze hover:text-offwhite">
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/auth/sign-in" className="hidden rounded text-sm font-medium text-haze hover:text-offwhite sm:block">
                Log in
              </Link>
            )
          )}
          {!onCalculator && (
            <Link href="/calculator" className={`${button({ variant: "inverse", size: "md" })} hidden sm:inline-flex`}>
              Try the calculator
              <ArrowRightIcon className="size-4" />
            </Link>
          )}
          <button
            ref={toggleRef}
            type="button"
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((v) => !v)}
            className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[.03] text-offwhite transition-colors hover:bg-white/10 md:hidden"
          >
            {menu ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen mobile menu */}
      {menu && (
        <div
          id="mobile-menu"
          className="aurora fixed inset-0 z-40 flex flex-col bg-ink px-8 pb-10 pt-28 md:hidden motion-safe:animate-[fade-in_180ms_ease-out]"
        >
          <nav aria-label="Main" className="flex flex-1 flex-col justify-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={`type-headline ${isActive(pathname, link.href) ? "text-accent-light" : "text-offwhite"}`}
              >
                {link.label}
              </Link>
            ))}
            {isSupabaseConfigured && (
              user ? (
                <>
                  <Link href="/saved-estimates" className="type-headline text-offwhite">
                    Saved estimates
                  </Link>
                  <button type="button" onClick={signOut} className="text-left type-headline text-offwhite">
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/auth/sign-in" className="type-headline text-offwhite">
                  Log in
                </Link>
              )
            )}
          </nav>
          {!onCalculator && (
            <Link href="/calculator" className={button({ size: "lg", full: true })}>
              Try the calculator
              <ArrowRightIcon className="size-4" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
