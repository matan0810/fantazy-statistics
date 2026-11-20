import { useMemo } from 'react';
import { CompetitionChips } from '../components/CompetitionChips';
import { DownloadMenu } from '../components/DownloadMenu';
import { MedalTable } from '../components/MedalTable';
import { league } from '../domain/league';
import { medalTable, records } from '../domain/stats';
import { medalCsv } from '../export/tables';
import { useCompetitionFilter } from '../hooks/useCompetitionFilter';
import { useI18n } from '../i18n/context';
import { Ornament } from '../ui/Ornaments';
import { Card, Section } from '../ui/Section';
import { ChampionsRoll } from './records/ChampionsRoll';
import { RecordCard } from './records/RecordCard';
import { recordCards } from './records/recordCards';
import styles from './Records.module.css';

export function RecordsScreen() {
  const { t, name, language } = useI18n();
  const { active, filter, toggle } = useCompetitionFilter();
  // Everything below is derived from the chosen competitions alone.
  const { table, r } = useMemo(
    () => ({ table: medalTable(league, filter), r: records(league, filter) }),
    [filter],
  );
  const cards = recordCards(r, t, name);
  const maxTitles = table[0]?.titles || 1;
  const empty = active.length === 0;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className="eyebrow">{t.recordsEyebrow}</p>
        <h1 className={styles.title}>{t.recordsTitle}</h1>
        <Ornament reach={56} center />
        <p className={styles.lead}>{t.recordsLine}</p>
        <div className={styles.toolbar}>
          <CompetitionChips active={active} onToggle={toggle} />
          {!empty && (
            <DownloadMenu
              compact
              title={`${t.brand} · ${t.medalTable}`}
              csv={() => medalCsv(table, t, name)}
              image={() => ({
                eyebrow: `${t.brand} · ${t.recordsTitle}`,
                title: t.medalTable,
                subtitle: active.map((id) => t.competition[id]).join(' · '),
                accent: '#c8a96a',
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
          )}
        </div>
      </section>

      {empty ? (
        <p className={styles.empty}>{t.noCompetitions}</p>
      ) : (
        <>
          <div className={styles.records} data-stagger>
            {cards.map((c) => (
              <RecordCard key={c.id} {...c} />
            ))}
          </div>

          <Section
            eyebrow={t.legendsEyebrow}
            title={t.medalTable}
            hint={t.medalTableHint}
            id="medals"
          >
            <Card>
              <MedalTable rows={table} />
            </Card>
          </Section>

          <Section eyebrow={t.wallEyebrow} title={t.championsRoll} id="roll">
            <ChampionsRoll competitions={active} />
          </Section>
        </>
      )}
    </main>
  );
}
