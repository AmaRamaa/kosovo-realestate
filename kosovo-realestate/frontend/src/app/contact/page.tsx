'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { submissionApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';

const WHATSAPP_NUMBER = '38338123456';
const OFFICE_LAT = 42.6629;
const OFFICE_LNG = 21.1655;

const MapDisplay = dynamic(() => import('@/components/ui/MapDisplay'), { ssr: false });

export default function ContactPage() {
  const { t } = useTranslation('staticPages');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submissionApi.submitContact(form);
      setSent(true);
    } catch {
      toast(t('formError'), 'error');
    } finally {
      setSending(false);
    }
  };

  const infoItems = [
    { icon: MapPin, label: t('address'), value: 'Rr. Nënë Tereza, Prishtinë, Kosovo' },
    { icon: Phone, label: t('phone'), value: '+383 38 123 456', href: 'tel:+38338123456' },
    { icon: Mail, label: t('email'), value: 'info@kosovorealestate.com', href: 'mailto:info@kosovorealestate.com' },
    { icon: MessageCircle, label: t('whatsapp'), value: t('chatNow'), href: `https://wa.me/${WHATSAPP_NUMBER}` },
    { icon: Clock, label: t('contactHoursLabel'), value: t('contactHours') },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="relative overflow-hidden bg-primary-50 dark:bg-primary-950/30 py-16 lg:py-20">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="container-page text-center max-w-2xl mx-auto relative">
            <h1 className="font-display font-bold text-3xl lg:text-5xl text-neutral-900 dark:text-white mb-4 text-balance">{t('contactTitle')}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">{t('contactSubtitle')}</p>
          </div>
        </div>

        <div className="container-page py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <div>
              <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-4">{t('contactInfoTitle')}</h2>
              <div className="space-y-3 mb-6">
                {infoItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 card-hover">
                      <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.label}</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                  return item.href ? (
                    <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>

              <div className="rounded-xl overflow-hidden h-56 border border-primary-100 dark:border-primary-900/40">
                <MapDisplay lat={OFFICE_LAT} lng={OFFICE_LNG} title={t('contactMapTitle')} />
              </div>
            </div>

            {/* Form */}
            <div className="card p-6 lg:p-8 h-fit">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300">{t('formSuccess')}</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-6">{t('contactFormTitle')}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">{t('formName')}</label>
                        <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input" required />
                      </div>
                      <div>
                        <label className="label">{t('formEmail')}</label>
                        <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input" required />
                      </div>
                    </div>
                    <div>
                      <label className="label">{t('formMessage')}</label>
                      <textarea rows={6} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input resize-none" required />
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary btn-lg w-full">
                      {sending ? t('formSending') : t('formSend')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
