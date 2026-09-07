'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Archive, Trash2, ChevronDown, ChevronLeft, ChevronRight, Home, MessageSquare } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatRelativeDate } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';

const TYPES = ['ALL', 'LISTING', 'CONTACT'] as const;
const STATUSES = ['ALL', 'NEW', 'READ', 'ARCHIVED'] as const;

export default function AdminSubmissionsPage() {
  const { t, locale } = useTranslation('admin');
  const { t: tType } = useTranslation('propertyTypes');
  const queryClient = useQueryClient();
  const [type, setType] = useState<(typeof TYPES)[number]>('ALL');
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const typeLabel: Record<string, string> = { ALL: t('typeAll'), LISTING: t('typeListing'), CONTACT: t('typeContact') };
  const statusLabel: Record<string, string> = { ALL: t('filterAll'), NEW: t('submissionStatusNew'), READ: t('submissionStatusRead'), ARCHIVED: t('submissionStatusArchived') };
  const statusBadge: Record<string, string> = { NEW: 'badge-yellow', READ: 'badge-blue', ARCHIVED: 'badge-gray' };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-submissions', { type, status, page }],
    queryFn: () => adminApi.getSubmissions({
      type: type === 'ALL' ? undefined : type,
      status: status === 'ALL' ? undefined : status,
      page, limit: 15,
    }).then(r => r.data),
  });

  const submissions = data?.submissions || [];
  const pagination = data?.pagination;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-submissions'] });

  const toggleExpand = async (submission: any) => {
    const next = expandedId === submission.id ? null : submission.id;
    setExpandedId(next);
    if (next && submission.status === 'NEW') {
      await adminApi.updateSubmission(submission.id, 'READ');
      invalidate();
    }
  };

  const handleArchive = async (id: string) => {
    await adminApi.updateSubmission(id, 'ARCHIVED');
    invalidate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteSubmissionConfirm'))) return;
    await adminApi.deleteSubmission(id);
    invalidate();
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('submissionsTitle')}</h1>
          {pagination && <span className="text-sm text-neutral-500">{pagination.total} {t('resultsCount')}</span>}
        </div>

        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((tp) => (
              <button
                key={tp}
                onClick={() => { setType(tp); setPage(1); }}
                className={tp === type ? 'btn-sm btn bg-primary-600 text-white' : 'btn-sm btn bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'}
              >
                {typeLabel[tp]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={s === status ? 'btn-sm btn bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'btn-sm btn bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'}
              >
                {statusLabel[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-neutral-500">
              <div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noSubmissions')}</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {submissions.map((s: any) => {
                const isExpanded = expandedId === s.id;
                const Icon = s.type === 'LISTING' ? Home : MessageSquare;
                return (
                  <div key={s.id}>
                    <button onClick={() => toggleExpand(s)} className="w-full flex items-start gap-4 p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700/40">
                      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm text-neutral-900 dark:text-white">{s.name}</p>
                          <span className={`badge ${statusBadge[s.status]}`}>{statusLabel[s.status]}</span>
                          {!s.emailSent && <span className="badge-red text-[10px]">{t('emailFailedBadge')}</span>}
                        </div>
                        <p className="text-xs text-neutral-500">{s.email}{s.phone ? ` · ${s.phone}` : ''}</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-1 mt-1">{s.message || (s.data?.address ? `${s.data.address}, ${s.data.city}` : '')}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-neutral-400">{formatRelativeDate(s.createdAt, locale)}</p>
                        <ChevronDown className={`w-4 h-4 ml-auto mt-1 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pl-[68px]">
                        <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900/60 p-4 text-sm space-y-2">
                          {s.type === 'LISTING' ? (
                            <>
                              <DetailRow label={t('colType')} value={`${tType(s.data.listingType)} · ${tType(s.data.propertyType)}`} />
                              <DetailRow label={t('colPrice')} value={`${s.data.price} ${s.data.currency}`} />
                              <DetailRow label={t('colListing')} value={`${s.data.address}, ${s.data.neighborhood ? `${s.data.neighborhood}, ` : ''}${s.data.city}`} />
                              <DetailRow label="Area" value={`${s.data.area} m²`} />
                              {(s.data.bedrooms || s.data.bathrooms) && (
                                <DetailRow label="Rooms" value={`${s.data.bedrooms || '—'} bed · ${s.data.bathrooms || '—'} bath`} />
                              )}
                              {s.message && <DetailRow label={t('colMessage')} value={s.message} />}
                            </>
                          ) : (
                            <DetailRow label={t('colMessage')} value={s.message} />
                          )}
                          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
                            <a href={`mailto:${s.email}`} className="btn-sm btn btn-secondary"><Mail className="w-3.5 h-3.5" /> {s.email}</a>
                            {s.phone && <a href={`tel:${s.phone}`} className="btn-sm btn btn-secondary"><Phone className="w-3.5 h-3.5" /> {s.phone}</a>}
                            <div className="flex-1" />
                            {s.status !== 'ARCHIVED' && (
                              <button onClick={() => handleArchive(s.id)} className="btn-sm btn btn-ghost"><Archive className="w-3.5 h-3.5" /> {t('archiveAction')}</button>
                            )}
                            <button onClick={() => handleDelete(s.id)} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="w-3.5 h-3.5" /> {t('deleteAction')}</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-sm btn btn-secondary disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-neutral-500">{page} / {pagination.pages}</span>
            <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)} className="btn-sm btn btn-secondary disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-neutral-500 dark:text-neutral-400 min-w-[90px] flex-shrink-0">{label}</span>
      <span className="text-neutral-800 dark:text-neutral-200">{value}</span>
    </div>
  );
}
