'use client';

import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import { dictionaries, type Namespace } from './dictionaries';

export function useTranslation<N extends Namespace>(namespace: N) {
  const { locale: siteLocale, setLocale } = useLocale();
  const pathname = usePathname();
  // The admin dashboard is Albanian-only for its one (Albanian-speaking) owner,
  // regardless of whatever locale the public site is currently showing.
  const locale = pathname?.startsWith('/admin') ? 'sq' : siteLocale;
  const dict = dictionaries[namespace] as Record<'en' | 'sq', Record<string, string>>;

  const t = (key: string): string => {
    return dict[locale]?.[key] ?? dict.en[key] ?? key;
  };

  return { t, locale, setLocale };
}
