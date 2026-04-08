"use client";

import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import DayCell from "./DayCell";
import { CalendarDay } from "@/hooks/useCalendar";

interface CalendarGridProps {
  calendarDays: CalendarDay[];
  currentDate: Date;
  direction: number;
  isStart: (date: Date) => boolean;
  isEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  isRangeStartCap: (date: Date) => boolean;
  isRangeEndCap: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
}

export default function CalendarGrid({
  calendarDays,
  currentDate,
  direction,
  isStart,
  isEnd,
  isInRange,
  isRangeStartCap,
  isRangeEndCap,
  onDayClick,
  onDayHover,
  onDayLeave,
}: CalendarGridProps) {
  return (
    <div className="px-3 pt-2 pb-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={format(currentDate, "yyyy-MM")}
          initial={{
            opacity: 0,
            x: direction > 0 ? 40 : -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: direction > 0 ? -40 : 40,
          }}
          transition={{
            duration: 0.22,
            ease: "easeInOut",
          }}
        >
          <div
            className="grid grid-cols-7"
            onMouseLeave={onDayLeave}
            role="grid"
            aria-label={`Calendar grid for ${format(currentDate, "MMMM yyyy")}`}
          >
            {calendarDays.map((day, i) => (
              <DayCell
                key={`${format(day.date, "yyyy-MM-dd")}`}
                date={day.date}
                index={i}
                isCurrentMonth={day.isCurrentMonth}
                isToday={day.isToday}
                isWeekend={day.isWeekend}
                isStart={isStart(day.date)}
                isEnd={isEnd(day.date)}
                isInRange={isInRange(day.date)}
                isRangeStartCap={isRangeStartCap(day.date)}
                isRangeEndCap={isRangeEndCap(day.date)}
                onClick={() => onDayClick(day.date)}
                onMouseEnter={() => onDayHover(day.date)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}