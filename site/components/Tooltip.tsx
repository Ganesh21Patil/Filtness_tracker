"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { InfoIcon } from "./icons";

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
  anchor = "button",
  align = "right",
}: {
  label: string;
  children: ReactNode;
  anchor?: "button" | "container";
  /** Which edge of the trigger the note lines up with. */
  align?: "left" | "right";
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

  // Literal class strings so Tailwind can see them.
  const position =
    anchor === "container"
      ? align === "left"
        ? "inset-x-3 sm:inset-x-auto sm:left-0 sm:w-64"
        : "inset-x-3 sm:inset-x-auto sm:right-0 sm:w-64"
      : align === "left"
        ? "left-0 w-64 max-w-[calc(100vw-3rem)]"
        : "right-0 w-64 max-w-[calc(100vw-3rem)]";

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
        // 32px visible circle; the ::after pad brings the hit area to 44px.
        className={`relative grid size-8 place-items-center rounded-full transition-colors after:absolute after:-inset-1.5 after:content-[''] ${
          open ? "text-accent-light" : "text-dusk hover:text-accent-light"
        }`}
      >
        <InfoIcon className="size-[17px]" />
      </button>
      <div
        id={id}
        hidden={!open}
        className={`absolute z-50 mt-1 rounded-control border border-white/15 bg-panel/95 p-3.5 text-left text-sm font-normal normal-case leading-relaxed tracking-normal text-haze shadow-card backdrop-blur-xl motion-safe:animate-[fade-in_140ms_ease-out] ${position}`}
      >
        {children}
      </div>
    </div>
  );
}
