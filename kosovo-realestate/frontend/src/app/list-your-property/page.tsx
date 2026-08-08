'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cityApi, submissionApi } from '@/lib/api';
import { PROPERTY_TYPES, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';

export default function ListYourPropertyPage() {
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
      toast(err?.response?.data?.error || 'Something went wrong, please try again', 'error');
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
            <span className="eyebrow">List Your Property</span>
            <h1 className="font-display font-bold text-3xl lg:text-4xl text-neutral-900 dark:text-white mb-3">Tell us about your property</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              Fill in the details below and our team will reach out to get your property listed.
            </p>
          </div>
        </div>

        <div className="container-page py-10 max-w-2xl">
          {submitted ? (
            <div className="card p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-secondary-100 dark:bg-secondary-950 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-secondary-600 dark:text-secondary-400" />
              </div>
              <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-2">Thanks, we&apos;ve got it!</h2>
              <p className="text-neutral-500 dark:text-neutral-400">
                Your submission has been sent to our team. We&apos;ll reach out to {form.submitterEmail} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
              {/* Contact info */}
              <div>
                <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">Your contact info</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full name *</label>
                    <input className="input" value={form.submitterName} onChange={e => set('submitterName', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Phone</label>
                    <input className="input" value={form.submitterPhone} onChange={e => set('submitterPhone', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Email *</label>
                    <input type="email" className="input" value={form.submitterEmail} onChange={e => set('submitterEmail', e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Property info */}
              <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-4">Property details</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Listing type *</label>
                      <div className="flex gap-2">
                        {[{ v: 'SALE', l: 'For Sale' }, { v: 'RENT', l: 'For Rent' }].map(opt => (
                          <button key={opt.v} type="button" onClick={() => set('listingType', opt.v)}
                            className={cn('flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors', form.listingType === opt.v ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400' : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300')}>
                            {opt.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">Property type *</label>
                      <select className="input" value={form.propertyType} onChange={e => set('propertyType', e.target.value)}>
                        {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Price *</label>
                      <input type="number" min={0} className="input" placeholder="85000" value={form.price} onChange={e => set('price', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Currency</label>
                      <select className="input" value={form.currency} onChange={e => set('currency', e.target.value)}>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City *</label>
                      <select className="input" value={form.city} onChange={e => set('city', e.target.value)} required>
                        <option value="">Select a city</option>
                        {cities.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Neighborhood</label>
                      <input className="input" placeholder="e.g. Dardania" value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">Address *</label>
                    <input className="input" placeholder="Street, number, building" value={form.address} onChange={e => set('address', e.target.value)} required />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="label">Area (m²) *</label>
                      <input type="number" min={0} className="input" placeholder="80" value={form.area} onChange={e => set('area', e.target.value)} required />
                    </div>
                    <div>
                      <label className="label">Bedrooms</label>
                      <input type="number" min={0} className="input" placeholder="2" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Bathrooms</label>
                      <input type="number" min={0} className="input" placeholder="1" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="label">Anything else we should know?</label>
                    <textarea rows={4} className="input resize-none" placeholder="Condition, renovations, why you're selling/renting, best time to reach you..." value={form.notes} onChange={e => set('notes', e.target.value)} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={submitting} className="btn-primary btn-lg w-full">
                {submitting ? 'Sending...' : 'Submit property'}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
