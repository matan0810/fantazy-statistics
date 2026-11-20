import { useMemo, type CSSProperties } from 'react';
import { RankLines } from '../charts/RankLines';
import { seasonLabel } from '../domain/competitions';
import { league } from '../domain/league';
import { routeHash } from '../domain/routes';
import { career, playerById, rankChart } from '../domain/stats';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag, RankBadge } from '../ui/Badges';
import { Laurel, Medal, Ornament } from '../ui/Ornaments';
import { Card, Section } from '../ui/Section';
import styles from './Player.module.css';

export function PlayerScreen({ id }: { id: number }) {
  const { t, name } = useI18n();
  const player = playerById(league, id);
  const c = useMemo(() => (player ? career(league, player) : null), [player]);
  if (!player || !c) return null;

  const rate = c.appearances ? Math.round((c.podiums / c.appearances) * 100) : 0;
  const first = c.history.at(-1)?.season;
  const facts = [
    { label: t.seasons, value: c.appearances },
    { label: t.podiums, value: c.podiums },
    { label: t.podiumRate, value: `${rate}%` },
    { label: t.bestRank, value: c.bestRank ?? '—' },
  ];
  const cabinet = [
    { rank: 1, count: c.titles, label: t.titles },
    { rank: 2, count: c.seconds, label: t.seconds },
    { rank: 3, count: c.thirds, label: t.thirds },
  ] as const;
  const medallion = <Avatar player={player} size={112} gold={c.titles > 0} />;

  return (
    <main className={styles.page} style={{ '--accent': player.color } as CSSProperties}>
      <header className={styles.hero}>
        <div className={styles.crest}>
          {c.titles > 0 ? <Laurel size={210}>{medallion}</Laurel> : medallion}
        </div>
        {first && (
          <p className="eyebrow num">
            {t.memberSince(
              `${t.competition[first.competition]} ${seasonLabel(first.year, first.competition)}`,
            )}
          </p>
        )}
        <h1 className={`${styles.name} ${c.titles > 0 ? 'gilded' : ''}`}>{name(player)}</h1>
        <Ornament />
        <div className={styles.cabinet} aria-label={t.trophyCabinet} role="group">
          {cabinet.map((m) => (
            <div key={m.rank} className={styles.shelf} data-empty={m.count ? undefined : ''}>
              <Medal rank={m.rank} size={52} />
              <span className={`${styles.shelfCount} num`}>{m.count}</span>
              <span className={styles.shelfLabel}>{m.label}</span>
            </div>
          ))}
        </div>
      </header>

      <dl className={styles.facts}>
        {facts.map((f) => (
          <div key={f.label} className={styles.fact}>
            <dt className={styles.factLabel}>{f.label}</dt>
            <dd className={`${styles.factValue} num`}>
              <bdi dir="ltr">{f.value}</bdi>
            </dd>
          </div>
        ))}
      </dl>

      <Section eyebrow={t.byCompetition} title={t.career} hint={t.careerHint} id="career">
        <div className={styles.careers}>
          {c.byCompetition.map((cc) => (
            <Card key={cc.competition} className={styles.career}>
              <div className={styles.careerHead}>
                <CompetitionTag id={cc.competition} />
                <div className={`${styles.careerStats} num`}>
                  <span>
                    <b>{cc.appearances}</b> {t.seasons}
                  </span>
                  {cc.titles > 0 && (
                    <span>
                      <b className={styles.gold}>{cc.titles}</b> {t.titles}
                    </span>
                  )}
                  {cc.average !== null && (
                    <span>
                      <b>{cc.average}</b> {t.average}
                    </span>
                  )}
                </div>
              </div>
              <RankLines chart={rankChart(league, cc.competition)} focus={player.id} compact />
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow={t.playerCard} title={t.history} id="history">
        <Card>
          <ul className={styles.history}>
            {c.history.map((h) => (
              <li key={h.season.id}>
                <a className={styles.entry} href={routeHash({ name: 'season', id: h.season.id })}>
                  <RankBadge rank={h.result.rank} size={30} />
                  <span className={styles.entryMain}>
                    <span className={styles.entryTitle}>
                      <CompetitionTag id={h.season.competition} />
                      <span className="num">
                        {seasonLabel(h.season.year, h.season.competition)}
                      </span>
                    </span>
                    <span className={styles.entryTeam}>
                      {t.ofField(h.field)} · {h.result.team ?? t.noTeamName}
                    </span>
                  </span>
                  <span
                    className={`${styles.entryPoints} num ${h.result.points === null ? styles.faint : ''}`}
                  >
                    {h.result.points ?? '—'}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </Section>

      <Section title={t.otherPlayers} id="others">
        <div className={styles.others}>
          {league.players
            .filter((p) => p.id !== player.id)
            .map((p) => (
              <a key={p.id} className={styles.other} href={routeHash({ name: 'player', id: p.id })}>
                <Avatar player={p} size={28} />
                {name(p)}
              </a>
            ))}
        </div>
      </Section>
    </main>
  );
}
