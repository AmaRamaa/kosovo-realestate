'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ListingSection from '@/components/home/ListingSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import { OurAgentsSection } from '@/components/home/MiscSections';
import { listingApi } from '@/lib/api';

export default function HomePage() {
  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['listings', 'recent'],
    queryFn: () => listingApi.getRecent({ limit: 8 }).then(r => r.data),
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <div className="-mt-10 sm:-mt-14 lg:-mt-16 relative z-10">
          <ListingSection
            hideHeader
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
