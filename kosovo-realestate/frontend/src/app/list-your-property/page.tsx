'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cityApi, submissionApi } from '@/lib/api';
import { PROPERTY_TYPES, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ListYourPropertyPage() {
  const { t } = useTranslation('listProperty');
  const { t: tType } = useTranslation('propertyTypes');
  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then(r => r.data) });
  const cities = citiesData?.cities || [];

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    submitterName: '', submitterEmail: '', submitterPhone: '',
    listingType: 'SALE', propertyType: 'APARTMENT',
    price: '', currency: 'EUR',
    city: '', neighborhood: '', address: '',
    area: '', bedrooms: '', bathrooms: '',
    notes: '',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submissionApi.submitListing(form);
      setSubmitted(true);
    } catch (err: any) {
      toast(err?.response?.data?.error || t('submitError'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="bg-primary-50 dark:bg-primary-950/30 py-12">
          <div className="container-page text-center">
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 dark:text-white mb-3">{t('heading')}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              {t('subheading')}
            </p>
          </div>
        </div>

        <div className="container-page py-10 max-w-2xl">
          {submitted ? (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-950 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-2">{t('thanksHeading')}</h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                {t('thanksBody').replace('{email}', form.submitterEmail)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
              {/* Contact info */}
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">{t('contactInfoHeading')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">{t('fullNameLabel')}</label>
                    <input className="input" value={form.submitterName} onChange={e => set('submitterName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">{t('phoneLabel')}</label>
                    <input className="input" value={form.submitterPhone} onChange={e => set('submitterPhone', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">{t('emailLabel')}</label>
                    <input type="email" className="input" value={form.submitterEmail} onChange={e => set('submitterEmail', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Property info */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">{t('propertyDetailsHeading')}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('listingTypeLabel')}</label>
                      <div className="flex gap-2">
                        {[{ v: 'SALE', l: tType('SALE') }, { v: 'RENT', l: tType('RENT') }].map(opt => (
                          <button key={opt.v} type="button" onClick={() => set('listingType', opt.v)}
                            className={cn('flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors', form.listingType === opt.v ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400' : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300')}>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">{t('propertyTypeLabel')}</label>
                      <select className="input" value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                        {PROPERTY_TYPES.map(pt => <option key={pt.value} value={pt.value}>{tType(pt.value)}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('priceLabel')}</label>
                      <input type="number" min={0} className="input" placeholder="85000" value={form.price} onChange={e => set('price', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">{t('currencyLabel')}</label>
                      <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t('cityLabel')}</label>
                      <select className="input" value={form.city} onChange={e => set('city', e.target.value)} required>
                        <option value="">{t('selectCity')}</option>
                        {cities.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">{t('neighborhoodLabel')}</label>
                      <input className="input" placeholder={t('neighborhoodPlaceholder')} value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">{t('addressLabel')}</label>
                    <input className="input" placeholder={t('addressPlaceholder')} value={form.address} onChange={e => set('address', e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">{t('areaLabel')}</label>
                      <input type="number" min={0} className="input" placeholder="80" value={form.area} onChange={e => set('area', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">{t('bedroomsLabel')}</label>
                      <input type="number" min={0} className="input" placeholder="2" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">{t('bathroomsLabel')}</label>
                      <input type="number" min={0} className="input" placeholder="1" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">{t('notesLabel')}</label>
                    <textarea rows={4} className="input resize-none" placeholder={t('notesPlaceholder')} value={form.notes} onChange={e => set('notes', e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
                {submitting ? t('sending') : t('submitProperty')}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
