"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { HelpIcon } from "./icons";

/**
 * A "toggletip": an info button that reveals a short note.
 *
 * - Click or tap pins it open; mouse hover previews it. Touch never sets the
 *   hover state, so a second tap always closes it.
 * - Escape closes it and returns focus to the button; a click anywhere else closes it.
 * - It's a disclosure (aria-expanded + aria-controls), not role="tooltip",
 *   because the note can hold a link and tooltips can't contain focusable content.
 *
 * anchor="container" positions the note against the nearest positioned
 * ancestor below `sm` (e.g. a whole deduction card), so it can't run off a
 * phone screen; from `sm` up it hangs off the button.
 */
export default function Tooltip({
  label,
  children,
  tone = "light",
  anchor = "button",
}: {
  label: string;
  children: ReactNode;
  tone?: "light" | "dark";
  anchor?: "button" | "container";
}) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const open = pinned || hovered;
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => {
      setPinned(false);
      setHovered(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      close();
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerTone =
    tone === "dark"
      ? open ? "text-accent-light" : "text-dusk hover:text-accent-light"
      : open ? "text-accent-deep" : "text-inkmuted hover:text-accent-deep";

  return (
    <div
      ref={root}
      className={`print:hidden flex-shrink-0 ${anchor === "container" ? "sm:relative" : "relative"}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
    >
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setPinned((p) => !p)}
        // 36px visible circle; the ::after pad brings the hit area to 44px.
        className={`relative grid size-9 place-items-center rounded-full transition-colors after:absolute after:-inset-1 after:content-[''] ${triggerTone}`}
      >
        <HelpIcon className="size-[18px]" />
      </button>
      <div
        id={id}
        hidden={!open}
        className={`absolute z-50 mt-1 rounded-control border border-line bg-white p-3.5 text-sm leading-relaxed text-inksoft shadow-card motion-safe:animate-[fade-in_140ms_ease-out] ${
          anchor === "container" ? "inset-x-3 sm:inset-x-auto sm:right-0 sm:w-64" : "right-0 w-64 max-w-[calc(100vw-3rem)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
