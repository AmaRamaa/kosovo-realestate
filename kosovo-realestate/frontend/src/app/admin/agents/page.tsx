'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { adminApi } from '@/lib/api';
import { getInitials } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', password: '', agencyId: '', bio: '', licenseNumber: '', yearsExperience: 0, isVerified: true };
const NO_AGENCY = '__none__';

export default function AdminAgentsPage() {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin-agents'], queryFn: () => adminApi.getAgents().then((r) => r.data) });
  const { data: agenciesData } = useQuery({ queryKey: ['admin-agencies'], queryFn: () => adminApi.getAgencies().then((r) => r.data) });
  const agents = data?.agents || [];
  const agencies = agenciesData?.agencies || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-agents'] });

  const openNew = () => { setForm(emptyForm); setModal({ open: true }); };
  const openEdit = (a: any) => {
    setForm({
      firstName: a.user.firstName, lastName: a.user.lastName, email: a.user.email, phone: a.user.phone || '',
      password: '', agencyId: a.agency?.id || '', bio: a.bio || '', licenseNumber: a.licenseNumber || '',
      yearsExperience: a.yearsExperience, isVerified: a.isVerified,
    });
    setModal({ open: true, editing: a });
  };

  const save = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return toast('First and last name are required', 'error');
    if (!modal.editing && (!form.email.trim() || !form.password.trim())) return toast('Email and password are required for a new agent', 'error');
    setSaving(true);
    try {
      const agencyId = form.agencyId === NO_AGENCY ? null : form.agencyId || null;
      if (modal.editing) {
        await adminApi.updateAgent(modal.editing.id, {
          firstName: form.firstName, lastName: form.lastName, phone: form.phone,
          agencyId, bio: form.bio, licenseNumber: form.licenseNumber,
          yearsExperience: Number(form.yearsExperience) || 0, isVerified: form.isVerified,
        });
      } else {
        await adminApi.createAgent({ ...form, agencyId, yearsExperience: Number(form.yearsExperience) || 0 });
      }
      toast('Saved', 'success');
      setModal({ open: false });
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Remove this agent profile? Their user account will remain but lose agent status.')) return;
    try {
      await adminApi.deleteAgent(id);
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Could not delete', 'error');
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
                    <p className="text-xs text-neutral-500">{a.user.email} · {a.agency?.name || 'No agency'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-500 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {a.rating} · {a._count.listings} listings
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

      <Modal open={modal.open} onOpenChange={(open) => setModal({ open })} title={modal.editing ? 'Edit Agent' : 'New Agent'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First name</label>
              <input className="input" value={form.firstName} onChange={(e) => setForm((p: any) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input" value={form.lastName} onChange={(e) => setForm((p: any) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          {!modal.editing && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input type="email" className="input" value={form.email} onChange={(e) => setForm((p: any) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" value={form.password} onChange={(e) => setForm((p: any) => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
          )}
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm((p: any) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="label">Agency</label>
            <Select
              value={form.agencyId || NO_AGENCY}
              onValueChange={(v) => setForm((p: any) => ({ ...p, agencyId: v }))}
              options={[{ value: NO_AGENCY, label: 'No agency' }, ...agencies.map((a: any) => ({ value: a.id, label: a.name }))]}
            />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input resize-none" rows={3} value={form.bio} onChange={(e) => setForm((p: any) => ({ ...p, bio: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">License number</label>
              <input className="input" value={form.licenseNumber} onChange={(e) => setForm((p: any) => ({ ...p, licenseNumber: e.target.value }))} />
            </div>
            <div>
              <label className="label">Years experience</label>
              <input type="number" min={0} className="input" value={form.yearsExperience} onChange={(e) => setForm((p: any) => ({ ...p, yearsExperience: e.target.value }))} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.isVerified} onChange={(e) => setForm((p: any) => ({ ...p, isVerified: e.target.checked }))} />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Verified (visible on the site)</span>
          </label>
          <button onClick={save} disabled={saving} className="btn-primary btn-md w-full">Save</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
