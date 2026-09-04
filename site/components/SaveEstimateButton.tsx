"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../lib/supabase/client";
import { isSupabaseConfigured } from "../lib/supabase/config";
import { TAX_CONFIG, TaxInputs, TaxResults } from "../lib/calculator";

// Phase 2 groundwork — see supabase/schema.sql for the table this writes to.
// Renders nothing if Supabase isn't configured (see lib/supabase/config.ts),
// so this is inert in production until real credentials are added.
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

  if (!user) {
    return (
      <Link href="/auth/sign-in" className="mt-3 block text-center text-xs text-[#a9dff4] hover:underline">
        Sign in to save this estimate
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
    <button
      type="button"
      onClick={save}
      disabled={status === "saving" || status === "saved"}
      className="mt-3 w-full text-center text-xs font-semibold text-[#a9dff4] hover:text-white disabled:opacity-70"
    >
      {status === "saved" ? "Saved ✓" : status === "saving" ? "Saving…" : status === "error" ? "Couldn't save — try again" : "Save this estimate"}
    </button>
  );
}
