import type { SVGProps } from 'react';

/** Small line icons, drawn on a 24-unit grid with the current text colour. */
function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export const DownloadIcon = () => (
  <Icon>
    <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 20h14" />
  </Icon>
);
export const ImageIcon = () => (
  <Icon>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="m4 17 5-5 4 4 2.5-2.5L20 18" />
    <circle cx="15.5" cy="9" r="1.5" />
  </Icon>
);
export const TableIcon = () => (
  <Icon>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M3.5 15h17M10 4.5v15" />
  </Icon>
);
export const ArchiveIcon = () => (
  <Icon>
    <rect x="3" y="4" width="18" height="5" rx="1.5" />
    <path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4" />
  </Icon>
);
export const ShareIcon = () => (
  <Icon>
    <path d="M12 15V4m0 0L8 8m4-4 4 4M6 12v6.5A1.5 1.5 0 0 0 7.5 20h9a1.5 1.5 0 0 0 1.5-1.5V12" />
  </Icon>
);
export const ProofIcon = () => (
  <Icon>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z" />
    <path d="m8.8 12 2.2 2.2 4.4-4.4" />
  </Icon>
);
export const CloseIcon = () => (
  <Icon>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);
/** Points toward the inline end: flips with the page direction. */
export const ChevronIcon = ({ back = false }: { back?: boolean }) => (
  <Icon className={back ? 'chevron back' : 'chevron'}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);
