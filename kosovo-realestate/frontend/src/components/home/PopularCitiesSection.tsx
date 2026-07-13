import Link from 'next/link';
import Image from 'next/image';

const CITIES = [
  { name: 'Prishtinë', count: 842, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600' },
  { name: 'Prizren', count: 318, image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600' },
  { name: 'Pejë', count: 197, image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=600' },
  { name: 'Gjilan', count: 156, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600' },
  { name: 'Ferizaj', count: 134, image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600' },
  { name: 'Gjakovë', count: 112, image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600' },
];

export default function PopularCitiesSection() {
  return (
    <section className="section bg-neutral-100/60 dark:bg-neutral-800/30">
      <div className="container-page">
        <div className="mb-8">
          <h2 className="section-heading text-2xl lg:text-3xl mb-1">Popular cities in Kosovo</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Explore properties in Kosovo's most sought-after locations</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/properties?city=${city.name}`}
              className="relative aspect-[16/10] rounded-xl overflow-hidden group block"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display font-semibold text-white text-lg">{city.name}</h3>
                <p className="text-white/80 text-sm">{city.count} properties</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
