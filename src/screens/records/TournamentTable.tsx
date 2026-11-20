import styles from '../../components/MedalTable.module.css';
import { routeHash } from '../../domain/routes';
import type { TournamentRow } from '../../domain/tournaments';
import { goTo } from '../../hooks/useRoute';
import { useI18n } from '../../i18n/context';
import { Avatar, RankBadge } from '../../ui/Badges';
import { MEDAL_INK } from '../../ui/medals';
import { MetalDot } from '../../ui/Ornaments';

/** World Cups and Euros only: titles, podiums and the average place. */
export function TournamentTable({ rows }: { rows: TournamentRow[] }) {
  const { t, name } = useI18n();
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">{t.player}</th>
          <th scope="col" title={t.titles}>
            <MetalDot rank={1} size={9} />
            <span className="visually-hidden">{t.titles}</span>
          </th>
          <th scope="col">{t.podiums}</th>
          <th scope="col" className={styles.hideSmall}>
            {t.tournamentsCount}
          </th>
          <th scope="col">{t.averagePlace}</th>
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
                  <span className={styles.name}>{name(row.player)}</span>
                </a>
              </td>
              <td
                className={`${styles.medal} num`}
                style={row.titles ? { color: MEDAL_INK[1] } : undefined}
              >
                <span className={row.titles ? undefined : styles.zero}>{row.titles || '·'}</span>
              </td>
              <td className={`${styles.medal} num`}>
                <span className={row.podiums ? undefined : styles.zero}>{row.podiums || '·'}</span>
              </td>
              <td className={`${styles.hideSmall} ${styles.seasons} num`}>{row.tournaments}</td>
              <td className={`${styles.medal} num`}>{row.average}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
