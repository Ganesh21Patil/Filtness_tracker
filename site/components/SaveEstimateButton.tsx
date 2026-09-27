"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { SAVE_INTENT_KEY, signInHref } from "../lib/auth";
import { TAX_CONFIG, TaxInputs, TaxResults } from "../lib/calculator";
import { toast } from "./Toaster";
import { button } from "./ui";
import { BookmarkIcon, CheckIcon, Spinner } from "./icons";

// Writes to the saved_estimates table (see supabase/schema.sql). Renders
// nothing if Supabase isn't configured (see lib/supabase/config.ts). Sits in
// the results panel's header row.
//
// "Sign in to save" remembers the intent: back from Google, this button is
// scrolled into view, focused and pointed out. It still waits for a click —
// the privacy policy promises numbers leave the browser only when you press
// Save, never automatically.
export default function SaveEstimateButton({ inputs, results }: { inputs: TaxInputs; results: TaxResults }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [prompt, setPrompt] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "/";

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  // "Saved" belongs to the numbers that were saved. Change them and this is a
  // new estimate, so the button offers to save again.
  const fingerprint = JSON.stringify(inputs);
  useEffect(() => {
    setStatus((s) => (s === "saved" ? "idle" : s));
  }, [fingerprint]);

  // Just signed in to save? Point at the button, once.
  useEffect(() => {
    if (!user) return;
    let intended = false;
    try {
      intended = sessionStorage.getItem(SAVE_INTENT_KEY) === "1";
      sessionStorage.removeItem(SAVE_INTENT_KEY);
    } catch {
      // storage unavailable — no prompt, the button still works
    }
    if (!intended) return;
    setPrompt(true);
    const el = buttonRef.current;
    if (el) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "center" });
      el.focus({ preventScroll: true });
    }
    const t = setTimeout(() => setPrompt(false), 12000);
    return () => clearTimeout(t);
  }, [user]);

  if (!isSupabaseConfigured) return null;

  if (!user) {
    // On the homepage the calculator is a section, so come back to it.
    const returnTo = pathname === "/" ? "/#calculator" : pathname;
    return (
      <Link
        href={signInHref(returnTo)}
        onClick={() => {
          try {
            sessionStorage.setItem(SAVE_INTENT_KEY, "1");
          } catch {
            // fine — signing in still works, there's just no prompt afterwards
          }
        }}
        className={button({ variant: "secondary", size: "sm" })}
      >
        <BookmarkIcon className="size-4" />
        Sign in to save
      </Link>
    );
  }

  const save = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setPrompt(false);
    setStatus("saving");
    const { error } = await supabase.from("saved_estimates").insert({
      user_id: user.id,
      tax_year: TAX_CONFIG.TAX_YEAR,
      inputs,
      results,
    });
    setStatus(error ? "error" : "saved");
    if (error) toast("Couldn't save this estimate. Please try again.", { tone: "error" });
    else toast("Estimate saved to your account.", { action: { href: "/saved-estimates", label: "View" } });
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={save}
        disabled={status === "saving" || status === "saved"}
        aria-describedby={prompt ? "save-prompt" : undefined}
        className={`${button({ variant: prompt ? "primary" : "secondary", size: "sm" })} disabled:opacity-100`}
      >
        {status === "saved" ? (
          <>
            <CheckIcon className="size-4 text-accent-light motion-safe:animate-pop-in" strokeWidth={2.25} />
            Saved
          </>
        ) : status === "saving" ? (
          <>
            <Spinner className="size-4" />
            Saving…
          </>
        ) : status === "error" ? (
          "Couldn't save — retry"
        ) : (
          <>
            <BookmarkIcon className="size-4" />
            Save plan
          </>
        )}
      </button>
      {prompt && (
        <p
          id="save-prompt"
          className="absolute right-0 top-full z-10 mt-2 w-60 rounded-control border border-accent/35 bg-panel p-3 text-hint leading-relaxed text-haze shadow-card motion-safe:animate-drop-in"
        >
          <strong className="font-semibold text-offwhite">You&apos;re signed in.</strong> Save this estimate to keep it in your account.
        </p>
      )}
    </div>
  );
}
