// Shared class recipes for buttons, fields and surfaces. A plain module (no
// "use client") so server pages and client components can both import it —
// see the RSC note in docs/PROJECT_CONTEXT.md.
//
// Recipes return class strings rather than wrapping elements, so a button can
// stay a <button> and a navigation action can stay a <Link>.

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full py-2 font-semibold " +
  "transition-[background-color,border-color,color,transform] duration-150 ease-out " +
  "motion-safe:active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";

// Four variants, one shape. There is exactly one primary colour on the site:
// every main action — hero, calculator, calendar, CTA band — is the same cyan
// pill, so people learn once what "the thing to press" looks like.
const buttonVariants: Record<ButtonVariant, string> = {
  // The one main action in a view. Sky-cyan fill, ink text (7.9:1).
  primary: "bg-accent text-ink hover:bg-accent-light",
  // Supporting action: hairline outline.
  secondary: "border border-white/25 bg-white/[.02] text-offwhite hover:border-white/50 hover:bg-white/[.07]",
  // Light pill: the header CTA and third-party sign-in.
  inverse: "bg-offwhite text-ink hover:bg-white",
  // Tertiary action — no container until hovered.
  ghost: "text-haze hover:bg-white/[.07] hover:text-offwhite",
};

// Minimum heights, not fixed: a full-width button in a narrow column may need
// two lines, and a fixed height would clip the second one.
const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-[40px] text-sm",
  md: "min-h-[44px] text-sm", // the site's minimum touch target
  lg: "min-h-[52px] text-base",
};

// Side padding sizes a button to its label. A full-width button is already
// as wide as its column, so it only needs to clear its rounded ends — the lg
// padding wrapped "Add due dates to calendar" onto two lines on a phone.
const buttonPadding: Record<ButtonSize, string> = { sm: "px-4", md: "px-5", lg: "px-7" };

export function button({
  variant = "primary",
  size = "md",
  full = false,
}: { variant?: ButtonVariant; size?: ButtonSize; full?: boolean } = {}) {
  const layout = full ? " w-full px-4 text-center" : ` ${buttonPadding[size]} whitespace-nowrap`;
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}${layout}`;
}

/** Inline text links. */
export const linkOnDark = "font-semibold text-accent-light underline-offset-4 hover:underline";

/** Text inputs and selects. The border meets 3:1 (WCAG 1.4.11); focus swaps
 *  the outline for an accent border and halo — the same cyan as every other
 *  focus ring on the site. */
export const field =
  "block w-full min-h-[52px] rounded-control border border-edge bg-white/[.03] px-4 py-3 " +
  "text-field font-medium tabular-nums text-offwhite placeholder:text-fog " +
  "transition-[border-color,box-shadow,background-color] hover:border-dusk focus:border-accent focus:bg-white/[.05] focus:outline-none focus:ring-4 focus:ring-accent/20 " +
  "aria-[invalid=true]:border-danger";

export const fieldLabel = "mb-1 block text-label font-semibold text-offwhite";
export const fieldHint = "mb-2.5 block text-hint text-dusk";

/** Inline validation message under a field. */
export const fieldError = "mt-1.5 flex items-center gap-1 text-hint font-medium text-danger";

/** Frosted glass card. Pair with padding. */
export const glassCard = "glass rounded-card";
