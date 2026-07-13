'use client';
import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { adminApi, listingApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, formatRelativeDate } from '@/lib/utils';
import DashboardLayout from '../dashboard/layout';

export default function AdminPage() {
  const { user } = useAuth();
  const { data: statsData } = useQuery({ queryKey: ['admin-stats'], queryFn: () => adminApi.getStats().then(r => r.data) });
  const { data: pendingData } = useQuery({ queryKey: ['admin-pending'], queryFn: () => adminApi.getPendingListings().then(r => r.data) });

  const stats = statsData?.stats;
  const pendingListings = pendingData?.listings || [];

  const handleApprove = async (id: string, status: 'ACTIVE' | 'REJECTED') => {
    await listingApi.approve(id, status);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8">
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total users', value: stats?.users, icon: Users, color: 'text-primary-600 bg-primary-100 dark:bg-primary-950' },
            { label: 'Active listings', value: stats?.listings, icon: Building2, color: 'text-secondary-600 bg-secondary-100 dark:bg-secondary-950' },
            { label: 'Pending review', value: stats?.pendingListings, icon: Clock, color: 'text-amber-600 bg-amber-100 dark:bg-amber-950' },
            { label: 'Active agents', value: stats?.agents, icon: TrendingUp, color: 'text-purple-600 bg-purple-100 dark:bg-purple-950' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><Icon className="w-5 h-5" /></div>
                <div className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{s.value ?? '—'}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Pending Listings */}
        <div className="card">
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <h2 className="font-display font-semibold text-neutral-900 dark:text-white">Pending approvals</h2>
            <span className="badge-yellow">{pendingListings.length} pending</span>
          </div>
          {pendingListings.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">No pending listings</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {pendingListings.map((listing: any) => (
                <div key={listing.id} className="flex items-center gap-4 p-4">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                    {listing.images?.[0] && <img src={listing.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-1">{listing.title}</p>
                    <p className="text-xs text-neutral-500">{listing.city?.name} · by {listing.user?.firstName} {listing.user?.lastName}</p>
                    <p className="text-xs text-neutral-400">{formatRelativeDate(listing.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0 mr-4">
                    <p className="font-semibold text-primary-600 text-sm">{formatPrice(listing.price, listing.currency, listing.listingType)}</p>
                    <p className="text-xs text-neutral-500">{listing.propertyType}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(listing.id, 'ACTIVE')} className="btn-sm btn bg-secondary-600 text-white hover:bg-secondary-700">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleApprove(listing.id, 'REJECTED')} className="btn-sm btn bg-red-600 text-white hover:bg-red-700">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
