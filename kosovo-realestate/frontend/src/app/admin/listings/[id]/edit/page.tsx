'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ListingForm from '@/components/admin/ListingForm';
import { listingApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function EditListingPage() {
  const { t } = useTranslation('admin');
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-listing', id],
    queryFn: () => listingApi.getById(id).then((r) => r.data),
  });

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <Link href="/admin/listings" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4">
          <ArrowLeft className="w-4 h-4" /> {t('backToListings')}
        </Link>
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-8">{t('editListingTitle')}</h1>
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        ) : data?.listing ? (
          <ListingForm listing={data.listing} />
        ) : (
          <p className="text-neutral-500">{t('listingNotFound')}</p>
        )}
      </div>
    </AdminLayout>
  );
}
