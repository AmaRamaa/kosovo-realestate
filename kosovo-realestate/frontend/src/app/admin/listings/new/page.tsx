'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ListingForm from '@/components/admin/ListingForm';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function NewListingPage() {
  const { t } = useTranslation('admin');
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <Link href="/admin/listings" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4">
          <ArrowLeft className="w-4 h-4" /> {t('backToListings')}
        </Link>
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-8">{t('newListingBtn')}</h1>
        <ListingForm />
      </div>
    </AdminLayout>
  );
}
