import type { CSSProperties, ReactNode } from 'react';
import type { Player } from '../domain/types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReveal } from '../hooks/useReveal';
import { useI18n } from '../i18n/context';
import { Avatar } from '../ui/Badges';
import { MEDAL_COLOR } from '../ui/medals';
import { roman } from '../ui/roman';
import styles from './Podium.module.css';
import { PODIUM_HEIGHT, podiumSlots, type Place } from './podiumSlots';

export interface PodiumEntry {
  place: Place;
  player: Player;
  href: string;
  /** Under the name: a team, a title count. */
  caption: ReactNode;
  /** On the front of the block: points, medals. */
  face: ReactNode;
}

/** A fine-line crown for the champion. */
function Crown() {
  return (
    <svg
      className={styles.crown}
      viewBox="0 0 34 20"
      fill="none"
      stroke="var(--gold)"
      strokeWidth="1.2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 16.5 5 5l6.5 6L17 2.5 22.5 11 29 5l2 11.5Z" />
      <path d="M4.5 19h25" />
      <circle cx="17" cy="2.5" r="1" fill="var(--gold)" />
    </svg>
  );
}

const DELAY: Record<Place, number> = { 3: 0, 2: 140, 1: 280 };

/** The first three on a podium; a missing place keeps its empty block. */
export function Podium({ entries, label }: { entries: PodiumEntry[]; label: string }) {
  const { name } = useI18n();
  const narrow = useMediaQuery('(max-width: 640px)');
  const [ref, shown] = useReveal<HTMLDivElement>();

  return (
    // A podium is built the same way in any language: second, first, third.
    <div
      ref={ref}
      className={styles.podium}
      data-shown={shown ? '' : undefined}
      role="group"
      aria-label={label}
      dir="ltr"
    >
      <div className={styles.light} aria-hidden="true" />
      <div className={styles.stage}>
        {podiumSlots(entries).map(({ place, entry }) => (
          <div
            key={place}
            className={styles.slot}
            data-place={place}
            data-empty={entry ? undefined : ''}
            style={
              {
                '--h': PODIUM_HEIGHT[place],
                '--metal': MEDAL_COLOR[place],
                '--delay': `${DELAY[place]}ms`,
              } as CSSProperties
            }
          >
            {entry ? (
              <a className={styles.person} href={entry.href} dir="auto">
                {place === 1 && <Crown />}
                <Avatar
                  player={entry.player}
                  size={narrow ? (place === 1 ? 46 : 38) : place === 1 ? 64 : 50}
                  gold={place === 1}
                />
                <span className={styles.name}>{name(entry.player)}</span>
                <span className={styles.caption}>{entry.caption}</span>
              </a>
            ) : (
              <span className={styles.person} aria-hidden="true" />
            )}
            <div className={styles.block}>
              <span className={styles.numeral} aria-hidden="true">
                {roman(place)}
              </span>
              {entry && (
                <span className={`${styles.face} num`} dir="auto">
                  {entry.face}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.floor} />
    </div>
  );
}
