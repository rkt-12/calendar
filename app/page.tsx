"use client";

import { useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { useNotes } from "@/hooks/useNotes";
import CalendarHeader from "@/components/CalendarHeader";
import { format } from "date-fns";
import clsx from "clsx";

export default function Home() {
  const [direction, setDirection] = useState(1);

  const {
    currentDate,
    calendarDays,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  } = useCalendar();

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
  } = useNotes(currentDate, range);

  const allNotes = getAllNotes();

  function handlePrev() {
    setDirection(-1);
    goToPrevMonth();
  }

  function handleNext() {
    setDirection(1);
    goToNextMonth();
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="calendar-card w-full max-w-sm">

        <CalendarHeader
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={goToToday}
          direction={direction}
        />

        {/* Day grid */}
        <div className="px-3 pt-3">
          <div className="grid grid-cols-7" onMouseLeave={onDayLeave}>
            {calendarDays.map((day, i) => (
              <div
                key={i}
                onClick={() => day.isCurrentMonth && onDayClick(day.date)}
                onMouseEnter={() =>
                  day.isCurrentMonth && onDayHover(day.date)
                }
                className={clsx(
                  "day-cell aspect-square text-xs",
                  !day.isCurrentMonth && "day-cell--outside",
                  day.isToday && "day-cell--today",
                  day.isWeekend &&
                    day.isCurrentMonth &&
                    "day-cell--weekend",
                  isInRange(day.date) && "day-cell--in-range",
                  isRangeStartCap(day.date) &&
                    "day-cell--range-start-cap",
                  isRangeEndCap(day.date) && "day-cell--range-end-cap",
                  isStart(day.date) && "day-cell--start",
                  isEnd(day.date) && "day-cell--end"
                )}
              >
                {format(day.date, "d")}
              </div>
            ))}
          </div>
        </div>

        {/* Notes section */}
        <div
          className="px-4 py-4 mt-2 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div>
            <label
              className="text-xs font-semibold mb-1 block uppercase tracking-widest"
              style={{ color: "var(--text-secondary)", fontSize: "0.6rem" }}
            >
              Month note
            </label>
            <textarea
              className="notes-textarea"
              rows={2}
              placeholder={`Notes for ${format(currentDate, "MMMM")}...`}
              value={monthNote}
              onChange={(e) => setMonthNote(e.target.value)}
            />
          </div>

          {range.start && range.end && (
            <div>
              <label
                className="text-xs font-semibold mb-1 block uppercase tracking-widest"
                style={{ color: "var(--accent)", fontSize: "0.6rem" }}
              >
                {format(range.start, "MMM d")} →{" "}
                {format(range.end, "MMM d")}
              </label>
              <textarea
                className="notes-textarea"
                rows={2}
                placeholder="Notes for this range..."
                value={rangeNote}
                onChange={(e) => setRangeNote(e.target.value, range)}
              />
              <button
                onClick={clearRange}
                className="text-xs underline mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Clear range
              </button>
            </div>
          )}

          {isSelecting && (
            <p
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              From {format(range.start!, "MMM d")} — pick an end date
            </p>
          )}
        </div>

        {/* Saved notes */}
        {allNotes.length > 0 && (
          <div
            className="px-4 pb-4 space-y-2"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest pt-3"
              style={{ color: "var(--text-secondary)", fontSize: "0.6rem" }}
            >
              Saved notes
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
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
                      className="text-xs mt-0.5 line-clamp-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {note.content}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.key)}
                    style={{ color: "var(--text-muted)" }}
                    className="text-xs shrink-0 hover:text-red-400 transition-colors"
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