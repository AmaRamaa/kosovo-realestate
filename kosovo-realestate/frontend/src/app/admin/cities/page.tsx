'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, ChevronDown, MapPin } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Modal from '@/components/ui/Modal';
import { adminApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

const emptyCity = { name: '', nameAlbanian: '', description: '', isActive: true };
const emptyNeighborhood = { name: '', cityId: '' };

export default function AdminCitiesPage() {
  const { t } = useTranslation('admin');
  const queryClient = useQueryClient();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [cityModal, setCityModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [cityForm, setCityForm] = useState<any>(emptyCity);
  const [nbModal, setNbModal] = useState<{ open: boolean; editing?: any }>({ open: false });
  const [nbForm, setNbForm] = useState<any>(emptyNeighborhood);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin-cities'], queryFn: () => adminApi.getCities().then((r) => r.data) });
  const cities = data?.cities || [];

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-cities'] });

  const openNewCity = () => { setCityForm(emptyCity); setCityModal({ open: true }); };
  const openEditCity = (city: any) => { setCityForm({ name: city.name, nameAlbanian: city.nameAlbanian || '', description: city.description || '', isActive: city.isActive }); setCityModal({ open: true, editing: city }); };

  const saveCity = async () => {
    if (!cityForm.name.trim()) return toast('Name is required', 'error');
    setSaving(true);
    try {
      if (cityModal.editing) await adminApi.updateCity(cityModal.editing.id, cityForm);
      else await adminApi.createCity(cityForm);
      toast('Saved', 'success');
      setCityModal({ open: false });
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteCity = async (id: string) => {
    if (!confirm('Delete this city? This cannot be undone.')) return;
    try {
      await adminApi.deleteCity(id);
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Could not delete', 'error');
    }
  };

  const openNewNeighborhood = (cityId: string) => { setNbForm({ name: '', cityId }); setNbModal({ open: true }); };
  const openEditNeighborhood = (nb: any) => { setNbForm({ name: nb.name, cityId: nb.cityId }); setNbModal({ open: true, editing: nb }); };

  const saveNeighborhood = async () => {
    if (!nbForm.name.trim()) return toast('Name is required', 'error');
    setSaving(true);
    try {
      if (nbModal.editing) await adminApi.updateNeighborhood(nbModal.editing.id, { name: nbForm.name });
      else await adminApi.createNeighborhood(nbForm);
      toast('Saved', 'success');
      setNbModal({ open: false });
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteNeighborhood = async (id: string) => {
    if (!confirm('Delete this neighborhood?')) return;
    try {
      await adminApi.deleteNeighborhood(id);
      invalidate();
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Could not delete', 'error');
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white">{t('navCities')}</h1>
          <button onClick={openNewCity} className="btn-primary btn-md"><Plus className="w-4 h-4" /> {t('newCity')}</button>
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center"><div className="w-6 h-6 mx-auto border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : cities.length === 0 ? (
            <div className="p-10 text-center text-neutral-500">{t('noCities')}</div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {cities.map((city: any) => (
                <div key={city.id}>
                  <div className="flex items-center gap-4 p-4">
                    <button onClick={() => setExpandedCity(expandedCity === city.id ? null : city.id)} className="text-neutral-400">
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedCity === city.id ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-neutral-900 dark:text-white">{city.name}{city.nameAlbanian ? ` (${city.nameAlbanian})` : ''}</p>
                      <p className="text-xs text-neutral-500">{city._count.neighborhoods} neighborhoods · {city._count.listings} listings</p>
                    </div>
                    <span className={city.isActive ? 'badge-green' : 'badge-gray'}>{city.isActive ? t('activeBadge') : t('inactiveBadge')}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEditCity(city)} className="btn-sm btn btn-ghost"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteCity(city.id)} className="btn-sm btn btn-ghost text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {expandedCity === city.id && (
                    <div className="px-4 pb-4 pl-12">
                      <div className="rounded-lg bg-neutral-50 dark:bg-neutral-900/60 p-3 space-y-1.5">
                        {city.neighborhoods.map((nb: any) => (
                          <div key={nb.id} className="flex items-center gap-2 text-sm">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                            <span className="flex-1 text-neutral-700 dark:text-neutral-300">{nb.name}</span>
                            <button onClick={() => openEditNeighborhood(nb)} className="text-neutral-400 hover:text-primary-600"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteNeighborhood(nb.id)} className="text-neutral-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                        {city.neighborhoods.length === 0 && <p className="text-xs text-neutral-500">{t('noNeighborhoods')}</p>}
                        <button onClick={() => openNewNeighborhood(city.id)} className="text-xs link flex items-center gap-1 pt-1"><Plus className="w-3 h-3" /> {t('newNeighborhood')}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={cityModal.open} onOpenChange={(open) => setCityModal({ open })} title={cityModal.editing ? 'Edit City' : 'New City'}>
        <div className="space-y-4">
          <div>
            <label className="label">Name (English)</label>
            <input className="input" value={cityForm.name} onChange={(e) => setCityForm((p: any) => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Name (Albanian)</label>
            <input className="input" value={cityForm.nameAlbanian} onChange={(e) => setCityForm((p: any) => ({ ...p, nameAlbanian: e.target.value }))} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} value={cityForm.description} onChange={(e) => setCityForm((p: any) => ({ ...p, description: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={cityForm.isActive} onChange={(e) => setCityForm((p: any) => ({ ...p, isActive: e.target.checked }))} />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">Active (visible on the site)</span>
          </label>
          <button onClick={saveCity} disabled={saving} className="btn-primary btn-md w-full">Save</button>
        </div>
      </Modal>

      <Modal open={nbModal.open} onOpenChange={(open) => setNbModal({ open })} title={nbModal.editing ? 'Edit Neighborhood' : 'New Neighborhood'}>
        <div className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input" value={nbForm.name} onChange={(e) => setNbForm((p: any) => ({ ...p, name: e.target.value }))} />
          </div>
          <button onClick={saveNeighborhood} disabled={saving} className="btn-primary btn-md w-full">Save</button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
