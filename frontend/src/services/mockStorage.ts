export const STORAGE_KEY = "package_compliance_checker_db";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(`${STORAGE_KEY}:${key}`, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  localStorage.removeItem(`${STORAGE_KEY}:${key}`);
}