import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ListingType, PropertyType, MortgageResult } from '@/types';

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

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('sq-AL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return formatDate(date);
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

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  VILLA: 'Villa',
  LAND: 'Land',
  COMMERCIAL: 'Commercial',
  OFFICE: 'Office',
  WAREHOUSE: 'Warehouse',
  STUDIO: 'Studio',
  DUPLEX: 'Duplex',
};

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  SALE: 'For Sale',
  RENT: 'For Rent',
};

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
];

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
  totalListings: 2840,
  cities: 38,
  agents: 156,
  agencies: 42,
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
