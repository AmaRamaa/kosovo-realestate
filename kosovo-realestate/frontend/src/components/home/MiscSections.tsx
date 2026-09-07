'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Compass, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const FEATURES = [
  { icon: Compass, titleKey: 'feature1Title', descKey: 'feature1Desc' },
  { icon: ShieldCheck, titleKey: 'feature2Title', descKey: 'feature2Desc' },
  { icon: HeartHandshake, titleKey: 'feature3Title', descKey: 'feature3Desc' },
  { icon: Award, titleKey: 'feature4Title', descKey: 'feature4Desc' },
] as const;

export function WhyChooseSection() {
  const { t } = useTranslation('misc');
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">{t('whyChooseEyebrow')}</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">{t('whyChooseTitle')}</h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            {t('whyChooseSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.titleKey} className="text-center px-2">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const AGENTS = [
  { name: 'Arben Krasniqi', roleKey: 'agent1Role', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { name: 'Vlora Berisha', roleKey: 'agent2Role', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Dren Gashi', roleKey: 'agent3Role', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
  { name: 'Elira Hoxha', roleKey: 'agent4Role', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
] as const;

export function OurAgentsSection() {
  const { t } = useTranslation('misc');
  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow">{t('agentsEyebrow')}</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">{t('agentsTitle')}</h2>
          <p className="text-neutral-500 dark:text-neutral-400">{t('agentsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENTS.map((agent) => (
            <Link key={agent.name} href="/agents" className="card-hover p-6 text-center block">
              <Image src={agent.avatar} alt={agent.name} width={80} height={80} className="rounded-full mx-auto mb-4 object-cover" />
              <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm mb-1">{agent.name}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{t(agent.roleKey)}</p>
              <span className="link text-xs">{t('viewProfile')}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBannerSection() {
  const { t } = useTranslation('misc');
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
          {t('ctaTitle')}
        </h2>
        <p className="text-primary-100 max-w-xl mx-auto mb-8 text-balance">
          {t('ctaSubtitle')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/properties" className="btn bg-white text-primary-700 hover:bg-primary-50 btn-lg">
            {t('browseProperties')}
          </Link>
          <Link href="/list-your-property" className="btn border-2 border-white/40 text-white hover:bg-white/10 btn-lg">
            {t('listYourProperty')}
          </Link>
        </div>
      </div>
    </section>
  );
}
