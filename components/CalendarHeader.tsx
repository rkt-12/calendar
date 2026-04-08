"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import ThemeSwitcher from "./ThemeSwitcher";
import { Theme } from "@/hooks/useTheme";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  direction: number;
  theme: Theme;
  onThemeToggle: () => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
  direction,
  theme,
  onThemeToggle,
}: CalendarHeaderProps) {
  return (
    <div className="calendar-header">

      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 gap-2">

        {/* Prev button */}
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="nav-btn"
          aria-label="Previous month"
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </motion.button>

        {/* Month + Year */}
        <div className="flex flex-col items-center flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={format(currentDate, "yyyy-MM")}
              initial={{ opacity: 0, y: direction > 0 ? 16 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -16 : 16 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <span
                className="text-xl font-bold leading-tight tracking-wide uppercase"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "var(--text-primary)",
                  letterSpacing: "0.04em",
                }}
              >
                {format(currentDate, "MMMM")}
              </span>
              <span
                className="text-xs font-semibold"
                style={{
                  color: "var(--accent)",
                  letterSpacing: "0.18em",
                  fontSize: "0.6rem",
                }}
              >
                {format(currentDate, "yyyy")}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side: theme switcher + next button */}
        <div className="flex items-center gap-1.5">
          <ThemeSwitcher theme={theme} onToggle={onThemeToggle} />
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            className="nav-btn"
            aria-label="Next month"
          >
            <ChevronRight size={15} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>

      {/* Today button */}
      <div className="flex justify-center pb-2">
        <motion.button
          onClick={onToday}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="today-btn flex items-center gap-1.5"
          aria-label="Go to today"
        >
          <CalendarDays size={10} strokeWidth={2} />
          <span>Today</span>
        </motion.button>
      </div>

      {/* Weekday labels */}
      <div
        className="grid grid-cols-7 px-3 pb-2"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center py-1"
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color:
                day === "Sat" || day === "Sun"
                  ? "var(--accent)"
                  : "var(--text-secondary)",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}