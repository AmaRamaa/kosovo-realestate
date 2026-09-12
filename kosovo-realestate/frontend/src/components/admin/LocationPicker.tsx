'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const PIN_ICON = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42"><path d="M16 0C7.163 0 0 7.163 0 16c0 11 16 26 16 26s16-15 16-26C32 7.163 24.837 0 16 0z" fill="#6b1220"/><circle cx="16" cy="16" r="7" fill="#fff"/></svg>'
    ),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

const DEFAULT_CENTER: [number, number] = [42.6629, 21.1655]; // Prishtinë

interface LocationPickerProps {
  lat?: number | null;
  lng?: number | null;
  onChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const { t } = useTranslation('admin');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const position: [number, number] = lat != null && lng != null ? [lat, lng] : DEFAULT_CENTER;

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSearching(true);
    setError('');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=xk&q=${encodeURIComponent(query)}`,
        { signal: controller.signal, headers: { Accept: 'application/json' } }
      );
      const results = await res.json();
      if (results?.[0]) {
        onChange(Number(results[0].lat), Number(results[0].lon));
      } else {
        setError(t('noResultsFound'));
      }
    } catch {
      setError(t('searchFailedRetry'));
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
          placeholder={t('searchAddressPlaceholder')}
          className="input pl-9 pr-20"
        />
        <button type="button" onClick={() => handleSearch()} disabled={searching} className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-sm btn-primary">
          {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('searchAction')}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="rounded-xl overflow-hidden border border-primary-100 dark:border-primary-900/40 h-64 relative z-0">
        <MapContainer center={position} zoom={lat != null ? 15 : 12} scrollWheelZoom className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onChange={onChange} />
          <Recenter lat={position[0]} lng={position[1]} />
          {lat != null && lng != null && (
            <Marker
              position={[lat, lng]}
              icon={PIN_ICON}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target.getLatLng();
                  onChange(m.lat, m.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
        {lat != null && lng != null
          ? `${lat.toFixed(5)}, ${lng.toFixed(5)} — ${t('mapAdjustHint')}`
          : t('mapSearchHint')}
      </p>
    </div>
  );
}
