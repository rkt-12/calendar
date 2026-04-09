"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, StickyNote, CalendarRange, Clock } from "lucide-react";
import { DateRange } from "@/hooks/useDateRangeSelector";
import { getRangeDuration, getRangeDurationColor } from "@/utils/dateUtils";

interface NotesPanelProps {
  currentDate: Date;
  range: DateRange;
  monthNote: string;
  rangeNote: string;
  isSelecting: boolean;
  onMonthNoteChange: (value: string) => void;
  onRangeNoteChange: (value: string) => void;
  onClearRange: () => void;
}

const MAX_CHARS = 280;

export default function NotesPanel({
  currentDate,
  range,
  monthNote,
  rangeNote,
  isSelecting,
  onMonthNoteChange,
  onRangeNoteChange,
  onClearRange,
}: NotesPanelProps) {
  const hasRange = range.start !== null && range.end !== null;
  const monthCharsLeft = MAX_CHARS - monthNote.length;
  const rangeCharsLeft = MAX_CHARS - rangeNote.length;

  const duration =
    hasRange ? getRangeDuration(range.start!, range.end!) : null;
  const durationColor =
    hasRange ? getRangeDurationColor(range.start!, range.end!) : null;

  return (
    <div className="notes-panel px-4 py-4 space-y-4">

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <StickyNote size={11} style={{ color: "var(--text-secondary)" }} />
            <span
              className="uppercase tracking-widest"
              style={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              {format(currentDate, "MMMM yyyy")}
            </span>
          </div>
          <span
            style={{
              fontSize: "0.6rem",
              color: monthCharsLeft < 30 ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {monthNote.length > 0 && `${monthCharsLeft}`}
          </span>
        </div>
        <textarea
          className="notes-textarea"
          rows={2}
          maxLength={MAX_CHARS}
          placeholder={`Jot down notes for ${format(currentDate, "MMMM")}...`}
          value={monthNote}
          onChange={(e) => onMonthNoteChange(e.target.value)}
          aria-label={`Notes for ${format(currentDate, "MMMM yyyy")}`}
        />
      </div>

      {/* Selecting hint */}
      <AnimatePresence>
        {isSelecting && !hasRange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: "var(--accent-light)",
                border: "1px dashed var(--accent)",
              }}
            >
              <CalendarRange
                size={12}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--accent)", fontWeight: 500 }}>
                From {format(range.start!, "MMM d")} — now pick an end date
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Range Note */}
      <AnimatePresence>
        {hasRange && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Range badge row */}
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              {/* Date range label */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--accent-light)",
                  border: "1px solid var(--accent)",
                  flexShrink: 0,
                }}
              >
                <CalendarRange size={10} style={{ color: "var(--accent)" }} />
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {format(range.start!, "MMM d")}
                  {" → "}
                  {format(range.end!, "MMM d, yyyy")}
                </span>
              </div>

              {/* Duration badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={duration ?? "none"}
                  initial={{ opacity: 0, scale: 0.75, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                  style={{
                    background: `${durationColor}18`,
                    border: `1px solid ${durationColor}55`,
                    flexShrink: 0,
                  }}
                >
                  <Clock size={9} style={{ color: durationColor ?? undefined }} />
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: durationColor ?? undefined,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {duration}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Char counter + clear */}
              <div className="flex items-center gap-2 ml-auto">
                <span
                  style={{
                    fontSize: "0.6rem",
                    color: rangeCharsLeft < 30 ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {rangeNote.length > 0 && `${rangeCharsLeft}`}
                </span>
                <motion.button
                  onClick={onClearRange}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-1"
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                  }}
                  aria-label="Clear date range"
                >
                  <X size={9} />
                  <span>Clear</span>
                </motion.button>
              </div>
            </div>

            {/* Range textarea */}
            <textarea
              className="notes-textarea"
              rows={2}
              maxLength={MAX_CHARS}
              placeholder="Add a note for this date range..."
              value={rangeNote}
              onChange={(e) => onRangeNoteChange(e.target.value)}
              aria-label={`Notes for range ${format(range.start!, "MMM d")} to ${format(range.end!, "MMM d, yyyy")}`}
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}