"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import type { TaxResults } from "../../lib/calculator";

interface SavedEstimateRow {
  id: string;
  created_at: string;
  label: string | null;
  tax_year: number;
  results: TaxResults;
}

const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function SavedEstimates() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = still checking
  const [estimates, setEstimates] = useState<SavedEstimateRow[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setUser(null);
      return;
    }
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    if (!supabase) return;
    supabase
      .from("saved_estimates")
      .select("id, created_at, label, tax_year, results")
      .order("created_at", { ascending: false })
      .then(({ data }) => setEstimates((data as unknown as SavedEstimateRow[]) ?? []));
  }, [user]);

  const remove = async (id: string) => {
    const supabase = createClient();
    if (!supabase) return;
    setDeletingId(id);
    const { error } = await supabase.from("saved_estimates").delete().eq("id", id);
    if (!error) setEstimates((prev) => (prev ?? []).filter((e) => e.id !== id));
    setDeletingId(null);
  };

  return (
    <main className="flex-1 bg-ink py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/calculator" className="inline-flex items-center min-h-[44px] text-accent-deep hover:underline mb-6 rounded font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">&larr; Back to calculator</Link>

        <p className="text-xs font-semibold uppercase tracking-[.18em] text-accent-light">Your account</p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl tracking-[-.03em] text-offwhite mb-10">Saved estimates</h1>

        {user === undefined ? (
          <p className="text-offwhite/60">Loading…</p>
        ) : user === null ? (
          <div className="rounded-[28px] bg-panel border border-white/10 p-8 text-center">
            <p className="text-offwhite/80 mb-4">Sign in to see your saved estimates.</p>
            <Link href="/auth/sign-in" className="inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-ink">Sign in</Link>
          </div>
        ) : estimates === null ? (
          <p className="text-offwhite/60">Loading your estimates…</p>
        ) : estimates.length === 0 ? (
          <div className="rounded-[28px] bg-panel border border-white/10 p-8 text-center">
            <p className="text-offwhite/80 mb-4">Nothing saved yet — run a calculation and click &quot;Save this estimate&quot; to keep it here.</p>
            <Link href="/calculator" className="inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-ink">Go to the calculator</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {estimates.map((e) => (
              <div key={e.id} className="rounded-[24px] bg-panel border border-white/10 p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-offwhite/50 mb-1">
                    {new Date(e.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} &middot; {e.tax_year} tax year
                  </p>
                  <p className="font-serif text-2xl tabular-nums text-offwhite">{money(e.results.quarterlyPayment)}<span className="text-sm font-sans text-offwhite/50"> / quarter</span></p>
                  <p className="text-sm text-offwhite/60 mt-1">{money(e.results.totalLiability)} total estimated liability</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  disabled={deletingId === e.id}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-50 flex-shrink-0"
                >
                  {deletingId === e.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
