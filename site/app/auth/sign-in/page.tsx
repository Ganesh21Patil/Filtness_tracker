import type { Metadata } from "next";
import Image from "next/image";
import { safeNext } from "../../../lib/auth";
import mountains from "../../../public/images/mountains.jpg";
import SignInCard from "./SignInCard";

export const metadata: Metadata = {
  title: "Sign in | TrainerLedger",
  description: "Sign in with Google to save your tax estimates and come back to them on any device.",
  robots: { index: false, follow: true },
};

// `next` is where to return afterwards (same-site paths only, see safeNext);
// `error` comes back from the OAuth callback when sign-in didn't complete.
export default function SignInPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  return (
    <main className="relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image src={mountains} alt="" fill priority sizes="100vw" className="object-cover object-[45%_center] opacity-55" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(5_8_15/.55),rgb(5_8_15/.95))]" />
      </div>
      <SignInCard next={safeNext(searchParams.next)} error={searchParams.error} />
    </main>
  );
}
