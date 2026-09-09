'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Upload, X, Loader2, Star } from 'lucide-react';
import { cityApi, listingApi, uploadApi } from '@/lib/api';
import { PROPERTY_TYPES, HEATING_TYPES, ENERGY_RATINGS } from '@/lib/utils';
import { Listing } from '@/types';
import { toast } from '@/components/ui/Toaster';
import Select from '@/components/ui/Select';
import { useTranslation } from '@/lib/i18n/useTranslation';

const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

interface ImageItem {
  id?: string;
  url: string;
  publicId?: string;
}

interface ListingFormProps {
  listing?: Listing; // present when editing
}

const AMENITY_FIELDS = [
  { key: 'hasGarden', label: 'Garden' },
  { key: 'hasPool', label: 'Pool' },
  { key: 'hasBalcony', label: 'Balcony' },
  { key: 'hasTerrace', label: 'Terrace' },
  { key: 'hasElevator', label: 'Elevator' },
  { key: 'hasSecurity', label: 'Security' },
  { key: 'hasAirCon', label: 'Air Conditioning' },
  { key: 'hasHeating', label: 'Heating' },
  { key: 'hasFurnished', label: 'Furnished' },
  { key: 'hasStorage', label: 'Storage' },
] as const;

const STATUS_OPTIONS = ['PENDING', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE', 'REJECTED'];

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const { t: tType } = useTranslation('propertyTypes');
  const isEdit = !!listing;

  const [form, setForm] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    listingType: listing?.listingType || 'SALE',
    propertyType: listing?.propertyType || 'APARTMENT',
    status: listing?.status || 'ACTIVE',
    price: listing?.price ?? '',
    currency: listing?.currency || 'EUR',
    priceNegotiable: listing?.priceNegotiable || false,
    area: listing?.area ?? '',
    bedrooms: listing?.bedrooms ?? '',
    bathrooms: listing?.bathrooms ?? '',
    floor: listing?.floor ?? '',
    totalFloors: listing?.totalFloors ?? '',
    yearBuilt: listing?.yearBuilt ?? '',
    parkingSpaces: listing?.parkingSpaces ?? 0,
    garageSpaces: listing?.garageSpaces ?? 0,
    heatingType: listing?.heatingType || '',
    energyRating: listing?.energyRating || '',
    address: listing?.address || '',
    cityId: listing?.cityId || listing?.city?.id || '',
    neighborhoodId: listing?.neighborhoodId || '',
    lat: listing?.lat ?? null as number | null,
    lng: listing?.lng ?? null as number | null,
    isFeatured: listing?.isFeatured || false,
    hasGarden: listing?.hasGarden || false,
    hasPool: listing?.hasPool || false,
    hasBalcony: listing?.hasBalcony || false,
    hasTerrace: listing?.hasTerrace || false,
    hasElevator: listing?.hasElevator || false,
    hasSecurity: listing?.hasSecurity || false,
    hasAirCon: listing?.hasAirCon || false,
    hasHeating: listing?.hasHeating || false,
    hasFurnished: listing?.hasFurnished || false,
    hasStorage: listing?.hasStorage || false,
  });

  const [images, setImages] = useState<ImageItem[]>(
    (listing?.images || []).map((img) => ({ id: img.id, url: img.url, publicId: img.publicId }))
  );
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: citiesData } = useQuery({ queryKey: ['cities'], queryFn: () => cityApi.getAll().then((r) => r.data) });
  const cities = citiesData?.cities || [];
  const selectedCity = cities.find((c: any) => c.id === form.cityId);

  const { data: cityDetail } = useQuery({
    queryKey: ['city', selectedCity?.slug],
    queryFn: () => cityApi.getBySlug(selectedCity!.slug).then((r) => r.data),
    enabled: !!selectedCity?.slug,
  });
  const neighborhoods = cityDetail?.city?.neighborhoods || [];

  const set = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await uploadApi.uploadImages(files);
      const uploaded = res.data.images.map((img: any) => ({ url: img.url, publicId: img.publicId }));
      setImages((prev) => [...prev, ...uploaded]);
    } catch {
      toast('Image upload failed — check Cloudinary is configured.', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const img = images[index];
    if (img.id) setDeletedImageIds((p) => [...p, img.id!]);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cityId) return toast('Please select a city', 'error');
    setSaving(true);
    try {
      const payload: any = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
        bathrooms: form.bathrooms === '' ? null : Number(form.bathrooms),
        floor: form.floor === '' ? null : Number(form.floor),
        totalFloors: form.totalFloors === '' ? null : Number(form.totalFloors),
        yearBuilt: form.yearBuilt === '' ? null : Number(form.yearBuilt),
        parkingSpaces: Number(form.parkingSpaces) || 0,
        garageSpaces: Number(form.garageSpaces) || 0,
        heatingType: form.heatingType || null,
        energyRating: form.energyRating || null,
        neighborhoodId: form.neighborhoodId || null,
      };

      if (isEdit) {
        for (const imgId of deletedImageIds) {
          await listingApi.deleteImage(listing!.id, imgId);
        }
        const newImages = images.filter((img) => !img.id);
        if (newImages.length) payload.newImages = newImages;
        await listingApi.update(listing!.id, payload);
        toast('Listing updated', 'success');
        router.push('/admin/listings');
      } else {
        payload.images = images;
        const res = await listingApi.create(payload);
        toast('Listing created', 'success');
        router.push('/admin/listings');
      }
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Basic Info</h2>
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required maxLength={200} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input resize-none" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Listing Type</label>
            <Select
              value={form.listingType}
              onValueChange={(v) => set('listingType', v)}
              options={[{ value: 'SALE', label: tType('SALE') }, { value: 'RENT', label: tType('RENT') }]}
            />
          </div>
          <div>
            <label className="label">Property Type</label>
            <Select
              value={form.propertyType}
              onValueChange={(v) => set('propertyType', v)}
              options={PROPERTY_TYPES.map((pt) => ({ value: pt.value, label: tType(pt.value) }))}
            />
          </div>
        </div>
        <div>
          <label className="label">Status</label>
          <Select value={form.status} onValueChange={(v) => set('status', v)} options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
        </div>
      </div>

      {/* Pricing */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price</label>
            <input type="number" min={0} className="input" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div>
            <label className="label">Currency</label>
            <Select value={form.currency} onValueChange={(v) => set('currency', v)} options={[{ value: 'EUR', label: 'EUR (€)' }, { value: 'USD', label: 'USD ($)' }]} />
          </div>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.priceNegotiable} onChange={(e) => set('priceNegotiable', e.target.checked)} />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Price negotiable</span>
        </label>
      </div>

      {/* Details */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Area (m²)</label>
            <input type="number" min={0} className="input" value={form.area} onChange={(e) => set('area', e.target.value)} required />
          </div>
          <div>
            <label className="label">Bedrooms</label>
            <input type="number" min={0} className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
          </div>
          <div>
            <label className="label">Bathrooms</label>
            <input type="number" min={0} className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
          </div>
          <div>
            <label className="label">Floor</label>
            <input type="number" className="input" value={form.floor} onChange={(e) => set('floor', e.target.value)} />
          </div>
          <div>
            <label className="label">Total Floors</label>
            <input type="number" min={0} className="input" value={form.totalFloors} onChange={(e) => set('totalFloors', e.target.value)} />
          </div>
          <div>
            <label className="label">Year Built</label>
            <input type="number" className="input" value={form.yearBuilt} onChange={(e) => set('yearBuilt', e.target.value)} />
          </div>
          <div>
            <label className="label">Parking Spaces</label>
            <input type="number" min={0} className="input" value={form.parkingSpaces} onChange={(e) => set('parkingSpaces', e.target.value)} />
          </div>
          <div>
            <label className="label">Garage Spaces</label>
            <input type="number" min={0} className="input" value={form.garageSpaces} onChange={(e) => set('garageSpaces', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Heating Type</label>
            <Select value={form.heatingType} onValueChange={(v) => set('heatingType', v)} options={HEATING_TYPES} placeholder="Not specified" />
          </div>
          <div>
            <label className="label">Energy Rating</label>
            <Select value={form.energyRating} onValueChange={(v) => set('energyRating', v)} options={ENERGY_RATINGS.map((r) => ({ value: r, label: r.replace('_PLUS', '+') }))} placeholder="Not specified" />
          </div>
        </div>
        <div>
          <label className="label mb-2">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AMENITY_FIELDS.map((f) => (
              <label key={f.key} className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600"
                  checked={(form as any)[f.key]}
                  onChange={(e) => set(f.key, e.target.checked)}
                />
                {f.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Location</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">City</label>
            <Select
              value={form.cityId}
              onValueChange={(v) => { set('cityId', v); set('neighborhoodId', ''); }}
              options={cities.map((c: any) => ({ value: c.id, label: c.name }))}
              placeholder="Select a city"
            />
          </div>
          <div>
            <label className="label">Neighborhood</label>
            <Select
              value={form.neighborhoodId}
              onValueChange={(v) => set('neighborhoodId', v)}
              options={neighborhoods.map((n: any) => ({ value: n.id, label: n.name }))}
              placeholder={neighborhoods.length ? 'Select a neighborhood' : 'No neighborhoods'}
            />
          </div>
        </div>
        <div>
          <label className="label">Address</label>
          <input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} required />
        </div>
        <div>
          <label className="label mb-2">Map location</label>
          <LocationPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))} />
        </div>
      </div>

      {/* Images */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Photos</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id || img.url} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 badge bg-primary-600 text-white text-[10px] flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <label className="aspect-[4/3] rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary-400 text-neutral-500">
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span className="text-xs">Upload</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-neutral-500">The first photo is used as the cover image. Add photos in the order you want them.</p>
      </div>

      {/* Featured */}
      <div className="card p-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">Feature this listing on the homepage</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary btn-lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEdit ? 'Save Changes' : 'Create Listing'}
        </button>
        <button type="button" onClick={() => router.push('/admin/listings')} className="btn-secondary btn-lg">
          Cancel
        </button>
      </div>
    </form>
  );
}
