import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "package_compliance_checker_theme";
const listeners = new Set<() => void>();

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function getDeviceTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let currentTheme: Theme = getStoredTheme() ?? getDeviceTheme();

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

applyTheme(currentTheme);

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Theme {
  return currentTheme;
}

export function setTheme(theme: Theme): void {
  currentTheme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  emitChange();
}

export function toggleTheme(): void {
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, () => "light");
}

window.addEventListener("storage", (event) => {
  if (event.key !== THEME_STORAGE_KEY) return;
  currentTheme = getStoredTheme() ?? getDeviceTheme();
  applyTheme(currentTheme);
  emitChange();
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (getStoredTheme()) return;
  currentTheme = getDeviceTheme();
  applyTheme(currentTheme);
  emitChange();
});