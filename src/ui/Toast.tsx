import { useEffect } from 'react';
import styles from './Toast.module.css';

/** A short confirmation at the bottom of the screen that clears itself. */
export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDone, 2400);
    return () => clearTimeout(timer);
  }, [message, onDone]);

  return message ? (
    <div className={styles.toast} role="status">
      {message}
    </div>
  ) : null;
}
