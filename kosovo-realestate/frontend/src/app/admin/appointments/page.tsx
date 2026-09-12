'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Calendar, Phone, Mail } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;
const STATUS_BADGE: Record<string, string> = { PENDING: 'badge-yellow', CONFIRMED: 'badge-green', CANCELLED: 'badge-red', COMPLETED: 'badge-blue' };
const STATUS_LABEL_KEYS: Record<string, string> = { ALL: 'filterAll', PENDING: 'statusPending', CONFIRMED: 'apptConfirmed', CANCELLED: 'apptCancelled', COMPLETED: 'apptCompleted' };

export default function AdminAppointmentsPage() {
  const { t, locale } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-appointments', status],
    queryFn: () => adminApi.getAppointments(status === 'ALL' ? undefined : { status }).then((r) => r.data),
  });
  const appointments = data?.appointments || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] });

  const changeStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateAppointment(id, newStatus);
      invalidate();
    } catch {
      toast(t('couldNotUpdate'), 'error');
    }
  };

  const remove = async (id: string) => {
    if (!confirm(t('deleteAppointmentConfirm'))) return;
    try {
      await adminApi.deleteAppointment(id);
      invalidate();
    } catch {
      toast(t('couldNotDelete'), 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('navAppointments')}</h1>
          {data && <span className="text-sm text-neutral-500">{appointments.length} {t('resultsCount')}</span>}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={s === status ? 'btn-sm btn bg-primary-600 text-white' : 'btn-sm btn bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700'}
            >
              {t(STATUS_LABEL_KEYS[s])}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : appointments.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noAppointments')}</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {appointments.map((appt: any) => (
                <div key={appt.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="w-16 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                    {appt.listing.images?.[0] && <img src={appt.listing.images[0].url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white line-clamp-1">{appt.listing.title}</p>
                    <p className="text-xs text-neutral-500">{appt.buyer.firstName} {appt.buyer.lastName} · <Calendar className="w-3 h-3 inline" /> {formatDate(appt.scheduledAt, locale)}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-2">
                      {appt.buyer.phone && <a href={`tel:${appt.buyer.phone}`} className="flex items-center gap-1 hover:text-primary-600"><Phone className="w-3 h-3" /> {appt.buyer.phone}</a>}
                      <a href={`mailto:${appt.buyer.email}`} className="flex items-center gap-1 hover:text-primary-600"><Mail className="w-3 h-3" /> {appt.buyer.email}</a>
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500 flex-shrink-0">{t('agentLabel')} {appt.agent?.user?.firstName} {appt.agent?.user?.lastName}</p>
                  <select
                    value={appt.status}
                    onChange={(e) => changeStatus(appt.id, e.target.value)}
                    className={`badge ${STATUS_BADGE[appt.status] || 'badge-gray'} border-0 cursor-pointer`}
                  >
                    {STATUSES.filter((s) => s !== 'ALL').map((s) => <option key={s} value={s}>{t(STATUS_LABEL_KEYS[s])}</option>)}
                  </select>
                  <button onClick={() => remove(appt.id)} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
