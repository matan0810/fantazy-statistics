import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { DownloadMenu } from '../components/DownloadMenu';
import { MedalTable } from '../components/MedalTable';
import { COMPETITIONS, competition, seasonLabel } from '../domain/competitions';
import { league } from '../domain/league';
import { routeHash } from '../domain/routes';
import { champions, medalTable, records } from '../domain/stats';
import { COMPETITION_IDS, type CompetitionId, type Player } from '../domain/types';
import { medalCsv } from '../export/tables';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag, PlayerDot } from '../ui/Badges';
import { Card, Section } from '../ui/Section';
import styles from './Records.module.css';

const FILTER_KEY = 'hall-of-fame:records-filter';
const DEFAULT_FILTER: CompetitionId[] = ['ucl', 'world-cup', 'euro'];
const vars = (v: Record<string, string>) => v as CSSProperties;

interface RecordProps {
  label: string;
  player: Player;
  value: ReactNode;
  sub: string;
  color: string;
  href: string;
}

function RecordCard({ label, player, value, sub, color, href }: RecordProps) {
  const { name } = useI18n();
  return (
    <a className={styles.record} href={href} style={vars({ '--c': color })}>
      <span className={styles.recordLabel}>{label}</span>
      <span className={styles.recordWho}>
        <Avatar player={player} size={30} />
        {name(player)}
      </span>
      <span className={`${styles.recordValue} num`}>{value}</span>
      <span className={styles.recordSub}>{sub}</span>
    </a>
  );
}

