import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { DateRange } from "./useDateRangeSelector";

export interface Note {
  id: string;
  key: string;           // "2024-01" or "2024-01-15:2024-01-20"
  label: string;         // "January 2024" or "Jan 15 -> Jan 20"
  content: string;
  createdAt: string;
  updatedAt: string;
  rangeStart: string | null;
  rangeEnd: string | null;
}

export interface UseNotesReturn {
  notes: Record<string, Note>;
  monthNote: string;
  rangeNote: string;
  setMonthNote: (content: string) => void;
  setRangeNote: (content: string, range: DateRange) => void;
  deleteNote: (key: string) => void;
  getAllNotes: () => Note[];
  getMonthKey: (date: Date) => string;
  getRangeKey: (range: DateRange) => string | null;
  activeMonthKey: string;
  activeRangeKey: string | null;
}

const STORAGE_KEY = "wall-calendar-notes";

function now(): string {
  return new Date().toISOString();
}

export function useNotes(
  currentDate: Date,
  range: DateRange
): UseNotesReturn {
  const [notes, setNotes] = useState<Record<string, Note>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load notes from localStorage", e);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage when notes change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.warn("Failed to save notes to localStorage", e);
    }
  }, [notes, hydrated]);

  const getMonthKey = useCallback((date: Date): string => {
    return format(date, "yyyy-MM");
  }, []);

  const getRangeKey = useCallback((r: DateRange): string | null => {
    if (!r.start || !r.end) return null;
    return `${format(r.start, "yyyy-MM-dd")}:${format(r.end, "yyyy-MM-dd")}`;
  }, []);

  const activeMonthKey = getMonthKey(currentDate);
  const activeRangeKey = getRangeKey(range);

  const monthNote = notes[activeMonthKey]?.content ?? "";
  const rangeNote = activeRangeKey ? (notes[activeRangeKey]?.content ?? "") : "";

  // CRUD 
  const setMonthNote = useCallback(
    (content: string) => {
      setNotes((prev) => {
        const existing = prev[activeMonthKey];
        if (!content.trim()) {
          const updated = { ...prev };
          delete updated[activeMonthKey];
          return updated;
        }
        return {
          ...prev,
          [activeMonthKey]: {
            id: existing?.id ?? `month-${activeMonthKey}`,
            key: activeMonthKey,
            label: format(currentDate, "MMMM yyyy"),
            content,
            createdAt: existing?.createdAt ?? now(),
            updatedAt: now(),
            rangeStart: null,
            rangeEnd: null,
          },
        };
      });
    },
    [activeMonthKey, currentDate]
  );

  const setRangeNote = useCallback(
    (content: string, r: DateRange) => {
      const key = getRangeKey(r);
      if (!key || !r.start || !r.end) return;

      setNotes((prev) => {
        const existing = prev[key];
        if (!content.trim()) {
          const updated = { ...prev };
          delete updated[key];
          return updated;
        }
        return {
          ...prev,
          [key]: {
            id: existing?.id ?? `range-${key}`,
            key,
            label: `${format(r.start!, "MMM d")} → ${format(r.end!, "MMM d, yyyy")}`,
            content,
            createdAt: existing?.createdAt ?? now(),
            updatedAt: now(),
            rangeStart: format(r.start!, "yyyy-MM-dd"),
            rangeEnd: format(r.end!, "yyyy-MM-dd"),
          },
        };
      });
    },
    [getRangeKey]
  );

  const deleteNote = useCallback((key: string) => {
    setNotes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const getAllNotes = useCallback((): Note[] => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes]);

  return {
    notes,
    monthNote,
    rangeNote,
    setMonthNote,
    setRangeNote,
    deleteNote,
    getAllNotes,
    getMonthKey,
    getRangeKey,
    activeMonthKey,
    activeRangeKey,
  };
}