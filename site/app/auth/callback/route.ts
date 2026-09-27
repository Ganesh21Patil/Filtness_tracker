import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { NEXT_COOKIE, SIGNED_IN_COOKIE, safeNext } from "../../../lib/auth";

// Handles the redirect back from Google OAuth: exchanges the auth code for a
// session, then returns the visitor to the page they signed in from. That
// page travels in a short-lived cookie set by the sign-in page (a `next`
// query param also works); either way only same-site paths are accepted.
// If Google or Supabase sends back an error instead of a code — most often
// because the visitor closed or declined the Google screen — they land on
// the sign-in page with a plain-language message. Redirects straight on if
// Supabase isn't configured.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next") ?? readNextCookie());

  const done = (url: string | URL) => {
    const response = NextResponse.redirect(url);
    response.cookies.delete(NEXT_COOKIE);
    return response;
  };
  const backToSignIn = (reason: "cancelled" | "failed") => {
    const url = new URL("/auth/sign-in", origin);
    url.searchParams.set("error", reason);
    url.searchParams.set("next", next);
    return done(url);
  };

  const providerError = searchParams.get("error");
  if (providerError) return backToSignIn(providerError === "access_denied" ? "cancelled" : "failed");

  if (code) {
    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) return backToSignIn("failed");
      const response = done(`${origin}${next}`);
      // Read (and cleared) by the header, which confirms the sign-in.
      response.cookies.set(SIGNED_IN_COOKIE, "1", { path: "/", maxAge: 60, sameSite: "lax" });
      return response;
    }
  }

  return done(`${origin}${next}`);
}

function readNextCookie() {
  const raw = cookies().get(NEXT_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}
