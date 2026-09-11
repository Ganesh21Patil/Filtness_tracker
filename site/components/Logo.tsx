import Link from "next/link";
import { useId } from "react";
import { STAR_PATH } from "./icons";

/** The gold star inside a faint gold ring. The faces are lit from above: a
 *  light upper half and a deeper lower half meet at the waist, like the
 *  bevel in the brand artwork. Decorative — the wordmark names the link. */
export function LogoMark({ className = "size-9", ring = true }: { className?: string; ring?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className={`flex-shrink-0 overflow-visible drop-shadow-[0_0_10px_rgba(217,178,95,.45)] ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="2" x2="0" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbefc9" />
          <stop offset=".47" stopColor="#e9c878" />
          <stop offset=".53" stopColor="#d4a54e" />
          <stop offset="1" stopColor="#a97c32" />
        </linearGradient>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#d9b25f" stopOpacity=".75" />
          <stop offset="1" stopColor="#d9b25f" stopOpacity=".12" />
        </linearGradient>
      </defs>
      {ring && <circle cx="20" cy="20" r="19.4" fill="none" stroke={`url(#${id}-ring)`} strokeWidth=".9" />}
      <path d={STAR_PATH} fillRule="evenodd" fill={`url(#${id}-face)`} />
    </svg>
  );
}

/** "Trainer" in white, "Ledger" in gold. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Trainer
      <span className="bg-gradient-to-b from-gold-light via-gold to-gold bg-clip-text text-transparent">Ledger</span>
    </span>
  );
}

/** Mark + wordmark, linking home. Used by the header, footer, and sign-in card. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 rounded text-[1.35rem] font-semibold tracking-[-.02em] text-offwhite ${className}`}>
      <LogoMark />
      <Wordmark />
    </Link>
  );
}
