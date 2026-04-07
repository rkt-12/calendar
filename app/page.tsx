"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { format } from "date-fns";

export default function Home() {
  const { currentDate, calendarDays, goToNextMonth, goToPrevMonth, goToToday } =
    useCalendar();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Month display */}
      <div className="calendar-card p-6 w-full max-w-md">
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

        {/* Weekday headers */}
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
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`day-cell aspect-square text-xs
                ${!day.isCurrentMonth ? "day-cell--outside" : ""}
                ${day.isToday ? "day-cell--today" : ""}
                ${day.isWeekend && day.isCurrentMonth ? "day-cell--weekend" : ""}
              `}
            >
              {format(day.date, "d")}
            </div>
          ))}
        </div>

        {/* Today button */}
        <button
          onClick={goToToday}
          className="mt-4 w-full py-2 rounded-lg text-sm font-medium text-white"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Today
        </button>
      </div>
    </main>
  );
}