// src/store/storage.ts
// redux-persist's default storage uses localStorage directly,
// which throws on the server (Next.js SSR). This wrapper
// checks for window first and falls back to a no-op on the server.

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

function createNoopStorage() {
  return {
    getItem: (_key: string) => Promise.resolve(null),
    setItem: (_key: string, value: unknown) => Promise.resolve(value),
    removeItem: (_key: string) => Promise.resolve(),
  };
}

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;