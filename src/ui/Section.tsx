import type { ReactNode } from 'react';
import styles from './Section.module.css';

interface Props {
  title: string;
  hint?: string;
  /** Controls at the end of the heading row. */
  action?: ReactNode;
  id?: string;
  children: ReactNode;
}

export function Section({ title, hint, action, id, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title} id={headingId}>
            {title}
          </h2>
          {hint && <p className={styles.hint}>{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** The standard raised surface. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}
