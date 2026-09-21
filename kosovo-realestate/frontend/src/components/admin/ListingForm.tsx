'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Upload, X, Loader2, Star, Lock } from 'lucide-react';
import { adminApi, cityApi, listingApi, uploadApi } from '@/lib/api';
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
  { key: 'hasGarden', labelKey: 'amenityGarden' },
  { key: 'hasPool', labelKey: 'amenityPool' },
  { key: 'hasBalcony', labelKey: 'amenityBalcony' },
  { key: 'hasTerrace', labelKey: 'amenityTerrace' },
  { key: 'hasElevator', labelKey: 'amenityElevator' },
  { key: 'hasSecurity', labelKey: 'amenitySecurity' },
  { key: 'hasAirCon', labelKey: 'amenityAirCon' },
  { key: 'hasHeating', labelKey: 'amenityHeating' },
  { key: 'hasFurnished', labelKey: 'amenityFurnished' },
  { key: 'hasStorage', labelKey: 'amenityStorage' },
] as const;

const STATUS_OPTIONS = ['PENDING', 'ACTIVE', 'SOLD', 'RENTED', 'INACTIVE', 'REJECTED'];
const STATUS_LABEL_KEYS: Record<string, string> = {
  PENDING: 'statusPending', ACTIVE: 'statusActive', SOLD: 'statusSold',
  RENTED: 'statusRented', INACTIVE: 'statusInactive', REJECTED: 'statusRejected',
};
const HEATING_LABEL_KEYS: Record<string, string> = {
  CENTRAL: 'heatingCentral', ELECTRIC: 'heatingElectric', GAS: 'heatingGas', OIL: 'heatingOil',
  WOOD: 'heatingWood', HEAT_PUMP: 'heatingHeatPump', UNDERFLOOR: 'heatingUnderfloor', NONE: 'heatingNone',
};
// Radix Select doesn't allow an empty-string item value, so "no agent" gets a sentinel.
const NO_AGENT = '__none__';

