"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Theme } from "@/hooks/useTheme";

interface ThemeSwitcherProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeSwitcher({
  theme,
  onToggle,
}: ThemeSwitcherProps) {
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        border: "1px solid var(--border)",
        background: "var(--surface-2)",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Moon
              size={15}
              strokeWidth={2}
              style={{ color: "var(--accent)" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Sun
              size={15}
              strokeWidth={2}
              style={{ color: "var(--accent)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}