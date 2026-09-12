'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import HeroSearchBar from '@/components/home/HeroSearchBar';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HeroSection() {
  const { t } = useTranslation('hero');

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-villa.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Uniform dark scrim so text stays legible over the whole photo */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Subtle vignette for depth — no fade into the page background, hero ends on a crisp edge */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
      </div>

      <div className="container-page relative py-16 lg:py-20 w-full min-w-0">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="sr-only">{t('logoAlt')}</h1>
          <Logo className="h-36 sm:h-40 lg:h-44 text-white mx-auto mb-8" />
          <div className="flex justify-center mb-3">
            <HeroSearchBar />
          </div>
          <Link
            href="/list-your-property"
            className="btn bg-white/10 text-white border border-white/40 hover:bg-white hover:text-primary-700 hover:border-white btn-md backdrop-blur-sm"
          >
            <PlusCircle className="w-4 h-4" /> {t('listYourProperty')}
          </Link>
        </div>
      </div>
    </section>
  );
}
