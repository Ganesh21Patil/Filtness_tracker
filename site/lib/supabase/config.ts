// Phase 2 (save estimate + auth) groundwork. Not live yet — see
// site/supabase/schema.sql and the note at the bottom of app/auth/sign-in
// for what's needed to turn this on.
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0;
