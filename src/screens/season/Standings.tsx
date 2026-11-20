import type { CSSProperties } from 'react';
import { routeHash } from '../../domain/routes';
import type { Placing } from '../../domain/stats';
import { goTo } from '../../hooks/useRoute';
import { useI18n } from '../../i18n/context';
import { Avatar, RankBadge } from '../../ui/Badges';
import styles from './Standings.module.css';

/** The final table. Each row opens the player's page; a thin bar shows points against the leader. */
export function Standings({ table }: { table: Placing[] }) {
  const { t, name, language } = useI18n();
  const top = table[0]?.result.points ?? null;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th scope="col">{t.rank}</th>
          <th scope="col">
            {t.player} · {t.team}
          </th>
          <th scope="col" className={styles.hideSmall}>
            {t.coach}
          </th>
          <th scope="col" className={`${styles.right} ${styles.hideSmall}`}>
            {t.gap}
          </th>
          <th scope="col" className={styles.right}>
            {t.points}
          </th>
        </tr>
      </thead>
      <tbody>
        {table.map((p) => {
          const href = routeHash({ name: 'player', id: p.player.id });
          const ratio = top && p.result.points !== null ? p.result.points / top : null;
          return (
            <tr key={p.player.id} className={styles.row} onClick={() => goTo(href)}>
              <td>
                <RankBadge rank={p.result.rank} />
              </td>
              <td>
                <a className={styles.who} href={href} aria-label={t.openPlayer(name(p.player))}>
                  <Avatar player={p.player} size={34} />
                  <span className={styles.whoText}>
                    <span className={styles.name}>{name(p.player)}</span>
                    <span className={styles.team}>
                      {p.result.team ?? <span className={styles.lost}>{t.noTeamName}</span>}
                      {p.result.coach && (
                        <span className={styles.coachInline}> · {p.result.coach}</span>
                      )}
                    </span>
                  </span>
                  {ratio !== null && (
                    <span
                      className={styles.bar}
                      style={
                        {
                          '--w': `${Math.round(ratio * 100)}%`,
                          '--c': p.player.color,
                          '--toward': language === 'he' ? 'left' : 'right',
                        } as CSSProperties
                      }
                    />
                  )}
                </a>
              </td>
              <td className={`${styles.coach} ${styles.hideSmall}`}>{p.result.coach ?? '—'}</td>
              <td className={`${styles.right} ${styles.gap} ${styles.hideSmall} num`}>
                {p.gap === null ? '' : <bdi dir="ltr">{p.gap === 0 ? '0' : `−${p.gap}`}</bdi>}
              </td>
              <td className={`${styles.right} ${styles.points} num`}>{p.result.points ?? '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
