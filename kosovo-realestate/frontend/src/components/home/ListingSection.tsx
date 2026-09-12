'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Listing } from '@/types';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ListingSectionProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  listings: Listing[];
  isLoading?: boolean;
  viewAllHref: string;
  skeletonCount?: number;
}

export default function ListingSection({ title, subtitle, eyebrow, listings, isLoading, viewAllHref, skeletonCount = 8 }: ListingSectionProps) {
  const { t } = useTranslation('listingSection');
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className="section-heading text-2xl lg:text-3xl mb-1">{title}</h2>
            {subtitle && <p className="text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
          </div>
          <Link href={viewAllHref} className="link flex items-center gap-1 text-sm flex-shrink-0 whitespace-nowrap">
            {t('viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : listings.map((listing, i) => <PropertyCard key={listing.id} listing={listing} index={i} />)}
        </div>
      </div>
    </section>
  );
}
