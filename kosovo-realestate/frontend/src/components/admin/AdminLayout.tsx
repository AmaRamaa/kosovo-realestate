'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || user?.role !== 'ADMIN') router.push('/auth/login');
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.role !== 'ADMIN') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col z-40 hidden lg:flex">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/">
            <Logo className="h-7 text-neutral-900 dark:text-white" />
          </Link>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            {user.avatar
              ? <Image src={user.avatar} alt={user.firstName} width={40} height={40} className="rounded-full object-cover" />
              : <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300">{getInitials(user.firstName, user.lastName)}</div>
            }
            <div className="min-w-0">
              <p className="font-medium text-sm text-neutral-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
              <span className="badge-blue text-[10px]">Owner</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link href="/admin" className={pathname === '/admin' ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400' : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white'}>
            <BarChart3 className="w-4 h-4" /> Overview
          </Link>
        </nav>

        <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64 flex-1 min-w-0">
        <div className="min-h-screen">{children}</div>
      </div>
    </div>
  );
}
