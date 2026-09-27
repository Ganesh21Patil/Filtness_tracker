"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BookmarkIcon, ChartIcon, LogOutIcon } from "./icons";

/** Initials for the avatar: "Jordan Lee" → "JL", "sam@x.com" → "S". Drawn
 *  from the name, not the Google photo, so the header loads nothing from
 *  another site. */
function initialsFor(name?: string, email?: string) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length > 0) return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
  return (email?.[0] ?? "?").toUpperCase();
}

const item =
  "flex min-h-[44px] w-full items-center gap-3 rounded-control px-3 text-left text-sm font-medium text-haze transition-colors hover:bg-white/[.06] hover:text-offwhite";

/**
 * The signed-in header control: an avatar button that opens a small panel
 * with who you're signed in as, your saved estimates, and sign out.
 *
 * It's a disclosure (button + aria-expanded), not an ARIA menu: the panel
 * holds ordinary links, so Tab moves through it like the rest of the page.
 * Escape closes it and returns focus to the avatar; so does a click
 * outside it or moving to another page.
 */
export default function AccountMenu({ name, email, onSignOut }: { name?: string; email?: string; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Account menu for ${name || email || "your account"}`}
        onClick={() => setOpen((o) => !o)}
        className={`grid size-11 place-items-center rounded-full border bg-gradient-to-br from-accent/35 to-electric/40 text-sm font-semibold tracking-wide text-offwhite transition-colors ${
          open ? "border-accent" : "border-white/25 hover:border-white/50"
        }`}
      >
        {initialsFor(name, email)}
      </button>

      <div
        id={id}
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 w-72 rounded-tile border border-white/15 bg-panel p-2 shadow-card motion-safe:animate-drop-in"
      >
        <div className="px-3 pb-3 pt-2">
          <p className="eyebrow text-fog">Signed in as</p>
          {name && <p className="mt-1.5 truncate text-sm font-semibold text-offwhite">{name}</p>}
          {email && <p className="truncate text-hint text-dusk">{email}</p>}
        </div>
        <ul className="border-t border-white/[.08] py-1.5">
          <li>
            <Link href="/saved-estimates" className={item}>
              <BookmarkIcon className="size-5 text-dusk" />
              Saved estimates
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className={item}>
              <ChartIcon className="size-5 text-dusk" />
              Your breakdown
            </Link>
          </li>
        </ul>
        <div className="border-t border-white/[.08] pt-1.5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className={item}
          >
            <LogOutIcon className="size-5 text-dusk" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
