import { quarterlyDueDates } from "./calculator";

/** Local midnight today. Due dates are whole days: a payment due Apr 15 is
 *  still on time all of Apr 15. */
export function startOfToday(now: Date = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** The next estimated-payment due date on or after today, with the whole days
 *  left (0 = due today). null once all four dates for that tax year have
 *  passed. Shared by the results panel and the dashboard so they agree. */
export function nextDueDate(year: number, now: Date = new Date()) {
  const today = startOfToday(now);
  const next = quarterlyDueDates(year).find((d) => d.date >= today);
  if (!next) return null;
  // Rounded, not floored: a daylight-saving change makes one day 23 or 25 hours.
  return { ...next, days: Math.round((next.date.getTime() - today.getTime()) / 86_400_000) };
}

/** "today", "tomorrow", "in 12 days". */
export function dueIn(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}
