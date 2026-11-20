import { seasonLabel } from '../../domain/competitions';
import { routeHash } from '../../domain/routes';
import type { Season } from '../../domain/types';
import type { Stories } from '../../domain/stories';
import type { Player } from '../../domain/types';
import type { Strings } from '../../i18n/strings';
import type { RecordCardData } from './recordCards';

/** The cards for the league's other stories: near misses, the steady and the patient. */
export function storyCards(s: Stories, t: Strings, name: (p: Player) => string): RecordCardData[] {
  const label = (season: Season) =>
    `${t.competition[season.competition]} ${seasonLabel(season.year, season.competition)}`;
  const player = (p: Player) => routeHash({ name: 'player', id: p.id });
  const season = (x: Season) => routeHash({ name: 'season', id: x.id });
  const cards: RecordCardData[] = [];

  if (s.mostThirds)
    cards.push({
      id: 'thirds',
      label: t.mostThirds,
      player: s.mostThirds.player,
      value: String(s.mostThirds.value),
      signed: false,
      sub: t.thirdsValue(s.mostThirds.value),
      href: player(s.mostThirds.player),
    });
  if (s.heartbreak) {
    const { placing, champion, value } = s.heartbreak;
    cards.push({
      id: 'heartbreak',
      label: t.heartbreak,
      player: placing.player,
      value: value === 0 ? t.tie : `−${value}`,
      signed: value !== 0,
      sub: t.heartbreakValue(label(placing.season), value, name(champion.player)),
      href: season(placing.season),
    });
  }
  if (s.bestWithoutTitle) {
    const { placing, value } = s.bestWithoutTitle;
    cards.push({
      id: 'without-title',
      label: t.bestWithoutTitle,
      player: placing.player,
      value: `+${value}%`,
      signed: true,
      sub: t.bestWithoutTitleValue(label(placing.season), placing.result.rank ?? 0, value),
      href: season(placing.season),
    });
  }
  if (s.aboveChampion)
    cards.push({
      id: 'above-champion',
      label: t.aboveChampion,
      player: s.aboveChampion.player,
      value: String(s.aboveChampion.value),
      signed: false,
      sub: t.aboveChampionValue(s.aboveChampion.value),
      href: player(s.aboveChampion.player),
    });
  if (s.steadiest)
    cards.push({
      id: 'steadiest',
      label: t.steadiest,
      player: s.steadiest.player,
      value: `±${s.steadiest.value}`,
      signed: true,
      sub: t.steadyValue(s.steadiest.seasons, s.steadiest.value),
      href: player(s.steadiest.player),
    });
  if (s.form)
    cards.push({
      id: 'form',
      label: t.form,
      player: s.form.player,
      value: String(s.form.value),
      signed: false,
      sub: t.formValue(s.form.played, s.form.of),
      href: player(s.form.player),
    });
  if (s.longestWait) {
    const { placing, value } = s.longestWait;
    cards.push({
      id: 'wait',
      label: t.longestWait,
      player: placing.player,
      value: String(value),
      signed: false,
      sub: t.waitValue(value, label(placing.season)),
      href: season(placing.season),
    });
  }
  if (s.loyalName)
    cards.push({
      id: 'loyal',
      label: t.loyalName,
      player: s.loyalName.player,
      value: String(s.loyalName.value),
      signed: false,
      sub: t.loyalValue(s.loyalName.team, s.loyalName.value),
      href: player(s.loyalName.player),
    });
  return cards;
}

/** The order of all record cards: the leaders, the near misses, the long stories. */
const ORDER = [
  'titles',
  'streak',
  'podiums',
  'seconds',
  'thirds',
  'average',
  'form',
  'closest',
  'heartbreak',
  'biggest',
  'without-title',
  'leap',
  'rivalry',
  'above-champion',
  'steadiest',
  'wait',
  'loyal',
  'seasons',
];

export function inOrder(cards: RecordCardData[]): RecordCardData[] {
  const at = (id: string) => (ORDER.includes(id) ? ORDER.indexOf(id) : ORDER.length);
  return [...cards].sort((a, b) => at(a.id) - at(b.id));
}
