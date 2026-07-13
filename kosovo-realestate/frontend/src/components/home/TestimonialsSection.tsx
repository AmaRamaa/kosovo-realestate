import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Blerina Hoxha',
    role: 'Bought an apartment in Dardania',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    text: 'The platform made finding my first apartment incredibly easy. The filters were precise and the agent was responsive throughout the entire process.',
  },
  {
    name: 'Driton Gashi',
    role: 'Sold a house in Pejë',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    text: 'Listed my house and had three serious offers within two weeks. The dashboard analytics helped me understand which buyers were genuinely interested.',
  },
  {
    name: 'Arta Krasniqi',
    role: 'Rented an office in Prishtinë',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    text: 'As a small business owner, finding the right commercial space was crucial. The map search and detailed specifications saved me weeks of searching.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">What our customers say</h2>
          <p className="text-neutral-500 dark:text-neutral-400">Thousands of Kosovars have found their perfect property through our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card p-6">
              <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-5">{t.text}</p>
              <div className="flex items-center gap-3">
                <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover" />
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
