import { useState } from 'react';
import { competition, seasonLabel } from '../../domain/competitions';
import { league } from '../../domain/league';
import { routeHash } from '../../domain/routes';
import { champions, records } from '../../domain/stats';
import type { CompetitionId } from '../../domain/types';
import { useI18n } from '../../i18n/context';
import { PlayerDot } from '../../ui/Badges';
import { Segmented } from '../../ui/Segmented';
import styles from '../Records.module.css';

/** Every champion of one competition at a time, chosen with tabs. */
export function ChampionsRoll({ competitions }: { competitions: CompetitionId[] }) {
  const { t, name } = useI18n();
  const [picked, setPicked] = useState<CompetitionId>('ucl');
  const current = competitions.includes(picked) ? picked : (competitions[0] ?? 'ucl');
  const high = records(league, new Set([current])).highScores[0];
  return (
    <div className={styles.roll}>
      <Segmented
        label={t.pickCompetition}
        value={current}
        onChange={setPicked}
        options={competitions.map((id) => ({
          value: id,
          label: t.competition[id],
          swatch: competition(id).color,
        }))}
      />
      {high && (
        <p className={styles.rollHigh}>
          {t.highScores}: <b className="num">{high.value}</b> · {name(high.placing.player)}{' '}
          {seasonLabel(high.placing.season.year, current)}
        </p>
      )}
      <ul className={styles.rollList}>
        {champions(league, current).map((entry) => (
          <li key={entry.season.id}>
            <a
              className={styles.rollItem}
              href={routeHash({ name: 'season', id: entry.season.id })}
            >
              <span className={`${styles.rollYear} num`}>
                {seasonLabel(entry.season.year, current)}
              </span>
              <span className={styles.rollName}>
                <PlayerDot player={entry.champion.player} />
                {name(entry.champion.player)}
              </span>
              <span className={styles.rollTeam}>{entry.champion.result.team ?? ''}</span>
              <span className={`${styles.rollPoints} num`}>
                {entry.champion.result.points ?? '—'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
