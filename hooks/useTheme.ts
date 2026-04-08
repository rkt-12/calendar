"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

export interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  isDark: boolean;
}

const STORAGE_KEY = "calendar-theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>("light");

  // reading from device preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") {
        setThemeState(stored);
        applyTheme(stored);
        return;
      }
    } catch (_) {}

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial: Theme = prefersDark ? "dark" : "light";
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  // Listen to OS preference changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(e: MediaQueryListEvent) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        // Only auto-switch if user hasn't manually chosen
        if (!stored) {
          const next: Theme = e.matches ? "dark" : "light";
          setThemeState(next);
          applyTheme(next);
        }
      } catch (_) {}
    }

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch (_) {}
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (_) {}
      return next;
    });
  }, []);

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === "dark",
  };
}