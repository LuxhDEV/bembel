import { useEffect, useState } from "react";

/** localStorage nach dem ersten Render, damit SSR und Client gleich starten. */
export function useStoredString(key: string, fallback: string) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(raw);
    } catch {
      /* privater Modus oder voller Speicher */
    }
  }, [key]);

  const update = (next: string) => {
    setValue(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      /* privater Modus oder voller Speicher */
    }
  };

  return [value, update] as const;
}
