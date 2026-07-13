'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, Bed, Bath, Maximize, MapPin, Car } from 'lucide-react';
import { Listing } from '@/types';
import { formatPrice, formatArea, PROPERTY_TYPE_LABELS, cn } from '@/lib/utils';
import { favoriteApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/Toaster';

interface PropertyCardProps {
  listing: Listing;
  isFavorited?: boolean;
  className?: string;
}

export default function PropertyCard({ listing, isFavorited = false, className }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const coverImage = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast('Please sign in to save favorites', 'info');
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        await favoriteApi.remove(listing.id);
        setFavorited(false);
      } else {
        await favoriteApi.add(listing.id);
        setFavorited(true);
        toast('Added to favorites', 'success');
      }
    } catch {
      toast('Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/properties/${listing.slug}`} className={cn('card-hover group block', className)}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
        <Image
          src={coverImage}
          alt={listing.images?.[0]?.alt || listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge', listing.listingType === 'SALE' ? 'bg-primary-600 text-white' : 'bg-secondary-600 text-white')}>
            {listing.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
          </span>
          {listing.isFeatured && (
            <span className="badge bg-amber-500 text-white">Featured</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-900 transition-colors shadow-sm"
          aria-label="Toggle favorite"
        >
          <Heart className={cn('w-4 h-4 transition-colors', favorited ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-300')} />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm font-display font-bold text-primary-600 dark:text-primary-400 text-base shadow-sm">
            {formatPrice(listing.price, listing.currency, listing.listingType)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="badge-gray text-[11px]">{PROPERTY_TYPE_LABELS[listing.propertyType]}</span>
        </div>

        <h3 className="font-display font-semibold text-neutral-900 dark:text-white line-clamp-1 mb-1.5 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{listing.neighborhood?.name ? `${listing.neighborhood.name}, ` : ''}{listing.city.name}</span>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-neutral-100 dark:border-neutral-700">
          {listing.bedrooms !== undefined && listing.bedrooms !== null && (
            <div className="property-stat">
              <Bed className="w-4 h-4" />
              <span>{listing.bedrooms}</span>
            </div>
          )}
          {listing.bathrooms !== undefined && listing.bathrooms !== null && (
            <div className="property-stat">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms}</span>
            </div>
          )}
          <div className="property-stat">
            <Maximize className="w-4 h-4" />
            <span>{formatArea(listing.area)}</span>
          </div>
          {listing.parkingSpaces > 0 && (
            <div className="property-stat">
              <Car className="w-4 h-4" />
              <span>{listing.parkingSpaces}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
