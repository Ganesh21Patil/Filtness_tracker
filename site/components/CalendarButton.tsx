"use client";

import { useEffect, useState } from "react";
import { downloadQuarterlyIcs } from "../lib/ics";
import { button } from "./ui";
import { CalendarIcon, CheckIcon } from "./icons";

/** Downloads the four due dates as an .ics file. The download happens outside
 *  the page, and some browsers barely show it, so the button confirms it for
 *  a few seconds and a screen reader hears what to do next. */
export default function CalendarButton({ quarterlyPayment, year, className = "" }: { quarterlyPayment: number; year?: number; className?: string }) {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!downloaded) return;
    const t = setTimeout(() => setDownloaded(false), 4000);
    return () => clearTimeout(t);
  }, [downloaded]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          downloadQuarterlyIcs(quarterlyPayment, year);
          setDownloaded(true);
        }}
        className={`${button({ size: "lg", full: true })} ${className}`}
      >
        {downloaded ? <CheckIcon className="size-5 motion-safe:animate-pop-in" strokeWidth={2.25} /> : <CalendarIcon className="size-5" />}
        {downloaded ? (
          "Calendar file downloaded"
        ) : (
          <>
            {/* Inside the results panel (a size container), a very narrow
                panel gets the short label. */}
            <span className="[@container(max-width:17rem)]:hidden">Add due dates to calendar</span>
            <span className="hidden [@container(max-width:17rem)]:inline">Add to calendar</span>
          </>
        )}
      </button>
      <span role="status" className="sr-only">
        {downloaded ? "Calendar file downloaded. Open it to add the four due dates to your calendar." : ""}
      </span>
    </>
  );
}
