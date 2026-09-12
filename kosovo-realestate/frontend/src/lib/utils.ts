import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ListingType, PropertyType, MortgageResult } from '@/types';

// The finalized production domain — overridable via env for previews/staging.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.molla-realestate.com').replace(/\/$/, '');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'EUR', listingType?: ListingType): string {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
  return listingType === 'RENT' ? `${formatted}/mo` : formatted;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} m²`;
}

export function formatDate(date: string, locale: 'en' | 'sq' = 'en'): string {
  return new Intl.DateTimeFormat(locale === 'sq' ? 'sq-AL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

const RELATIVE_DATE_LABELS = {
  en: { today: 'Today', yesterday: 'Yesterday', daysAgo: (n: number) => `${n} days ago`, weeksAgo: (n: number) => `${n} weeks ago`, monthsAgo: (n: number) => `${n} months ago` },
  sq: { today: 'Sot', yesterday: 'Dje', daysAgo: (n: number) => `${n} ditë më parë`, weeksAgo: (n: number) => `${n} javë më parë`, monthsAgo: (n: number) => `${n} muaj më parë` },
};

export function formatRelativeDate(date: string, locale: 'en' | 'sq' = 'en'): string {
  const labels = RELATIVE_DATE_LABELS[locale];
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return labels.today;
  if (diffDays === 1) return labels.yesterday;
  if (diffDays < 7) return labels.daysAgo(diffDays);
  if (diffDays < 30) return labels.weeksAgo(Math.floor(diffDays / 7));
  if (diffDays < 365) return labels.monthsAgo(Math.floor(diffDays / 30));
  return formatDate(date, locale);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '…';
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'LAND', label: 'Land' },
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'WAREHOUSE', label: 'Warehouse' },
  { value: 'LOCAL', label: 'Storefront' },
];

export const HEATING_TYPES = [
  { value: 'CENTRAL', label: 'Central' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'GAS', label: 'Gas' },
  { value: 'OIL', label: 'Oil' },
  { value: 'WOOD', label: 'Wood' },
  { value: 'HEAT_PUMP', label: 'Heat Pump' },
  { value: 'UNDERFLOOR', label: 'Underfloor' },
  { value: 'NONE', label: 'None' },
];

export const ENERGY_RATINGS = ['A_PLUS', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'area:desc', label: 'Largest First' },
  { value: 'viewCount:desc', label: 'Most Viewed' },
];

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
export const BATHROOM_OPTIONS = [1, 2, 3, 4];

export function calculateMortgage(
  price: number,
  downPaymentPct: number,
  interestRate: number,
  years: number
): MortgageResult {
  const loanAmount = price * (1 - downPaymentPct / 100);
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numPayments;
  } else {
    monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - loanAmount;

  return { monthlyPayment, totalPayment, totalInterest, loanAmount };
}

export const KOSOVO_STATS = {
  totalListings: 50,
  cities: 37,
  agents: 1,
};

export const STATUS_COLORS = {
  PENDING: 'badge-yellow',
  ACTIVE: 'badge-green',
  SOLD: 'badge-blue',
  RENTED: 'badge-blue',
  INACTIVE: 'badge-gray',
  REJECTED: 'badge-red',
};

export const APPOINTMENT_STATUS_COLORS = {
  PENDING: 'badge-yellow',
  CONFIRMED: 'badge-green',
  CANCELLED: 'badge-red',
  COMPLETED: 'badge-blue',
};
