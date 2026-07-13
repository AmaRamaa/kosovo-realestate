'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/Toaster';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('Welcome back!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Invalid credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center"><Home className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl text-white">Kosovo Real Estate</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="font-display font-bold text-4xl text-white mb-4">Find your dream property in Kosovo</h2>
          <p className="text-primary-100 text-lg">Access thousands of verified listings across all 38 municipalities.</p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[['2,840+','Active listings'],['156','Verified agents'],['38','Municipalities'],['4.9★','User rating']].map(([v,l])=>(
            <div key={l} className="bg-white/10 rounded-xl p-4">
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="text-primary-200 text-sm">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center"><Home className="w-5 h-5 text-white" /></div>
              <span className="font-display font-bold text-xl text-neutral-900 dark:text-white">Kosovo Real Estate</span>
            </Link>
          </div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" className="input pl-10" required />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="label mb-0">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} placeholder="••••••••" className="input pl-10 pr-10" required />
                <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200 dark:border-neutral-700" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-900">or continue with</span></div>
          </div>

          <button className="btn-secondary btn-lg w-full mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="link font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
