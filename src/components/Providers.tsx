"use client";
import { SessionProvider } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  dark: boolean;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  mode: "system",
  setMode: () => {},
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") ?? "system") as ThemeMode;
    setModeState(stored);
    applyTheme(stored);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if ((localStorage.getItem("theme") ?? "system") === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  function applyTheme(m: ThemeMode) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = m === "dark" || (m === "system" && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }

  function setMode(m: ThemeMode) {
    setModeState(m);
    localStorage.setItem("theme", m);
    applyTheme(m);
  }

  function toggle() {
    setMode(dark ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ dark, mode, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
