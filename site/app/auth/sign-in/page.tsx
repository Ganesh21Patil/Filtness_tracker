"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { isSupabaseConfigured } from "../../../lib/supabase/config";

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
    <main className="flex-1 bg-ink flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-panel p-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-offwhite mb-8">
          <span className="grid size-8 place-items-center rounded-full bg-accent text-ink">✦</span>
          TrainerLedger
        </Link>

        <h1 className="font-serif text-3xl tracking-[-.02em] text-offwhite mb-2">Sign in</h1>
        <p className="text-sm text-offwhite/60 mb-8">Save your estimates and pick up where you left off.</p>

        {isSupabaseConfigured ? (
          <>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-full bg-offwhite py-3.5 font-semibold text-ink transition hover:bg-accent disabled:opacity-60"
            >
              <svg className="size-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" /><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.1-6.71-4.93H1.28v3.11A12 12 0 0 0 12 24Z" /><path fill="#FBBC05" d="M5.29 14.3A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.3V6.59H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l4.01-3.1Z" /><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.59l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z" /></svg>
              Continue with Google
            </button>
            {error && <p className="mt-4 text-xs text-red-400">{error}</p>}
          </>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-offwhite/60">
            Sign-in isn&apos;t set up yet — saved estimates are coming soon.
          </p>
        )}

        <Link href="/calculator" className="mt-8 inline-block text-sm text-offwhite/50 hover:text-offwhite/80 hover:underline">
          &larr; Back to the calculator
        </Link>
      </div>
    </main>
  );
}
