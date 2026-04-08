import { useState, useCallback } from "react";
import { isAfter, isBefore, isSameDay, isWithinInterval, startOfDay } from "date-fns";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface UseDateRangeSelectorReturn {
  range: DateRange;
  hoverDate: Date | null;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date) => void;
  onDayLeave: () => void;
  clearRange: () => void;
  isStart: (date: Date) => boolean;
  isEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  isRangeStartCap: (date: Date) => boolean;
  isRangeEndCap: (date: Date) => boolean;
  isSelecting: boolean;
}

export function useDateRangeSelector(): UseDateRangeSelectorReturn {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // in the middle of selecting
  const isSelecting = range.start !== null && range.end === null;

  const onDayClick = useCallback(
    (date: Date) => {
      const clicked = startOfDay(date);

      // Nothing selected -> set start
      if (!range.start && !range.end) {
        setRange({ start: clicked, end: null });
        return;
      }

      // Start selected, not ended
      if (range.start && !range.end) {
        // clicked the same day -> clear
        if (isSameDay(clicked, range.start)) {
          setRange({ start: null, end: null });
          return;
        }
        // Clicked before start -> swap
        if (isBefore(clicked, range.start)) {
          setRange({ start: clicked, end: range.start });
          return;
        }
        // set end
        setRange({ start: range.start, end: clicked });
        return;
      }

      // Full range already set -> start fresh
      setRange({ start: clicked, end: null });
    },
    [range]
  );

  const onDayHover = useCallback((date: Date) => {
    setHoverDate(startOfDay(date));
  }, []);

  const onDayLeave = useCallback(() => {
    setHoverDate(null);
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setHoverDate(null);
  }, []);

  const effectiveEnd =
    isSelecting && hoverDate ? hoverDate : range.end;

  const effectiveStart = range.start;

  const normalizedStart =
    effectiveStart && effectiveEnd
      ? isBefore(effectiveStart, effectiveEnd)
        ? effectiveStart
        : effectiveEnd
      : effectiveStart;

  const normalizedEnd =
    effectiveStart && effectiveEnd
      ? isAfter(effectiveEnd, effectiveStart)
        ? effectiveEnd
        : effectiveStart
      : effectiveEnd;

  const isStart = useCallback(
    (date: Date) => {
      if (!range.start) return false;
      return isSameDay(date, range.start);
    },
    [range.start]
  );

  const isEnd = useCallback(
    (date: Date) => {
      if (!effectiveEnd) return false;
      return isSameDay(date, effectiveEnd);
    },
    [effectiveEnd]
  );

  const isInRange = useCallback(
    (date: Date) => {
      if (!normalizedStart || !normalizedEnd) return false;
      if (isSameDay(normalizedStart, normalizedEnd)) return false;
      return isWithinInterval(startOfDay(date), {
        start: normalizedStart,
        end: normalizedEnd,
      });
    },
    [normalizedStart, normalizedEnd]
  );

  const isRangeStartCap = useCallback(
    (date: Date) => {
      if (!normalizedStart || !normalizedEnd) return false;
      if (isSameDay(normalizedStart, normalizedEnd)) return false;
      return isSameDay(date, normalizedStart);
    },
    [normalizedStart, normalizedEnd]
  );

  const isRangeEndCap = useCallback(
    (date: Date) => {
      if (!normalizedStart || !normalizedEnd) return false;
      if (isSameDay(normalizedStart, normalizedEnd)) return false;
      return isSameDay(date, normalizedEnd);
    },
    [normalizedStart, normalizedEnd]
  );

  return {
    range,
    hoverDate,
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
  };
}