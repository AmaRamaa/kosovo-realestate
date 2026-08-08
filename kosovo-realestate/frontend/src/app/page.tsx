'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ListingSection from '@/components/home/ListingSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { WhyChooseSection, OurAgentsSection, BlogPreviewSection, CtaBannerSection } from '@/components/home/MiscSections';
import { listingApi } from '@/lib/api';

export default function HomePage() {
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
        <HeroSection />

        <ListingSection
          eyebrow="Featured Listings"
          title="Discover luxury homes"
          subtitle="Hand-picked premium listings"
          listings={featuredData?.listings || []}
          isLoading={featuredLoading}
          viewAllHref="/properties?isFeatured=true"
        />

        <div className="bg-neutral-100/60 dark:bg-neutral-800/30">
          <ListingSection
            eyebrow="Just Listed"
            title="Newest listings"
            subtitle="Recently added properties across Kosovo"
            listings={recentData?.listings || []}
            isLoading={recentLoading}
            viewAllHref="/properties?sortBy=createdAt&sortOrder=desc"
          />
        </div>

        <WhyChooseSection />
        <PopularCitiesSection />
        <OurAgentsSection />
        <TestimonialsSection />
        <BlogPreviewSection />
        <CtaBannerSection />
      </main>
      <Footer />
    </>
  );
}
