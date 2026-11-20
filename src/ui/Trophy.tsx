/**
 * The mark: a trophy in fine gold line. The same drawing is the app icon
 * (scripts/icons.html renders it for public/icons).
 */
export function Trophy({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="var(--gold)"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10h24v12a12 12 0 0 1-24 0Z" />
      <path d="M20 14h-6a6 6 0 0 0 7.5 9.4M44 14h6a6 6 0 0 1-7.5 9.4" />
      <path d="M32 34v9M25.5 43h13l2 8h-17Z" />
      <path d="M20 55h24" />
    </svg>
  );
}
