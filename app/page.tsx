"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { format } from "date-fns";
import clsx from "clsx";

export default function Home() {
  const { currentDate, calendarDays, goToNextMonth, goToPrevMonth } =
    useCalendar();

  const {
    range,
    onDayClick,
    onDayHover,
    onDayLeave,
    clearRange,
    isStart,
    isEnd,
    isInRange,
    isRangeStartCap,
    isRangeEndCap,
    isSelecting,
  } = useDateRangeSelector();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="calendar-card p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="px-3 py-1 rounded text-sm"
            style={{ background: "var(--surface-2)", color: "var(--text-primary)" }}
          >
            ← Prev
          </button>
          <h2
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
            className="text-xl font-bold"
          >
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button
            onClick={goToNextMonth}
            className="px-3 py-1 rounded text-sm"
            style={{ background: "var(--surface-2)", color: "var(--text-primary)" }}
          >
            Next →
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold py-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div
          className="grid grid-cols-7"
          onMouseLeave={onDayLeave}
        >
          {calendarDays.map((day, i) => {
            const start = isStart(day.date);
            const end = isEnd(day.date);
            const inRange = isInRange(day.date);
            const startCap = isRangeStartCap(day.date);
            const endCap = isRangeEndCap(day.date);

            return (
              <div
                key={i}
                onClick={() => day.isCurrentMonth && onDayClick(day.date)}
                onMouseEnter={() => day.isCurrentMonth && onDayHover(day.date)}
                className={clsx(
                  "day-cell aspect-square text-xs",
                  !day.isCurrentMonth && "day-cell--outside",
                  day.isToday && "day-cell--today",
                  day.isWeekend && day.isCurrentMonth && "day-cell--weekend",
                  inRange && "day-cell--in-range",
                  startCap && "day-cell--range-start-cap",
                  endCap && "day-cell--range-end-cap",
                  start && "day-cell--start",
                  end && "day-cell--end"
                )}
              >
                {format(day.date, "d")}
              </div>
            );
          })}
        </div>

        {/* Range status */}
        <div
          className="mt-4 pt-4 text-xs flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-secondary)" }}
        >
          <span>
            {isSelecting
              ? `From ${format(range.start!, "MMM d")} — pick end date`
              : range.start && range.end
              ? `${format(range.start, "MMM d")} → ${format(range.end, "MMM d, yyyy")}`
              : "Click a date to start selecting"}
          </span>
          {(range.start || range.end) && (
            <button
              onClick={clearRange}
              className="text-xs underline"
              style={{ color: "var(--accent)" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </main>
  );
}