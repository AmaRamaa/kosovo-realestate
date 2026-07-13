'use client';

import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ListingSection from '@/components/home/ListingSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { FeaturedAgenciesSection, BlogPreviewSection } from '@/components/home/MiscSections';
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

  const { data: saleData, isLoading: saleLoading } = useQuery({
    queryKey: ['listings', 'recent', 'SALE'],
    queryFn: () => listingApi.getRecent({ limit: 8, listingType: 'SALE' }).then(r => r.data),
  });

  const { data: rentData, isLoading: rentLoading } = useQuery({
    queryKey: ['listings', 'recent', 'RENT'],
    queryFn: () => listingApi.getRecent({ limit: 8, listingType: 'RENT' }).then(r => r.data),
  });

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <ListingSection
          title="Featured properties"
          subtitle="Hand-picked premium listings"
          listings={featuredData?.listings || []}
          isLoading={featuredLoading}
          viewAllHref="/properties?isFeatured=true"
        />

        <div className="bg-neutral-100/60 dark:bg-neutral-800/30">
          <ListingSection
            title="Newest listings"
            subtitle="Recently added properties across Kosovo"
            listings={recentData?.listings || []}
            isLoading={recentLoading}
            viewAllHref="/properties?sortBy=createdAt&sortOrder=desc"
          />
        </div>

        <ListingSection
          title="Properties for sale"
          subtitle="Find your next home to buy"
          listings={saleData?.listings || []}
          isLoading={saleLoading}
          viewAllHref="/properties?listingType=SALE"
        />

        <div className="bg-neutral-100/60 dark:bg-neutral-800/30">
          <ListingSection
            title="Properties for rent"
            subtitle="Apartments, houses, and offices available now"
            listings={rentData?.listings || []}
            isLoading={rentLoading}
            viewAllHref="/properties?listingType=RENT"
          />
        </div>

        <PopularCitiesSection />
        <FeaturedAgenciesSection />
        <TestimonialsSection />
        <BlogPreviewSection />
      </main>
      <Footer />
    </>
  );
}
