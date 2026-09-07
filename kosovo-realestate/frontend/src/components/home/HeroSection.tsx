'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Listing } from '@/types';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';

interface HeroSectionProps {
  listings?: Listing[];
  isLoading?: boolean;
}

export default function HeroSection({ listings = [], isLoading }: HeroSectionProps) {
  const { t } = useTranslation('hero');

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Uniform dark scrim so text stays legible over the whole photo */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Subtle vignette for depth — no fade into the page background, hero ends on a crisp edge */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
        </div>

        <div className="container-page relative pt-36 pb-24 lg:pt-44 lg:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="sr-only">{t('logoAlt')}</h1>
            <Logo className="h-20 sm:h-24 lg:h-28 text-primary-400 mx-auto mb-8" />
            <p className="text-lg text-white/80 text-balance max-w-2xl mx-auto mb-8">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/properties" className="btn-primary btn-lg">
                {t('exploreProperties')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/agents" className="btn bg-white/10 text-white border border-primary-400/50 hover:bg-white/20 btn-lg">
                <CalendarCheck className="w-4 h-4" /> {t('talkToAgent')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured listings overlap the hero's crisp bottom edge — half on the photo, half on the page,
          giving visitors an immediate peek that invites scrolling into the full listings below. */}
      <div className="container-page">
        <div className="-mt-10 sm:-mt-14 lg:-mt-16 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : listings.slice(0, 4).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
        </div>
      </div>
    </>
  );
}
