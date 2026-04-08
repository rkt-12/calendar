"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Trash2, ChevronDown, ChevronUp, StickyNote, CalendarRange } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import { useState } from "react";

interface NotesListProps {
  notes: Note[];
  onDelete: (key: string) => void;
  onNoteClick?: (note: Note) => void;
}

export default function NotesList({
  notes,
  onDelete,
  onNoteClick,
}: NotesListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);

  if (notes.length === 0) return null;

  const visibleNotes = isExpanded ? notes : notes.slice(0, 2);
  const hasMore = notes.length > 2;

  function handleDelete(key: string) {
    setDeletingKey(key);
    setTimeout(() => {
      onDelete(key);
      setDeletingKey(null);
    }, 250);
  }

  return (
    <div
      className="px-4 pb-4"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between pt-3 mb-2">
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
            Saved Notes
          </span>
          {/* Count badge */}
          <span
            className="flex items-center justify-center rounded-full"
            style={{
              width: "16px",
              height: "16px",
              fontSize: "0.55rem",
              fontWeight: 700,
              background: "var(--accent)",
              color: "#ffffff",
            }}
          >
            {notes.length}
          </span>
        </div>

        {/* Expand / collapse */}
        {hasMore && (
          <motion.button
            onClick={() => setIsExpanded((v) => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1"
            style={{
              fontSize: "0.6rem",
              color: "var(--accent)",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <span>{isExpanded ? "Show less" : `+${notes.length - 2} more`}</span>
            {isExpanded ? (
              <ChevronUp size={10} />
            ) : (
              <ChevronDown size={10} />
            )}
          </motion.button>
        )}
      </div>

      {/* Notes list */}
      <div className="space-y-1.5">
        <AnimatePresence initial={false}>
          {visibleNotes.map((note) => {
            const isRange = note.rangeStart !== null;
            const isDeleting = deletingKey === note.key;

            return (
              <motion.div
                key={note.key}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{
                  opacity: isDeleting ? 0 : 1,
                  y: 0,
                  scale: isDeleting ? 0.96 : 1,
                }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="group flex items-start gap-2 p-2.5 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-light)",
                  }}
                  onClick={() => onNoteClick?.(note)}
                >
                  {/* Icon */}
                  <div
                    className="shrink-0 mt-0.5"
                    style={{ color: isRange ? "var(--accent)" : "var(--text-muted)" }}
                  >
                    {isRange ? (
                      <CalendarRange size={12} />
                    ) : (
                      <StickyNote size={12} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Label */}
                    <p
                      className="font-medium truncate"
                      style={{
                        fontSize: "0.7rem",
                        color: isRange ? "var(--accent)" : "var(--text-secondary)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {note.label}
                    </p>
                    {/* Preview */}
                    <p
                      className="line-clamp-1 mt-0.5"
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {note.content}
                    </p>
                    {/* Timestamp */}
                    <p
                      className="mt-1"
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {format(parseISO(note.updatedAt), "MMM d, h:mm a")}
                    </p>
                  </div>

                  {/* Delete button — visible on hover */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.key);
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                    style={{
                      color: "var(--text-muted)",
                    }}
                    aria-label={`Delete note: ${note.label}`}
                  >
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}