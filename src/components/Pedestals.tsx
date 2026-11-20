import type { CSSProperties, ReactNode } from 'react';
import type { Player } from '../domain/types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/context';
import { Avatar } from '../ui/Badges';
import { MEDAL_COLOR, MEDAL_INK } from '../ui/medals';
import { Laurel } from '../ui/Ornaments';
import styles from './Pedestals.module.css';

export interface PedestalEntry {
  place: 1 | 2 | 3;
  player: Player;
  href: string;
  /** Under the name: a team, a title count. */
  caption: ReactNode;
  /** The last line: points, medals. */
  detail: ReactNode;
}

const PLINTH: Record<number, number> = { 1: 150, 2: 112, 3: 86 };
// second, first, third: the first stands in the middle
const ORDER = [2, 1, 3] as const;

/** Three players on plinths of stone with engraved metal numerals; the first in a laurel. */
export function Pedestals({ entries, label }: { entries: PedestalEntry[]; label: string }) {
  const { name } = useI18n();
  const narrow = useMediaQuery('(max-width: 640px)');

  return (
    <div role="group" aria-label={label}>
      <div className={styles.stage}>
        {ORDER.map((place) => {
          const e = entries.find((x) => x.place === place);
          if (!e) return <div key={place} />;
          const size = narrow ? (place === 1 ? 54 : 48) : place === 1 ? 84 : 68;
          const avatar = <Avatar player={e.player} size={size} gold={place === 1} />;
          return (
            <a
              key={place}
              className={styles.legend}
              href={e.href}
              style={{ '--delay': `${(3 - place) * 120}ms` } as CSSProperties}
            >
              <span className={styles.portrait}>
                {place === 1 ? <Laurel size={narrow ? 112 : 160}>{avatar}</Laurel> : avatar}
              </span>
              <span className={styles.name}>{name(e.player)}</span>
              <span className={styles.titles}>{e.caption}</span>
              <span className={styles.medals}>{e.detail}</span>
              <span
                className={styles.plinth}
                style={
                  {
                    '--h': `${(PLINTH[place] ?? 80) * (narrow ? 0.7 : 1)}px`,
                    '--metal': MEDAL_COLOR[place],
                    '--edge': MEDAL_INK[place],
                  } as CSSProperties
                }
              >
                <span className={styles.numeral}>{place}</span>
              </span>
            </a>
          );
        })}
      </div>
      <div className={styles.floor} />
    </div>
  );
}
