import { createContext, useContext } from 'react';
import type { Player } from '../domain/types';
import { STRINGS, type Language, type Strings } from './strings';

export interface I18n {
  language: Language;
  t: Strings;
  setLanguage: (language: Language) => void;
  /** A player's name in the current language. */
  name: (player: Player) => string;
}

export const I18nContext = createContext<I18n>({
  language: 'he',
  t: STRINGS.he,
  setLanguage: () => undefined,
  name: (p) => p.name.he,
});

export function useI18n() {
  return useContext(I18nContext);
}
