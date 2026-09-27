// Shared by the sign-in page, the OAuth callback and every "Sign in" link.

/** Where to send someone after signing in. Only a path on this site is
 *  accepted ("/calculator", "/#calculator"), never "//evil.com" or a full
 *  URL, so the link can't be used to bounce people to another site. The
 *  sign-in pages themselves fall back too, so nobody lands back on them. */
export function safeNext(next: string | null | undefined, fallback = "/calculator") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\") || next.startsWith("/auth")) {
    return fallback;
  }
  return next;
}

/** The sign-in page, remembering where to come back to. */
export function signInHref(next?: string | null) {
  const target = safeNext(next, "");
  return target ? `/auth/sign-in?next=${encodeURIComponent(target)}` : "/auth/sign-in";
}

/** Carries `next` across the Google round trip. The OAuth redirect URL
 *  itself stays exactly /auth/callback, the address registered with
 *  Supabase, so adding a query string can never fail its allow-list. */
export const NEXT_COOKIE = "trainerledger-next";

/** Set by the OAuth callback on a successful sign-in, for one minute, so the
 *  header can confirm it ("Signed in as …") and then clear it. */
export const SIGNED_IN_COOKIE = "trainerledger-signed-in";

/** Set (in sessionStorage) when someone clicks "Sign in to save": back on
 *  the calculator, the Save button is brought into view and pointed out.
 *  It never saves by itself — the privacy policy promises saving happens
 *  only when you click the button. */
export const SAVE_INTENT_KEY = "trainerledger-save-intent";

/** Plain-language versions of the ways sign-in can fail. Provider messages
 *  are technical ("invalid flow state"), so they're never shown as-is. */
export const SIGN_IN_ERRORS: Record<string, string> = {
  cancelled: "Sign-in was cancelled. You can try again, or keep using the calculator without an account.",
  failed: "We couldn't sign you in just now. Please try again in a moment.",
  unreachable: "We couldn't reach Google. Check your connection and try again.",
};
