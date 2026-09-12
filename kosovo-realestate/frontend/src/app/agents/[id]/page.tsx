'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Phone, Mail, Building2, CheckCircle, ArrowLeft, BadgeCheck, Calendar } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { agentApi } from '@/lib/api';
import { formatRelativeDate, getInitials } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AgentProfilePage() {
  const { t, locale } = useTranslation('agentProfile');
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['agent', id],
    queryFn: () => agentApi.getById(id).then((r) => r.data),
    enabled: !!id,
  });

  if (isLoading) return (
    <>
      <Navbar />
      <main className="pt-[72px] container-page py-10">
        <div className="skeleton h-40 rounded-2xl mb-6" />
        <div className="skeleton h-6 w-64 mb-3" />
        <div className="skeleton h-4 w-96" />
      </main>
    </>
  );

  const agent = data?.agent;

  if (!agent) return (
    <>
      <Navbar />
      <main className="pt-[72px] container-page py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">{t('agentNotFound')}</h1>
        <Link href="/agents" className="btn-primary btn-md inline-flex"><ArrowLeft className="w-4 h-4" /> {t('backToAgents')}</Link>
      </main>
    </>
  );

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="bg-primary-50 dark:bg-primary-950/30 py-12">
          <div className="container-page">
            <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-6">
              <ArrowLeft className="w-4 h-4" /> {t('backToAgents')}
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative flex-shrink-0">
                {agent.user.avatar
                  ? <Image src={agent.user.avatar} alt={agent.user.firstName} width={96} height={96} className="rounded-full object-cover w-24 h-24" />
                  : <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300 text-2xl">{getInitials(agent.user.firstName, agent.user.lastName)}</div>
                }
                {agent.isVerified && <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-primary-600 bg-white rounded-full" />}
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl lg:text-3xl text-neutral-900 dark:text-white">{agent.user.firstName} {agent.user.lastName}</h1>
                {agent.agency && <p className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-1"><Building2 className="w-4 h-4" /> {agent.agency.name}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {agent.rating} ({agent.reviewCount} {t('reviews')})</span>
                  <span>{agent.yearsExperience} {t('yearsExperience')}</span>
                  <span>{agent._count?.listings ?? agent.listings?.length ?? 0} {t('listings')}</span>
                  {agent.isVerified && <span className="badge-green flex items-center gap-1"><BadgeCheck className="w-3.5 h-3.5" /> {t('verifiedBadge')}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-page py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {agent.bio && (
              <div className="card p-6">
                <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-3">{t('about')}</h2>
                <p className="text-neutral-600 dark:text-neutral-400 whitespace-pre-line">{agent.bio}</p>
              </div>
            )}

            <div>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">{t('activeListings')}</h2>
              {agent.listings?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {agent.listings.map((l: any, i: number) => <PropertyCard key={l.id} listing={l} index={i} />)}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">{t('noActiveListings')}</p>
              )}
            </div>

            <div>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">{t('clientReviews')}</h2>
              {agent.reviews?.length > 0 ? (
                <div className="space-y-4">
                  {agent.reviews.map((r: any) => (
                    <div key={r.id} className="card p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
                          {getInitials(r.user.firstName, r.user.lastName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{r.user.firstName} {r.user.lastName}</p>
                          <p className="text-xs text-neutral-400">{formatRelativeDate(r.createdAt, locale)}</p>
                        </div>
                      </div>
                      {r.rating != null && (
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300 dark:text-neutral-600'}`} />
                          ))}
                        </div>
                      )}
                      {r.comment && <p className="text-sm text-neutral-600 dark:text-neutral-400">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400">{t('noReviews')}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6 space-y-3">
              {agent.user.phone && (
                <a href={`tel:${agent.user.phone}`} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                  <Phone className="w-4 h-4 text-neutral-400" /> {agent.user.phone}
                </a>
              )}
              <a href={`mailto:${agent.user.email}`} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                <Mail className="w-4 h-4 text-neutral-400" /> {agent.user.email}
              </a>
              {agent.licenseNumber && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                  {t('licenseNumber')}: {agent.licenseNumber}
                </p>
              )}
              {agent.user.createdAt && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {t('memberSince')} {formatRelativeDate(agent.user.createdAt, locale)}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
