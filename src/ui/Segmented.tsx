import styles from './Segmented.module.css';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  /** Optional colour dot before the label. */
  swatch?: string;
}

interface Props<T extends string | number> {
  label: string;
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** One choice out of a few, as a row of pill buttons. */
export function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className = '',
}: Props<T>) {
  return (
    <div className={`${styles.group} ${className}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className={styles.option}
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.swatch && (
            <span className={styles.swatch} style={{ ['--swatch' as string]: o.swatch }} />
          )}
          {o.label}
        </button>
      ))}
    </div>
  );
}
