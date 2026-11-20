import { seasonLabel } from '../domain/competitions';
import { routeHash } from '../domain/routes';
import type { ChampionEntry } from '../domain/stats';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag } from '../ui/Badges';
import { Plaque } from '../ui/Section';
import styles from './ChampionPlaque.module.css';

/** A season's champion as a museum label, linking to the season. */
export function ChampionPlaque({ entry }: { entry: ChampionEntry }) {
  const { t, name } = useI18n();
  const { season, champion, margin } = entry;
  return (
    <a className={styles.link} href={routeHash({ name: 'season', id: season.id })}>
      <Plaque className={styles.body}>
        <div className={styles.top}>
          <CompetitionTag id={season.competition} />
          <span className={`${styles.season} num`}>
            {seasonLabel(season.year, season.competition)}
          </span>
        </div>
        <div className={styles.who}>
          <Avatar player={champion.player} size={40} gold />
          <span className={styles.name}>{name(champion.player)}</span>
        </div>
        <span className={styles.team}>{champion.result.team ?? ''}</span>
        <div className={styles.foot}>
          {champion.result.points !== null ? (
            <>
              <span>
                <span className={`${styles.points} num`}>{champion.result.points}</span>
                <span className={styles.unit}>{t.pointsShort}</span>
              </span>
              {margin !== null && (
                <span className="num" title={t.margin}>
                  <bdi dir="ltr">{margin === 0 ? t.tie : `+${margin}`}</bdi>
                </span>
              )}
            </>
          ) : (
            <span>{t.pointsLost}</span>
          )}
        </div>
      </Plaque>
    </a>
  );
}
