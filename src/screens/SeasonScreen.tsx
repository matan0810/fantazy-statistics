import { useMemo, useState, type CSSProperties } from 'react';
import { DownloadMenu } from '../components/DownloadMenu';
import { competition, seasonLabel } from '../domain/competitions';
import { league } from '../domain/league';
import { seasonById, summarize } from '../domain/stats';
import { standingsCsv } from '../export/tables';
import { useI18n } from '../i18n/context';
import { Avatar } from '../ui/Badges';
import { Button } from '../ui/Button';
import { ProofIcon } from '../ui/icons';
import { Card } from '../ui/Section';
import { Podium } from './season/Podium';
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

  return (
    <main className={styles.page} style={{ '--accent': comp.color } as CSSProperties}>
      <SeasonNav season={season} />

      <div className={styles.head}>
        <div className={styles.titles}>
          <h1 className={styles.title}>
            <span>{t.competition[season.competition]}</span>
            <span className={`${styles.year} num`}>{label}</span>
          </h1>
          {season.name && <p className={styles.leagueName}>„{season.name}”</p>}
        </div>
        <div className={styles.actions}>
          {proofs.length > 0 && (
            <Button onClick={() => setProofOpen(true)}>
              <ProofIcon />
              {t.proof}
            </Button>
          )}
          <DownloadMenu
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
      </div>

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>{t.seasonChampion}</dt>
          <dd className={styles.factValue} style={{ margin: 0 }}>
            {champion ? (
              <>
                <Avatar player={champion.player} size={26} />
                <span>{name(champion.player)}</span>
              </>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>{t.field}</dt>
          <dd className={`${styles.factValue} num`} style={{ margin: 0 }}>
            {table.length}
          </dd>
        </div>
        {margin !== null && (
          <div className={styles.fact}>
            <dt className={styles.factLabel}>{t.margin}</dt>
            <dd className={`${styles.factValue} num`} style={{ margin: 0 }}>
              <bdi dir="ltr">{margin === 0 ? t.tie : `+${margin}`}</bdi>
            </dd>
          </div>
        )}
        {average !== null && (
          <div className={styles.fact}>
            <dt className={styles.factLabel}>{t.teamAverage}</dt>
            <dd className={`${styles.factValue} num`} style={{ margin: 0 }}>
              {average}
            </dd>
          </div>
        )}
      </dl>

      <Card className={styles.board}>
        <Podium table={table} />
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
