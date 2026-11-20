import { useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { Player } from '../domain/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { I18nContext } from './context';
import { defaultLanguage, isLanguage, STRINGS, type Language } from './strings';

// Keys keep the site's first name, so visitors' saved choices survive the rename.
const STORAGE_KEY = 'hall-of-fame:language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [stored, setLanguage] = useLocalStorage<Language | null>(STORAGE_KEY, null);
  const language = isLanguage(stored)
    ? stored
    : defaultLanguage(navigator.languages, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const t = STRINGS[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = t.dir;
  }, [language, t]);

  const name = useCallback((p: Player) => p.name[language], [language]);
  const value = useMemo(
    () => ({ language, t, setLanguage, name }),
    [language, t, setLanguage, name],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
