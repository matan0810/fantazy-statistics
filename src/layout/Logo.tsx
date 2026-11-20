/** Three podium steps in gold: the site's mark. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#d99a1e" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="#171b25" />
      <rect x="6" y="15" width="6" height="11" rx="1.5" fill="#c9d1dc" />
      <rect x="13" y="8" width="6" height="18" rx="1.5" fill="url(#logo-gold)" />
      <rect x="20" y="18" width="6" height="8" rx="1.5" fill="#d9915a" />
    </svg>
  );
}
