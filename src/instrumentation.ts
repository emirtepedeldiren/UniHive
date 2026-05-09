// Next.js instrumentation hook — runs before the server starts handling requests.
// Fixes the broken localStorage mock injected by Node.js --localstorage-file flag
// (used by some tools) which creates a localStorage object where getItem is not a function.

type GlobalWithStorage = typeof globalThis & {
  localStorage?: Storage | null;
  sessionStorage?: Storage | null;
};

function makeMockStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    key: (_index: number) => null,
    get length() { return Object.keys(store).length; },
  };
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const g = globalThis as GlobalWithStorage;

    if (g.localStorage !== undefined && g.localStorage !== null && typeof g.localStorage.getItem !== "function") {
      g.localStorage = makeMockStorage();
    }

    if (g.sessionStorage !== undefined && g.sessionStorage !== null && typeof g.sessionStorage.getItem !== "function") {
      g.sessionStorage = makeMockStorage();
    }
  }
}
