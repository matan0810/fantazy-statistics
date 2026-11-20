import { seasonLabel } from '../../domain/competitions';
import { routeHash } from '../../domain/routes';
import type { Records } from '../../domain/stats';
import type { CompetitionId, Player } from '../../domain/types';
import type { Strings } from '../../i18n/strings';

export interface RecordCardData {
  id: string;
  label: string;
  player: Player;
  /** Shown as figures; `signed` values keep their sign in front in Hebrew. */
  value: string;
  signed: boolean;
  sub: string;
  href: string;
}

/**
 * The record cards, each linked where its story is told: a career record opens the
 * player (on the competition it was set in, when there is one), a title race opens the
 * season it was decided in.
 */
export function recordCards(r: Records, t: Strings, name: (p: Player) => string): RecordCardData[] {
  const comp = (id: CompetitionId) => t.competition[id];
  const player = (p: Player, competition?: CompetitionId) =>
    routeHash(
      competition ? { name: 'player', id: p.id, competition } : { name: 'player', id: p.id },
    );
  const cards: RecordCardData[] = [];

  if (r.mostTitles)
    cards.push({
      id: 'titles',
      label: t.mostTitles,
      player: r.mostTitles.player,
      value: String(r.mostTitles.value),
      signed: false,
      sub: t.titleCount(r.mostTitles.value),
      href: player(r.mostTitles.player),
    });
  if (r.longestStreak)
    cards.push({
      id: 'streak',
      label: t.longestStreak,
      player: r.longestStreak.player,
      value: String(r.longestStreak.value),
      signed: false,
      sub: t.streakValue(r.longestStreak.value, comp(r.longestStreak.competition)),
      href: player(r.longestStreak.player, r.longestStreak.competition),
    });
  if (r.mostPodiums)
    cards.push({
      id: 'podiums',
      label: t.mostPodiums,
      player: r.mostPodiums.player,
      value: String(r.mostPodiums.value),
      signed: false,
      sub: t.podiums,
      href: player(r.mostPodiums.player),
    });
  if (r.bestAverage)
    cards.push({
      id: 'average',
      label: t.bestAverage,
      player: r.bestAverage.player,
      value: String(r.bestAverage.value),
      signed: false,
      sub: t.averageValue(comp(r.bestAverage.competition), r.bestAverage.seasons),
      href: player(r.bestAverage.player, r.bestAverage.competition),
    });
  if (r.closestTitle) {
    const s = r.closestTitle.placing.season;
    const rival = r.closestTitle.runnerUp ? name(r.closestTitle.runnerUp.player) : '—';
    cards.push({
      id: 'closest',
      label: t.closestTitle,
      player: r.closestTitle.placing.player,
      value: r.closestTitle.value === 0 ? t.tie : `+${r.closestTitle.value}`,
      signed: r.closestTitle.value !== 0,
      sub: `${comp(s.competition)} ${seasonLabel(s.year, s.competition)} · ${t.closestValue(r.closestTitle.value, rival)}`,
      href: routeHash({ name: 'season', id: s.id }),
    });
  }
  if (r.biggestWin) {
    const s = r.biggestWin.placing.season;
    const rival = r.biggestWin.runnerUp ? name(r.biggestWin.runnerUp.player) : '—';
    cards.push({
      id: 'biggest',
      label: t.biggestWin,
      player: r.biggestWin.placing.player,
      value: `+${r.biggestWin.value}%`,
      signed: true,
      sub: `${comp(s.competition)} ${seasonLabel(s.year, s.competition)} · ${t.biggestValue(r.biggestWin.value, rival)}`,
      href: routeHash({ name: 'season', id: s.id }),
    });
  }
  if (r.mostSeasons)
    cards.push({
      id: 'seasons',
      label: t.mostSeasons,
      player: r.mostSeasons.player,
      value: String(r.mostSeasons.value),
      signed: false,
      sub: t.seasons,
      href: player(r.mostSeasons.player),
    });
  return cards;
}
