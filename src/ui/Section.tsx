import type { ReactNode } from 'react';
import { Ornament } from './Ornaments';
import styles from './Section.module.css';

interface Props {
  title: string;
  eyebrow?: string;
  hint?: string;
  /** A link or control under the heading. */
  action?: ReactNode;
  id?: string;
  children: ReactNode;
}

/** A titled part of a page: a spaced eyebrow, a serif title and a gold divider, centred. */
export function Section({ title, eyebrow, hint, action, id, children }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.head}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className={styles.title} id={headingId}>
          {title}
        </h2>
        <Ornament />
        {hint && <p className={styles.hint}>{hint}</p>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
      {children}
    </section>
  );
}

/** The standard raised surface. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

/** A framed plaque for what deserves honour: champions, records. */
export function Plaque({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={styles.plaque}>
      <div className={`${styles.plaqueInner} ${className}`}>{children}</div>
    </div>
  );
}
