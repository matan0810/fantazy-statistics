import { useState } from 'react';
import { useI18n } from '../../i18n/context';
import { Button, ButtonLink } from '../../ui/Button';
import { Dialog } from '../../ui/Dialog';
import { ChevronIcon, DownloadIcon } from '../../ui/icons';
import styles from './ProofDialog.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  urls: string[];
  title: string;
}

/** The screenshots that prove a season's result, one at a time. */
export function ProofDialog({ open, onClose, urls, title }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const url = urls[Math.min(index, urls.length - 1)] ?? '';
  const step = (by: number) => setIndex((i) => (i + by + urls.length) % urls.length);

  return (
    <Dialog
      open={open}
      title={t.proofTitle(title)}
      onClose={onClose}
      actions={
        <ButtonLink
          icon
          variant="quiet"
          href={url}
          download
          aria-label={t.downloadImage}
          title={t.downloadImage}
        >
          <DownloadIcon />
        </ButtonLink>
      }
    >
      <div className={styles.stage}>
        <img className={styles.image} src={url} alt={t.proofTitle(title)} />
        {urls.length > 1 && (
          <>
            <Button
              icon
              className={`${styles.arrow} ${styles.start}`}
              aria-label={t.previousImage}
              onClick={() => step(-1)}
            >
              <ChevronIcon back />
            </Button>
            <Button
              icon
              className={`${styles.arrow} ${styles.end}`}
              aria-label={t.nextImage}
              onClick={() => step(1)}
            >
              <ChevronIcon />
            </Button>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <p className={`${styles.count} num`}>{t.proofOf(index + 1, urls.length)}</p>
      )}
    </Dialog>
  );
}
