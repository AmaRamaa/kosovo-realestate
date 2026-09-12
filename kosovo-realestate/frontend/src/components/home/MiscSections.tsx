'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Compass, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { agentApi } from '@/lib/api';
import { getInitials } from '@/lib/utils';
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

export function OurAgentsSection() {
  const { t } = useTranslation('misc');
  const { data, isLoading } = useQuery({
    queryKey: ['agents', 'home'],
    queryFn: () => agentApi.getAll({ limit: 4 }).then((r) => r.data),
  });
  const agents = data?.agents || [];

  if (!isLoading && agents.length === 0) return null;

  return (
    <section className="section">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="eyebrow">{t('agentsEyebrow')}</span>
          <h2 className="section-heading text-2xl lg:text-3xl mb-2">{t('agentsTitle')}</h2>
          <p className="text-neutral-500 dark:text-neutral-400">{t('agentsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="skeleton w-20 h-20 rounded-full mx-auto mb-4" />
                  <div className="skeleton h-4 w-24 mx-auto mb-2" />
                  <div className="skeleton h-3 w-16 mx-auto" />
                </div>
              ))
            : agents.map((agent: any) => (
                <Link key={agent.id} href={`/agents/${agent.id}`} className="card-hover p-6 text-center block">
                  {agent.user.avatar ? (
                    <Image src={agent.user.avatar} alt={agent.user.firstName} width={80} height={80} className="rounded-full mx-auto mb-4 object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300 text-lg mx-auto mb-4">
                      {getInitials(agent.user.firstName, agent.user.lastName)}
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-neutral-900 dark:text-white text-sm mb-1">{agent.user.firstName} {agent.user.lastName}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">{agent._count?.listings ?? 0} {t('agentListingsCount')}</p>
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
