'use client';

import { useLocale } from '@/contexts/LocaleContext';
import { dictionaries, type Namespace } from './dictionaries';

export function useTranslation<N extends Namespace>(namespace: N) {
  const { locale, setLocale } = useLocale();
  const dict = dictionaries[namespace] as Record<'en' | 'sq', Record<string, string>>;

  const t = (key: string): string => {
    return dict[locale]?.[key] ?? dict.en[key] ?? key;
  };

  return { t, locale, setLocale };
}
