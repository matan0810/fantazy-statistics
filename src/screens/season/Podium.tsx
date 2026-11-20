import { Podium, type PodiumEntry } from '../../components/Podium';
import { routeHash } from '../../domain/routes';
import type { Placing } from '../../domain/stats';
import { useI18n } from '../../i18n/context';

/** The season's first three on the podium, with their team and points. */
export function SeasonPodium({ table }: { table: Placing[] }) {
  const { t } = useI18n();
  const entries = table.flatMap((p): PodiumEntry[] => {
    const place = p.result.rank;
    if (place !== 1 && place !== 2 && place !== 3) return [];
    return [
      {
        place,
        player: p.player,
        href: routeHash({ name: 'player', id: p.player.id }),
        caption: p.result.team ?? '',
        face:
          p.result.points !== null ? (
            <span>
              <b>{p.result.points}</b> {t.pointsShort}
            </span>
          ) : null,
      },
    ];
  });
  return <Podium entries={entries} label={t.podium} />;
}
