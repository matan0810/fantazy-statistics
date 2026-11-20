import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Look {
  variant?: 'default' | 'primary' | 'quiet';
  /** Square, icon only: needs an aria-label. */
  icon?: boolean;
}

const classes = ({ variant = 'default', icon = false }: Look, extra = '') =>
  [styles.button, variant !== 'default' && styles[variant], icon && styles.icon, extra]
    .filter(Boolean)
    .join(' ');

export function Button({
  variant,
  icon,
  className,
  ...rest
}: Look & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...rest} className={classes({ variant, icon }, className)} />;
}

/** A link that looks like a button (downloads, navigation). */
export function ButtonLink({
  variant,
  icon,
  className,
  ...rest
}: Look & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...rest} className={classes({ variant, icon }, className)} />;
}