export default function ListingForm({ listing }: ListingFormProps) {
  const router = useRouter();
  const { t } = useTranslation('admin');
  const { t: tType } = useTranslation('propertyTypes');
  const isEdit = !!listing;

  const [form, setForm] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    listingType: listing?.listingType || 'SALE',
    propertyType: listing?.propertyType || 'APARTMENT',
    status: listing?.status || 'ACTIVE',
    agentId: listing?.agentId || listing?.agent?.id || '',
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

  // The original owner's private contact — sent to the API as `ownerContact`,
  // which only stores/returns it for admins.
  const [owner, setOwner] = useState({
    name: listing?.ownerContact?.name || '',
    phone: listing?.ownerContact?.phone || '',
    email: listing?.ownerContact?.email || '',
    notes: listing?.ownerContact?.notes || '',
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

  const { data: agentsData } = useQuery({ queryKey: ['admin-agents'], queryFn: () => adminApi.getAgents().then((r) => r.data) });
  const agents = agentsData?.agents || [];

  // New listings default to the first agent so it isn't forgotten; the admin can still pick "no agent".
  useEffect(() => {
    if (!isEdit && !form.agentId && agents.length > 0) setForm((p) => ({ ...p, agentId: agents[0].id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, agents.length]);

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
      toast(t('imageUploadFailed'), 'error');
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
    if (!form.cityId) return toast(t('pleaseSelectCity'), 'error');
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
        agentId: form.agentId || null,
        ownerContact: owner,
      };

      if (isEdit) {
        for (const imgId of deletedImageIds) {
          await listingApi.deleteImage(listing!.id, imgId);
        }
        const newImages = images.filter((img) => !img.id);
        if (newImages.length) payload.newImages = newImages;
        await listingApi.update(listing!.id, payload);
        toast(t('listingUpdatedToast'), 'success');
        router.push('/admin/listings');
      } else {
        payload.images = images;
        const res = await listingApi.create(payload);
        toast(t('listingCreatedToast'), 'success');
        router.push('/admin/listings');
      }
    } catch (err: any) {
      toast(err?.response?.data?.error || t('somethingWentWrong'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('formBasicInfo')}</h2>
        <div>
          <label className="label">{t('fieldTitle')}</label>
          <input className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required maxLength={200} />
        </div>
        <div>
          <label className="label">{t('fieldDescription')}</label>
          <textarea className="input resize-none" rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('fieldListingType')}</label>
            <Select
              value={form.listingType}
              onValueChange={(v) => set('listingType', v)}
              options={[{ value: 'SALE', label: tType('SALE') }, { value: 'RENT', label: tType('RENT') }]}
            />
          </div>
          <div>
            <label className="label">{t('fieldPropertyType')}</label>
            <Select
              value={form.propertyType}
              onValueChange={(v) => set('propertyType', v)}
              options={PROPERTY_TYPES.map((pt) => ({ value: pt.value, label: tType(pt.value) }))}
            />
          </div>
        </div>
        <div>
          <label className="label">{t('fieldStatus')}</label>
          <Select value={form.status} onValueChange={(v) => set('status', v)} options={STATUS_OPTIONS.map((s) => ({ value: s, label: t(STATUS_LABEL_KEYS[s]) }))} />
        </div>
      </div>

      {/* Pricing */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('formPricing')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('fieldPrice')}</label>
            <input type="number" min={0} className="input" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div>
            <label className="label">{t('fieldCurrency')}</label>
            <Select value={form.currency} onValueChange={(v) => set('currency', v)} options={[{ value: 'EUR', label: 'EUR (€)' }, { value: 'USD', label: 'USD ($)' }]} />
          </div>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.priceNegotiable} onChange={(e) => set('priceNegotiable', e.target.checked)} />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">{t('fieldPriceNegotiable')}</span>
        </label>
      </div>

      {/* Details */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('formDetails')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">{t('fieldArea')}</label>
            <input type="number" min={0} className="input" value={form.area} onChange={(e) => set('area', e.target.value)} required />
          </div>
          <div>
            <label className="label">{t('fieldBedrooms')}</label>
            <input type="number" min={0} className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldBathrooms')}</label>
            <input type="number" min={0} className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldFloor')}</label>
            <input type="number" className="input" value={form.floor} onChange={(e) => set('floor', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldTotalFloors')}</label>
            <input type="number" min={0} className="input" value={form.totalFloors} onChange={(e) => set('totalFloors', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldYearBuilt')}</label>
            <input type="number" className="input" value={form.yearBuilt} onChange={(e) => set('yearBuilt', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldParkingSpaces')}</label>
            <input type="number" min={0} className="input" value={form.parkingSpaces} onChange={(e) => set('parkingSpaces', e.target.value)} />
          </div>
          <div>
            <label className="label">{t('fieldGarageSpaces')}</label>
            <input type="number" min={0} className="input" value={form.garageSpaces} onChange={(e) => set('garageSpaces', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('fieldHeatingType')}</label>
            <Select value={form.heatingType} onValueChange={(v) => set('heatingType', v)} options={HEATING_TYPES.map((h) => ({ value: h.value, label: t(HEATING_LABEL_KEYS[h.value]) }))} placeholder={t('notSpecified')} />
          </div>
          <div>
            <label className="label">{t('fieldEnergyRating')}</label>
            <Select value={form.energyRating} onValueChange={(v) => set('energyRating', v)} options={ENERGY_RATINGS.map((r) => ({ value: r, label: r.replace('_PLUS', '+') }))} placeholder={t('notSpecified')} />
          </div>
        </div>
        <div>
          <label className="label mb-2">{t('fieldAmenities')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {AMENITY_FIELDS.map((f) => (
              <label key={f.key} className="flex items-center gap-2 cursor-pointer text-sm text-neutral-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-600"
                  checked={(form as any)[f.key]}
                  onChange={(e) => set(f.key, e.target.checked)}
                />
                {t(f.labelKey)}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('formLocation')}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('fieldCity')}</label>
            <Select
              value={form.cityId}
              onValueChange={(v) => { set('cityId', v); set('neighborhoodId', ''); }}
              options={cities.map((c: any) => ({ value: c.id, label: c.name }))}
              placeholder={t('selectCity')}
            />
          </div>
          <div>
            <label className="label">{t('fieldNeighborhood')}</label>
            <Select
              value={form.neighborhoodId}
              onValueChange={(v) => set('neighborhoodId', v)}
              options={neighborhoods.map((n: any) => ({ value: n.id, label: n.name }))}
              placeholder={neighborhoods.length ? t('selectNeighborhood') : t('noNeighborhoodsOption')}
            />
          </div>
        </div>
        <div>
          <label className="label">{t('fieldAddress')}</label>
          <input className="input" value={form.address} onChange={(e) => set('address', e.target.value)} required />
        </div>
        <div>
          <label className="label mb-2">{t('fieldMapLocation')}</label>
          <LocationPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm((p) => ({ ...p, lat, lng }))} />
        </div>
      </div>

      {/* Original owner — private, admin-only */}
      <div className="card p-6 space-y-4 border-amber-300 bg-amber-50/60 dark:border-amber-700/50 dark:bg-amber-950/20">
        <div>
          <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" /> {t('ownerContactHeading')}
          </h2>
          <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">{t('ownerContactPrivateNote')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('ownerNameLabel')}</label>
            <input className="input" value={owner.name} onChange={(e) => setOwner((p) => ({ ...p, name: e.target.value }))} autoComplete="off" />
          </div>
          <div>
            <label className="label">{t('ownerPhoneLabel')}</label>
            <input className="input" value={owner.phone} onChange={(e) => setOwner((p) => ({ ...p, phone: e.target.value }))} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">{t('ownerEmailLabel')}</label>
            <input type="email" className="input" value={owner.email} onChange={(e) => setOwner((p) => ({ ...p, email: e.target.value }))} autoComplete="off" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">{t('ownerNotesLabel')}</label>
            <textarea rows={3} className="input resize-none" placeholder={t('ownerNotesPlaceholder')} value={owner.notes} onChange={(e) => setOwner((p) => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Agent managing this listing */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('fieldAgent')}</h2>
        <Select
          value={form.agentId || NO_AGENT}
          onValueChange={(v) => set('agentId', v === NO_AGENT ? '' : v)}
          options={[
            { value: NO_AGENT, label: t('noAgentOption') },
            ...agents.map((a: any) => ({ value: a.id, label: `${a.user.firstName} ${a.user.lastName}` })),
          ]}
        />
      </div>

      {/* Images */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">{t('formPhotos')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, i) => (
            <div key={img.id || img.url} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 badge bg-primary-600 text-white text-[10px] flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-current" /> {t('coverBadge')}
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
            <span className="text-xs">{t('uploadAction')}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        <p className="text-xs text-neutral-500">{t('photosHelp')}</p>
      </div>

      {/* Featured */}
      <div className="card p-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-600" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">{t('featureOnHomepage')}</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary btn-lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEdit ? t('saveChanges') : t('createListing')}
        </button>
        <button type="button" onClick={() => router.push('/admin/listings')} className="btn-secondary btn-lg">
          {t('cancelAction')}
        </button>
      </div>
    </form>
  );
}
