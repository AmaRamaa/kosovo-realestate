'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Locale = 'en' | 'sq';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('locale');
      if (stored === 'en' || stored === 'sq') setLocaleState(stored);
    } catch {}
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try { localStorage.setItem('locale', next); } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
