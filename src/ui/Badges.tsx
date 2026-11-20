import type { CSSProperties } from 'react';
import { competition } from '../domain/competitions';
import type { CompetitionId, Player } from '../domain/types';
import { useI18n } from '../i18n/context';
import styles from './Badges.module.css';
import { MEDAL_COLOR } from './medals';

const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** A player's medallion: their initial, ringed in their colour; champions get a gold ring. */
export function Avatar({
  player,
  size = 36,
  gold = false,
}: {
  player: Player;
  size?: number;
  gold?: boolean;
}) {
  const { name } = useI18n();
  return (
    <span
      className={styles.avatar}
      data-gold={gold ? '' : undefined}
      style={vars({ '--size': `${size}px`, '--color': player.color })}
      aria-hidden="true"
    >
      {name(player).charAt(0)}
    </span>
  );
}

/** Finishing position: gold, silver and bronze discs for the podium, an outline below it. */
export function RankBadge({ rank, size = 28 }: { rank: number | null; size?: number }) {
  const { t } = useI18n();
  const medal = rank === null ? undefined : MEDAL_COLOR[rank];
  return (
    <span
      className={styles.rank}
      data-medal={medal ? '' : undefined}
      style={vars({ '--size': `${size}px`, ...(medal ? { '--medal': medal } : {}) })}
      title={rank === null ? t.unknownRank : t.rankValue(rank)}
    >
      {rank ?? '?'}
    </span>
  );
}

export function CompetitionTag({ id, label }: { id: CompetitionId; label?: string }) {
  const { t } = useI18n();
  return (
    <span className={styles.tag} style={vars({ '--color': competition(id).color })}>
      {label ?? t.competition[id]}
    </span>
  );
}

export function PlayerDot({ player }: { player: Player }) {
  return (
    <span className={styles.dot} style={vars({ '--color': player.color })} aria-hidden="true" />
  );
}

/** One small disc per medal: a trophy cabinet at a glance. */
export function MedalPips({
  titles,
  seconds,
  thirds,
}: {
  titles: number;
  seconds: number;
  thirds: number;
}) {
  const pips = [
    ...Array<number>(titles).fill(1),
    ...Array<number>(seconds).fill(2),
    ...Array<number>(thirds).fill(3),
  ];
  return (
    <span className={styles.pips} aria-hidden="true">
      {pips.map((rank, i) => (
        <span key={i} className={styles.pip} style={vars({ '--medal': MEDAL_COLOR[rank] ?? '' })} />
      ))}
    </span>
  );
}
