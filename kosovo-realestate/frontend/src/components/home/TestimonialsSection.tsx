'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const TESTIMONIALS = [
  {
    name: 'Blerina Hoxha',
    roleKey: 'role1',
    textKey: 'text1',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
  },
  {
    name: 'Driton Gashi',
    roleKey: 'role2',
    textKey: 'text2',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
  },
  {
    name: 'Arta Krasniqi',
    roleKey: 'role3',
    textKey: 'text3',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
] as const;

export default function TestimonialsSection() {
  const { t } = useTranslation('testimonials');

  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">{t('title')}</h2>
          <p className="text-neutral-500 dark:text-neutral-400">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="card p-6">
              <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-3" />
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed mb-5">{t(item.textKey)}</p>
              <div className="flex items-center gap-3">
                <Image src={item.avatar} alt={item.name} width={40} height={40} className="rounded-full object-cover" />
                <div>
                  <p className="font-medium text-sm text-neutral-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{t(item.roleKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
