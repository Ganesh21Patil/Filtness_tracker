"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import Logo from "../../../components/Logo";
import { button } from "../../../components/ui";
import { LockIcon } from "../../../components/icons";
import mountains from "../../../public/images/mountains.jpg";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
    // On success, Supabase redirects the browser to Google — nothing else to do here.
  };

  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={mountains} alt="" fill priority sizes="100vw" className="object-cover object-[45%_center] opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(5_8_15/.55),rgb(5_8_15/.95))]" />
      </div>

      <div className="glass-glow w-full max-w-sm rounded-card p-8 text-center sm:p-10">
        <Logo className="mb-8" />

        <h1 className="type-title text-4xl text-offwhite">Welcome back</h1>
        <p className="mb-8 mt-3 text-sm leading-relaxed text-haze">Log in to save your estimates and pick up where you left off.</p>

        {isSupabaseConfigured ? (
          <>
            <button type="button" onClick={signInWithGoogle} disabled={loading} className={`${button({ variant: "inverse", size: "lg", full: true })} gap-3`}>
              <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.11A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.3V6.59H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4.01-3.1Z" /><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.59l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z" /></svg>
              {loading ? "Redirecting…" : "Continue with Google"}
            </button>
            {error && <p role="alert" className="mt-4 text-xs text-danger">{error}</p>}
          </>
        ) : (
          <p className="rounded-control border border-white/10 bg-white/[.04] p-4 text-sm text-dusk">
            Sign-in isn&apos;t set up yet — saved estimates are coming soon.
          </p>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-dusk">
          <LockIcon className="size-4" />
          The calculator works without an account.
        </p>
        <Link href="/calculator" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-accent-light hover:underline">
          Use it without logging in
        </Link>
      </div>
    </main>
  );
}
