import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight, Calendar } from 'lucide-react';

const AGENCIES = [
  { name: 'ERA Real Estate', logo: 'https://ui-avatars.com/api/?name=ERA&background=2563EB&color=fff', listings: 156, rating: 4.8 },
  { name: 'Kosovo Properties', logo: 'https://ui-avatars.com/api/?name=KP&background=10B981&color=fff', listings: 98, rating: 4.7 },
  { name: 'Prime Estates KS', logo: 'https://ui-avatars.com/api/?name=PE&background=2563EB&color=fff', listings: 87, rating: 4.9 },
  { name: 'Balkan Homes', logo: 'https://ui-avatars.com/api/?name=BH&background=10B981&color=fff', listings: 64, rating: 4.6 },
];

export function FeaturedAgenciesSection() {
  return (
    <section className="section bg-neutral-100/60 dark:bg-neutral-800/30">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-heading text-2xl lg:text-3xl mb-1">Featured agencies</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Trusted real estate partners across Kosovo</p>
          </div>
          <Link href="/agencies" className="link flex items-center gap-1 text-sm">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENCIES.map((agency) => (
            <div key={agency.name} className="card-hover p-6 text-center">
              <Image src={agency.logo} alt={agency.name} width={56} height={56} className="rounded-xl mx-auto mb-3" />
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm mb-1">{agency.name}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs text-neutral-600 dark:text-neutral-400">{agency.rating}</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{agency.listings} listings</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BLOG_POSTS = [
  {
    title: 'Si të Blesh Pronën e Parë në Kosovë: Udhëzuesi i Plotë',
    slug: 'si-te-blesh-pronen-e-pare-ne-kosove',
    excerpt: 'Gjithçka që duhet të dini para se të bëni investimin më të madh të jetës suaj.',
    coverImage: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600',
    category: 'Buying Guide',
    date: '15 Janar 2024',
  },
  {
    title: 'Tregu i Pronave në Prishtinë 2024: Analiza e Plotë',
    slug: 'tregu-i-pronave-ne-prishtine-2024',
    excerpt: 'Çmimet e apartamenteve, trendet dhe parashikimet për vitin 2024.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    category: 'Market Analysis',
    date: '10 Shkurt 2024',
  },
  {
    title: 'Investimi në Prona: Prizreni si Destinacion i Ardhshëm',
    slug: 'investimi-ne-prona-prizreni-destinacion',
    excerpt: 'Pse Prizreni po bëhet gjithnjë e më tërheqës për investitorët e pronave.',
    coverImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600',
    category: 'Investment',
    date: '5 Mars 2024',
  },
];

export function BlogPreviewSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-heading text-2xl lg:text-3xl mb-1">Latest from our blog</h2>
            <p className="text-neutral-500 dark:text-neutral-400">Tips, guides, and market insights for Kosovo real estate</p>
          </div>
          <Link href="/blog" className="link flex items-center gap-1 text-sm">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-hover block">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                <span className="absolute top-3 left-3 badge bg-white/95 text-primary-700">{post.category}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </div>
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white line-clamp-2 mb-2">{post.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
