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

  // Are we in the middle of selecting (start chosen, end not yet)
  const isSelecting = range.start !== null && range.end === null;

  const onDayClick = useCallback(
    (date: Date) => {
      const clicked = startOfDay(date);

      // Case 1: Nothing selected yet → set start
      if (!range.start && !range.end) {
        setRange({ start: clicked, end: null });
        return;
      }

      // Case 2: Start selected, no end yet
      if (range.start && !range.end) {
        // Clicking the same start date → clear
        if (isSameDay(clicked, range.start)) {
          setRange({ start: null, end: null });
          return;
        }
        // Clicked before start → swap: new date becomes start
        if (isBefore(clicked, range.start)) {
          setRange({ start: clicked, end: range.start });
          return;
        }
        // Normal case: set end
        setRange({ start: range.start, end: clicked });
        return;
      }

      // Case 3: Full range already set → start fresh
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

  // Effective end: while selecting, use hoverDate as preview end
  const effectiveEnd =
    isSelecting && hoverDate ? hoverDate : range.end;

  const effectiveStart = range.start;

  // Normalize so start is always before end for interval checks
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

  // Is this date the visual left edge of the range highlight
  const isRangeStartCap = useCallback(
    (date: Date) => {
      if (!normalizedStart || !normalizedEnd) return false;
      if (isSameDay(normalizedStart, normalizedEnd)) return false;
      return isSameDay(date, normalizedStart);
    },
    [normalizedStart, normalizedEnd]
  );

  // Is this date the visual right edge of the range highlight
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