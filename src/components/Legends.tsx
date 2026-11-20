import { routeHash } from '../domain/routes';
import type { Career } from '../domain/stats';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useI18n } from '../i18n/context';
import { Medal } from '../ui/Ornaments';
import styles from './Pedestals.module.css';
import { Pedestals, type PedestalEntry } from './Pedestals';

/** The top three of the medal table, with their title counts and medals. */
export function Legends({ table }: { table: Career[] }) {
  const { t } = useI18n();
  const narrow = useMediaQuery('(max-width: 640px)');
  const entries = table.slice(0, 3).map((c, i): PedestalEntry => ({
    place: (i + 1) as 1 | 2 | 3,
    player: c.player,
    href: routeHash({ name: 'player', id: c.player.id }),
    caption: (
      <span className="num">
        <b>{c.titles}</b> {t.titles}
      </span>
    ),
    detail: ([1, 2, 3] as const).map((rank) => (
      <span
        key={rank}
        className={`${styles.medal} num`}
        title={[t.titles, t.seconds, t.thirds][rank - 1]}
      >
        <Medal rank={rank} size={narrow ? 18 : 22} />
        {[c.titles, c.seconds, c.thirds][rank - 1]}
      </span>
    )),
  }));
  return <Pedestals entries={entries} label={t.legendsTitle} />;
}
