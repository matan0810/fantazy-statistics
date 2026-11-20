import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './Menu.module.css';

export interface MenuItem {
  key: string;
  label: string;
  hint?: string;
  icon?: ReactNode;
  onSelect: () => void;
  /** Draw a line above this item. */
  divider?: boolean;
}

interface Props {
  /** Renders the trigger; gets the props a menu button needs. */
  trigger: (props: {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-haspopup': 'menu';
    'aria-controls': string;
  }) => ReactNode;
  items: MenuItem[];
  label: string;
}

/** A button that opens a short list of actions. Esc, a click outside or a choice closes it. */
export function Menu({ trigger, items, label }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    wrap.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrap}>
      {trigger({
        onClick: () => setOpen((o) => !o),
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'aria-controls': id,
      })}
      {open && (
        <div className={styles.menu} role="menu" id={id} aria-label={label}>
          {items.map((item) => (
            <div key={item.key}>
              {item.divider && <div className={styles.divider} role="separator" />}
              <button
                type="button"
                role="menuitem"
                className={styles.item}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon}
                <span>
                  <span className={styles.label}>{item.label}</span>
                  {item.hint && <span className={styles.hint}>{item.hint}</span>}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
