import { useEffect, useRef, useState } from 'react';

/**
 * Whether an element has come into view, for a soft entrance as the reader scrolls.
 * Without IntersectionObserver everything is shown at once; once shown it stays shown.
 */
export function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  return [ref, shown] as const;
}
