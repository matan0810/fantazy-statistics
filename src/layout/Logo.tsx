import { useI18n } from '../i18n/context';
import { Trophy } from '../ui/Trophy';
import styles from './Header.module.css';

/** The mark and wordmark: the trophy, the name in the serif, the league after a hairline. */
export function Logo() {
  const { t } = useI18n();
  return (
    <span className={styles.wordmark}>
      <Trophy size={24} className={styles.mark} />
      <span className={styles.name}>{t.brand}</span>
      <span className={styles.sub}>{t.league}</span>
    </span>
  );
}
