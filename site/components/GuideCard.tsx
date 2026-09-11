import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { ArrowRightIcon } from "./icons";

/**
 * One guide teaser, used by the homepage section and the /guides index so the
 * same content always looks like the same object. An optional photograph
 * fills the card's top and melts into the glass; the "Read guide" line sits at
 * the bottom of every card, so a row of cards lines up regardless of length.
 */
export default function GuideCard({
  title,
  summary,
  href,
  image,
  as: Heading = "h3",
}: {
  title: string;
  summary: string;
  href: string;
  image?: StaticImageData;
  /** h3 under a section heading (homepage), h2 directly under the page H1 (/guides). */
  as?: "h2" | "h3";
}) {
  return (
    <Link
      href={href}
      className="glass group relative isolate flex h-full min-h-[300px] flex-col overflow-hidden rounded-tile p-6 transition-[border-color,transform] duration-200 hover:border-white/25 motion-safe:hover:-translate-y-0.5 sm:p-7"
    >
      {image && (
        // A mask, not a colour gradient, fades the photo out: the card is
        // glass, so fading to a fixed colour left a visible band where the
        // photo ended.
        <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[70%] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, 90vw"
            className="photo-grade object-cover object-[60%_30%] opacity-70 transition-opacity duration-300 group-hover:opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent" />
        </div>
      )}
      <span aria-hidden="true" className={`block h-0.5 w-7 rounded-full bg-accent shadow-[0_0_10px_rgba(31,182,255,.8)] ${image ? "mt-auto" : ""}`} />
      <Heading className="mt-4 type-title text-offwhite sm:text-[1.65rem]">{title}</Heading>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-haze">{summary}</p>
      <span className={`inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent-light ${image ? "" : "mt-auto"}`}>
        Read guide
        <ArrowRightIcon className="size-4 transition-transform duration-150 motion-safe:group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
