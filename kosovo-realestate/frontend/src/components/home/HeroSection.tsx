import HeroSearchBar from './HeroSearchBar';
import { TrendingUp, Building2, Users, MapPin } from 'lucide-react';

const STATS = [
  { icon: Building2, value: '2,840+', label: 'Active listings' },
  { icon: MapPin, value: '38', label: 'Municipalities' },
  { icon: Users, value: '156', label: 'Verified agents' },
  { icon: TrendingUp, value: '€2.1B', label: 'Property value listed' },
];

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-900 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
        backgroundImage: 'radial-gradient(circle, #2563EB 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="container-page relative">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="badge-blue mb-4 inline-flex">Kosovo's #1 Real Estate Platform</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-neutral-900 dark:text-white text-balance mb-5 leading-[1.1]">
            Find your perfect home in <span className="text-primary-600">Kosovo</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 text-balance max-w-2xl mx-auto">
            Browse thousands of verified properties for sale and rent across all 38 municipalities — from Prishtinë to Prizren.
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <HeroSearchBar />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="w-11 h-11 mx-auto mb-2.5 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="font-display font-bold text-xl lg:text-2xl text-neutral-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
