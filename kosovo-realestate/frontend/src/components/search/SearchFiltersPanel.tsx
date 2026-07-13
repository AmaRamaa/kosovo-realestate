'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ListingFilters, City } from '@/types';
import { PROPERTY_TYPES, BEDROOM_OPTIONS, BATHROOM_OPTIONS, cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: ListingFilters;
  cities: City[];
  onChange: (filters: ListingFilters) => void;
  onClear: () => void;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 py-4 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-3">
        <span className="font-medium text-sm text-neutral-900 dark:text-white">{title}</span>
        <ChevronDown className={cn('w-4 h-4 text-neutral-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && children}
    </div>
  );
}

export default function SearchFiltersPanel({ filters, cities, onChange, onClear }: SearchFiltersProps) {
  const [local, setLocal] = useState<ListingFilters>(filters);

  useEffect(() => { setLocal(filters); }, [filters]);

  const update = (patch: Partial<ListingFilters>) => {
    const updated = { ...local, ...patch };
    setLocal(updated);
    onChange(updated);
  };

  const activeCount = Object.entries(filters).filter(([k, v]) => v !== undefined && v !== '' && !['page', 'limit', 'sortBy', 'sortOrder'].includes(k)).length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-semibold text-neutral-900 dark:text-white">Filters</h3>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-primary-600 dark:text-primary-400 font-medium flex items-center gap-1 hover:text-primary-700">
            <X className="w-3.5 h-3.5" /> Clear ({activeCount})
          </button>
        )}
      </div>

      {/* Listing Type */}
      <FilterSection title="Listing type">
        <div className="flex gap-2">
          {(['SALE', 'RENT'] as const).map((type) => (
            <button
              key={type}
              onClick={() => update({ listingType: local.listingType === type ? undefined : type })}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium border transition-colors',
                local.listingType === type
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              )}
            >
              {type === 'SALE' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property type">
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => update({ propertyType: local.propertyType === type.value ? undefined : type.value })}
              className={cn(
                'py-2 px-2 rounded-lg text-xs font-medium border transition-colors text-left',
                local.propertyType === type.value
                  ? 'bg-primary-50 dark:bg-primary-950 border-primary-500 text-primary-700 dark:text-primary-400'
                  : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* City */}
      <FilterSection title="City">
        <select
          value={local.cityId || ''}
          onChange={(e) => update({ cityId: e.target.value || undefined })}
          className="input"
        >
          <option value="">All cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
        </select>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range (€)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={local.minPrice || ''}
            onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="input"
          />
          <span className="text-neutral-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={local.maxPrice || ''}
            onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="input"
          />
        </div>
      </FilterSection>

      {/* Area Range */}
      <FilterSection title="Area (m²)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={local.minArea || ''}
            onChange={(e) => update({ minArea: e.target.value ? Number(e.target.value) : undefined })}
            className="input"
          />
          <span className="text-neutral-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={local.maxArea || ''}
            onChange={(e) => update({ maxArea: e.target.value ? Number(e.target.value) : undefined })}
            className="input"
          />
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms">
        <div className="flex gap-2 flex-wrap">
          {BEDROOM_OPTIONS.map((num) => (
            <button
              key={num}
              onClick={() => update({ bedrooms: local.bedrooms === num ? undefined : num })}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium border transition-colors',
                local.bedrooms === num
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms">
        <div className="flex gap-2 flex-wrap">
          {BATHROOM_OPTIONS.map((num) => (
            <button
              key={num}
              onClick={() => update({ bathrooms: local.bathrooms === num ? undefined : num })}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium border transition-colors',
                local.bathrooms === num
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300'
              )}
            >
              {num}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { key: 'hasGarden', label: 'Garden' },
            { key: 'hasPool', label: 'Pool' },
            { key: 'hasBalcony', label: 'Balcony' },
            { key: 'hasFurnished', label: 'Furnished' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!!(local as any)[item.key]}
                onChange={(e) => update({ [item.key]: e.target.checked || undefined } as any)}
                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
