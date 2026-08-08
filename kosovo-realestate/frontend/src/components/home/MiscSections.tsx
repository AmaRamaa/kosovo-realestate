import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Compass, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

const FEATURES = [
  {
    icon: Compass,
    title: 'Trusted Local Experts',
    description: 'Deep knowledge of every municipality, from Prishtinë to the smallest towns.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Listings',
    description: 'Every property and agent is vetted before it goes live on the platform.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Support',
    description: 'From your first search to closing day, our team guides you every step.',
  },
  {
    icon: Award,
    title: 'Proven Track Record',
    description: 'Thousands of buyers, sellers, and renters have found their place through us.',
  },
];

export function WhyChooseSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">Built for Kosovo&apos;s real estate market</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            We combine local expertise, verified listings, and dedicated support to help you find the right property with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center px-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const AGENTS = [
  { name: 'Arben Krasniqi', role: 'Senior Real Estate Agent', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { name: 'Vlora Berisha', role: 'Property Specialist', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Dren Gashi', role: 'Investment Consultant', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
  { name: 'Elira Hoxha', role: 'Sales Executive', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
];

export function OurAgentsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow">Our Agents</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">Meet our experts</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Experienced professionals dedicated to finding you the perfect property</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <Link key={agent.name} href="/agents" className="card-hover p-6 text-center block">
              <Image src={agent.avatar} alt={agent.name} width={80} height={80} className="rounded-full mx-auto mb-4 object-cover" />
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm mb-1">{agent.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{agent.role}</p>
              <span className="link text-xs">View profile</span>
            </Link>
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
    <section className="section bg-neutral-100/60 dark:bg-neutral-800/30">
      <div className="container-page">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="eyebrow">Insights</span>
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

export function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden bg-primary-600">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="container-page relative py-16 lg:py-20 text-center">
        <h2 className="font-display font-bold text-2xl lg:text-4xl text-white mb-4 text-balance">
          Ready to find your place in Kosovo?
        </h2>
        <p className="text-primary-100 max-w-xl mx-auto mb-8 text-balance">
          Work with verified agents and browse thousands of listings across all 38 municipalities.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/properties" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg">
            Browse Properties
          </Link>
          <Link href="/list-your-property" className="btn border-2 border-white/40 text-white hover:bg-white/10 btn-lg">
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
}
