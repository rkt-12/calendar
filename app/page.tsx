"use client";

import { useState, useCallback } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useDateRangeSelector } from "@/hooks/useDateRangeSelector";
import { useNotes, Note } from "@/hooks/useNotes";
import { useTheme } from "@/hooks/useTheme";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarGrid from "@/components/CalendarGrid";
import HeroImagePanel from "@/components/HeroImagePanel";
import NotesPanel from "@/components/NotesPanel";
import NotesList from "@/components/NotesList";
import { parse } from "date-fns";

export default function Home() {

  const [direction, setDirection] = useState(1);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

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

  const handlePrev = useCallback(() => {
    setDirection(-1);
    goToPrevMonth();
  }, [goToPrevMonth]);

  const handleNext = useCallback(() => {
    setDirection(1);
    goToNextMonth();
  }, [goToNextMonth]);

  // Navigate calendar to the month of a clicked saved note
  const handleNoteClick = useCallback(
    (note: Note) => {
      if (!note.rangeStart) return;
      const target = parse(note.rangeStart, "yyyy-MM-dd", new Date());
      const currentMonths =
        currentDate.getFullYear() * 12 + currentDate.getMonth();
      const targetMonths =
        target.getFullYear() * 12 + target.getMonth();
      const diff = targetMonths - currentMonths;

      if (diff === 0) return;

      if (diff > 0) {
        setDirection(1);
        for (let i = 0; i < diff; i++) goToNextMonth();
      } else {
        setDirection(-1);
        for (let i = 0; i < Math.abs(diff); i++) goToPrevMonth();
      }
    },
    [currentDate, goToNextMonth, goToPrevMonth]
  );

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "var(--bg)" }}
      aria-label="Wall Calendar Application"
    >
      <div
        className="calendar-card w-full max-w-3xl flex flex-col md:flex-row"
        style={{ minHeight: "560px" }}
        role="application"
        aria-label="Interactive Wall Calendar"
      >
        {/* Image Panel */}
        <div
          className="md:w-2/5 w-full"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          {/* Mobile banner */}
          <div className="block md:hidden">
            <HeroImagePanel
              currentDate={currentDate}
              customImageUrl={customImageUrl}
              onImageUpload={setCustomImageUrl}
              variant="banner"
            />
          </div>
          {/* Desktop full hero */}
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

        {/* Calendar + Notes Panel */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{ borderLeft: "1px solid var(--border)" }}
        >
          <CalendarHeader
            currentDate={currentDate}
            onPrev={handlePrev}
            onNext={handleNext}
            onToday={goToToday}
            direction={direction}
            theme={theme}
            onThemeToggle={toggleTheme}
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