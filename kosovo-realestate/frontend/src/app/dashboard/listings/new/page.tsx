'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, Upload, X } from 'lucide-react';
import { listingApi, uploadApi } from '@/lib/api';
import { PROPERTY_TYPES, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';

const STEPS = ['Basic Info', 'Location', 'Details', 'Photos', 'Review'];

const FEATURES = [
  { key: 'hasGarden', label: 'Garden' }, { key: 'hasPool', label: 'Pool' },
  { key: 'hasBalcony', label: 'Balcony' }, { key: 'hasTerrace', label: 'Terrace' },
  { key: 'hasElevator', label: 'Elevator' }, { key: 'hasSecurity', label: 'Security' },
  { key: 'hasAirCon', label: 'Air Conditioning' }, { key: 'hasHeating', label: 'Heating' },
  { key: 'hasFurnished', label: 'Furnished' }, { key: 'hasStorage', label: 'Storage Room' },
];

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; publicId: string; isCover: boolean }[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', listingType: 'SALE', propertyType: 'APARTMENT',
    price: '', priceNegotiable: false, currency: 'EUR',
    address: '', cityId: '', neighborhoodId: '',
    area: '', bedrooms: '', bathrooms: '', floor: '', totalFloors: '', yearBuilt: '', parkingSpaces: '0', garageSpaces: '0',
    hasGarden: false, hasPool: false, hasBalcony: false, hasTerrace: false,
    hasElevator: false, hasSecurity: false, hasAirCon: false, hasHeating: false,
    hasFurnished: false, hasStorage: false,
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const { data } = await uploadApi.uploadImages(files);
      const newImgs = data.images.map((img: any, i: number) => ({ ...img, isCover: uploadedImages.length === 0 && i === 0 }));
      setUploadedImages(p => [...p, ...newImgs]);
      toast('Images uploaded', 'success');
    } catch { toast('Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        area: Number(form.area),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        floor: form.floor ? Number(form.floor) : undefined,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : undefined,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        parkingSpaces: Number(form.parkingSpaces),
        garageSpaces: Number(form.garageSpaces),
        images: uploadedImages,
      };
      await listingApi.create(payload);
      toast('Listing submitted for review!', 'success');
      router.push('/dashboard/listings');
    } catch (err: any) {
      toast(err?.response?.data?.error || 'Submission failed', 'error');
    } finally { setSubmitting(false); }
  };

  const canNext = [
    form.title && form.description && form.listingType && form.propertyType && form.price,
    form.address && form.cityId,
    form.area,
    true,
    true,
  ][step];

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-neutral-900 dark:text-white mb-2">Post a new listing</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mb-8">Fill in the details about your property</p>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              i < step ? 'bg-primary-600 text-white' : i === step ? 'bg-primary-600 text-white ring-4 ring-primary-100 dark:ring-primary-950' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500')}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-400')}>{s}</span>
            {i < STEPS.length - 1 && <div className={cn('w-8 h-0.5 rounded', i < step ? 'bg-primary-600' : 'bg-neutral-200 dark:bg-neutral-700')} />}
          </div>
        ))}
      </div>

      <div className="card p-6 mb-6">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Basic information</h2>
            <div>
              <label className="label">Title *</label>
              <input className="input" placeholder="e.g. Modern 2-bedroom apartment in Dardania" value={form.title} onChange={e=>set('title',e.target.value)} maxLength={200} />
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea className="input min-h-[120px]" rows={5} placeholder="Describe the property in detail..." value={form.description} onChange={e=>set('description',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Listing type *</label>
                <div className="flex gap-2">
                  {[{v:'SALE',l:'For Sale'},{v:'RENT',l:'For Rent'}].map(opt=>(
                    <button key={opt.v} type="button" onClick={()=>set('listingType',opt.v)}
                      className={cn('flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors', form.listingType===opt.v?'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400':'border-neutral-200 dark:border-neutral-600 text-neutral-600 dark:text-neutral-300')}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Property type *</label>
                <select className="input" value={form.propertyType} onChange={e=>set('propertyType',e.target.value)}>
                  {PROPERTY_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Price ({form.currency}) *</label>
                <input type="number" className="input" placeholder="85000" value={form.price} onChange={e=>set('price',e.target.value)} min={0} />
              </div>
              <div>
                <label className="label">Currency</label>
                <select className="input" value={form.currency} onChange={e=>set('currency',e.target.value)}>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.priceNegotiable} onChange={e=>set('priceNegotiable',e.target.checked)} className="w-4 h-4 rounded border-neutral-300 text-primary-600" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">Price is negotiable</span>
            </label>
          </div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Location</h2>
            <div>
              <label className="label">Address *</label>
              <input className="input" placeholder="Street, number, building" value={form.address} onChange={e=>set('address',e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City *</label>
                <input className="input" placeholder="e.g. Prishtinë" value={form.cityId} onChange={e=>set('cityId',e.target.value)} />
                <p className="text-xs text-neutral-400 mt-1">Enter city name — will match to database</p>
              </div>
              <div>
                <label className="label">Neighborhood</label>
                <input className="input" placeholder="e.g. Dardania" value={form.neighborhoodId} onChange={e=>set('neighborhoodId',e.target.value)} />
              </div>
            </div>
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-xl h-56 flex items-center justify-center">
              <p className="text-sm text-neutral-500">Interactive map will appear here (Google Maps API)</p>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Property details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><label className="label">Area (m²) *</label><input type="number" className="input" placeholder="80" value={form.area} onChange={e=>set('area',e.target.value)} /></div>
              <div><label className="label">Bedrooms</label><input type="number" className="input" placeholder="2" value={form.bedrooms} onChange={e=>set('bedrooms',e.target.value)} /></div>
              <div><label className="label">Bathrooms</label><input type="number" className="input" placeholder="1" value={form.bathrooms} onChange={e=>set('bathrooms',e.target.value)} /></div>
              <div><label className="label">Floor</label><input type="number" className="input" placeholder="3" value={form.floor} onChange={e=>set('floor',e.target.value)} /></div>
              <div><label className="label">Total floors</label><input type="number" className="input" placeholder="8" value={form.totalFloors} onChange={e=>set('totalFloors',e.target.value)} /></div>
              <div><label className="label">Year built</label><input type="number" className="input" placeholder="2020" value={form.yearBuilt} onChange={e=>set('yearBuilt',e.target.value)} /></div>
              <div><label className="label">Parking spaces</label><input type="number" className="input" placeholder="1" value={form.parkingSpaces} onChange={e=>set('parkingSpaces',e.target.value)} /></div>
              <div><label className="label">Garage spaces</label><input type="number" className="input" placeholder="0" value={form.garageSpaces} onChange={e=>set('garageSpaces',e.target.value)} /></div>
            </div>
            <div>
              <label className="label mb-3">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FEATURES.map(f=>(
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={(form as any)[f.key]} onChange={e=>set(f.key,e.target.checked)} className="w-4 h-4 rounded border-neutral-300 text-primary-600" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Photos</h2>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-neutral-50 dark:bg-neutral-700/30">
              <Upload className="w-8 h-8 text-neutral-400 mb-2" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Click to upload photos</span>
              <span className="text-xs text-neutral-400 mt-1">JPG, PNG, WEBP — max 10MB each</span>
              {uploading && <span className="text-xs text-primary-600 mt-2">Uploading...</span>}
              <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageUpload} disabled={uploading} />
            </label>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {uploadedImages.map((img, i) => (
                  <div key={img.publicId} className="relative group">
                    <img src={img.url} alt={`Upload ${i+1}`} className="w-full h-24 object-cover rounded-lg" />
                    {img.isCover && <span className="absolute top-1 left-1 badge bg-primary-600 text-white text-[10px]">Cover</span>}
                    <button
                      onClick={()=>setUploadedImages(p=>p.filter((_,j)=>j!==i))}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white">Review & submit</h2>
            <div className="space-y-3 text-sm">
              {[
                ['Title', form.title],
                ['Type', `${form.listingType} · ${form.propertyType}`],
                ['Price', `€${Number(form.price).toLocaleString()}${form.priceNegotiable?' (negotiable)':''}`],
                ['Location', `${form.address}${form.cityId ? ', '+form.cityId : ''}`],
                ['Area', `${form.area} m²`],
                ['Bedrooms / Bathrooms', `${form.bedrooms || '—'} / ${form.bathrooms || '—'}`],
                ['Photos', `${uploadedImages.length} uploaded`],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 py-3 border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                  <span className="text-neutral-500 dark:text-neutral-400 w-40 flex-shrink-0">{label}</span>
                  <span className="font-medium text-neutral-900 dark:text-white">{value || '—'}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-xl text-sm text-amber-800 dark:text-amber-300">
              Your listing will be reviewed by our team before going live. This usually takes 24-48 hours.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={()=>setStep(p=>p-1)} disabled={step===0} className="btn-secondary btn-md disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {step < STEPS.length - 1
          ? <button onClick={()=>setStep(p=>p+1)} disabled={!canNext} className="btn-primary btn-md disabled:opacity-40">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          : <button onClick={handleSubmit} disabled={submitting} className="btn-primary btn-md">
              {submitting ? 'Submitting...' : 'Submit listing'}
            </button>
        }
      </div>
    </div>
  );
}
