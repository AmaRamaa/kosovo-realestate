'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star, Users, Building2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { adminApi, cityApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

const emptyForm = { name: '', description: '', email: '', phone: '', address: '', website: '', cityId: '', isVerified: true };

export default function AdminAgenciesPage() {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin-agencies'], queryFn: () => adminApi.getAgencies().then((r) => r.data) });
  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then((r) => r.data) });
  const agencies = data?.agencies || [];
  const cities = citiesData?.cities || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-agencies'] });

  const openNew = () => { setForm(emptyForm); setModal({ open: true }); };
  const openEdit = (a: any) => {
    setForm({ name: a.name, description: a.description || '', email: a.email, phone: a.phone, address: a.address || '', website: a.website || '', cityId: a.city.id, isVerified: a.isVerified });
    setModal({ open: true, editing: a });
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.cityId) return toast(t('agencyRequiredFields'), 'error');
    setSaving(true);
    try {
      if (modal.editing) await adminApi.updateAgency(modal.editing.id, form);
      else await adminApi.createAgency(form);
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
    if (!confirm(t('deleteAgencyConfirm'))) return;
    try {
      await adminApi.deleteAgency(id);
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || t('couldNotDelete'), 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('navAgencies')}</h1>
          <button onClick={openNew} className="btn-primary btn-md"><Plus className="w-4 h-4" /> {t('newAgency')}</button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center"><div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : agencies.length === 0 ? (
          <div className="card p-10 text-center text-neutral-500">{t('noAgencies')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agencies.map((a: any) => (
              <div key={a.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-neutral-900 dark:text-white">{a.name}</h3>
                  <span className={a.isVerified ? 'badge-green' : 'badge-gray'}>{a.isVerified ? t('activeBadge') : t('inactiveBadge')}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-3">{a.city?.name}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-700">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {a.rating}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {a._count.agents}</span>
                  <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {a._count.listings}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(a)} className="btn-sm btn btn-secondary flex-1"><Pencil className="w-3.5 h-3.5" /> {t('editAction')}</button>
                  <button onClick={() => remove(a.id)} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modal.open} onOpenChange={(open) => setModal({ open })} title={modal.editing ? t('editAgencyTitle') : t('newAgencyTitle')}>
        <div className="space-y-4">
          <div>
            <label className="label">{t('fieldName')}</label>
            <input className="input" value={form.name} onChange={(e) => setForm((p: any) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">{t('fieldDescription')}</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => setForm((p: any) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t('fieldEmail')}</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm((p: any) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">{t('fieldPhone')}</label>
              <input className="input" value={form.phone} onChange={(e) => setForm((p: any) => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">{t('fieldAddress')}</label>
            <input className="input" value={form.address} onChange={(e) => setForm((p: any) => ({ ...p, address: e.target.value }))} />
          </div>
          <div>
            <label className="label">{t('fieldWebsite')}</label>
            <input className="input" value={form.website} onChange={(e) => setForm((p: any) => ({ ...p, website: e.target.value }))} />
          </div>
          <div>
            <label className="label">{t('fieldCity')}</label>
            <Select value={form.cityId} onValueChange={(v) => setForm((p: any) => ({ ...p, cityId: v }))} options={cities.map((c: any) => ({ value: c.id, label: c.name }))} placeholder={t('selectCity')} />
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
