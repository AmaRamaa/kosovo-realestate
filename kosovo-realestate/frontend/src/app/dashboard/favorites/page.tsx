'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, Bed, Bath, Maximize, MapPin, ExternalLink } from 'lucide-react';
import { favoriteApi } from '@/lib/api';
import { formatPrice, formatArea } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoriteApi.getAll().then(r => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (listingId: string) => favoriteApi.remove(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast('Removed from favorites', 'info');
    },
  });

  const favorites = data?.favorites || [];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">Saved properties</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">{favorites.length} properties saved</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="skeleton aspect-[4/3]" />
              <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-neutral-200 dark:text-neutral-700 mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-2">No saved properties yet</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">Start browsing and save properties you're interested in</p>
          <Link href="/properties" className="btn-primary btn-md inline-flex">Browse properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {favorites.map((fav: any) => {
            const listing = fav.listing;
            const cover = listing.images?.[0]?.url;
            return (
              <div key={fav.id} className="card-hover group">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                  {cover && <Image src={cover} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />}
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${listing.listingType === 'SALE' ? 'bg-primary-600 text-white' : 'bg-secondary-600 text-white'}`}>
                      {listing.listingType === 'SALE' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(listing.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1.5 rounded-lg bg-white/95 dark:bg-neutral-900/95 font-display font-bold text-primary-600 dark:text-primary-400 text-sm shadow-sm">
                      {formatPrice(listing.price, listing.currency, listing.listingType)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-neutral-900 dark:text-white line-clamp-1 mb-1">{listing.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="line-clamp-1">{listing.city?.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-neutral-100 dark:border-neutral-700 mb-4">
                    {listing.bedrooms != null && <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{listing.bedrooms}</span>}
                    {listing.bathrooms != null && <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{listing.bathrooms}</span>}
                    <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{formatArea(listing.area)}</span>
                  </div>
                  <Link href={`/properties/${listing.slug}`} className="btn-primary btn-sm w-full">
                    <ExternalLink className="w-4 h-4" /> View property
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
