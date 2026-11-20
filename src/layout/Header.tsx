import type { Route } from '../domain/routes';
import { useI18n } from '../i18n/context';
import { Button } from '../ui/Button';
import styles from './Header.module.css';
import { Logo } from './Logo';

interface Props {
  route: Route;
  /** Where "Seasons" leads: the season seen last, or the latest one. */
  seasonsHref: string;
}

export function Header({ route, seasonsHref }: Props) {
  const { t, language, setLanguage } = useI18n();
  const links = [
    { key: 'home', href: '#/', label: t.nav.home },
    { key: 'season', href: seasonsHref, label: t.nav.seasons },
    { key: 'records', href: '#/records', label: t.nav.records },
  ] as const;

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.brand} href="#/">
          <Logo size={42} />
          <span className={styles.name}>{t.brand}</span>
        </a>
        <nav className={styles.nav} aria-label={t.navLabel}>
          {links.map((l) => (
            <a
              key={l.key}
              className={styles.link}
              href={l.href}
              aria-current={route.name === l.key ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className={styles.end}>
          <span className={`${styles.version} num`} title={t.version(__APP_VERSION__)}>
            v{__APP_VERSION__}
          </span>
          <Button
            onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
            aria-label={t.switchLanguageLabel}
            lang={language === 'he' ? 'en' : 'he'}
          >
            {t.switchLanguage}
          </Button>
        </div>
      </div>
    </header>
  );
}
