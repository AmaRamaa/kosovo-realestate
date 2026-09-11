'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ListingSection from '@/components/home/ListingSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import { OurAgentsSection } from '@/components/home/MiscSections';
import { listingApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HomePage() {
  const { t } = useTranslation('home');

  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: () => listingApi.getFeatured().then(r => r.data),
  });

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['listings', 'recent'],
    queryFn: () => listingApi.getRecent({ limit: 8 }).then(r => r.data),
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection listings={featuredData?.listings || []} isLoading={featuredLoading} />

        <div className="pt-16 lg:pt-20">
          <ListingSection
            eyebrow={t('recentEyebrow')}
            title={t('recentTitle')}
            subtitle={t('recentSubtitle')}
            listings={recentData?.listings || []}
            isLoading={recentLoading}
            viewAllHref="/properties?sortBy=createdAt&sortOrder=desc"
          />
        </div>

        <PopularCitiesSection />
        <OurAgentsSection />
      </main>
      <Footer />
    </>
  );
}
