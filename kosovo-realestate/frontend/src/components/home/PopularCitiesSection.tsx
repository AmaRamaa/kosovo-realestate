'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { cityApi } from '@/lib/api';

const CITY_IMAGES: Record<string, string> = {
  'Prishtinë': 'https://images.unsplash.com/photo-1654983972542-66f3a80a1dbe?w=700&q=80',
  'Prizren': 'https://images.unsplash.com/photo-1622400456695-951f80571268?w=700&q=80',
  'Pejë': 'https://images.unsplash.com/photo-1650239995181-b6d37139b837?w=700&q=80',
  'Gjilan': 'https://images.unsplash.com/photo-1650240430719-261b362f9308?w=700&q=80',
  'Ferizaj': 'https://images.unsplash.com/photo-1770291841814-0486e0799bbd?w=700&q=80',
  'Gjakovë': 'https://images.unsplash.com/photo-1597428983834-58c4ec5640fb?w=700&q=80',
};

function CityCard({ city }: { city: { id: string; name: string; count: number; image: string } }) {
  const { t } = useTranslation('popularCities');
  return (
    <Link
      href={`/properties?cityId=${city.id}`}
      className="relative flex-shrink-0 w-72 aspect-[16/10] rounded-xl overflow-hidden group block border border-primary-100 dark:border-primary-900/40"
    >
      <Image
        src={city.image}
        alt={city.name}
        fill
        sizes="288px"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display font-semibold text-white text-lg">{city.name}</h3>
        <p className="text-white/80 text-sm">{city.count} {t('properties')}</p>
      </div>
    </Link>
  );
}

export default function PopularCitiesSection() {
  const { t } = useTranslation('popularCities');
  const { data } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then(r => r.data) });

  const cities = (data?.cities || [])
    .filter((c: any) => CITY_IMAGES[c.name])
    .sort((a: any, b: any) => (b._count?.listings ?? 0) - (a._count?.listings ?? 0))
    .slice(0, 6)
    .map((c: any) => ({ id: c.id, name: c.name, count: c._count?.listings ?? 0, image: CITY_IMAGES[c.name] }));

  if (cities.length === 0) return null;

  const track = [...cities, ...cities];

  return (
    <section className="section bg-neutral-100/60 dark:bg-neutral-800/30">
      <div className="container-page mb-8">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 className="section-heading text-2xl lg:text-3xl mb-1">{t('title')}</h2>
        <p className="text-neutral-500 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

      <div className="relative overflow-hidden group/marquee [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex gap-4 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
          {track.map((city, i) => (
            <CityCard key={`${city.name}-${i}`} city={city} />
          ))}
        </div>
      </div>
    </section>
  );
}
