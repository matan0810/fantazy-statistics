import type { CSSProperties } from 'react';
import { competition, seasonLabel } from '../domain/competitions';
import { routeHash } from '../domain/routes';
import type { ChampionEntry } from '../domain/stats';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag } from '../ui/Badges';
import styles from './ChampionCard.module.css';

/** A season's champion, as a card that links to the season. */
export function ChampionCard({ entry }: { entry: ChampionEntry }) {
  const { t, name } = useI18n();
  const { season, champion, margin } = entry;
  return (
    <a
      className={styles.card}
      href={routeHash({ name: 'season', id: season.id })}
      style={{ '--accent': competition(season.competition).color } as CSSProperties}
    >
      <div className={styles.top}>
        <CompetitionTag id={season.competition} />
        <span className={styles.year}>{seasonLabel(season.year, season.competition)}</span>
      </div>
      <div className={styles.who}>
        <Avatar player={champion.player} size={44} ring="rgb(242 193 78 / 35%)" />
        <div style={{ minWidth: 0 }}>
          <div className={styles.name}>{name(champion.player)}</div>
          <div className={styles.team}>{champion.result.team ?? t.noTeamName}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        {champion.result.points !== null ? (
          <>
            <span className={`${styles.points} num`}>{champion.result.points}</span>
            {t.pointsShort}
            {margin !== null && (
              <span className="num">
                · <bdi dir="ltr">{margin === 0 ? t.tie : `+${margin}`}</bdi>
              </span>
            )}
          </>
        ) : (
          t.pointsLost
        )}
      </div>
    </a>
  );
}
