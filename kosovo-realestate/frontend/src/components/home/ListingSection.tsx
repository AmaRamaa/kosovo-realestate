'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Listing } from '@/types';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';

interface ListingSectionProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  listings: Listing[];
  isLoading?: boolean;
  viewAllHref: string;
}

export default function ListingSection({ title, subtitle, eyebrow, listings, isLoading, viewAllHref }: ListingSectionProps) {
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
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : listings.slice(0, 4).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
        </div>
      </div>
    </section>
  );
}
