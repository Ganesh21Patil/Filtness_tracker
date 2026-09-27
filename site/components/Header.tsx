"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { SAVE_INTENT_KEY, SIGNED_IN_COOKIE, signInHref } from "../lib/auth";
import Logo from "./Logo";
import AccountMenu from "./AccountMenu";
import { toast } from "./Toaster";
import { button } from "./ui";
import { ArrowRightIcon, BookmarkIcon, CloseIcon, LogOutIcon, MenuIcon } from "./icons";

const navLinks = [
  { href: "/calculator", label: "Calculator" },
  { href: "/deductions", label: "Deductions" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

// The full nav shows from lg (1024px). Between md and lg the four links, the
// sign-in link and the CTA didn't fit — the CTA ran off a 768px screen — so
// tablets get the menu button, like phones.

// Pages that already are the calculator: the header CTA would point at itself.
const CALCULATOR_ROUTES = [
  "/calculator",
  "/deductions",
  "/calculators/quarterly-tax-calculator-personal-trainers",
  "/calculators/personal-trainer-deduction-finder",
];

// A nav item stays lit across its whole section, not just on its own URL:
// the calculator landing pages, the LLC page and the breakdown all belong to
// Calculator; the deduction finder belongs to Deductions.
const NAV_SECTIONS: Record<string, string[]> = {
  "/calculator": [
    "/calculator",
    "/dashboard",
    "/calculators/quarterly-tax-calculator-personal-trainers",
    "/calculators/llc-vs-scorp-fitness-professionals",
  ],
  "/deductions": ["/deductions", "/calculators/personal-trainer-deduction-finder"],
};

function isActive(pathname: string, href: string) {
  if (href === "/guides") return pathname === "/guides" || pathname.startsWith("/guides/");
  return (NAV_SECTIONS[href] ?? [href]).includes(pathname);
}

/** aria-current: "page" on the page itself, "true" on its section's other pages. */
const currentFor = (pathname: string, href: string) => (pathname === href ? "page" : isActive(pathname, href) ? "true" : undefined);

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

  // Back from Google: confirm it, once the name is known. Skipped when they
  // signed in to save — the Save button's own callout says it there.
  const justSignedIn = useRef(false);
  useEffect(() => {
    if (!document.cookie.split("; ").includes(`${SIGNED_IN_COOKIE}=1`)) return;
    document.cookie = `${SIGNED_IN_COOKIE}=; path=/; max-age=0`;
    let savingIntent = false;
    try {
      savingIntent = sessionStorage.getItem(SAVE_INTENT_KEY) === "1";
    } catch {
      // storage unavailable — confirm the sign-in anyway
    }
    justSignedIn.current = !savingIntent;
  }, []);
  useEffect(() => {
    if (!user || !justSignedIn.current) return;
    justSignedIn.current = false;
    toast(`Signed in as ${user.user_metadata?.full_name || user.user_metadata?.name || user.email}.`);
  }, [user]);

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast("Couldn't sign you out. Please try again.", { tone: "error" });
      return;
    }
    setUser(null);
    setMenu(false);
    router.refresh();
    toast("You're signed out.");
  };

  // The /embed route is meant to be iframed onto other sites — no site chrome there.
  if (pathname.startsWith("/embed")) return null;

  const onCalculator = CALCULATOR_ROUTES.includes(pathname);
  const fullName: string | undefined = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const email = user?.email;
  // Signing in from a page brings you back to it (the sign-in page itself excepted).
  const signInLink = signInHref(pathname);

  return (
    <>
      {/* First stop for keyboard users: jumps past the header to the page's
          content. Hidden until it has focus. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3.5 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-full focus:bg-offwhite focus:px-5 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-card"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full border-b ${animateHeader ? "transition-[background-color,backdrop-filter,border-color] duration-300" : ""} ${
          scrolled ? "border-white/[.08] bg-ink/75 backdrop-blur-xl" : "border-transparent bg-transparent"
        }`}
      >
        {/* Fixed height on purpose: animating padding on a sticky (in-flow)
            header shifted the whole page 24px the moment you scrolled. Only the
            background changes now. The calculator's observer assumes 72px.
            relative z-50 keeps the bar — logo and close button — above the
            full-screen mobile menu (z-40). */}
        <div className="shell relative z-50 flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-9 text-sm lg:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={currentFor(pathname, link.href)}
                  className={`group relative rounded py-2 font-medium transition-colors hover:text-offwhite ${active ? "text-offwhite" : "text-haze"}`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-accent transition-transform duration-200 motion-reduce:transition-none ${
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
                <div className="hidden sm:block">
                  <AccountMenu name={fullName} email={email} onSignOut={signOut} />
                </div>
              ) : (
                <Link href={signInLink} className="hidden rounded text-sm font-medium text-haze hover:text-offwhite sm:block">
                  Sign in
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
              className="grid size-11 place-items-center rounded-full border border-white/20 bg-white/[.03] text-offwhite transition-colors hover:bg-white/10 lg:hidden"
            >
              {menu ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>

        {/* Full-screen mobile menu */}
        {menu && (
          <div
            id="mobile-menu"
            className="aurora fixed inset-0 z-40 flex flex-col bg-ink px-8 pb-10 pt-28 lg:hidden motion-safe:animate-fade-in"
          >
            <nav aria-label="Main" className="flex flex-1 flex-col justify-center gap-7">
              {navLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={currentFor(pathname, link.href)}
                  style={{ animationDelay: `${60 + i * 40}ms` }}
                  className={`type-headline motion-safe:animate-rise-in ${isActive(pathname, link.href) ? "text-accent-light" : "text-offwhite"}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Account actions sit apart from the site's pages, one step
                quieter, so the menu reads as "where to go", then "you". */}
            {isSupabaseConfigured && (
              <div style={{ animationDelay: "220ms" }} className="mb-5 border-t border-white/10 pt-6 motion-safe:animate-rise-in">
                {user ? (
                  <>
                    <p className="truncate text-hint text-fog">
                      Signed in as <span className="font-semibold text-haze">{fullName || email}</span>
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Link href="/saved-estimates" className={button({ variant: "secondary", size: "md" })}>
                        <BookmarkIcon className="size-4" />
                        Saved
                      </Link>
                      <button type="button" onClick={signOut} className={button({ variant: "secondary", size: "md" })}>
                        <LogOutIcon className="size-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href={signInLink} className={button({ variant: "secondary", size: "lg", full: true })}>
                    Sign in
                  </Link>
                )}
              </div>
            )}
            {!onCalculator && (
              <Link href="/calculator" style={{ animationDelay: "260ms" }} className={`${button({ size: "lg", full: true })} motion-safe:animate-rise-in`}>
                Try the calculator
                <ArrowRightIcon className="size-4" />
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
