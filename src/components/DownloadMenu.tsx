import { useCallback, useState } from 'react';
import { league } from '../domain/league';
import { downloadBlob, fileName, canShareFiles, shareFile } from '../export/download';
import { renderImage, type ImageSpec } from '../export/shareImage';
import { archiveCsv } from '../export/tables';
import { useI18n } from '../i18n/context';
import { Button } from '../ui/Button';
import { ArchiveIcon, DownloadIcon, ImageIcon, ShareIcon, TableIcon } from '../ui/icons';
import { Menu, type MenuItem } from '../ui/Menu';
import { Toast } from '../ui/Toast';

interface Props {
  /** Used for file names and the share title. */
  title: string;
  image: () => ImageSpec;
  csv: () => string;
}

const csvBlob = (text: string) => new Blob([text], { type: 'text/csv;charset=utf-8' });

/** "Download": a share image, the table as CSV, or the full archive. */
export function DownloadMenu({ title, image, csv }: Props) {
  const { t, name } = useI18n();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const withImage = async (act: (blob: Blob, file: string) => Promise<void> | void) => {
    setBusy(true);
    try {
      await act(await renderImage(image()), fileName(title, 'png'));
    } catch {
      setToast(t.downloadFailed);
    } finally {
      setBusy(false);
    }
  };

  const items: MenuItem[] = [
    {
      key: 'png',
      label: t.downloadPng,
      hint: t.downloadPngHint,
      icon: <ImageIcon />,
      onSelect: () =>
        void withImage((blob, file) => {
          downloadBlob(blob, file);
          setToast(t.downloaded);
        }),
    },
    ...(canShareFiles()
      ? [
          {
            key: 'share',
            label: t.share,
            hint: t.shareHint,
            icon: <ShareIcon />,
            onSelect: () =>
              void withImage(async (blob, file) => {
                if (!(await shareFile(blob, file, title))) downloadBlob(blob, file);
              }),
          },
        ]
      : []),
    {
      key: 'csv',
      label: t.downloadCsv,
      hint: t.downloadCsvHint,
      icon: <TableIcon />,
      onSelect: () => {
        downloadBlob(csvBlob(csv()), fileName(title, 'csv'));
        setToast(t.downloaded);
      },
    },
    {
      key: 'archive',
      label: t.downloadArchive,
      hint: t.downloadArchiveHint,
      icon: <ArchiveIcon />,
      divider: true,
      onSelect: () => {
        downloadBlob(
          csvBlob(archiveCsv(league, t, name)),
          fileName(`${t.brand} ${t.downloadArchive}`, 'csv'),
        );
        setToast(t.downloaded);
      },
    },
  ];

  return (
    <>
      <Menu
        label={t.download}
        items={items}
        trigger={(props) => (
          <Button {...props} disabled={busy}>
            <DownloadIcon />
            {t.download}
          </Button>
        )}
      />
      <Toast message={toast} onDone={clearToast} />
    </>
  );
}
