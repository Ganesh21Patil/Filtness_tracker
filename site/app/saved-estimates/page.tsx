"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "../../lib/supabase/client";
import { isSupabaseConfigured } from "../../lib/supabase/config";
import { signInHref } from "../../lib/auth";
import type { TaxResults } from "../../lib/calculator";
import { toast } from "../../components/Toaster";
import { button } from "../../components/ui";
import { ArrowRightIcon, BookmarkIcon, Spinner, TrashIcon } from "../../components/icons";
import PageHeader, { PageBand } from "../../components/PageHeader";

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
  // Deleting is permanent, so the first click only asks; the row then offers
  // "Delete" and "Keep", with focus on Keep.
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

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
    // Signing out from the header (or in another tab) clears the list at once.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setEstimates(null);
      return;
    }
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
    setDeletingId(null);
    setConfirmingId(null);
    if (error) {
      toast("Couldn't delete that estimate. Please try again.", { tone: "error" });
      return;
    }
    setEstimates((prev) => (prev ?? []).filter((e) => e.id !== id));
    toast("Estimate deleted.");
  };

  return (
    <main className="flex-1 overflow-x-clip">
      <PageBand width="max-w-3xl">
        <PageHeader eyebrow="Your account" title="Saved estimates" lede="Snapshots you chose to keep, frozen with the rules they were calculated under." />
      </PageBand>

      <section className="pb-20 sm:pb-24">
        <div className="shell max-w-3xl">
          {user === undefined ? (
            <LoadingRows label="Checking your account…" />
          ) : user === null ? (
            <EmptyCard
              text="Sign in to see the estimates you've saved."
              action={
                <Link href={signInHref("/saved-estimates")} className={button({ size: "lg" })}>
                  Sign in
                </Link>
              }
            />
          ) : estimates === null ? (
            <LoadingRows label="Loading your estimates…" />
          ) : estimates.length === 0 ? (
            <EmptyCard
              text="Nothing saved yet — run a calculation and click “Save plan” to keep it here."
              action={<Link href="/calculator" className={button({ size: "lg" })}>Go to the calculator</Link>}
            />
          ) : (
            <div className="space-y-4">
              {estimates.map((e) => (
                <div key={e.id} className="glass flex flex-wrap items-center justify-between gap-4 rounded-card p-6">
                  <div>
                    <p className="mb-1 text-hint text-fog">
                      {new Date(e.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} &middot; {e.tax_year} tax year
                    </p>
                    <p className="type-figure text-3xl text-offwhite">
                      {money(e.results.quarterlyPayment)}
                      <span className="font-sans text-sm text-fog"> / quarter</span>
                    </p>
                    <p className="mt-1 text-sm text-dusk">{money(e.results.totalLiability)} total estimated liability</p>
                  </div>
                  {confirmingId === e.id ? (
                    <DeleteConfirm
                      busy={deletingId === e.id}
                      onConfirm={() => remove(e.id)}
                      onCancel={() => setConfirmingId(null)}
                    />
                  ) : (
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <Link href={`/dashboard?estimate=${e.id}`} className={button({ variant: "secondary", size: "sm" })}>
                        View breakdown
                        <ArrowRightIcon className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(e.id)}
                        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
                      >
                        <TrashIcon className="size-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/** Inline "are you sure?" for deleting a saved estimate. Focus lands on
 *  Keep, the safe choice; Escape also keeps it. */
function DeleteConfirm({ busy, onConfirm, onCancel }: { busy: boolean; onConfirm: () => void; onCancel: () => void }) {
  const keepRef = useRef<HTMLButtonElement>(null);
  useEffect(() => keepRef.current?.focus(), []);
  return (
    <div
      role="group"
      aria-label="Delete this estimate?"
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
      className="flex flex-shrink-0 items-center gap-2 motion-safe:animate-fade-in"
    >
      <span className="mr-1 text-sm text-haze">Delete permanently?</span>
      <button ref={keepRef} type="button" onClick={onCancel} disabled={busy} className={button({ variant: "secondary", size: "sm" })}>
        Keep
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={busy}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-danger px-4 text-sm font-semibold text-ink transition-colors hover:bg-danger/85 disabled:opacity-60"
      >
        {busy ? <Spinner className="size-4" /> : <TrashIcon className="size-4" />}
        {busy ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}

function EmptyCard({ text, action }: { text: string; action: React.ReactNode }) {
  return (
    <div className="glass rounded-card p-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full border border-accent/35 bg-accent/10 text-accent-light">
        <BookmarkIcon className="size-6" />
      </span>
      <p className="mx-auto mt-5 max-w-sm text-haze">{text}</p>
      <div className="mt-6">{action}</div>
    </div>
  );
}

/** Placeholder rows shaped like saved-estimate cards, so the page doesn't jump
 *  when they arrive. The label is for screen readers only. */
function LoadingRows({ label }: { label: string }) {
  return (
    <div aria-busy="true" className="space-y-4">
      <span className="sr-only">{label}</span>
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton h-[124px] rounded-card" />
      ))}
    </div>
  );
}
