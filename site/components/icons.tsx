// One icon set: 24px grid, 1.75 stroke, currentColor, hidden from assistive
// tech by default (the control carrying the icon owns the accessible name).
// Replaces text glyphs (✦ ☰ ✕ ✓ 💡), which rendered differently per font.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** The brand spark. Exported as a path so the favicon and OG image
 *  (rendered by next/og, outside React DOM) draw the exact same shape. */
export const SPARK_PATH =
  "M36 0c2.8 24.8 11.2 33.2 36 36-24.8 2.8-33.2 11.2-36 36-2.8-24.8-11.2-33.2-36-36C24.8 33.2 33.2 24.8 36 0Z";

export function Spark(props: IconProps) {
  return (
    <svg viewBox="0 0 72 72" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
      <path d={SPARK_PATH} />
    </svg>
  );
}

export const MenuIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Stroke>
);

export const CloseIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Stroke>
);

export const CheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Stroke>
);

export const HelpIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1 1-1.1 1.7v.3" />
    <path d="M12 17h.01" strokeWidth={2.25} />
  </Stroke>
);

export const InfoIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.8h.01" strokeWidth={2.25} />
  </Stroke>
);

export const AlertIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.3h.01" strokeWidth={2.25} />
  </Stroke>
);

export const CalendarIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Stroke>
);

export const PrinterIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 9V4h10v5" />
    <rect x="3.5" y="9" width="17" height="8" rx="2" />
    <path d="M7 14h10v6H7z" />
  </Stroke>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
);

export const ArrowDownIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Stroke>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m9 6 6 6-6 6" />
  </Stroke>
);

export const DollarIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.6 9.6c-.4-.9-1.4-1.5-2.6-1.5-1.5 0-2.6.8-2.6 1.9 0 2.6 5.2 1.3 5.2 4 0 1.1-1.1 1.9-2.6 1.9-1.2 0-2.2-.6-2.6-1.5M12 6.5v11" />
  </Stroke>
);

/** Indeterminate spinner; stops spinning under prefers-reduced-motion. */
export const Spinner = ({ className = "", ...p }: IconProps) => (
  <Stroke className={`motion-safe:animate-spin ${className}`} {...p}>
    <circle cx="12" cy="12" r="9" opacity={0.25} />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </Stroke>
);
