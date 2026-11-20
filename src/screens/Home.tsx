import { useMemo, useState } from 'react';
import { RankLines } from '../charts/RankLines';
import { ChampionPlaque } from '../components/ChampionPlaque';
import { Legends } from '../components/Legends';
import { MedalTable } from '../components/MedalTable';
import { COMPETITIONS, competition } from '../domain/competitions';
import { league } from '../domain/league';
import { champions, medalTable, rankChart } from '../domain/stats';
import type { CompetitionId } from '../domain/types';
import { useI18n } from '../i18n/context';
import { ChevronIcon } from '../ui/icons';
import { Laurel, Trophy } from '../ui/Ornaments';
import { Card, Section } from '../ui/Section';
import { Segmented } from '../ui/Segmented';
import styles from './Home.module.css';

// year is the end year of two-year leagues: 2016 = the 15/16 season
const SINCE =
  Math.min(
    ...league.seasons.filter((s) => competition(s.competition).spansTwoYears).map((s) => s.year),
  ) - 1;

export function Home() {
  const { t } = useI18n();
  const [comp, setComp] = useState<CompetitionId>('ucl');
  const chart = useMemo(() => rankChart(league, comp), [comp]);
  const latest = COMPETITIONS.flatMap((c) => champions(league, c.id).slice(0, 1));
  const table = useMemo(() => medalTable(league), []);
  const stats = [
    { label: t.statYears, value: Math.max(...league.seasons.map((s) => s.year)) - SINCE },
    { label: t.statSeasons, value: league.seasons.length },
    { label: t.statChampions, value: table.filter((c) => c.titles > 0).length },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.crest}>
          <Laurel size={150}>
            <Trophy size={58} />
          </Laurel>
        </div>
        <p className={`eyebrow ${styles.eyebrow}`}>
          {t.league} · {t.founded(SINCE)}
        </p>
        <h1 className={`${styles.title} gilded`}>{t.heroTitle}</h1>
        <p className={styles.lead}>{t.heroLine}</p>
        <dl className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dd className={`${styles.statValue} num`}>{s.value}</dd>
              <dt className={styles.statLabel}>{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <Section eyebrow={t.wallEyebrow} title={t.wallTitle} hint={t.wallHint} id="wall">
        <div className={styles.plaques}>
          {latest.map((entry) => (
            <ChampionPlaque key={entry.season.id} entry={entry} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t.legendsEyebrow}
        title={t.legendsTitle}
        hint={t.legendsHint}
        id="medals"
        action={
          <a className={styles.more} href="#/records">
            {t.allRecords}
            <ChevronIcon />
          </a>
        }
      >
        <Legends table={table} />
        <Card className={styles.ranking}>
          <MedalTable rows={table} />
        </Card>
      </Section>

      <Section eyebrow={t.historyEyebrow} title={t.linesTitle} hint={t.linesHint} id="lines">
        <Card className={styles.chart}>
          <div className={styles.chartHead}>
            <Segmented
              label={t.pickCompetition}
              value={comp}
              onChange={setComp}
              options={COMPETITIONS.map((c) => ({
                value: c.id,
                label: t.competitionShort[c.id],
                swatch: c.color,
              }))}
            />
          </div>
          <RankLines chart={chart} />
        </Card>
      </Section>
    </main>
  );
}
