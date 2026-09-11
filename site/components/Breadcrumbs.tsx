import Link from "next/link";
import { ChevronRightIcon } from "./icons";

export type Crumb = { label: string; href?: string };

/**
 * Where this page sits: ancestors are links, the last item is the current page
 * (aria-current). Replaces the old "← Back to calculator" link, which sent
 * every page — guides, privacy, terms — back to one assumed origin.
 */
export default function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const link = tone === "dark" ? "text-accent-light hover:text-offwhite" : "text-accent-deep hover:text-inktext";
  const current = tone === "dark" ? "text-offwhite/70" : "text-inkmuted";
  const separator = tone === "dark" ? "text-offwhite/40" : "text-inkmuted/70";

  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-x-1.5 text-sm">
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className={`inline-flex min-h-[44px] items-center rounded font-semibold underline-offset-4 hover:underline ${link}`}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={`truncate ${current}`}>
                  {crumb.label}
                </span>
              )}
              {!last && <ChevronRightIcon className={`size-3.5 flex-shrink-0 ${separator}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
