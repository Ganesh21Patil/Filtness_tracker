"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertIcon, CheckIcon } from "./icons";

/** A link ("View") or an in-place action ("Undo"). */
type ToastAction = { label: string } & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });
type ToastOptions = { action?: ToastAction; tone?: "success" | "error" };
type Toast = ToastOptions & { id: number; message: string };

let show: ((message: string, options?: ToastOptions) => void) | null = null;

/** A short confirmation under the header ("Signed out", "Estimate saved"),
 *  with an optional link or action. Announced politely to screen readers. */
export function toast(message: string, options?: ToastOptions) {
  show?.(message, options);
}

const VISIBLE_MS = 5000;
const EXIT_MS = 180;

/** Mounted once, in the root layout. One toast at a time; a new one replaces
 *  the last. It sits under the header, clear of the mobile summary bar. It
 *  stays put while hovered or focused — time to reach its button — and
 *  lifts away when it leaves (reduced motion: it just disappears). */
export default function Toaster() {
  const [current, setCurrent] = useState<Toast | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let id = 0;
    show = (message, options) => {
      setLeaving(false);
      setCurrent({ id: ++id, message, ...options });
    };
    return () => {
      show = null;
    };
  }, []);

  useEffect(() => {
    if (!current || paused) return;
    const leave = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const remove = setTimeout(() => setCurrent(null), VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(remove);
    };
  }, [current, paused]);

  const dismiss = () => {
    setPaused(false);
    setCurrent(null);
  };

  const actionClass =
    "inline-flex min-h-[40px] items-center rounded-full px-3 font-semibold text-accent-light transition-colors hover:bg-white/[.07] hover:text-offwhite";

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[84px] z-[60] flex justify-center px-4 print:hidden">
      {current && (
        <div
          key={current.id}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className={`pointer-events-auto flex min-h-[44px] items-center gap-3 rounded-full border border-white/15 bg-panel py-1 pl-2 pr-2 text-sm text-offwhite shadow-card ${
            leaving ? "motion-safe:animate-drop-out" : "motion-safe:animate-drop-in"
          }`}
        >
          <span
            aria-hidden="true"
            className={`grid size-7 flex-shrink-0 place-items-center rounded-full ${current.tone === "error" ? "bg-danger text-ink" : "bg-accent text-ink"}`}
          >
            {current.tone === "error" ? <AlertIcon className="size-4" strokeWidth={2.25} /> : <CheckIcon className="size-4" strokeWidth={2.5} />}
          </span>
          <span className={current.action ? "" : "pr-3"}>{current.message}</span>
          {current.action?.href && (
            <Link href={current.action.href} onClick={dismiss} className={actionClass}>
              {current.action.label}
            </Link>
          )}
          {current.action?.onClick && (
            <button
              type="button"
              onClick={() => {
                current.action?.onClick?.();
                dismiss();
              }}
              className={actionClass}
            >
              {current.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
