import { useState, useCallback, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  getDay,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface UseCalendarReturn {
  currentDate: Date;
  calendarDays: CalendarDay[];
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
}

function buildCalendarDays(referenceDate: Date): CalendarDay[] {
  const monthStart = startOfMonth(referenceDate);
  const monthEnd = endOfMonth(referenceDate);

  // Week starts on Monday
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  // ensuring there are 42 days
  while (allDays.length < 42) {
    const last = allDays[allDays.length - 1];
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    allDays.push(next);
  }

  return allDays.slice(0, 42).map((date) => {
    const dayOfWeek = getDay(date); // 0 = Sunday, 6 = Saturday
    return {
      date,
      isCurrentMonth: isSameMonth(date, referenceDate),
      isToday: isToday(date),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });
}

export function useCalendar(): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const calendarDays = useMemo(
    () => buildCalendarDays(currentDate),
    [currentDate]
  );

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => addMonths(prev, 1));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentDate((prev) => subMonths(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return {
    currentDate,
    calendarDays,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  };
}