'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', password: '', bio: '', licenseNumber: '', yearsExperience: 0, isVerified: true };

export default function AdminAgentsPage() {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin-agents'], queryFn: () => adminApi.getAgents().then((r) => r.data) });
  const agents = data?.agents || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-agents'] });

  const openNew = () => { setForm(emptyForm); setModal({ open: true }); };
  const openEdit = (a: any) => {
    setForm({
      firstName: a.user.firstName, lastName: a.user.lastName, email: a.user.email, phone: a.user.phone || '',
      password: '', bio: a.bio || '', licenseNumber: a.licenseNumber || '',
      yearsExperience: a.yearsExperience, isVerified: a.isVerified,
    });
    setModal({ open: true, editing: a });
  };

  const save = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return toast(t('firstLastNameRequired'), 'error');
    if (!modal.editing && (!form.email.trim() || !form.password.trim())) return toast(t('emailPasswordRequiredNewAgent'), 'error');
    setSaving(true);
    try {
      if (modal.editing) {
        await adminApi.updateAgent(modal.editing.id, {
          firstName: form.firstName, lastName: form.lastName, phone: form.phone,
          bio: form.bio, licenseNumber: form.licenseNumber,
          yearsExperience: Number(form.yearsExperience) || 0, isVerified: form.isVerified,
        });
      } else {
        await adminApi.createAgent({ ...form, yearsExperience: Number(form.yearsExperience) || 0 });
      }
      toast(t('savedToast'), 'success');
      setModal({ open: false });
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || t('somethingWentWrong'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm(t('removeAgentConfirm'))) return;
    try {
      await adminApi.deleteAgent(id);
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || t('couldNotDelete'), 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('navAgents')}</h1>
          <button onClick={openNew} className="btn-primary btn-md"><Plus className="w-4 h-4" /> {t('newAgent')}</button>
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : agents.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noAgents')}</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {agents.map((a: any) => (
                <div key={a.id} className="flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 flex-shrink-0">
                    {getInitials(a.user.firstName, a.user.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-neutral-900 dark:text-white">{a.user.firstName} {a.user.lastName}</p>
                    <p className="text-xs text-neutral-500">{a.user.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {a.rating} · {a._count.listings} {t('listingsCount')}
                  </div>
                  <span className={a.isVerified ? 'badge-green' : 'badge-gray'}>{a.isVerified ? t('activeBadge') : t('inactiveBadge')}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(a)} className="btn-sm btn btn-ghost"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(a.id)} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={modal.open} onOpenChange={(open) => setModal({ open })} title={modal.editing ? t('editAgentTitle') : t('newAgentTitle')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('fieldFirstName')}</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm((p: any) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('fieldLastName')}</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm((p: any) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          {!modal.editing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t('fieldEmail')}</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm((p: any) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">{t('fieldPassword')}</label>
                <input type="password" className="input" value={form.password} onChange={(e) => setForm((p: any) => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
          )}
          <div>
            <label className="label">{t('fieldPhone')}</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((p: any) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">{t('fieldBio')}</label>
            <textarea className="input resize-none" rows={3} value={form.bio} onChange={(e) => setForm((p: any) => ({ ...p, bio: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('fieldLicenseNumber')}</label>
              <input className="input" value={form.licenseNumber} onChange={(e) => setForm((p: any) => ({ ...p, licenseNumber: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('fieldYearsExperience')}</label>
              <input type="number" min={0} className="input" value={form.yearsExperience} onChange={(e) => setForm((p: any) => ({ ...p, yearsExperience: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.isVerified} onChange={(e) => setForm((p: any) => ({ ...p, isVerified: e.target.checked }))} />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{t('verifiedVisible')}</span>
          </label>
          <button onClick={save} disabled={saving} className="btn-primary btn-md w-full">{t('saveAction')}</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
