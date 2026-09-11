'use client';

import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import HeroSearchBar from '@/components/home/HeroSearchBar';
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
            src="https://images.unsplash.com/photo-1654983972542-66f3a80a1dbe?w=2000&q=80"
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

        <div className="container-page relative pt-24 pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="sr-only">{t('logoAlt')}</h1>
            <Logo className="h-28 sm:h-32 lg:h-36 text-primary-600 opacity-50 mx-auto mb-8" />
            <div className="flex justify-center mb-3">
              <HeroSearchBar />
            </div>
            <Link href="/list-your-property" className="text-sm text-white/80 hover:text-white underline underline-offset-4 transition-colors">
              {t('listYourProperty')}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured listings overlap the hero's crisp bottom edge — half on the photo, half on the page,
          giving visitors an immediate peek that invites scrolling into the full listings below. */}
      <div className="container-page">
        <div className="-mt-10 sm:-mt-14 lg:-mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : listings.slice(0, 4).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
        </div>
      </div>
    </>
  );
}
