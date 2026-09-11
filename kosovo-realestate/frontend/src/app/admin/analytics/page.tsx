'use client';
import { useQuery } from '@tanstack/react-query';
import { Eye, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { analyticsApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function AdminAnalyticsPage() {
  const { t } = useTranslation('admin');
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => analyticsApi.getStats(30).then((r) => r.data),
  });

  const viewsByDay = data?.viewsByDay || [];
  const topPages = data?.topPages || [];
  const maxDayCount = Math.max(1, ...viewsByDay.map((d: any) => d.count));
  const maxPageCount = Math.max(1, ...topPages.map((p: any) => p.count));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-1">{t('navAnalytics')}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">{t('analyticsSubtitle')}</p>

        {isLoading ? (
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 mb-8 max-w-md">
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mb-3">
                  <Eye className="w-5 h-5 text-primary-600" />
                </div>
                <div className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{data?.totalViews ?? 0}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{t('totalViews')}</div>
              </div>
              <div className="card p-5">
                <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-950 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-secondary-600" />
                </div>
                <div className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{data?.uniqueVisitors ?? 0}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{t('uniqueVisitors')}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="card p-5">
                <h2 className="font-display font-semibold text-sm text-neutral-900 dark:text-white mb-4">{t('viewsOverTime')}</h2>
                {viewsByDay.length === 0 ? (
                  <p className="text-sm text-neutral-500 py-6 text-center">{t('noAnalyticsData')}</p>
                ) : (
                  <div className="flex items-end gap-1 h-36">
                    {viewsByDay.map((d: any) => (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div
                          className="w-full bg-primary-500 rounded-t hover:bg-primary-600 transition-colors"
                          style={{ height: `${Math.max(4, (d.count / maxDayCount) * 100)}%` }}
                          title={`${d.date}: ${d.count}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="font-display font-semibold text-sm text-neutral-900 dark:text-white mb-4">{t('topPages')}</h2>
                {topPages.length === 0 ? (
                  <p className="text-sm text-neutral-500 py-6 text-center">{t('noAnalyticsData')}</p>
                ) : (
                  <div className="space-y-2.5">
                    {topPages.map((p: any) => (
                      <div key={p.path} className="flex items-center gap-3 text-sm">
                        <span className="flex-shrink-0 w-32 sm:w-40 text-neutral-600 dark:text-neutral-400 truncate" title={p.path}>{p.path}</span>
                        <div className="flex-1 h-2 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
                          <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${(p.count / maxPageCount) * 100}%` }} />
                        </div>
                        <span className="w-8 flex-shrink-0 text-right text-neutral-500">{p.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
