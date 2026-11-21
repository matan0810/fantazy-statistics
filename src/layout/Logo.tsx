import { useI18n } from '../i18n/context';
import { Emblem } from '../ui/Emblem';
import styles from './Header.module.css';

/** The mark and wordmark: the wreathed trophy, the name in the serif, the league after a hairline. */
export function Logo() {
  const { t } = useI18n();
  return (
    <span className={styles.wordmark}>
      <Emblem size={46} className={styles.mark} />
      <span className={styles.name}>{t.brand}</span>
      <span className={styles.sub}>{t.league}</span>
    </span>
  );
}
