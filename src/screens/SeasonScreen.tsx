import { useMemo, useState, type CSSProperties } from 'react';
import { DownloadMenu } from '../components/DownloadMenu';
import { competition, seasonLabel } from '../domain/competitions';
import { league } from '../domain/league';
import { seasonById, seasonsOf, summarize } from '../domain/stats';
import { standingsCsv } from '../export/tables';
import { useI18n } from '../i18n/context';
import { Avatar } from '../ui/Badges';
import { Ornament } from '../ui/Ornaments';
import { Button } from '../ui/Button';
import { ProofIcon } from '../ui/icons';
import { Card } from '../ui/Section';
import { SeasonPodium } from './season/Podium';
import { ProofDialog } from './season/ProofDialog';
import { SeasonNav } from './season/SeasonNav';
import { Standings } from './season/Standings';
import styles from './Season.module.css';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function SeasonScreen({ id }: { id: number }) {
  const { t, name, language } = useI18n();
  const [proofOpen, setProofOpen] = useState(false);
  const season = seasonById(league, id);
  const summary = useMemo(() => (season ? summarize(league, season) : null), [season]);
  if (!season || !summary) return null;

  const comp = competition(season.competition);
  const label = seasonLabel(season.year, season.competition);
  const title = `${t.competition[season.competition]} ${label}`;
  const proofs = (league.proofs.get(season.id) ?? []).map((p) => base + p);
  const { standings: table, champion, margin, average } = summary;
  const top = table[0]?.result.points ?? 0;
  const order = seasonsOf(league, season.competition)
    .reverse()
    .map((s) => s.id);

  return (
    <main className={styles.page} style={{ '--accent': comp.color } as CSSProperties}>
      <SeasonNav season={season} />

      <header className={styles.head}>
        <p className="eyebrow num">
          {t.seasonOf(order.indexOf(season.id) + 1, order.length)}
          {season.pointsLost && ` · ${t.pointsLost}`}
        </p>
        <h1 className={styles.title}>
          <span className={styles.competition}>{t.competition[season.competition]}</span>{' '}
          <span className={`${styles.year} num`}>{label}</span>
        </h1>
        {season.name && <p className={styles.leagueName}>„{season.name}”</p>}
        <Ornament reach={56} center />
        <div className={styles.actions}>
          {proofs.length > 0 && (
            <Button
              icon
              variant="quiet"
              onClick={() => setProofOpen(true)}
              aria-label={t.proof}
              title={t.proof}
            >
              <ProofIcon />
            </Button>
          )}
          <DownloadMenu
            compact
            title={`${title} · ${t.finalStandings}`}
            csv={() => standingsCsv(table, t, name)}
            image={() => ({
              eyebrow: `${t.brand} · ${t.finalStandings}`,
              title,
              subtitle: [season.name, `${table.length} ${t.field}`].filter(Boolean).join(' · '),
              accent: comp.color,
              rtl: language === 'he',
              footer: t.brand,
              rows: table.map((p) => ({
                rank: p.result.rank,
                name: name(p.player),
                color: p.player.color,
                sub: [p.result.team, p.result.coach && `${t.coach}: ${p.result.coach}`]
                  .filter(Boolean)
                  .join(' · '),
                value: p.result.points,
                valueLabel: p.result.points === null ? '' : t.pointsShort,
                note: p.gap ? `−${p.gap}` : null,
                ratio: p.result.points !== null && top ? p.result.points / top : null,
              })),
            })}
          />
        </div>
      </header>

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>{t.seasonChampion}</dt>
          <dd className={styles.factValue}>
            {champion ? (
              <>
                <Avatar player={champion.player} size={30} gold />
                <span>{name(champion.player)}</span>
              </>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>{t.field}</dt>
          <dd className={`${styles.factValue} num`}>{table.length}</dd>
        </div>
        {margin !== null && (
          <div className={styles.fact}>
            <dt className={styles.factLabel}>{t.margin}</dt>
            <dd className={`${styles.factValue} num`}>
              <bdi dir="ltr">{margin === 0 ? t.tie : `+${margin}`}</bdi>
            </dd>
          </div>
        )}
        {average !== null && (
          <div className={styles.fact}>
            <dt className={styles.factLabel}>{t.teamAverage}</dt>
            <dd className={`${styles.factValue} num`}>{average}</dd>
          </div>
        )}
      </dl>

      <SeasonPodium table={table} />

      <Card className={styles.board}>
        <Standings table={table} />
      </Card>

      {season.pointsLost && <p className={styles.note}>{t.pointsLostNote}</p>}
      <p className={styles.hint}>{t.keyboardHint}</p>

      {proofs.length > 0 && (
        <ProofDialog
          key={season.id}
          open={proofOpen}
          onClose={() => setProofOpen(false)}
          urls={proofs}
          title={title}
        />
      )}
    </main>
  );
}
