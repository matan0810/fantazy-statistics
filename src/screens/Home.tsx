import { useMemo, useState } from 'react';
import { RankLines } from '../charts/RankLines';
import { ChampionCard } from '../components/ChampionCard';
import { MedalTable } from '../components/MedalTable';
import { COMPETITIONS, competition } from '../domain/competitions';
import { league } from '../domain/league';
import { champions, medalTable, rankChart } from '../domain/stats';
import type { CompetitionId } from '../domain/types';
import { useI18n } from '../i18n/context';
import { ChevronIcon } from '../ui/icons';
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

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          {t.league} · {t.since(SINCE)}
        </p>
        <h1 className={styles.title}>{t.heroTitle}</h1>
        <p className={styles.lead}>{t.heroLine}</p>
        <p className={`${styles.facts} num`}>
          {t.heroFacts(league.seasons.length, league.players.length)}
        </p>
      </section>

      <Card className={styles.chart}>
        <div className={styles.chartHead}>
          <h2>{t.linesTitle}</h2>
          <div>
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
        </div>
        <p className={styles.chartHint}>{t.linesHint}</p>
        <RankLines chart={chart} />
      </Card>

      <Section title={t.latestChampions} id="latest">
        <div className={styles.champions}>
          {latest.map((entry) => (
            <ChampionCard key={entry.season.id} entry={entry} />
          ))}
        </div>
      </Section>

      <Section
        title={t.medalTable}
        hint={t.medalTableHint}
        id="medals"
        action={
          <a className={styles.more} href="#/records">
            {t.allRecords}
            <ChevronIcon />
          </a>
        }
      >
        <Card>
          <MedalTable rows={table} />
        </Card>
      </Section>
    </main>
  );
}
