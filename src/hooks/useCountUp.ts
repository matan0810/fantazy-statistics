import { useEffect, useState } from 'react';

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** A number that counts up to `target` once, easing out; at once with reduced motion. */
export function useCountUp(target: number, duration = 1400, delay = 300): number {
  const [value, setValue] = useState(() => (reduced() ? target : 0));

  useEffect(() => {
    // with reduced motion the first render already shows the final number
    if (reduced()) return;
    let frame = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, delay]);

  return value;
}
