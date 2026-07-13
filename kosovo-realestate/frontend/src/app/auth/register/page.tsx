'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'BUYER' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      localStorage.setItem('accessToken', data.accessToken);
      toast('Account created successfully!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center"><Home className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl text-neutral-900 dark:text-white">Kosovo Real Estate</span>
          </Link>
        </div>
        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">Create your account</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Join thousands of users across Kosovo</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input className="input" placeholder="Ardian" value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} required />
              </div>
              <div>
                <label className="label">Last name</label>
                <input className="input" placeholder="Krasniqi" value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} required />
              </div>
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPassword?'text':'password'} className="input pr-10" placeholder="Min. 8 characters" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} required minLength={8} />
                <button type="button" onClick={()=>setShowPassword(p=>!p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">I want to</label>
              <div className="grid grid-cols-2 gap-2">
                {[{v:'BUYER',l:'Buy / Rent'},{v:'SELLER',l:'Sell / List'}].map(opt=>(
                  <button key={opt.v} type="button" onClick={()=>setForm(p=>({...p,role:opt.v}))}
                    className={`py-3 rounded-xl text-sm font-medium border-2 transition-colors ${form.role===opt.v?'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400 dark:border-primary-500':'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300'}`}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-lg w-full mt-2">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
            Already have an account? <Link href="/auth/login" className="link font-medium">Sign in</Link>
          </p>
          <p className="text-center text-xs text-neutral-400 mt-3">
            By registering you agree to our <Link href="/terms" className="link">Terms</Link> and <Link href="/privacy" className="link">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
