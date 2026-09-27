import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import mountains from "../public/images/mountains.jpg";

/**
 * Title block for inner pages — optional breadcrumb, eyebrow, H1 and lede —
 * so every inner page shares one type scale and rhythm.
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
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} center={center} />}
      {eyebrow && <p className="eyebrow mb-4 text-accent-light">{eyebrow}</p>}
      <h1 className="type-headline text-offwhite">{title}</h1>
      {lede && <p className={`mt-5 text-lg leading-relaxed text-haze ${center ? "" : "max-w-2xl"}`}>{lede}</p>}
    </div>
  );
}

/**
 * The atmospheric top band every inner page opens with: blue light, one beam,
 * and the brand's mountain range fading up from the bottom. Children render
 * inside the page container.
 *
 * With `photo`, it becomes a full-bleed photo hero instead (the calculator
 * pages): the header floats over it, like the homepage hero, and the next
 * section can overlap its bottom edge with a negative margin.
 */
export function PageBand({
  children,
  className = "",
  photo,
  width = "",
}: {
  children: ReactNode;
  className?: string;
  photo?: StaticImageData;
  /** The page content's max-width class (e.g. "max-w-6xl"), so the title
   *  starts on the same left edge as the content below it. */
  width?: string;
}) {
  if (photo) {
    return (
      <section className={`relative isolate -mt-[72px] overflow-hidden pt-[72px] ${className}`}>
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src={photo} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover object-[22%_center] lg:object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink" />
        </div>
        {/* Tall on purpose: the next section overlaps the bottom ~80px, and the
            photo needs room to read as a scene, not a strip. */}
        <div className="shell relative pb-32 pt-14 sm:pb-48 sm:pt-24 lg:pb-56">
          <div className="relative">
            {/* A pool of shade anchored to the text block itself, whatever
                it holds, so the words clear AA contrast even over the
                brightest part of the photo (the sunset and the snow). */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-[12%] -inset-y-[55%] -z-10 bg-[radial-gradient(closest-side,rgb(5_8_15/.88),rgb(5_8_15/.76)_65%,transparent)]"
            />
            {children}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={`aurora relative isolate overflow-hidden ${className}`}>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[85%] [mask-image:linear-gradient(to_top,transparent,black_35%,black_55%,transparent)]">
        <Image src={mountains} alt="" fill priority sizes="100vw" className="object-cover object-[50%_40%] opacity-[.28]" />
      </div>
      <div className={`shell relative pb-12 pt-10 sm:pb-16 sm:pt-16 ${width}`}>{children}</div>
    </section>
  );
}
