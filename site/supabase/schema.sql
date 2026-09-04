-- TrainerLedger — Phase 2 schema (save estimate + auth)
-- Run this in the Supabase SQL editor once the project exists.
--
-- Design decision (confirmed with the site owner): saved estimates FREEZE
-- their computed results at save-time rather than recomputing against
-- current tax constants. A user should never see a saved number silently
-- change because TAX_CONFIG got updated for a new year — that's exactly the
-- "confidently wrong numbers" failure mode this whole project has avoided
-- elsewhere. `tax_year` records which year's rules produced the snapshot.

create table if not exists public.saved_estimates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  label text, -- optional user-given nickname, e.g. "Q2 check-in"
  tax_year integer not null,

  -- Raw inputs, so a user could theoretically re-open and adjust from here
  -- later. Shape matches TaxInputs in lib/calculator.ts.
  inputs jsonb not null,

  -- The computed TaxResults at save-time — the frozen, authoritative
  -- snapshot shown back to the user. Shape matches TaxResults.
  results jsonb not null
);

alter table public.saved_estimates enable row level security;

-- Users can only ever see, insert, or delete their own rows. No update
-- policy on purpose: a saved estimate is a frozen snapshot, not something
-- that gets edited in place — delete and re-save instead.
create policy "Users can view their own saved estimates"
  on public.saved_estimates for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saved estimates"
  on public.saved_estimates for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saved estimates"
  on public.saved_estimates for delete
  using (auth.uid() = user_id);

create index if not exists saved_estimates_user_id_idx on public.saved_estimates (user_id, created_at desc);
