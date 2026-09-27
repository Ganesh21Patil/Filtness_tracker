import Link from "next/link";
import { ChevronRightIcon } from "./icons";

export type Crumb = { label: string; href?: string };

/**
 * Where this page sits: ancestors are links, the last item is the current page
 * (aria-current). Only used where a real parent exists.
 */
export default function Breadcrumbs({ items, center = false }: { items: Crumb[]; center?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className={`flex flex-wrap items-center gap-x-1.5 text-sm ${center ? "justify-center" : ""}`}>
        {items.map((crumb, i) => {
          const last = i === items.length - 1;
          return (
            <li key={crumb.label} className="flex min-w-0 items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="inline-flex min-h-[44px] items-center rounded font-semibold text-accent-light underline-offset-4 hover:text-offwhite hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="truncate text-dusk">
                  {crumb.label}
                </span>
              )}
              {!last && <ChevronRightIcon className="size-3.5 flex-shrink-0 text-fog" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
