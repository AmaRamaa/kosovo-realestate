'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { formatDate, getInitials } from '@/lib/utils';
import AdminLayout from '@/components/admin/AdminLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';

const ROLE_KEYS: Record<string, string> = { BUYER: 'roleBuyer', SELLER: 'roleSeller', AGENT: 'roleAgent', ADMIN: 'roleAdmin' };

export default function AdminUsersPage() {
  const { t, locale } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { page }],
    queryFn: () => adminApi.getUsers({ page, limit: 20 }).then(r => r.data),
  });

  const users = data?.users || [];
  const pagination = data?.pagination;

  const handleToggle = async (id: string) => {
    await adminApi.toggleUser(id);
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('usersTitle')}</h1>
          {pagination && <span className="text-sm text-neutral-500">{pagination.total} {t('resultsCount')}</span>}
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-neutral-500">
              <div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noUsers')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700 text-left text-xs text-neutral-500 dark:text-neutral-400">
                    <th className="p-4 font-medium">{t('colName')}</th>
                    <th className="p-4 font-medium">{t('colRole')}</th>
                    <th className="p-4 font-medium">{t('colListingsCount')}</th>
                    <th className="p-4 font-medium">{t('colJoined')}</th>
                    <th className="p-4 font-medium">{t('colStatus')}</th>
                    <th className="p-4 font-medium text-right">{t('colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {users.map((u: any) => (
                    <tr key={u.id}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
                            {getInitials(u.firstName, u.lastName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 dark:text-white truncate flex items-center gap-1">
                              {u.firstName} {u.lastName}
                              {u.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">{t(ROLE_KEYS[u.role] || 'roleBuyer')}</td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">{u._count?.listings ?? 0}</td>
                      <td className="p-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{formatDate(u.createdAt, locale)}</td>
                      <td className="p-4">
                        <span className={u.isActive ? 'badge-green' : 'badge-gray'}>{u.isActive ? t('activeBadge') : t('inactiveBadge')}</span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleToggle(u.id)}
                            className={`btn-sm btn ${u.isActive ? 'btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950' : 'bg-secondary-600 text-white hover:bg-secondary-700'}`}
                          >
                            {u.isActive ? t('deactivate') : t('activate')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
