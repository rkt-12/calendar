"use client";

import { useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { useNotes } from "@/hooks/useNotes";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import HeroImagePanel from "@/components/HeroImagePanel";
import { format } from "date-fns";

export default function Home() {
  const [direction, setDirection] = useState(1);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);

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
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* ── Desktop: side-by-side | Mobile: stacked ──── */}
      <div
        className="calendar-card w-full max-w-3xl flex flex-col md:flex-row"
        style={{ minHeight: "520px" }}
      >
        {/* Left — Hero image (desktop) / Top banner (mobile) */}
        <div
          className="md:w-2/5 w-full"
          style={{ position: "relative", flexShrink: 0 }}
        >
          {/* Mobile: banner variant */}
          <div className="block md:hidden">
            <HeroImagePanel
              currentDate={currentDate}
              customImageUrl={customImageUrl}
              onImageUpload={setCustomImageUrl}
              variant="banner"
            />
          </div>
          {/* Desktop: full-height hero variant */}
          <div
            className="hidden md:block"
            style={{ height: "100%", minHeight: "520px" }}
          >
            <HeroImagePanel
              currentDate={currentDate}
              customImageUrl={customImageUrl}
              onImageUpload={setCustomImageUrl}
              variant="hero"
            />
          </div>
        </div>

        {/* Right — Calendar panel */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ borderLeft: "1px solid var(--border)" }}
        >

        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={goToToday}
          direction={direction}
        />

        {/* Grid */}
        <CalendarGrid
          calendarDays={calendarDays}
          currentDate={currentDate}
          direction={direction}
          isStart={isStart}
          isEnd={isEnd}
          isInRange={isInRange}
          isRangeStartCap={isRangeStartCap}
          isRangeEndCap={isRangeEndCap}
          onDayClick={onDayClick}
          onDayHover={onDayHover}
          onDayLeave={onDayLeave}
        />

        {/* Notes */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div>
            <label
              className="block mb-1 uppercase tracking-widest"
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
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
                className="block mb-1 uppercase tracking-widest"
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
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
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
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
              className="uppercase tracking-widest pt-3"
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
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
                    className="text-xs shrink-0 transition-colors"
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
      </div>
    </main>
  );
}