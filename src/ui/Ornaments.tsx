import type { CSSProperties } from 'react';
import { MEDAL_COLOR } from './medals';
import styles from './Ornaments.module.css';

/** A short gold hairline: the only ornament, under titles. */
export function Ornament({ reach = 40, center = false }: { reach?: number; center?: boolean }) {
  return (
    <span
      className={`${styles.rule} ${center ? styles.center : ''}`}
      style={{ '--reach': `${reach}px` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

/** A flat disc in gold, silver or bronze. */
export function MetalDot({ rank, size = 8 }: { rank: 1 | 2 | 3; size?: number }) {
  return (
    <span
      className={styles.metal}
      style={{ '--size': `${size}px`, '--metal': MEDAL_COLOR[rank] } as CSSProperties}
      aria-hidden="true"
    />
  );
}
