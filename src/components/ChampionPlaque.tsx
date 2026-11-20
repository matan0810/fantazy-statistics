import { seasonLabel } from '../domain/competitions';
import { routeHash } from '../domain/routes';
import type { ChampionEntry } from '../domain/stats';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag } from '../ui/Badges';
import { Ornament } from '../ui/Ornaments';
import { Plaque } from '../ui/Section';
import styles from './ChampionPlaque.module.css';

/** A season's champion on a framed plaque, linking to the season. */
export function ChampionPlaque({ entry }: { entry: ChampionEntry }) {
  const { t, name } = useI18n();
  const { season, champion, margin } = entry;
  return (
    <a className={styles.link} href={routeHash({ name: 'season', id: season.id })}>
      <Plaque className={styles.body}>
        <CompetitionTag id={season.competition} />
        <span className={`${styles.season} num`}>
          {seasonLabel(season.year, season.competition)}
        </span>
        <Avatar player={champion.player} size={64} gold />
        <span className={styles.name}>{name(champion.player)}</span>
        <span className={styles.team}>{champion.result.team ?? ''}</span>
        <Ornament reach={36} />
        <span className={styles.foot}>
          {champion.result.points !== null ? (
            <>
              <span className={`${styles.points} gilded num`}>{champion.result.points}</span>
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
        </span>
      </Plaque>
    </a>
  );
}
