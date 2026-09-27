"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../../lib/supabase/client";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import { NEXT_COOKIE, SIGN_IN_ERRORS } from "../../../lib/auth";
import Logo from "../../../components/Logo";
import { toast } from "../../../components/Toaster";
import { button, linkOnDark } from "../../../components/ui";
import { AlertIcon, BookmarkIcon, CheckIcon, LockIcon, Spinner } from "../../../components/icons";

const BENEFITS = [
  "Save a snapshot of any estimate, kept with the tax rules it used",
  "Open your saved estimates from any device",
  "Compare them on your full breakdown",
];

function GoogleLogo() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.3V6.59H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.59l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z" />
    </svg>
  );
}

/**
 * Sign-in card. Google is the only method, and it covers new and returning
 * visitors alike, so the copy never assumes which one you are. `next` is the
 * page to return to afterwards; `error` is a code from the OAuth callback,
 * shown in plain language.
 */
export default function SignInCard({ next, error: errorCode }: { next: string; error?: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errorCode ? SIGN_IN_ERRORS[errorCode] ?? SIGN_IN_ERRORS.failed : null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  // Coming back with the browser's Back button from Google restores this page
  // from cache, still saying "Opening Google…". Reset it.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => e.persisted && setLoading(false);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    // Ten minutes is plenty for the Google screens; the callback clears it.
    document.cookie = `${NEXT_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=600; samesite=lax`;
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(SIGN_IN_ERRORS.unreachable);
      setLoading(false);
    }
    // On success the browser is already on its way to Google.
  };

  const signOut = async () => {
    const supabase = createClient();
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      toast("Couldn't sign you out. Please try again.", { tone: "error" });
      return;
    }
    setUser(null);
    router.refresh();
    toast("You're signed out.");
  };

  if (user) {
    const name: string | undefined = user.user_metadata?.full_name || user.user_metadata?.name;
    return (
      <div className="glass-glow w-full max-w-md rounded-card p-8 text-center sm:p-10">
        <Logo />
        <h1 className="mt-8 type-title text-3xl text-offwhite sm:text-4xl">You&apos;re signed in</h1>
        <p className="mt-3 text-sm leading-relaxed text-haze">
          as <span className="font-semibold text-offwhite">{name || user.email}</span>
          {name && user.email && <span className="block text-dusk">{user.email}</span>}
        </p>
        <div className="mt-8 grid gap-3">
          <Link href={next} className={button({ size: "lg", full: true })}>
            Continue
          </Link>
          <Link href="/saved-estimates" className={button({ variant: "secondary", size: "lg", full: true })}>
            <BookmarkIcon className="size-4" />
            Your saved estimates
          </Link>
        </div>
        <button type="button" onClick={signOut} className={`mt-4 ${button({ variant: "ghost", size: "sm" })}`}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="glass-glow w-full max-w-md rounded-card p-8 sm:p-10">
      <div className="text-center">
        <Logo />
        <h1 className="mt-8 type-title text-3xl text-offwhite sm:text-4xl">Sign in to save your estimates</h1>
        <p className="mt-3 text-sm leading-relaxed text-haze">
          Optional, and free. The calculator works the same without an account.
        </p>
      </div>

      <ul className="mx-auto mt-7 max-w-xs space-y-2.5 text-sm text-haze">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 size-4 flex-shrink-0 text-accent" strokeWidth={2.25} />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {error && (
          <p role="alert" className="mb-4 flex items-start gap-2.5 rounded-control border border-danger/30 bg-danger/[.08] p-3 text-hint leading-relaxed text-danger">
            <AlertIcon className="mt-px size-4 flex-shrink-0" />
            {error}
          </p>
        )}

        {isSupabaseConfigured ? (
          <>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              aria-busy={loading || undefined}
              className={`${button({ variant: "inverse", size: "lg", full: true })} gap-3 disabled:opacity-80`}
            >
              {loading ? <Spinner className="size-5 text-ink" /> : <GoogleLogo />}
              {loading ? "Opening Google…" : "Continue with Google"}
            </button>
            <p className="mt-3 text-center text-hint text-dusk">New here? This creates your free account.</p>
          </>
        ) : (
          <p className="rounded-control border border-white/10 bg-white/[.04] p-4 text-center text-sm text-dusk">
            Sign-in isn&apos;t set up yet — saved estimates are coming soon.
          </p>
        )}
      </div>

      <div className="mt-8 border-t border-white/[.08] pt-6 text-center">
        <Link href={next} className={`inline-flex min-h-[44px] items-center rounded text-sm ${linkOnDark}`}>
          Continue without signing in
        </Link>
        <p className="mt-2 flex items-start justify-center gap-2 text-hint text-dusk">
          <LockIcon className="mt-px size-4 flex-shrink-0" />
          Your numbers stay in this browser until you choose to save one.
        </p>
        <p className="mt-4 text-hint text-fog">
          By continuing, you agree to the{" "}
          <Link href="/terms" className="rounded underline underline-offset-2 hover:text-offwhite">
            Terms
          </Link>
          . See exactly what&apos;s stored in the{" "}
          <Link href="/privacy" className="rounded underline underline-offset-2 hover:text-offwhite">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
