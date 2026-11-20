import type { CSSProperties } from 'react';
import type { Placing } from '../../domain/stats';
import { useI18n } from '../../i18n/context';
import { Avatar } from '../../ui/Badges';
import { MEDAL_COLOR } from '../../ui/medals';
import styles from './Podium.module.css';

const HEIGHT: Record<number, number> = { 1: 140, 2: 108, 3: 88 };
// second, first, third: the champion stands in the middle
const ORDER = [2, 1, 3];

export function Podium({ table }: { table: Placing[] }) {
  const { t, name } = useI18n();
  return (
    <div className={styles.podium} aria-label={t.podium} role="group">
      {ORDER.map((rank) => {
        const p = table.find((x) => x.result.rank === rank);
        if (!p) return <div key={rank} />;
        return (
          <a
            key={rank}
            className={styles.step}
            href={`#/player/${p.player.id}`}
            style={
              {
                '--medal': MEDAL_COLOR[rank],
                '--h': `${HEIGHT[rank]}px`,
                '--delay': `${(3 - rank) * 90 + 100}ms`,
              } as CSSProperties
            }
          >
            <Avatar
              player={p.player}
              size={rank === 1 ? 64 : 50}
              ring={rank === 1 ? 'rgb(242 193 78 / 45%)' : undefined}
            />
            <span className={styles.name}>{name(p.player)}</span>
            <span className={styles.team}>{p.result.team ?? ''}</span>
            <span className={styles.block}>
              <span className={styles.rank}>{rank}</span>
              {p.result.points !== null && (
                <span className={`${styles.points} num`}>{t.pointsValue(p.result.points)}</span>
              )}
            </span>
          </a>
        );
      })}
    </div>
  );
}
