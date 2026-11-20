import { useId, type CSSProperties, type ReactNode } from 'react';
import { laurelBranch } from './laurel';
import styles from './Ornaments.module.css';

/** A thin gold rule with a diamond at its centre: the divider under every title. */
export function Ornament({ reach = 64, className = '' }: { reach?: number; className?: string }) {
  return (
    <div
      className={`${styles.ornament} ${className}`}
      style={{ '--reach': `${reach}px` } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 22 10">
        <path d="M11 0.5 15 5 11 9.5 7 5Z" fill="currentColor" />
        <circle cx="2" cy="5" r="1.2" fill="currentColor" opacity="0.6" />
        <circle cx="20" cy="5" r="1.2" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

const LEAF = 'M0 0C5-5.5 14-6 21 0C14 6 5 5.5 0 0Z';
const BRANCH = laurelBranch(100, 70, 9);

/** A laurel wreath in gold, open at the top, with whatever is given in its centre. */
export function Laurel({ size = 120, children }: { size?: number; children?: ReactNode }) {
  const id = useId().replace(/:/g, '');
  const gold = `laurel-gold-${id}`;
  const half = (
    <g>
      <path
        d="M86 172C46 158 24 116 34 72"
        fill="none"
        stroke={`url(#${gold})`}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {BRANCH.map((leaf, i) => (
        <path
          key={i}
          d={LEAF}
          fill={`url(#${gold})`}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})`}
        />
      ))}
    </g>
  );
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-grid',
        placeItems: 'center',
        width: size,
        height: size,
      }}
    >
      <svg
        className={styles.laurel}
        viewBox="0 0 200 200"
        width={size}
        height={size}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e4b4" />
            <stop offset="0.45" stopColor="#d4b06a" />
            <stop offset="1" stopColor="#8f6b2e" />
          </linearGradient>
        </defs>
        {half}
        <g transform="translate(200 0) scale(-1 1)">{half}</g>
        <path
          d="M92 176 100 168 108 176"
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span style={{ position: 'relative' }}>{children}</span>
    </span>
  );
}

const METAL: Record<number, [string, string, string]> = {
  1: ['#f6e4b4', '#d4b06a', '#8f6b2e'],
  2: ['#f4f5f7', '#c3c7cf', '#80858e'],
  3: ['#f0c39b', '#c48a5a', '#7d4a26'],
};
const RIBBON: Record<number, string> = { 1: '#7a2232', 2: '#26375f', 3: '#2f4a3a' };

/** A medal on its ribbon, gold, silver or bronze. */
export function Medal({ rank, size = 28 }: { rank: 1 | 2 | 3; size?: number }) {
  // Unique per medal: a gradient defined inside a hidden copy would not paint the others.
  const id = `medal-${rank}-${useId().replace(/:/g, '')}`;
  const [light, mid, dark] = METAL[rank] ?? ['#fff', '#ccc', '#888'];
  return (
    <svg viewBox="0 0 24 34" width={(size * 24) / 34} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path d="M4 0h6l4 12H8Z" fill={RIBBON[rank]} />
      <path d="M20 0h-6l-4 12h6Z" fill={RIBBON[rank]} opacity="0.85" />
      <circle cx="12" cy="22" r="10" fill={`url(#${id})`} />
      <circle
        cx="12"
        cy="22"
        r="7.2"
        fill="none"
        stroke={dark}
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <text
        x="12"
        y="25.6"
        textAnchor="middle"
        fontFamily="Frank Ruhl Libre Variable, Georgia, serif"
        fontSize="10"
        fontWeight="700"
        fill={dark}
      >
        {rank}
      </text>
    </svg>
  );
}

/** A trophy cup in fine gold line. */
export function Trophy({ size = 34 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="var(--gold)"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 5h12v6a6 6 0 0 1-12 0Z" />
      <path d="M10 7H6.5a3.5 3.5 0 0 0 3.8 4.6M22 7h3.5a3.5 3.5 0 0 1-3.8 4.6" />
      <path d="M16 17v5M12 26h8M13 22h6l1 4h-8Z" />
    </svg>
  );
}
