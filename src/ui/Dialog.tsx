import { useEffect, useRef, type ReactNode } from 'react';
import { useI18n } from '../i18n/context';
import { Button } from './Button';
import styles from './Dialog.module.css';
import { CloseIcon } from './icons';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Extra controls in the title row, before the close button. */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * The browser's own modal <dialog>: focus is trapped, Esc closes it and focus returns
 * to the opener, with no code of ours. A click on the backdrop closes it too.
 */
export function Dialog({ open, title, onClose, actions, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      {open && (
        <>
          <div className={styles.head}>
            <h2>{title}</h2>
            {actions}
            <Button icon variant="quiet" aria-label={t.close} onClick={onClose}>
              <CloseIcon />
            </Button>
          </div>
          <div className={styles.body}>{children}</div>
        </>
      )}
    </dialog>
  );
}
