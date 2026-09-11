'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/Toaster';
import Logo from '@/components/ui/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation('auth');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast(t('welcomeBack'), 'success');
      router.push('/admin');
    } catch (err: any) {
      toast(err?.response?.data?.error || t('invalidCredentials'), 'error');
    } finally {
      setLoading(false);
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
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">{t('ownerSignIn')}</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">{t('signInToManage')}</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">{t('emailAddress')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder={t('emailPlaceholder')} className="input pl-10" required />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label mb-0">{t('password')}</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700">{t('forgotPassword')}</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="••••••••" className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
              {loading ? t('signingIn') : t('signIn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
