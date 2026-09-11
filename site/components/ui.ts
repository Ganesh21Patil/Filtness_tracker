// Shared class recipes for buttons, fields and surfaces. A plain module (no
// "use client") so server pages and client components can both import it —
// see the RSC note in docs/PROJECT_CONTEXT.md.
//
// Recipes return class strings rather than wrapping elements, so a button can
// stay a <button> and a navigation action can stay a <Link>.

type ButtonVariant = "primary" | "electric" | "glow" | "secondary" | "inverse" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full py-2 font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform,filter] duration-150 ease-out " +
  "motion-safe:active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  // Site-level main action (hero, CTA band). Sky-cyan fill, ink text (7.9:1).
  primary: "bg-accent text-ink hover:bg-accent-light hover:shadow-glow",
  // The calculator's main action: an electric-blue gradient pill.
  electric:
    "bg-gradient-to-b from-electric-light to-electric text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25)] hover:brightness-110 hover:shadow-glow-blue",
  // Outlined pill lit from within — the calendar action in the results panel.
  glow:
    "border border-electric-light/70 bg-electric/[.06] text-offwhite shadow-[0_0_26px_-6px_rgba(42,98,255,.65),inset_0_0_18px_-8px_rgba(77,134,255,.7)] hover:bg-electric/15",
  // Supporting action: hairline outline.
  secondary: "border border-white/25 bg-white/[.02] text-offwhite hover:border-white/50 hover:bg-white/[.07]",
  // Light pill: the header CTA and third-party sign-in.
  inverse: "bg-offwhite text-ink hover:bg-white hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,.5)]",
  // Tertiary action — no container until hovered.
  ghost: "text-haze hover:bg-white/[.07] hover:text-offwhite",
};

// Minimum heights, not fixed: a full-width button in a narrow column may need
// two lines, and a fixed height would clip the second one.
const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-[40px] px-4 text-sm",
  md: "min-h-[44px] px-5 text-sm", // the site's minimum touch target
  lg: "min-h-[52px] px-7 text-base",
};

export function button({
  variant = "primary",
  size = "md",
  full = false,
}: { variant?: ButtonVariant; size?: ButtonSize; full?: boolean } = {}) {
  const layout = full ? " w-full text-center" : " whitespace-nowrap";
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}${layout}`;
}

/** Inline text links. */
export const linkOnDark = "font-semibold text-accent-light underline-offset-4 hover:underline";

/** Text inputs and selects. The border meets 3:1 (WCAG 1.4.11); focus swaps
 *  the outline for an electric border and halo. */
export const field =
  "block w-full min-h-[52px] rounded-control border border-edge bg-white/[.03] px-4 py-3 " +
  "text-field font-medium tabular-nums text-offwhite placeholder:text-fog " +
  "transition-[border-color,box-shadow,background-color] hover:border-dusk focus:border-electric-light focus:bg-white/[.05] focus:outline-none focus:ring-4 focus:ring-electric/25 " +
  "aria-[invalid=true]:border-danger";

export const fieldLabel = "mb-1 block text-label font-semibold text-offwhite";
export const fieldHint = "mb-2.5 block text-xs text-dusk";

/** Inline validation message under a field. */
export const fieldError = "mt-1.5 flex items-center gap-1 text-xs font-medium text-danger";

/** Frosted glass card. Pair with padding. */
export const glassCard = "glass rounded-card";
