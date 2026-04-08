"use client";

import { useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { useNotes } from "@/hooks/useNotes";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import HeroImagePanel from "@/components/HeroImagePanel";
import NotesPanel from "@/components/NotesPanel";
import NotesList from "@/components/NotesList";
import { Note } from "@/hooks/useNotes";
import { parse } from "date-fns";

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

  // Clicking a saved note navigates to that month
  function handleNoteClick(note: Note) {
    if (note.rangeStart) {
      const target = parse(note.rangeStart, "yyyy-MM-dd", new Date());
      const diff =
        target.getFullYear() * 12 +
        target.getMonth() -
        (currentDate.getFullYear() * 12 + currentDate.getMonth());
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          setDirection(1);
          goToNextMonth();
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          setDirection(-1);
          goToPrevMonth();
        }
      }
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        className="calendar-card w-full max-w-3xl flex flex-col md:flex-row"
        style={{ minHeight: "560px" }}
      >
        {/* ── Left: Hero Image ───────────────────────────── */}
        <div className="md:w-2/5 w-full" style={{ flexShrink: 0 }}>
          <div className="block md:hidden">
            <HeroImagePanel
              currentDate={currentDate}
              customImageUrl={customImageUrl}
              onImageUpload={setCustomImageUrl}
              variant="banner"
            />
          </div>
          <div
            className="hidden md:block"
            style={{ height: "100%", minHeight: "560px" }}
          >
            <HeroImagePanel
              currentDate={currentDate}
              customImageUrl={customImageUrl}
              onImageUpload={setCustomImageUrl}
              variant="hero"
            />
          </div>
        </div>

        {/* ── Right: Calendar + Notes ─────────────────────── */}
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

          {/* Notes panel */}
          <div style={{ borderTop: "1px solid var(--border)" }}>
            <NotesPanel
              currentDate={currentDate}
              range={range}
              monthNote={monthNote}
              rangeNote={rangeNote}
              isSelecting={isSelecting}
              onMonthNoteChange={setMonthNote}
              onRangeNoteChange={(val) => setRangeNote(val, range)}
              onClearRange={clearRange}
            />
          </div>

          {/* Saved notes list */}
          <NotesList
            notes={allNotes}
            onDelete={deleteNote}
            onNoteClick={handleNoteClick}
          />
        </div>
      </div>
    </main>
  );
}