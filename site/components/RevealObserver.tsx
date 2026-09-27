"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades marketing content up the first time it scrolls into view: mark an
 * element with `data-reveal`. Mounted once, in the root layout.
 *
 * Only elements that start below the fold are hidden (data-reveal-pending),
 * and only from here, after hydration — so nothing is ever invisible without
 * JavaScript, and nothing already on screen blinks. Items that enter together
 * (a row of cards) are staggered by 70ms. Off under reduced motion. Never
 * used on the calculator: a tool you're working in doesn't perform.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    if (pending.length === 0) return;
    pending.forEach((el) => el.setAttribute("data-reveal-pending", ""));

    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            io.unobserve(el);
            el.style.setProperty("--reveal-delay", `${i * 70}ms`);
            el.setAttribute("data-revealed", "");
            el.removeAttribute("data-reveal-pending");
            // Hand the element back its own transitions once it has landed.
            timers.push(
              window.setTimeout(() => {
                el.removeAttribute("data-revealed");
                el.style.removeProperty("--reveal-delay");
              }, 800 + i * 70)
            );
          });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    pending.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      // Never leave anything hidden behind a torn-down observer.
      pending.forEach((el) => {
        el.removeAttribute("data-reveal-pending");
        el.removeAttribute("data-revealed");
      });
    };
  }, [pathname]);

  return null;
}
