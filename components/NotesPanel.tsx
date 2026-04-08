"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { X, StickyNote, CalendarRange } from "lucide-react";
import { DateRange } from "@/hooks/useDateRangeSelector";

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

  return (
    <div className="notes-panel px-4 py-4 space-y-4">

      {/* Month Note */}
      <div>
        {/* Label row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <StickyNote
              size={11}
              style={{ color: "var(--text-secondary)" }}
            />
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
          {/* Char counter */}
          <span
            style={{
              fontSize: "0.6rem",
              color:
                monthCharsLeft < 30
                  ? "var(--accent)"
                  : "var(--text-muted)",
              transition: "color 0.2s ease",
            }}
          >
            {monthNote.length > 0 && `${monthCharsLeft}`}
          </span>
        </div>

        {/* Textarea */}
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
                border: "1px solid var(--accent)",
                borderStyle: "dashed",
              }}
            >
              <CalendarRange
                size={12}
                style={{ color: "var(--accent)", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "var(--accent)",
                  fontWeight: 500,
                }}
              >
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
            {/* Range badge */}
            <div className="flex items-center justify-between mb-1.5">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--accent-light)",
                  border: "1px solid var(--accent)",
                }}
              >
                <CalendarRange
                  size={10}
                  style={{ color: "var(--accent)" }}
                />
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

              {/* Char counter + clear */}
              <div className="flex items-center gap-2">
                <span
                  style={{
                    fontSize: "0.6rem",
                    color:
                      rangeCharsLeft < 30
                        ? "var(--accent)"
                        : "var(--text-muted)",
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