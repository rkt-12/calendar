"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import clsx from "clsx";
import { getHolidayName } from "@/data/holidays";

interface DayCellProps {
  date: Date;
  index: number; // for stagger animation
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isRangeStartCap: boolean;
  isRangeEndCap: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export default function DayCell({
  date,
  index,
  isCurrentMonth,
  isToday,
  isWeekend,
  isStart,
  isEnd,
  isInRange,
  isRangeStartCap,
  isRangeEndCap,
  onClick,
  onMouseEnter,
}: DayCellProps) {
  const holidayName = isCurrentMonth ? getHolidayName(date) : null;
  const isSelected = isStart || isEnd;

  return (
    <motion.div
      // Staggered entry animation on mount
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.18,
        delay: isCurrentMonth ? index * 0.008 : 0,
        ease: "easeOut",
      }}
      // Spring pop on selection
      whileTap={isCurrentMonth ? { scale: 0.88 } : {}}
      onClick={isCurrentMonth ? onClick : undefined}
      onMouseEnter={isCurrentMonth ? onMouseEnter : undefined}
      title={holidayName ?? undefined}
      aria-label={`${format(date, "MMMM d, yyyy")}${
        isStart ? ", selected as start date" : ""
      }${isEnd ? ", selected as end date" : ""}${
        holidayName ? `, ${holidayName}` : ""
      }`}
      role="button"
      tabIndex={isCurrentMonth ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isCurrentMonth) onClick();
        }
      }}
      className={clsx(
        "day-cell",
        // Outside current month
        !isCurrentMonth && "day-cell--outside",
        // Today indicator
        isToday && "day-cell--today",
        // Weekend color
        isWeekend && isCurrentMonth && !isSelected && "day-cell--weekend",
        // Range states
        isInRange && "day-cell--in-range",
        isRangeStartCap && "day-cell--range-start-cap",
        isRangeEndCap && "day-cell--range-end-cap",
        // Selected endpoints
        isStart && "day-cell--start",
        isEnd && "day-cell--end",
        // Holiday marker
        holidayName && !isSelected && "day-cell--holiday",
      )}
      style={{
        aspectRatio: "1",
        fontSize: "0.8rem",
      }}
    >
      {format(date, "d")}
    </motion.div>
  );
}