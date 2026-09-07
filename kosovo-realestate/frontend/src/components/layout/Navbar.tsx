'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Menu, X, Search, ChevronDown, Sun, Moon,
  Home, Building2, MapPin, TrendingUp, PlusCircle, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation('navbar');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    {
      label: t('buy'),
      href: '/properties?listingType=SALE',
      mega: [
        { label: t('apartments'), href: '/properties?listingType=SALE&propertyType=APARTMENT', icon: Building2 },
        { label: t('houses'), href: '/properties?listingType=SALE&propertyType=HOUSE', icon: Home },
        { label: t('villas'), href: '/properties?listingType=SALE&propertyType=VILLA', icon: Home },
        { label: t('land'), href: '/properties?listingType=SALE&propertyType=LAND', icon: MapPin },
        { label: t('commercial'), href: '/properties?listingType=SALE&propertyType=COMMERCIAL', icon: Building2 },
        { label: t('newDevelopments'), href: '/properties?listingType=SALE&sortBy=createdAt', icon: TrendingUp },
      ],
      viewAll: t('viewAllForSale'),
    },
    {
      label: t('rent'),
      href: '/properties?listingType=RENT',
      mega: [
        { label: t('apartments'), href: '/properties?listingType=RENT&propertyType=APARTMENT', icon: Building2 },
        { label: t('houses'), href: '/properties?listingType=RENT&propertyType=HOUSE', icon: Home },
        { label: t('studios'), href: '/properties?listingType=RENT&propertyType=STUDIO', icon: Home },
        { label: t('offices'), href: '/properties?listingType=RENT&propertyType=OFFICE', icon: Building2 },
        { label: t('commercial'), href: '/properties?listingType=RENT&propertyType=COMMERCIAL', icon: Building2 },
        { label: t('shortTerm'), href: '/properties?listingType=RENT', icon: MapPin },
      ],
      viewAll: t('viewAllForRent'),
    },
    { label: t('agents'), href: '/agents' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
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
          <Link href="/" className="flex items-center flex-shrink-0">
            <Logo className="h-12 text-neutral-900 dark:text-white" />
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
                        {link.viewAll}
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
            <Link href="/properties" className="btn btn-ghost btn-sm hidden sm:flex" aria-label={t('search')}>
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">{t('search')}</span>
            </Link>

            {/* Language Switcher */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setLocale(locale === 'en' ? 'sq' : 'en')}
              aria-label={t('changeLanguage')}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden md:inline">{locale === 'en' ? 'EN' : 'SQ'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('toggleTheme')}
            >
              <Sun className="w-4 h-4 dark:hidden" />
              <Moon className="w-4 h-4 hidden dark:block" />
            </button>

            {/* List Your Property */}
            <Link href="/list-your-property" className="btn btn-primary btn-sm hidden sm:flex">
              <PlusCircle className="w-4 h-4" />
              {t('listYourProperty')}
            </Link>

            {/* Mobile menu button */}
            <button
              className="btn btn-ghost btn-sm lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={t('toggleMenu')}
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
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Link href="/list-your-property" className="btn btn-primary btn-md w-full">
                <PlusCircle className="w-4 h-4" /> {t('listYourProperty')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
