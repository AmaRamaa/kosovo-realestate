'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Menu, X, Search, Heart, Bell, User, ChevronDown, Sun, Moon,
  Home, Building2, MapPin, Users, BookOpen, LayoutDashboard,
  LogOut, Settings, Plus, TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';

const NAV_LINKS = [
  {
    label: 'Buy',
    href: '/properties?listingType=SALE',
    mega: [
      { label: 'Apartments', href: '/properties?listingType=SALE&propertyType=APARTMENT', icon: Building2 },
      { label: 'Houses', href: '/properties?listingType=SALE&propertyType=HOUSE', icon: Home },
      { label: 'Villas', href: '/properties?listingType=SALE&propertyType=VILLA', icon: Home },
      { label: 'Land', href: '/properties?listingType=SALE&propertyType=LAND', icon: MapPin },
      { label: 'Commercial', href: '/properties?listingType=SALE&propertyType=COMMERCIAL', icon: Building2 },
      { label: 'New Developments', href: '/properties?listingType=SALE&sortBy=createdAt', icon: TrendingUp },
    ],
  },
  {
    label: 'Rent',
    href: '/properties?listingType=RENT',
    mega: [
      { label: 'Apartments', href: '/properties?listingType=RENT&propertyType=APARTMENT', icon: Building2 },
      { label: 'Houses', href: '/properties?listingType=RENT&propertyType=HOUSE', icon: Home },
      { label: 'Studios', href: '/properties?listingType=RENT&propertyType=STUDIO', icon: Home },
      { label: 'Offices', href: '/properties?listingType=RENT&propertyType=OFFICE', icon: Building2 },
      { label: 'Commercial', href: '/properties?listingType=RENT&propertyType=COMMERCIAL', icon: Building2 },
      { label: 'Short Term', href: '/properties?listingType=RENT', icon: MapPin },
    ],
  },
  { label: 'Agents', href: '/agents' },
  { label: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href.split('?')[0]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled || mobileOpen
          ? 'bg-white dark:bg-neutral-900 shadow-sm border-b border-neutral-200 dark:border-neutral-800'
          : 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-200/80 dark:border-neutral-800/80'
      )}
    >
      <div className="container-page" ref={menuRef}>
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-neutral-900 dark:text-white leading-none">Kosovo</span>
              <span className="block text-xs font-medium text-primary-600 leading-none -mt-0.5">Real Estate</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative">
                {link.mega ? (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                    onClick={() => setActiveMenu(activeMenu === link.label ? null : link.label)}
                  >
                    {link.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', activeMenu === link.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'text-primary-600 bg-primary-50 dark:bg-primary-950 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    )}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Mega Menu */}
                {link.mega && activeMenu === link.label && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-3 animate-scale-in">
                    <div className="grid grid-cols-2 gap-1">
                      {link.mega.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors group"
                          >
                            <Icon className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                      <Link
                        href={link.href}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 transition-colors"
                      >
                        View all {link.label === 'Buy' ? 'properties for sale' : 'properties for rent'}
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Link href="/properties" className="btn btn-ghost btn-sm hidden sm:flex" aria-label="Search">
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Search</span>
            </Link>

            {/* Theme Toggle */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Favorites */}
                <Link href="/dashboard/favorites" className="btn btn-ghost btn-sm hidden sm:flex" aria-label="Favorites">
                  <Heart className="w-4 h-4" />
                </Link>

                {/* Notifications */}
                <Link href="/dashboard/notifications" className="btn btn-ghost btn-sm relative hidden sm:flex" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>

                {/* Post Listing */}
                <Link href="/dashboard/listings/new" className="btn btn-primary btn-sm hidden md:flex">
                  <Plus className="w-4 h-4" />
                  Post listing
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.firstName} width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300">
                        {getInitials(user?.firstName || 'U', user?.lastName || 'S')}
                      </div>
                    )}
                    <ChevronDown className={cn('w-4 h-4 text-neutral-500 hidden sm:block transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-1.5 animate-scale-in z-50">
                      <div className="px-3 py-2 mb-1 border-b border-neutral-200 dark:border-neutral-700">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user?.email}</p>
                      </div>
                      {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/dashboard/listings', label: 'My Listings', icon: Building2 },
                        { href: '/dashboard/messages', label: 'Messages', icon: BookOpen },
                        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                            <Icon className="w-4 h-4 text-neutral-400" /> {item.label}
                          </Link>
                        );
                      })}
                      {user?.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                          <Settings className="w-4 h-4 text-neutral-400" /> Admin Panel
                        </Link>
                      )}
                      <div className="mt-1 pt-1 border-t border-neutral-200 dark:border-neutral-700">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm hidden sm:flex">Sign in</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="btn btn-ghost btn-sm lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 py-4 space-y-1 animate-slide-down">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-950'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  {link.label}
                </Link>
                {link.mega && (
                  <div className="pl-4 mt-1 space-y-1">
                    {link.mega.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link href="/dashboard/listings/new" className="btn btn-primary btn-md w-full">
                    <Plus className="w-4 h-4" /> Post a listing
                  </Link>
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="btn btn-secondary btn-md w-full">Sign in</Link>
                  <Link href="/auth/register" className="btn btn-primary btn-md w-full">Create account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
