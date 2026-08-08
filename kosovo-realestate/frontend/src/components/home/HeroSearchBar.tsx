'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';
import { PROPERTY_TYPES } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function HeroSearchBar() {
  const router = useRouter();
  const [listingType, setListingType] = useState<'SALE' | 'RENT'>('SALE');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('listingType', listingType);
    if (propertyType) params.set('propertyType', propertyType);
    if (location) params.set('search', location);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-2 max-w-3xl w-full">
      {/* Tabs */}
      <div className="flex gap-1 p-1 mb-2">
        {(['SALE', 'RENT'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setListingType(type)}
            className={cn(
              'flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-colors',
              listingType === type
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            )}
          >
            {type === 'SALE' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 p-1">
        {/* Property type */}
        <div className="relative flex-shrink-0 sm:w-44">
          <button
            onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
            className="w-full h-12 flex items-center justify-between gap-2 px-4 rounded-xl border border-neutral-200 dark:border-neutral-600 text-sm text-neutral-700 dark:text-neutral-200 hover:border-neutral-300 transition-colors"
          >
            <span className="flex items-center gap-2 truncate">
              <Home className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              {propertyType ? PROPERTY_TYPES.find(p => p.value === propertyType)?.label : 'Any type'}
            </span>
            <ChevronDown className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          </button>

          {showPropertyDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-1.5 z-20 animate-scale-in max-h-72 overflow-y-auto">
              <button
                onClick={() => { setPropertyType(''); setShowPropertyDropdown(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                Any type
              </button>
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setPropertyType(type.value); setShowPropertyDropdown(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location input */}
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="City, neighborhood, or address..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Search button */}
        <button onClick={handleSearch} className="btn-primary h-12 px-6 flex-shrink-0">
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}
