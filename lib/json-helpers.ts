/**
 * Type-safe JSON parse/stringify utilities for SQLite text columns
 */

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toJson<T>(value: T): string {
  return JSON.stringify(value);
}
