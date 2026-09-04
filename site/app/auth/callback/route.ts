import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

// Handles the redirect back from Google OAuth, exchanges the auth code for a
// session, then sends the user on to the calculator. No-op (redirects home)
// if Supabase isn't configured yet.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.exchangeCodeForSession(code);
    }
  }

  return NextResponse.redirect(`${origin}/calculator`);
}
