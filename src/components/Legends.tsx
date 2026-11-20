import { routeHash } from '../domain/routes';
import type { Career } from '../domain/stats';
import { useI18n } from '../i18n/context';
import { MetalDot } from '../ui/Ornaments';
import styles from './Honours.module.css';
import { Honours, type Honour } from './Honours';

/** The top three of the medal table, with their medal counts. */
export function Legends({ table }: { table: Career[] }) {
  const { t } = useI18n();
  const entries = table.slice(0, 3).map((c, i): Honour => ({
    place: (i + 1) as 1 | 2 | 3,
    player: c.player,
    href: routeHash({ name: 'player', id: c.player.id }),
    caption: t.titleCount(c.titles),
    detail: ([1, 2, 3] as const).map((rank) => (
      <span
        key={rank}
        className={`${styles.count} num`}
        title={[t.titles, t.seconds, t.thirds][rank - 1]}
      >
        <MetalDot rank={rank} />
        {[c.titles, c.seconds, c.thirds][rank - 1]}
      </span>
    )),
  }));
  return <Honours entries={entries} label={t.legendsTitle} />;
}
