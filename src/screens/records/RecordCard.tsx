import { useI18n } from '../../i18n/context';
import { Avatar } from '../../ui/Badges';
import { ChevronIcon } from '../../ui/icons';
import { Plaque } from '../../ui/Section';
import styles from '../Records.module.css';
import type { RecordCardData } from './recordCards';

/** A record as a museum label; the whole label links to where the record was set. */
export function RecordCard({ label, player, value, signed, sub, href }: RecordCardData) {
  const { name } = useI18n();
  return (
    <a className={styles.record} href={href}>
      <Plaque className={styles.recordBody}>
        <span className={styles.recordLabel}>
          {label}
          <ChevronIcon />
        </span>
        <span className={`${styles.recordValue} num`}>
          {signed ? <bdi dir="ltr">{value}</bdi> : value}
        </span>
        <span className={styles.recordWho}>
          <Avatar player={player} size={28} />
          {name(player)}
        </span>
        <span className={styles.recordSub}>{sub}</span>
      </Plaque>
    </a>
  );
}
