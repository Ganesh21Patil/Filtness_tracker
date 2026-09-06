import { TAX_CONFIG, quarterlyDueDates } from "./calculator";

/** Builds and downloads a .ics calendar of the four estimated-payment due
 *  dates. Shared by the calculator's results panel and the dashboard so the
 *  two can't drift apart. */
export function downloadQuarterlyIcs(quarterlyPayment: number, year: number = TAX_CONFIG.TAX_YEAR) {
  const amount = quarterlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = quarterlyDueDates(year)
    .map(({ label, date }, i) => {
      const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
      return `BEGIN:VEVENT
UID:trainerledger-${year}-${label}-${i}@trainerledger
DTSTAMP:${stamp}
DTSTART;VALUE=DATE:${yyyymmdd}
SUMMARY:Estimated tax payment due (${label}) — ~$${amount}
DESCRIPTION:Estimated quarterly tax payment from TrainerLedger. This is a planning estimate\\, not formal tax advice.
END:VEVENT`;
    })
    .join("\n");

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TrainerLedger//Quarterly Tax Calendar//EN
CALSCALE:GREGORIAN
${events}
END:VCALENDAR`;

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `trainerledger-quarterly-taxes-${year}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
