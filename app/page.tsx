"use client";

import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { useNotes } from "@/hooks/useNotes";
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

  const {
    monthNote,
    rangeNote,
    setMonthNote,
    setRangeNote,
    deleteNote,
    getAllNotes,
    activeMonthKey,
    activeRangeKey,
  } = useNotes(currentDate, range);

  const allNotes = getAllNotes();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="calendar-card p-6 w-full max-w-lg">

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
        <div className="grid grid-cols-7" onMouseLeave={onDayLeave}>
          {calendarDays.map((day, i) => (
            <div
              key={i}
              onClick={() => day.isCurrentMonth && onDayClick(day.date)}
              onMouseEnter={() => day.isCurrentMonth && onDayHover(day.date)}
              className={clsx(
                "day-cell aspect-square text-xs",
                !day.isCurrentMonth && "day-cell--outside",
                day.isToday && "day-cell--today",
                day.isWeekend && day.isCurrentMonth && "day-cell--weekend",
                isInRange(day.date) && "day-cell--in-range",
                isRangeStartCap(day.date) && "day-cell--range-start-cap",
                isRangeEndCap(day.date) && "day-cell--range-end-cap",
                isStart(day.date) && "day-cell--start",
                isEnd(day.date) && "day-cell--end"
              )}
            >
              {format(day.date, "d")}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)" }} className="mt-4 pt-4 space-y-4">

          {/* Month note */}
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--text-secondary)" }}
            >
              📝 Month note — {format(currentDate, "MMMM yyyy")}
            </label>
            <textarea
              className="notes-textarea"
              rows={2}
              placeholder="Add a note for this month..."
              value={monthNote}
              onChange={(e) => setMonthNote(e.target.value)}
            />
          </div>

          {/* Range note — only shows when range is selected */}
          {range.start && range.end && (
            <div>
              <label
                className="text-xs font-semibold mb-1 block"
                style={{ color: "var(--accent)" }}
              >
                📌 Range note — {format(range.start, "MMM d")} →{" "}
                {format(range.end, "MMM d")}
              </label>
              <textarea
                className="notes-textarea"
                rows={2}
                placeholder="Add a note for this date range..."
                value={rangeNote}
                onChange={(e) => setRangeNote(e.target.value, range)}
              />
              <button
                onClick={clearRange}
                className="text-xs underline mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Clear range
              </button>
            </div>
          )}

          {/* Hint when selecting */}
          {isSelecting && (
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              From {format(range.start!, "MMM d")} — hover and click an end date
            </p>
          )}
        </div>

        {/* All saved notes */}
        {allNotes.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
              All saved notes ({allNotes.length})
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {allNotes.map((note) => (
                <div
                  key={note.key}
                  className="flex items-start justify-between gap-2 p-2 rounded-lg"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--accent)" }}
                    >
                      {note.label}
                    </p>
                    <p
                      className="text-xs mt-0.5 line-clamp-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {note.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.key)}
                    className="text-xs shrink-0"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}