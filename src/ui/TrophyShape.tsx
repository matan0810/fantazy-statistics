import { TROPHY } from './mark';

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
