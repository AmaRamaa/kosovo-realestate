'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Logo from '@/components/ui/Logo';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('staticPages');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await authApi.forgotPassword(email);
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Logo className="h-9 text-primary-600" />
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">{t('forgotTitle')}</h1>

          {sent ? (
            <p className="text-neutral-600 dark:text-neutral-400">{t('forgotSuccess')}</p>
          ) : (
            <>
              <p className="text-neutral-500 dark:text-neutral-400 mb-8">{t('forgotSubtitle')}</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" required />
                </div>
                <button type="submit" disabled={sending} className="btn-primary btn-lg w-full">
                  {sending ? t('forgotSending') : t('forgotSend')}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            <Link href="/auth/login" className="link">{t('backToLogin')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
