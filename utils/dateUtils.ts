import { differenceInDays, differenceInWeeks, differenceInMonths } from "date-fns";

export function getRangeDuration(start: Date, end: Date): string {
  const days = differenceInDays(end, start) + 1;

  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;

  const weeks = differenceInWeeks(end, start);
  const remainingDays = days - weeks * 7;

  if (days < 30) {
    if (remainingDays === 0) {
      return weeks === 1 ? "1 week" : `${weeks} weeks`;
    }
    return weeks === 1
      ? `1 week, ${remainingDays}d`
      : `${weeks} weeks, ${remainingDays}d`;
  }

  const months = differenceInMonths(end, start);
  if (months === 1) return "1 month";
  if (months > 1) return `${months} months`;

  return `${days} days`;
}

export function getRangeDurationColor(start: Date, end: Date): string {
  const days = differenceInDays(end, start) + 1;
  if (days <= 3)  return "#22c55e"; // green  — short
  if (days <= 7)  return "#f59e0b"; // amber  — one week
  if (days <= 14) return "#3b82f6"; // blue   — two weeks
  if (days <= 30) return "#8b5cf6"; // purple — month
  return "#ef4444";                 // red    — long
}