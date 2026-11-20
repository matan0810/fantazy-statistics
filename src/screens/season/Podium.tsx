import { Pedestals, type PedestalEntry } from '../../components/Pedestals';
import { routeHash } from '../../domain/routes';
import type { Placing } from '../../domain/stats';
import { useI18n } from '../../i18n/context';

/** The season's top three on plinths, with their team and points. */
export function Podium({ table }: { table: Placing[] }) {
  const { t } = useI18n();
  const entries = table.flatMap((p): PedestalEntry[] => {
    const place = p.result.rank;
    if (place !== 1 && place !== 2 && place !== 3) return [];
    return [
      {
        place,
        player: p.player,
        href: routeHash({ name: 'player', id: p.player.id }),
        caption: p.result.team ?? '',
        detail:
          p.result.points !== null ? (
            <span className="num">
              <b>{p.result.points}</b> {t.pointsShort}
            </span>
          ) : null,
      },
    ];
  });
  return <Pedestals entries={entries} label={t.podium} />;
}
