'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { MapPinned, ShieldCheck, Users2, Headphones, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CtaBannerSection } from '@/components/home/MiscSections';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { cityApi, agentApi, listingApi } from '@/lib/api';

export default function AboutPage() {
  const { t } = useTranslation('staticPages');

  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then((r) => r.data) });
  const { data: agentsData } = useQuery({ queryKey: ['agents', 'count'], queryFn: () => agentApi.getAll({ limit: 1 }).then((r) => r.data) });
  const { data: listingsData } = useQuery({ queryKey: ['listings', 'count'], queryFn: () => listingApi.getAll({ limit: 1 }).then((r) => r.data) });

  const stats = [
    { icon: MapPinned, value: `${citiesData?.cities?.length ?? '—'}`, label: t('statCities') },
    { icon: Users2, value: `${agentsData?.pagination?.total ?? '—'}`, label: t('statAgents') },
    { icon: Award, value: `${listingsData?.pagination?.total ?? '—'}`, label: t('statListings') },
  ];

  const features = [
    { icon: ShieldCheck, titleKey: 'aboutFeature1Title', descKey: 'aboutFeature1Desc' },
    { icon: Award, titleKey: 'aboutFeature2Title', descKey: 'aboutFeature2Desc' },
    { icon: MapPinned, titleKey: 'aboutFeature3Title', descKey: 'aboutFeature3Desc' },
    { icon: Headphones, titleKey: 'aboutFeature4Title', descKey: 'aboutFeature4Desc' },
  ] as const;

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="relative overflow-hidden bg-primary-50 dark:bg-primary-950/30 py-16 lg:py-20">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="container-page text-center max-w-2xl mx-auto relative">
            <span className="eyebrow">{t('aboutHeroEyebrow')}</span>
            <h1 className="font-display font-bold text-3xl lg:text-5xl text-neutral-900 dark:text-white mb-4 text-balance">{t('aboutTitle')}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed">{t('aboutIntro')}</p>
          </div>
        </div>

        <div className="container-page py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16 lg:mb-20">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary-100 dark:border-primary-900/40 order-1 lg:order-2">
              <Image
                src="https://images.unsplash.com/photo-1654983972542-66f3a80a1dbe?w=900&q=80"
                alt="Prishtinë, Kosovo"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="order-2 lg:order-1">
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg mb-6">{t('aboutBody1')}</p>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{t('aboutBody2')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="card p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="font-display font-bold text-2xl text-primary-600 dark:text-primary-400 mb-1">{s.value}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="section bg-neutral-100/60 dark:bg-neutral-800/30">
          <div className="container-page">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="eyebrow">{t('aboutFeaturesEyebrow')}</span>
              <h2 className="section-heading text-2xl lg:text-3xl">{t('aboutFeaturesTitle')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.titleKey} className="text-center px-2">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{t(feature.descKey)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CtaBannerSection />
      </main>
      <Footer />
    </>
  );
}
