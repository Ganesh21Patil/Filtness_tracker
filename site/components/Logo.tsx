import Link from "next/link";
import { Spark } from "./icons";

/** The spark in a cyan disc. Decorative: the wordmark beside it names the link. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`grid flex-shrink-0 place-items-center rounded-full bg-accent text-ink ${className}`}>
      <Spark className="size-[50%]" />
    </span>
  );
}

/** Mark + wordmark, linking home. Used by the header, footer, and sign-in card. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 rounded text-xl font-semibold tracking-tight text-offwhite ${className}`}>
      <LogoMark />
      TrainerLedger
    </Link>
  );
}
