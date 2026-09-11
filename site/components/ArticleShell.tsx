import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import Breadcrumbs, { type Crumb } from "./Breadcrumbs";
import { PageBand } from "./PageHeader";

/**
 * The reading-page template (guides, about, privacy, terms, the LLC page):
 * the title in the atmospheric page band, then the text on one dark glass
 * card with article typography (.prose-dark). Pass plain elements as
 * children — h2, p, ul, a and strong are styled by the wrapper.
 */
export default function ArticleShell({
  title,
  eyebrow,
  breadcrumbs,
  image,
  imageAlt = "",
  footer,
  article = true,
  children,
}: {
  title: ReactNode;
  eyebrow?: string;
  breadcrumbs?: Crumb[];
  image?: StaticImageData;
  imageAlt?: string;
  /** Small print under the text: sources, "last updated". */
  footer?: ReactNode;
  /** Guides are <article>s; policy pages are plain content. */
  article?: boolean;
  children: ReactNode;
}) {
  const Tag = article ? "article" : "div";
  return (
    <main className="flex-1 overflow-x-clip">
      <Tag>
        <PageBand>
          <div className="mx-auto max-w-3xl">
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {eyebrow && <p className="eyebrow mb-4 text-accent-light">{eyebrow}</p>}
            <h1 className="type-headline text-offwhite">{title}</h1>
          </div>
        </PageBand>

        <div className="shell pb-20 sm:pb-24">
          <div className="glass mx-auto max-w-3xl overflow-hidden rounded-card">
            {image && (
              <div className="relative aspect-[21/9]">
                <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 768px, 100vw" className="photo-grade object-cover object-[50%_35%]" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              </div>
            )}
            <div className="prose-dark p-6 sm:p-10">{children}</div>
            {footer && <div className="mx-6 border-t border-white/[.08] py-5 text-sm leading-relaxed text-dusk sm:mx-10 [&_a]:font-semibold [&_a]:text-accent-light hover:[&_a]:underline">{footer}</div>}
          </div>
        </div>
      </Tag>
    </main>
  );
}
