import { TROPHY } from './mark';

/** The mark: a solid gold trophy. The emblem (`Emblem`) sets it in a laurel wreath. */
export function Trophy({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <TrophyShape />
    </svg>
  );
}

/** The trophy's shapes, for drawing inside another SVG. */
export function TrophyShape() {
  return (
    <g>
      <path d={TROPHY.body} fill="var(--gold)" />
      <path
        d={TROPHY.handles}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d={TROPHY.sheen}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  );
}
