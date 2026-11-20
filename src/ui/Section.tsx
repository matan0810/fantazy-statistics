import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  title: string;
  eyebrow?: string;
  hint?: string;
  /** A link or control at the far end of the heading. */
  action?: ReactNode;
  id?: string;
  children: ReactNode;
}

/** A titled part of a page: eyebrow and serif title at the start, a hairline across. */
export function Section({ title, eyebrow, hint, action, id, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.head}>
        <div className={styles.titles}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className={styles.title} id={headingId}>
            {title}
          </h2>
        </div>
        {(hint || action) && (
          <div className={styles.side}>
            {hint && <p className={styles.hint}>{hint}</p>}
            {action}
          </div>
        )}
      </div>
      {children}
    </section>
  );
}

/** The standard surface: a hairline frame. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

/** A museum label: a hairline frame around what is honoured. */
export function Plaque({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.plaque} ${className}`}>{children}</div>;
}
