import type { CSSProperties } from 'react';
import { headToHead } from '../../domain/headToHead';
import { league } from '../../domain/league';
import { routeHash } from '../../domain/routes';
import { useI18n } from '../../i18n/context';
import { Avatar } from '../../ui/Badges';
import styles from './HeadToHead.module.css';

/** How a player fared against each rival: seasons above, seasons below, as one split rule. */
export function HeadToHead({ playerId }: { playerId: number }) {
  const { t, name } = useI18n();
  const meetings = headToHead(league, playerId);
  return (
    <ul className={styles.list}>
      {meetings.map(({ rival, above, below }) => {
        const share = above / (above + below);
        return (
          <li key={rival.id}>
            <a
              className={styles.row}
              href={routeHash({ name: 'player', id: rival.id })}
              style={{ '--share': share, '--color': rival.color } as CSSProperties}
            >
              <Avatar player={rival} size={30} />
              <span className={styles.name}>{name(rival)}</span>
              <span className={styles.score}>
                <span className={styles.above} title={t.above}>
                  {above}
                </span>
                <span className={styles.dash}>–</span>
                <span title={t.below}>{below}</span>
              </span>
              <span className={styles.bar} aria-hidden="true" />
              <span className="visually-hidden">
                {t.above} {above}, {t.below} {below}, {t.together} {above + below}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
