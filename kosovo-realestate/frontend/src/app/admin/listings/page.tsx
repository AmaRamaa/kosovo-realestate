'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Star, Trash2, ExternalLink, ChevronLeft, ChevronRight, Plus, Pencil } from 'lucide-react';
import Link from 'next/link';
import { listingApi } from '@/lib/api';
import { formatPrice, formatRelativeDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';

const STATUSES = ['ALL', 'PENDING', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE', 'REJECTED'] as const;
const STATUS_BADGE: Record<string, string> = {
  PENDING: 'badge-yellow', ACTIVE: 'badge-green', SOLD: 'badge-blue',
  RENTED: 'badge-blue', INACTIVE: 'badge-gray', REJECTED: 'badge-red',
};

export default function AdminListingsPage() {
  const { t, locale } = useTranslation('admin');
  const { t: tType } = useTranslation('propertyTypes');
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const statusLabel: Record<string, string> = {
    ALL: t('filterAll'), PENDING: t('statusPending'), ACTIVE: t('statusActive'),
    SOLD: t('statusSold'), RENTED: t('statusRented'), INACTIVE: t('statusInactive'), REJECTED: t('statusRejected'),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listings', { status, search, page }],
    queryFn: () => listingApi.getAll({ status, search: search || undefined, page, limit: 15, sortBy: 'createdAt', sortOrder: 'desc' }).then(r => r.data),
  });

  const listings = data?.listings || [];
  const pagination = data?.pagination;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await listingApi.approve(id, newStatus);
    invalidate();
  };

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    await listingApi.update(id, { isFeatured: !isFeatured });
    invalidate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteListingConfirm'))) return;
    await listingApi.delete(id);
    invalidate();
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('listingsTitle')}</h1>
            {pagination && <span className="text-sm text-neutral-500">{pagination.total} {t('resultsCount')}</span>}
          </div>
          <Link href="/admin/listings/new" className="btn-primary btn-md">
            <Plus className="w-4 h-4" /> New Listing
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <form
            className="relative flex-1 max-w-sm"
            onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input pl-9"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={s === status
                  ? 'btn-sm btn bg-primary-600 text-white'
                  : 'btn-sm btn bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-neutral-500">
              <div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noListings')}</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {listings.map((listing: any) => (
                <div key={listing.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                    {listing.images?.[0] && <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-1 flex items-center gap-1.5">
                      {listing.isFeatured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />}
                      {listing.title}
                    </p>
                    <p className="text-xs text-neutral-500">{listing.city?.name} · {tType(listing.propertyType)}</p>
                    <p className="text-xs text-neutral-400">{formatRelativeDate(listing.createdAt, locale)}</p>
                  </div>
                  <div className="text-sm font-semibold text-primary-600 flex-shrink-0 min-w-[90px]">
                    {formatPrice(listing.price, listing.currency, listing.listingType)}
                  </div>
                  <select
                    value={listing.status}
                    onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                    className={`badge ${STATUS_BADGE[listing.status] || 'badge-gray'} border-0 cursor-pointer`}
                  >
                    {STATUSES.filter(s => s !== 'ALL').map((s) => (
                      <option key={s} value={s}>{statusLabel[s]}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                    <button
                      onClick={() => handleToggleFeatured(listing.id, listing.isFeatured)}
                      title={listing.isFeatured ? t('unfeatureListing') : t('featureListing')}
                      className={`btn-sm btn ${listing.isFeatured ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'btn-ghost'}`}
                    >
                      <Star className={`w-4 h-4 ${listing.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <Link href={`/properties/${listing.slug}`} target="_blank" title={t('viewListing')} className="btn-sm btn btn-ghost">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link href={`/admin/listings/${listing.id}/edit`} title="Edit" className="btn-sm btn btn-ghost">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(listing.id)} title={t('deleteAction')} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-sm btn btn-secondary disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-neutral-500">{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-sm btn btn-secondary disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
