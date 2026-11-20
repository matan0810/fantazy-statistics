import type { CSSProperties, ReactNode } from 'react';
import type { Player } from '../domain/types';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/context';
import { Avatar } from '../ui/Badges';
import { MEDAL_COLOR } from '../ui/medals';
import { roman } from '../ui/roman';
import styles from './Honours.module.css';

export interface Honour {
  place: 1 | 2 | 3;
  player: Player;
  href: string;
  /** Under the name: a team, a title count. */
  caption: ReactNode;
  /** The last line: points, medals. */
  detail: ReactNode;
}

/** The first three, side by side in reading order, each under its Roman numeral. */
export function Honours({ entries, label }: { entries: Honour[]; label: string }) {
  const { name } = useI18n();
  const narrow = useMediaQuery('(max-width: 640px)');
  const sorted = [...entries].sort((a, b) => a.place - b.place);

  return (
    <div className={styles.row} role="group" aria-label={label}>
      {sorted.map((e) => (
        <a
          key={e.place}
          className={styles.place}
          href={e.href}
          style={
            { '--metal': MEDAL_COLOR[e.place], '--delay': `${e.place * 90}ms` } as CSSProperties
          }
        >
          <span className={styles.numeral} aria-hidden="true">
            {roman(e.place)}
          </span>
          <Avatar player={e.player} size={narrow ? 40 : 52} gold={e.place === 1} />
          <span className={styles.name}>{name(e.player)}</span>
          <span className={styles.caption}>{e.caption}</span>
          <span className={styles.detail}>{e.detail}</span>
        </a>
      ))}
    </div>
  );
}
