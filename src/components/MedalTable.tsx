import { routeHash } from '../domain/routes';
import type { Career } from '../domain/stats';
import { goTo } from '../hooks/useRoute';
import { useI18n } from '../i18n/context';
import { Avatar, MedalPips, RankBadge } from '../ui/Badges';
import { MEDAL_INK } from '../ui/medals';
import { MetalDot } from '../ui/Ornaments';
import styles from './MedalTable.module.css';

const MEDALS = [
  { key: 'titles', rank: 1 },
  { key: 'seconds', rank: 2 },
  { key: 'thirds', rank: 3 },
] as const;

/** Ranked players with their medals. A row opens the player's page. */
export function MedalTable({ rows }: { rows: Career[] }) {
  const { t, name } = useI18n();
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{t.player}</th>
          {MEDALS.map((m) => (
            <th key={m.key} scope="col" title={t[m.key]}>
              <MetalDot rank={m.rank} size={9} />
              <span className="visually-hidden">{t[m.key]}</span>
            </th>
          ))}
          <th scope="col" className={styles.hideSmall}>
            {t.seasons}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => {
          const href = routeHash({ name: 'player', id: row.player.id });
          return (
            <tr key={row.player.id} className={styles.row} onClick={() => goTo(href)}>
              <td>
                <RankBadge rank={i + 1} size={26} />
              </td>
              <td>
                <a className={styles.who} href={href} aria-label={t.openPlayer(name(row.player))}>
                  <Avatar player={row.player} size={36} gold={i === 0} />
                  <span className={styles.whoText}>
                    <span className={styles.name}>{name(row.player)}</span>
                    <MedalPips titles={row.titles} seconds={row.seconds} thirds={row.thirds} />
                  </span>
                </a>
              </td>
              {MEDALS.map((m) => (
                <td
                  key={m.key}
                  className={`${styles.medal} num`}
                  style={row[m.key] ? { color: MEDAL_INK[m.rank] } : undefined}
                >
                  <span className={row[m.key] ? undefined : styles.zero}>{row[m.key] || '·'}</span>
                </td>
              ))}
              <td className={`${styles.hideSmall} ${styles.seasons} num`}>{row.appearances}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
