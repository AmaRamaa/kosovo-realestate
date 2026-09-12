'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { cityApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';

const CITIES = ['Prishtinë', 'Prizren', 'Pejë', 'Gjilan', 'Ferizaj', 'Mitrovicë', 'Gjakovë', 'Podujevë'];

export default function Footer() {
  const { t } = useTranslation('footer');
  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then((r) => r.data) });
  const cityIdByName: Record<string, string> = {};
  (citiesData?.cities || []).forEach((c: any) => { cityIdByName[c.name] = c.id; });

  const FOOTER_LINKS = {
    [t('buyHeading')]: [
      { label: t('apartmentsForSale'), href: '/properties?listingType=SALE&propertyType=APARTMENT' },
      { label: t('housesForSale'), href: '/properties?listingType=SALE&propertyType=HOUSE' },
      { label: t('villas'), href: '/properties?listingType=SALE&propertyType=VILLA' },
      { label: t('land'), href: '/properties?listingType=SALE&propertyType=LAND' },
      { label: t('commercial'), href: '/properties?listingType=SALE&propertyType=COMMERCIAL' },
    ],
    [t('rentHeading')]: [
      { label: t('apartmentsForRent'), href: '/properties?listingType=RENT&propertyType=APARTMENT' },
      { label: t('housesForRent'), href: '/properties?listingType=RENT&propertyType=HOUSE' },
      { label: t('studios'), href: '/properties?listingType=RENT&propertyType=STUDIO' },
      { label: t('offices'), href: '/properties?listingType=RENT&propertyType=OFFICE' },
    ],
    [t('companyHeading')]: [
      { label: t('aboutUs'), href: '/about' },
      { label: t('listYourProperty'), href: '/list-your-property' },
      { label: t('agents'), href: '/agents' },
      { label: t('contact'), href: '/contact' },
    ],
  };

  return (
    <footer className="bg-white text-neutral-600 pt-16 pb-8 border-t border-neutral-200">
      <div className="container-page">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-200">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <Logo className="h-11 text-primary-600" />
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed mb-6 max-w-xs">
              {t('tagline')}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-500">
                <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                Rr. Nënë Tereza, Prishtinë, Kosovo
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" />
                +383 45 400 907
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <Mail className="w-4 h-4 text-primary-600 flex-shrink-0" />
                realestatemolla@gmail.com
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-neutral-900 mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-500 hover:text-primary-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Cities */}
        <div className="py-6 border-b border-neutral-200">
          <h4 className="font-display font-semibold text-neutral-900 mb-3 text-sm">{t('popularCities')}</h4>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <Link
                key={city}
                href={cityIdByName[city] ? `/properties?cityId=${cityIdByName[city]}` : '/properties'}
                className="px-3 py-1.5 rounded-full bg-neutral-100 text-xs text-neutral-600 hover:bg-primary-600 hover:text-white transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} {t('copyright')}</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900">{t('termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
