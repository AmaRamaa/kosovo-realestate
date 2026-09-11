'use client';

import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  lat: number;
  lng: number;
  title?: string;
  zoom?: number;
  className?: string;
}

export default function MapDisplay({ lat, lng, title, zoom = 15, className }: MapDisplayProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className={className || 'w-full h-full'}
      aria-label={title}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={[lat, lng]}
        radius={12}
        pathOptions={{ color: '#6b1220', weight: 3, fillColor: '#6b1220', fillOpacity: 0.35 }}
      />
    </MapContainer>
  );
}
