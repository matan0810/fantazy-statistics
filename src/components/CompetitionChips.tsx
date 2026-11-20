import type { CSSProperties } from 'react';
import { COMPETITIONS } from '../domain/competitions';
import type { CompetitionId } from '../domain/types';
import { useI18n } from '../i18n/context';
import styles from './CompetitionChips.module.css';

interface Props {
  active: readonly CompetitionId[];
  onToggle: (id: CompetitionId) => void;
}

/** Which competitions are counted: one toggle each, any number of them, none included. */
export function CompetitionChips({ active, onToggle }: Props) {
  const { t } = useI18n();
  return (
    <div className={styles.wrap}>
      <p className={styles.label}>{t.filterLabel}</p>
      <div className={styles.chips} role="group" aria-label={t.filterLabel}>
        {COMPETITIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.chip}
            style={{ '--c': c.color } as CSSProperties}
            aria-pressed={active.includes(c.id)}
            onClick={() => onToggle(c.id)}
          >
            {t.competition[c.id]}
          </button>
        ))}
      </div>
    </div>
  );
}
