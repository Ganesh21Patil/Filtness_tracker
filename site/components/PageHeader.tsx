import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

/**
 * Title block for pages on the dark ground — optional breadcrumb, eyebrow,
 * H1 and lede — so every inner page shares one type scale and rhythm instead
 * of each page hand-sizing its own heading.
 */
export default function PageHeader({
  title,
  eyebrow,
  lede,
  breadcrumbs,
  align = "left",
  className = "",
}: {
  title: ReactNode;
  eyebrow?: string;
  lede?: ReactNode;
  breadcrumbs?: Crumb[];
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : ""} ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      {eyebrow && <p className="eyebrow mb-4 text-accent-light">{eyebrow}</p>}
      <h1 className="font-serif text-4xl tracking-[-.03em] text-offwhite sm:text-5xl">{title}</h1>
      {lede && <p className={`mt-4 text-lg leading-relaxed text-offwhite/80 ${center ? "" : "max-w-2xl"}`}>{lede}</p>}
    </div>
  );
}
