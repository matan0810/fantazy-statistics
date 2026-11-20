import { useI18n } from '../i18n/context';
import styles from './Header.module.css';

/** The wordmark: the name in the serif, the league in spaced capitals after a hairline. */
export function Logo() {
  const { t } = useI18n();
  return (
    <span className={styles.wordmark}>
      <span className={styles.name}>{t.brand}</span>
      <span className={styles.sub}>{t.league}</span>
    </span>
  );
}
