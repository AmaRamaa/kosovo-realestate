import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/utils';

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'daily' },
  { path: '/properties', priority: 0.9, changeFrequency: 'daily' },
  { path: '/agencies', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/agents', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/list-your-property', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  let listingEntries: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/listings?limit=1000&status=ACTIVE`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      listingEntries = (data.listings || []).map((listing: any) => ({
        url: `${SITE_URL}/properties/${listing.slug}`,
        lastModified: new Date(listing.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // A briefly unreachable API shouldn't fail the whole sitemap — static routes still ship.
  }

  return [...staticEntries, ...listingEntries];
}
