'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building2, Heart, Eye, MessageSquare, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listingApi } from '@/lib/api';
import { formatPrice, formatRelativeDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ['my-listings'], queryFn: () => listingApi.getMyListings().then(r => r.data) });
  const listings = data?.listings || [];

  const stats = [
    { label: 'Active listings', value: listings.filter((l:any) => l.status === 'ACTIVE').length, icon: Building2, color: 'text-primary-600 bg-primary-100 dark:bg-primary-950' },
    { label: 'Total views', value: listings.reduce((a:number, l:any) => a + l.viewCount, 0), icon: Eye, color: 'text-secondary-600 bg-secondary-100 dark:bg-secondary-950' },
    { label: 'Saved by users', value: listings.reduce((a:number, l:any) => a + (l._count?.favorites || 0), 0), icon: Heart, color: 'text-rose-600 bg-rose-100 dark:bg-rose-950' },
    { label: 'Inquiries', value: listings.reduce((a:number, l:any) => a + (l._count?.appointments || 0), 0), icon: MessageSquare, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">Good morning, {user?.firstName} 👋</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Here's what's happening with your listings</p>
        </div>
        <Link href="/dashboard/listings/new" className="btn-primary btn-md">
          <Plus className="w-4 h-4" /> New listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{s.value.toLocaleString()}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Listings */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="font-display font-semibold text-neutral-900 dark:text-white">My listings</h2>
          <Link href="/dashboard/listings" className="link text-sm flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {listings.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">No listings yet</p>
            <Link href="/dashboard/listings/new" className="btn-primary btn-md inline-flex"><Plus className="w-4 h-4" /> Post your first listing</Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {listings.slice(0, 5).map((listing: any) => (
              <div key={listing.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/30">
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                  {listing.images?.[0] && <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-1">{listing.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{listing.city?.name} · {formatRelativeDate(listing.createdAt)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-primary-600 dark:text-primary-400 text-sm">{formatPrice(listing.price, listing.currency, listing.listingType)}</p>
                  <span className={`badge text-[10px] ${listing.status === 'ACTIVE' ? 'badge-green' : listing.status === 'PENDING' ? 'badge-yellow' : 'badge-gray'}`}>{listing.status}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 flex-shrink-0 hidden sm:flex">
                  <Eye className="w-3.5 h-3.5" /> {listing.viewCount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
