import Image from 'next/image';
import Link from 'next/link';
import HeroSearchBar from './HeroSearchBar';
import { TrendingUp, Building2, Users, MapPin, ArrowRight, CalendarCheck } from 'lucide-react';

const STATS = [
  { icon: Building2, value: '2,840+', label: 'Active listings' },
  { icon: MapPin, value: '38', label: 'Municipalities' },
  { icon: Users, value: '156', label: 'Verified agents' },
  { icon: TrendingUp, value: '€2.1B', label: 'Property value listed' },
];

export default function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2000&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Uniform dark scrim so text stays legible over the whole photo */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Subtle vignette for depth — no fade into the page background, hero ends on a crisp edge */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/45" />
        </div>

        <div className="container-page relative pt-36 pb-20 lg:pt-44 lg:pb-24">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="eyebrow !text-primary-300">Kosovo&apos;s #1 Real Estate Platform</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white text-balance mb-5 leading-[1.1]">
              Find your perfect home in <span className="text-primary-300">Kosovo</span>
            </h1>
            <p className="text-lg text-white/80 text-balance max-w-2xl mx-auto mb-8">
              Browse thousands of verified properties for sale and rent across all 38 municipalities — from Prishtinë to Prizren.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/properties" className="btn-primary btn-lg">
                Explore Properties <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/agents" className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20 btn-lg">
                <CalendarCheck className="w-4 h-4" /> Talk to an Agent
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-display font-bold text-xl lg:text-2xl text-white">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search card overlaps the hero's crisp bottom edge instead of fading into it */}
      <div className="container-page">
        <div className="-mt-8 lg:-mt-10 relative z-10 flex justify-center">
          <HeroSearchBar />
        </div>
      </div>
    </>
  );
}
