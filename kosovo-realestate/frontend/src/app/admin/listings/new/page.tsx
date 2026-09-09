'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ListingForm from '@/components/admin/ListingForm';

export default function NewListingPage() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <Link href="/admin/listings" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-8">New Listing</h1>
        <ListingForm />
      </div>
    </AdminLayout>
  );
}
