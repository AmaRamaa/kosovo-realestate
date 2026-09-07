'use client';

import { useQuery } from '@tanstack/react-query';
import { Star, Building2, Users } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { agencyApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AgenciesPage() {
  const { t } = useTranslation('staticPages');
  const { data, isLoading } = useQuery({
    queryKey: ['agencies'],
    queryFn: () => agencyApi.getAll().then(r => r.data),
  });

  const agencies = data?.agencies || [];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="bg-primary-50 dark:bg-primary-950/30 py-16">
          <div className="container-page text-center max-w-2xl mx-auto">
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 dark:text-white mb-4">{t('agenciesTitle')}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">{t('agenciesSubtitle')}</p>
          </div>
        </div>

        <div className="container-page py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}
            </div>
          ) : agencies.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">{t('agenciesEmpty')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agencies.map((agency: any) => (
                <div key={agency.id} className="card p-6">
                  <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-1">{agency.name}</h3>
                  {agency.city?.name && <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{agency.city.name}</p>}
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{agency.rating}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 pt-3 border-t border-primary-100 dark:border-primary-900/40">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {agency._count?.agents ?? 0} {t('agents')}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {agency._count?.listings ?? 0} {t('listings')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
