// Client-only favorites, stored in localStorage so they work without accounts.
const KEY = "cornerpost:favorites";
export const FAVORITES_EVENT = "cornerpost:favorites-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  // Let other mounted hearts / the favorites page react instantly.
  window.dispatchEvent(new Event(FAVORITES_EVENT));
}

export function getFavorites(): string[] {
  return read();
}

export function isFavorite(id: string): boolean {
  return read().includes(id);
}

/** Toggle a favorite; returns the new state (true = now favorited). */
export function toggleFavorite(id: string): boolean {
  const ids = read();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
    write(ids);
    return true;
  }
  ids.splice(idx, 1);
  write(ids);
  return false;
}