export function RecordsScreen() {
  const { t, name, language } = useI18n();
  const [stored, setStored] = useLocalStorage<string[]>(FILTER_KEY, DEFAULT_FILTER);
  const active = useMemo(() => {
    const chosen = COMPETITION_IDS.filter((id) => stored.includes(id));
    return chosen.length ? chosen : DEFAULT_FILTER;
  }, [stored]);
  // Everything here is derived from the chosen competitions alone.
  const { filter, table, r } = useMemo(() => {
    const set = new Set(active);
    return { filter: set, table: medalTable(league, set), r: records(league, set) };
  }, [active]);
  const toggle = (id: CompetitionId) => {
    const next = active.includes(id) ? active.filter((x) => x !== id) : [...active, id];
    if (next.length) setStored(next);
  };
  const playerHref = (p: Player) => routeHash({ name: 'player', id: p.id });
  const seasonHref = (id: number) => routeHash({ name: 'season', id });
  const compName = (id: CompetitionId) => t.competition[id];
  const maxTitles = table[0]?.titles || 1;

  const cards: RecordProps[] = [];
  if (r.mostTitles)
    cards.push({
      label: t.mostTitles,
      player: r.mostTitles.player,
      value: r.mostTitles.value,
      sub: t.titleCount(r.mostTitles.value),
      color: 'var(--gold)',
      href: playerHref(r.mostTitles.player),
    });
  if (r.longestStreak)
    cards.push({
      label: t.longestStreak,
      player: r.longestStreak.player,
      value: r.longestStreak.value,
      sub: t.streakValue(r.longestStreak.value, compName(r.longestStreak.competition)),
      color: competition(r.longestStreak.competition).color,
      href: playerHref(r.longestStreak.player),
    });
  if (r.mostPodiums)
    cards.push({
      label: t.mostPodiums,
      player: r.mostPodiums.player,
      value: r.mostPodiums.value,
      sub: t.podiums,
      color: 'var(--silver)',
      href: playerHref(r.mostPodiums.player),
    });
  if (r.bestAverage)
    cards.push({
      label: t.bestAverage,
      player: r.bestAverage.player,
      value: r.bestAverage.value,
      sub: t.averageValue(compName(r.bestAverage.competition), r.bestAverage.seasons),
      color: competition(r.bestAverage.competition).color,
      href: playerHref(r.bestAverage.player),
    });
  if (r.closestTitle) {
    const s = r.closestTitle.placing.season;
    cards.push({
      label: t.closestTitle,
      player: r.closestTitle.placing.player,
      value: <bdi dir="ltr">{r.closestTitle.value === 0 ? t.tie : `+${r.closestTitle.value}`}</bdi>,
      sub: `${compName(s.competition)} ${seasonLabel(s.year, s.competition)} · ${t.closestValue(r.closestTitle.value)}`,
      color: competition(s.competition).color,
      href: seasonHref(s.id),
    });
  }
  if (r.biggestWin) {
    const s = r.biggestWin.placing.season;
    cards.push({
      label: t.biggestWin,
      player: r.biggestWin.placing.player,
      value: <bdi dir="ltr">{`+${r.biggestWin.value}%`}</bdi>,
      sub: `${compName(s.competition)} ${seasonLabel(s.year, s.competition)} · ${t.biggestValue(r.biggestWin.value)}`,
      color: competition(s.competition).color,
      href: seasonHref(s.id),
    });
  }
  if (r.mostSeasons)
    cards.push({
      label: t.mostSeasons,
      player: r.mostSeasons.player,
      value: r.mostSeasons.value,
      sub: t.seasons,
      color: 'var(--text)',
      href: playerHref(r.mostSeasons.player),
    });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>{t.brand}</p>
        <h1 className={styles.title}>{t.recordsTitle}</h1>
        <p className={styles.lead}>{t.recordsLine}</p>
        <div className={styles.toolbar}>
          <div>
            <p className={styles.filterLabel}>{t.filterLabel}</p>
            <div className={styles.chips} role="group" aria-label={t.filterLabel}>
              {COMPETITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={styles.chip}
                  style={vars({ '--c': c.color })}
                  aria-pressed={active.includes(c.id)}
                  onClick={() => toggle(c.id)}
                >
                  {t.competition[c.id]}
                </button>
              ))}
            </div>
            <p className={styles.filterHint}>{t.filterHint}</p>
          </div>
          <DownloadMenu
            title={`${t.brand} · ${t.medalTable}`}
            csv={() => medalCsv(table, t, name)}
            image={() => ({
              eyebrow: `${t.brand} · ${t.recordsTitle}`,
              title: t.medalTable,
              subtitle: active.map(compName).join(' · '),
              accent: '#f2c14e',
              rtl: language === 'he',
              footer: t.brand,
              rows: table.map((row, i) => ({
                rank: i + 1,
                name: name(row.player),
                color: row.player.color,
                sub: `${t.seconds} ${row.seconds} · ${t.thirds} ${row.thirds} · ${t.seasonCount(row.appearances)}`,
                value: row.titles,
                valueLabel: t.titles,
                note: null,
                ratio: row.titles / maxTitles,
              })),
            })}
          />
        </div>
      </section>

      <div className={styles.records}>
        {cards.map((c) => (
          <RecordCard key={c.label} {...c} />
        ))}
      </div>

      <Section title={t.medalTable} hint={t.medalTableHint} id="medals">
        <Card>
          <MedalTable rows={table} />
        </Card>
      </Section>

      <Section title={t.championsRoll} id="roll">
        <div className={styles.rolls}>
          {COMPETITIONS.filter((c) => filter.has(c.id)).map((c) => {
            const high = r.highScores.find((h) => h.placing.season.competition === c.id);
            return (
              <Card key={c.id} className={styles.roll}>
                <div className={styles.rollHead} style={vars({ '--c': c.color })}>
                  <CompetitionTag id={c.id} />
                </div>
                {high && (
                  <div className={styles.rollHigh} style={vars({ '--c': c.color })}>
                    {t.highScores}: <b className="num">{high.value}</b> ·{' '}
                    {name(high.placing.player)} {seasonLabel(high.placing.season.year, c.id)}
                  </div>
                )}
                <ul className={styles.rollList}>
                  {champions(league, c.id).map((entry) => (
                    <li key={entry.season.id}>
                      <a className={styles.rollItem} href={seasonHref(entry.season.id)}>
                        <span className={`${styles.rollYear} num`}>
                          {seasonLabel(entry.season.year, c.id)}
                        </span>
                        <span className={styles.rollName}>
                          <PlayerDot player={entry.champion.player} />
                          {name(entry.champion.player)}
                        </span>
                        <span className={`${styles.rollPoints} num`}>
                          {entry.champion.result.points ?? '—'}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </Section>
    </main>
  );
}
