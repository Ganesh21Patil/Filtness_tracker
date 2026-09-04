"use client";

import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./config";

/** Browser Supabase client. Returns null when env vars aren't set yet,
 *  rather than throwing — callers should check for null and show a
 *  graceful "not available yet" state instead of a broken button. */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}
