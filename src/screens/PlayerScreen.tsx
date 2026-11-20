import { useMemo, useState, type CSSProperties } from 'react';
import { RankLines } from '../charts/RankLines';
import { competition, seasonLabel } from '../domain/competitions';
import { league } from '../domain/league';
import { routeHash } from '../domain/routes';
import { career as careerOf, playerById, rankChart } from '../domain/stats';
import type { CompetitionId } from '../domain/types';
import { replaceAddress } from '../hooks/useRoute';
import { useI18n } from '../i18n/context';
import { Avatar, CompetitionTag, RankBadge } from '../ui/Badges';
import { MetalDot, Ornament } from '../ui/Ornaments';
import { Button } from '../ui/Button';
import { Card, Section } from '../ui/Section';
import { Segmented } from '../ui/Segmented';
import styles from './Player.module.css';

const HISTORY_PREVIEW = 8;

interface Props {
  id: number;
  /** The competition to open the career on, from the address. */
  competition?: CompetitionId;
}

export function PlayerScreen({ id, competition: fromAddress }: Props) {
  const { t, name } = useI18n();
  const player = playerById(league, id);
  const c = useMemo(() => (player ? careerOf(league, player) : null), [player]);
  const [picked, setPicked] = useState<CompetitionId>(fromAddress ?? 'ucl');
  // A tab writes itself into the address without a navigation, so the view can be shared.
  const pick = (competition: CompetitionId) => {
    setPicked(competition);
    replaceAddress(routeHash({ name: 'player', id, competition }));
  };
  const [showAll, setShowAll] = useState(false);
  if (!player || !c) return null;

  const rate = c.appearances ? Math.round((c.podiums / c.appearances) * 100) : 0;
  const first = c.history.at(-1)?.season;
  const career = c.byCompetition.find((cc) => cc.competition === picked) ?? c.byCompetition[0];
  if (!career) return null;
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

  return (
    <main className={styles.page} style={{ '--accent': player.color } as CSSProperties}>
      <header className={styles.hero}>
        <Avatar player={player} size={88} gold={c.titles > 0} />
        {first && (
          <p className="eyebrow num">
            {t.memberSince(
              `${t.competition[first.competition]} ${seasonLabel(first.year, first.competition)}`,
            )}
          </p>
        )}
        <h1 className={styles.name}>{name(player)}</h1>
        <Ornament reach={56} center />
        <div className={styles.cabinet} aria-label={t.trophyCabinet} role="group">
          {cabinet.map((m) => (
            <div key={m.rank} className={styles.shelf} data-empty={m.count ? undefined : ''}>
              <span className={`${styles.shelfCount} num`}>{m.count}</span>
              <span className={styles.shelfLabel}>
                <MetalDot rank={m.rank} />
                {m.label}
              </span>
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
        <div className={styles.career}>
          <Segmented
            label={t.pickCompetition}
            value={career.competition}
            onChange={pick}
            options={c.byCompetition.map((cc) => ({
              value: cc.competition,
              label: t.competition[cc.competition],
              swatch: competition(cc.competition).color,
            }))}
          />
          <div className={`${styles.careerStats} num`}>
            <span>
              <b>{career.appearances}</b> {t.seasons}
            </span>
            <span>
              <b className={career.titles ? styles.gold : undefined}>{career.titles}</b> {t.titles}
            </span>
            <span>
              <b>{career.podiums}</b> {t.podiums}
            </span>
            {career.average !== null && (
              <span>
                <b>{career.average}</b> {t.average}
              </span>
            )}
            {career.best !== null && (
              <span>
                <b>{career.best}</b> {t.best}
              </span>
            )}
          </div>
          <RankLines chart={rankChart(league, career.competition)} focus={player.id} />
        </div>
      </Section>

      <Section eyebrow={t.playerCard} title={t.history} id="history">
        <Card>
          <ul className={styles.history}>
            {(showAll ? c.history : c.history.slice(0, HISTORY_PREVIEW)).map((h) => (
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
        {c.history.length > HISTORY_PREVIEW && (
          <div className={styles.more}>
            <Button onClick={() => setShowAll(!showAll)} aria-expanded={showAll}>
              {showAll ? t.showFewer : t.showAllSeasons(c.history.length)}
            </Button>
          </div>
        )}
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
