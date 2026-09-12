'use client';

import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  lat: number;
  lng: number;
  title?: string;
  zoom?: number;
  className?: string;
}

// Shows the property's general area rather than its exact address — a real
// geographic radius (meters, via Circle) rather than a pixel-sized pin, so it
// stays honest about how approximate the location is at any zoom level.
const AREA_RADIUS_METERS = 400;

export default function MapDisplay({ lat, lng, title, zoom = 14, className }: MapDisplayProps) {
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
      <Circle
        center={[lat, lng]}
        radius={AREA_RADIUS_METERS}
        pathOptions={{ color: '#6b1220', weight: 2, fillColor: '#6b1220', fillOpacity: 0.2 }}
      />
    </MapContainer>
  );
}
