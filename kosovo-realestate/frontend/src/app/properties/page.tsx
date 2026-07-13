'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Grid3x3, List, Map as MapIcon, SlidersHorizontal, X } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton';
import SearchFiltersPanel from '@/components/search/SearchFiltersPanel';
import { listingApi, cityApi } from '@/lib/api';
import { ListingFilters } from '@/types';
import { SORT_OPTIONS, cn } from '@/lib/utils';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters: ListingFilters = {
    listingType: (searchParams.get('listingType') as any) || undefined,
    propertyType: (searchParams.get('propertyType') as any) || undefined,
    cityId: searchParams.get('cityId') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    minArea: searchParams.get('minArea') ? Number(searchParams.get('minArea')) : undefined,
    maxArea: searchParams.get('maxArea') ? Number(searchParams.get('maxArea')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    hasGarden: searchParams.get('hasGarden') === 'true' || undefined,
    hasPool: searchParams.get('hasPool') === 'true' || undefined,
    hasBalcony: searchParams.get('hasBalcony') === 'true' || undefined,
    hasFurnished: searchParams.get('hasFurnished') === 'true' || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  };

  const { data: citiesData } = useQuery({
    queryKey: ['cities'],
    queryFn: () => cityApi.getAll().then(r => r.data),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['listings', filters],
    queryFn: () => listingApi.getAll(filters).then(r => r.data),
  });

  const updateFilters = (newFilters: ListingFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && key !== 'limit') {
        params.set(key, String(value));
      }
    });
    params.delete('page');
    router.push(`/properties?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split(':');
    updateFilters({ ...filters, sortBy, sortOrder: sortOrder as any });
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/properties?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listings = data?.listings || [];
  const pagination = data?.pagination;
  const cities = citiesData?.cities || [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-screen">
        <div className="container-page py-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">
                {isLoading ? 'Searching...' : `${pagination?.total || 0} properties found`}
              </h1>
              {filters.search && <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Results for "{filters.search}"</p>}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="input w-auto text-sm py-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* View toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                {[
                  { mode: 'grid' as const, icon: Grid3x3 },
                  { mode: 'list' as const, icon: List },
                  { mode: 'map' as const, icon: MapIcon },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    className={cn('p-2 rounded-md transition-colors', view === mode ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'text-neutral-400')}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Mobile filter button */}
              <button onClick={() => setMobileFiltersOpen(true)} className="btn-secondary btn-md lg:hidden">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <SearchFiltersPanel filters={filters} cities={cities} onChange={updateFilters} onClear={() => router.push('/properties')} />
              </div>
            </aside>

            {/* Mobile Filters Drawer */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-neutral-50 dark:bg-neutral-900 overflow-y-auto animate-slide-up">
                  <div className="sticky top-0 bg-white dark:bg-neutral-800 p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 z-10">
                    <h3 className="font-display font-semibold">Filters</h3>
                    <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4">
                    <SearchFiltersPanel filters={filters} cities={cities} onChange={updateFilters} onClear={() => router.push('/properties')} />
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className={cn('grid gap-6', view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3')}>
                  {Array.from({ length: 9 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">No properties match your search criteria.</p>
                  <button onClick={() => router.push('/properties')} className="btn-primary btn-md">Clear filters</button>
                </div>
              ) : (
                <>
                  <div className={cn('grid gap-6', view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3')}>
                    {listings.map((listing: any) => (
                      <PropertyCard key={listing.id} listing={listing} className={view === 'list' ? 'sm:flex sm:flex-row' : ''} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button
                        disabled={pagination.page <= 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="btn-secondary btn-sm disabled:opacity-40"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(pagination.pages, 7) }).map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={cn(
                              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                              page === pagination.page ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="btn-secondary btn-sm disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="skeleton w-12 h-12 rounded-full" /></div>}>
      <PropertiesContent />
    </Suspense>
  );
}
