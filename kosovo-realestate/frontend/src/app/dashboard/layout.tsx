'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Heart, MessageSquare, Calendar, Bell, Settings, LogOut, Plus, Users, BarChart3, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/listings', label: 'My Listings', icon: Building2 },
  { href: '/dashboard/favorites', label: 'Favorites', icon: Heart },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const ADMIN_NAV = [
  { href: '/admin', label: 'Analytics', icon: BarChart3, exact: true },
  { href: '/admin/listings', label: 'Listings', icon: Building2 },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/approvals', label: 'Approvals', icon: ShieldCheck },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isActive = (href: string, exact = false) => exact ? pathname === href : pathname.startsWith(href);
  const nav = pathname.startsWith('/admin') ? ADMIN_NAV : NAV;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col z-40 hidden lg:flex">
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-neutral-900 dark:text-white">Kosovo RE</span>
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
              <span className="badge-blue text-[10px]">{user.role}</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {nav.map(item => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', active ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-400' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white')}>
                <Icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}

          {user.role === 'ADMIN' && !pathname.startsWith('/admin') && (
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 mt-4">
              <ShieldCheck className="w-4 h-4" /> Admin Panel
            </Link>
          )}
        </nav>

        <div className="p-3 border-t border-neutral-200 dark:border-neutral-700 space-y-1">
          <Link href="/dashboard/listings/new" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950">
            <Plus className="w-4 h-4" /> Post new listing
          </Link>
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
