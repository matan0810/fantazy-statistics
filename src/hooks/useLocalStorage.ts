import { useCallback, useState } from 'react';
import { readStored } from './storage';

function load<T>(key: string, fallback: T, parse: (value: unknown) => T | undefined): T {
  try {
    return readStored(localStorage.getItem(key), fallback, parse);
  } catch {
    return fallback;
  }
}

/**
 * `useState` that survives reloads. What was saved is checked by `parse` (undefined means
 * "not valid": the fallback is used). Storage failures (private mode, quota) are ignored.
 */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  parse: (value: unknown) => T | undefined,
) {
  const [value, setValue] = useState<T>(() => load(key, fallback, parse));

  const update = useCallback(
    (next: T) => {
      setValue(next);
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Persisting is best-effort; the in-memory value still updates.
      }
    },
    [key],
  );

  return [value, update] as const;
}
