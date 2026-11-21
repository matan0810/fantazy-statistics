import { LEAF_PATH, WREATH, WREATH_TIE } from './mark';
import { TrophyShape } from './Trophy';

/** The trophy in a laurel wreath: the mark at its grandest, for the home page. */
export function Emblem({ size = 96, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      {WREATH.map((b, i) => (
        <g key={i}>
          <path d={b.stem} fill="none" stroke="var(--gold)" strokeWidth="1.3" />
          {b.leaves.map((leaf, j) => (
            <path
              key={j}
              d={LEAF_PATH}
              fill="var(--gold)"
              transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rotate}) scale(${leaf.scale})`}
            />
          ))}
        </g>
      ))}
      <path d={WREATH_TIE} fill="none" stroke="var(--gold)" strokeWidth="1.4" />
      <g transform="translate(22 19) scale(0.56)">
        <TrophyShape />
      </g>
    </svg>
  );
}
