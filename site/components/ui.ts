// Shared class recipes for buttons and form fields. A plain module (no
// "use client") so server pages and client components can both import it —
// see the RSC note in docs/PROJECT_CONTEXT.md.
//
// Recipes return class strings rather than wrapping elements, so a button can
// stay a <button> and a navigation action can stay a <Link>.

type ButtonVariant = "primary" | "secondary" | "inverse" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "motion-safe:active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";

const buttonVariants: Record<ButtonVariant, string> = {
  // The one main action in a view. Cyan fill, ink text (9.6:1).
  primary: "bg-accent text-ink hover:bg-accent-light hover:shadow-glow",
  // Supporting action on dark surfaces.
  secondary: "border border-white/25 text-offwhite hover:border-white/50 hover:bg-white/10",
  // Light pill on dark: the header CTA and third-party sign-in.
  inverse: "bg-offwhite text-ink hover:bg-accent-light",
  // Tertiary action on dark surfaces — no container until hovered.
  ghost: "text-haze hover:bg-white/[.07] hover:text-offwhite",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm", // 44px: the site's minimum touch target
  lg: "h-12 px-6 text-base",
};

export function button({
  variant = "primary",
  size = "md",
  full = false,
}: { variant?: ButtonVariant; size?: ButtonSize; full?: boolean } = {}) {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]}${full ? " w-full" : ""}`;
}

/** Inline text links. */
export const linkOnDark = "font-semibold text-accent-light underline-offset-4 hover:underline";
export const linkOnLight = "font-semibold text-accent-deep underline-offset-4 hover:underline";

/** Text inputs and selects on light surfaces. The border meets 3:1
 *  (WCAG 1.4.11); focus swaps the outline for a teal border and halo. */
export const field =
  "block w-full min-h-[48px] rounded-control border border-linestrong bg-white px-4 py-3 " +
  "text-[17px] font-medium tabular-nums text-inktext placeholder:text-inkmuted/60 " +
  "transition-colors hover:border-inkmuted focus:border-accent-deep focus:outline-none focus:ring-4 focus:ring-accent-deep/15 " +
  "aria-[invalid=true]:border-red-700";

export const fieldLabel = "mb-2 block text-[13px] font-semibold text-inksoft";

/** Inline validation message under a field (red-700: 6.5:1 on white). */
export const fieldError = "mt-1.5 flex items-center gap-1 text-xs font-medium text-red-700";
