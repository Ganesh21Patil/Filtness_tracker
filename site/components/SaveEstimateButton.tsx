"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { TAX_CONFIG, TaxInputs, TaxResults } from "../lib/calculator";
import { button } from "./ui";
import { BookmarkIcon, CheckIcon, Spinner } from "./icons";

// Writes to the saved_estimates table (see supabase/schema.sql). Renders
// nothing if Supabase isn't configured (see lib/supabase/config.ts). Sits in
// the results panel's header row.
export default function SaveEstimateButton({ inputs, results }: { inputs: TaxInputs; results: TaxResults }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return null;

  const look = button({ variant: "secondary", size: "sm" });

  if (!user) {
    return (
      <Link href="/auth/sign-in" className={look}>
        <BookmarkIcon className="size-4" />
        Sign in to save
      </Link>
    );
  }

  const save = async () => {
    const supabase = createClient();
    if (!supabase) return;
    setStatus("saving");
    const { error } = await supabase.from("saved_estimates").insert({
      user_id: user.id,
      tax_year: TAX_CONFIG.TAX_YEAR,
      inputs,
      results,
    });
    setStatus(error ? "error" : "saved");
  };

  return (
    <button type="button" onClick={save} disabled={status === "saving" || status === "saved"} className={`${look} disabled:opacity-100`}>
      {status === "saved" ? (
        <>
          <CheckIcon className="size-4 text-accent-light" strokeWidth={2.25} />
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
  );
}
