// Next.js instrumentation hook — runs before the server starts handling requests.
// Fixes the broken localStorage mock injected by Node.js --localstorage-file flag
// (used by some tools) which creates a localStorage object where getItem is not a function.

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const g = global as any;

    // If localStorage exists but is broken (getItem not a function), replace it
    if (
      g.localStorage !== undefined &&
      typeof g.localStorage.getItem !== "function"
    ) {
      g.localStorage = {
        _store: {} as Record<string, string>,
        getItem(key: string) {
          return this._store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this._store[key] = value;
        },
        removeItem(key: string) {
          delete this._store[key];
        },
        clear() {
          this._store = {};
        },
        key(_index: number) {
          return null;
        },
        get length() {
          return Object.keys(this._store).length;
        },
      };
    }

    // Also polyfill sessionStorage if broken
    if (
      g.sessionStorage !== undefined &&
      typeof g.sessionStorage.getItem !== "function"
    ) {
      g.sessionStorage = {
        _store: {} as Record<string, string>,
        getItem(key: string) {
          return this._store[key] ?? null;
        },
        setItem(key: string, value: string) {
          this._store[key] = value;
        },
        removeItem(key: string) {
          delete this._store[key];
        },
        clear() {
          this._store = {};
        },
        key(_index: number) {
          return null;
        },
        get length() {
          return Object.keys(this._store).length;
        },
      };
    }
  }
}
