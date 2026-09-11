// One icon set: 24px grid, 1.75 stroke, currentColor, hidden from assistive
// tech by default (the control carrying the icon owns the accessible name).
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

/** The brand star on a 40px grid: a four-point star with a star-shaped hole,
 *  so draw it with fill-rule="evenodd". Exported as a path so the favicon and
 *  OG image (rendered by next/og, outside React DOM) draw the exact same shape. */
export const STAR_PATH =
  "M20 2C22.4 12 27.5 18 36.5 20C27.5 22 22.4 28 20 38C17.6 28 12.5 22 3.5 20C12.5 18 17.6 12 20 2Z" +
  "M20 13.5C20.8 17.5 22.5 19.2 26.5 20C22.5 20.8 20.8 22.5 20 26.5C19.2 22.5 17.5 20.8 13.5 20C17.5 19.2 19.2 17.5 20 13.5Z";

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

export const CheckCircleIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.3 2.4 2.4 4.6-4.9" />
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

export const ChevronDownIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m6 9 6 6 6-6" />
  </Stroke>
);

export const DollarIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.6 9.6c-.4-.9-1.4-1.5-2.6-1.5-1.5 0-2.6.8-2.6 1.9 0 2.6 5.2 1.3 5.2 4 0 1.1-1.1 1.9-2.6 1.9-1.2 0-2.2-.6-2.6-1.5M12 6.5v11" />
  </Stroke>
);

export const DumbbellIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="5" y="7" width="3" height="10" rx="1" />
    <rect x="16" y="7" width="3" height="10" rx="1" />
    <path d="M2.5 10v4M21.5 10v4M8 12h8" />
  </Stroke>
);

export const CapIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M2.5 9.5 12 5l9.5 4.5L12 14Z" />
    <path d="M6.5 11.5v4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4M21.5 9.5v5" />
  </Stroke>
);

export const HomeIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z" />
  </Stroke>
);

export const CarIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 16v-3.5l2-5A1.5 1.5 0 0 1 7.4 6.5h9.2a1.5 1.5 0 0 1 1.4 1l2 5V16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" />
    <path d="M4 12.5h16M6.5 17v2M17.5 17v2M7.5 14.8h.01M16.5 14.8h.01" />
  </Stroke>
);

export const LaptopIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="4.5" y="5" width="15" height="10.5" rx="1.5" />
    <path d="M2.5 19h19" />
  </Stroke>
);

export const StudioIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 20V7.5L12 4l8 3.5V20M2.5 20h19" />
    <path d="M9 20v-5h6v5M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth={2} />
  </Stroke>
);

export const BoltIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6Z" />
  </Stroke>
);

export const ShieldIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Stroke>
);

export const UsersIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.8c1.6.6 2.7 2.3 3 4.7" />
  </Stroke>
);

export const LockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="5" y="10.5" width="14" height="10" rx="2" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
  </Stroke>
);

export const BulbIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z" />
  </Stroke>
);

export const TrendIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3.5 17.5 9 12l3.5 3.5 8-8" />
    <path d="M15 7.5h5.5V13" />
  </Stroke>
);

export const CoinsIcon = (p: IconProps) => (
  <Stroke {...p}>
    <ellipse cx="12" cy="6.5" rx="7" ry="2.8" />
    <path d="M5 6.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5M5 11.5v5c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-5" />
  </Stroke>
);

export const ReceiptIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6 3.5h12v17l-2.5-1.5-2 1.5-1.5-1.5-1.5 1.5-2-1.5L6 20.5Z" />
    <path d="M9 8h6M9 11.5h6M9 15h4" />
  </Stroke>
);

export const BookmarkIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7 3.5h10a1 1 0 0 1 1 1v16l-6-4-6 4v-16a1 1 0 0 1 1-1Z" />
  </Stroke>
);

export const UserIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="8" r="3.8" />
    <path d="M4.5 20.5c.8-4 3.8-6.3 7.5-6.3s6.7 2.3 7.5 6.3" />
  </Stroke>
);

export const PlusCircleIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </Stroke>
);

export const DocumentIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M6.5 3.5h7l4 4v13h-11Z" />
    <path d="M13.5 3.5v4h4M9 12h6M9 15.5h6" />
  </Stroke>
);

export const BriefcaseIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="3.5" y="7" width="17" height="12.5" rx="2" />
    <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3.5 12.5h17" />
  </Stroke>
);

export const TrashIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </Stroke>
);

export const CodeIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m8.5 7.5-5 4.5 5 4.5M15.5 7.5l5 4.5-5 4.5M13.5 5l-3 14" />
  </Stroke>
);

/** Indeterminate spinner; stops spinning under prefers-reduced-motion. */
export const Spinner = ({ className = "", ...p }: IconProps) => (
  <Stroke className={`motion-safe:animate-spin ${className}`} {...p}>
    <circle cx="12" cy="12" r="9" opacity={0.25} />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </Stroke>
);
