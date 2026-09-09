'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  Bed, Bath, Maximize, Car, MapPin, Share2,
  ChevronLeft, ChevronRight, Phone, Mail, Calendar, Star,
  Home, Zap, Thermometer, CheckCircle, Building2, Eye, ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { listingApi } from '@/lib/api';
import { formatPrice, formatArea, formatRelativeDate, calculateMortgage, cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { useTranslation } from '@/lib/i18n/useTranslation';

function MortgageCalculator({ price }: { price: number }) {
  const { t } = useTranslation('propertyDetail');
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(20);
  const result = calculateMortgage(price, downPct, rate, years);

  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-5">{t('mortgageCalculator')}</h3>
      <div className="space-y-4">
        <div>
          <label className="label">{t('downPayment')} ({downPct}%)</label>
          <input type="range" min={5} max={50} value={downPct} onChange={e => setDownPct(+e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>5%</span><span>€{(price * downPct / 100).toLocaleString()}</span><span>50%</span></div>
        </div>
        <div>
          <label className="label">{t('interestRate')} ({rate}%)</label>
          <input type="range" min={1} max={15} step={0.1} value={rate} onChange={e => setRate(+e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>1%</span><span>15%</span></div>
        </div>
        <div>
          <label className="label">{t('loanTerm')} ({years} {t('yearsUnit')})</label>
          <input type="range" min={5} max={30} step={5} value={years} onChange={e => setYears(+e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-xs text-neutral-500 mt-1"><span>5{t('yearAbbrev')}</span><span>30{t('yearAbbrev')}</span></div>
        </div>
        <div className="bg-primary-50 dark:bg-primary-950 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-neutral-600 dark:text-neutral-400">{t('monthlyPayment')}</span><span className="font-bold text-primary-600 text-lg">€{Math.round(result.monthlyPayment).toLocaleString()}</span></div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400"><span>{t('loanAmount')}</span><span>€{Math.round(result.loanAmount).toLocaleString()}</span></div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400"><span>{t('totalInterest')}</span><span>€{Math.round(result.totalInterest).toLocaleString()}</span></div>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400"><span>{t('totalPayment')}</span><span>€{Math.round(result.totalPayment).toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({ images, title }: { images: any[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (!images.length) return null;

  return (
    <>
      <div className="relative">
        {/* Main image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer bg-neutral-100 dark:bg-neutral-800" onClick={() => setLightbox(true)}>
          <Image src={images[current]?.url} alt={title} fill className="object-cover" sizes="100vw" priority />
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-lg">
            {current + 1} / {images.length}
          </div>
          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-md">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={e => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-md">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setCurrent(i)} className={cn('flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all', i === current ? 'border-primary-600' : 'border-transparent hover:border-neutral-300')}>
                <Image src={img.url} alt={`${i + 1}`} width={80} height={56} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white"><span className="text-2xl">×</span></button>
          <button onClick={e => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative max-w-5xl w-full max-h-[90vh] aspect-video" onClick={e => e.stopPropagation()}>
            <Image src={images[current]?.url} alt={title} fill className="object-contain" />
          </div>
          <button onClick={e => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white">
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}

export default function PropertyDetailPage() {
  const { t, locale } = useTranslation('propertyDetail');
  const { t: tType } = useTranslation('propertyTypes');
  const { slug } = useParams<{ slug: string }>();
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: t('defaultInquiryMessage') });
  const [sending, setSending] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => listingApi.getBySlug(slug).then(r => r.data),
    enabled: !!slug,
  });

  const { data: similarData } = useQuery({
    queryKey: ['listings', 'similar', slug],
    queryFn: () => listingApi.getSimilar(slug).then(r => r.data),
    enabled: !!slug,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast(t('linkCopied'), 'success');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); toast(t('messageSentSuccess'), 'success'); }, 1000);
  };

  if (isLoading) return (
    <>
      <Navbar />
      <main className="pt-[72px] container-page py-8">
        <div className="skeleton aspect-[16/9] rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-40 w-full" />
          </div>
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </main>
    </>
  );

  if (!data?.listing) return (
    <>
      <Navbar />
      <main className="pt-[72px] container-page py-20 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">{t('propertyNotFound')}</h1>
        <Link href="/properties" className="btn-primary btn-md inline-flex"><ArrowLeft className="w-4 h-4" /> {t('backToListings')}</Link>
      </main>
    </>
  );

  const listing = data.listing;
  const agent = listing.agent;

  const SPECS = [
    { icon: Bed, label: t('bedrooms'), value: listing.bedrooms != null ? `${listing.bedrooms} ${t('bedroomsUnit')}` : null },
    { icon: Bath, label: t('bathrooms'), value: listing.bathrooms != null ? `${listing.bathrooms} ${t('bathroomsUnit')}` : null },
    { icon: Maximize, label: t('area'), value: formatArea(listing.area) },
    { icon: Building2, label: t('floor'), value: listing.floor != null ? `${t('floor')} ${listing.floor}${listing.totalFloors ? ` ${t('floorOf')} ${listing.totalFloors}` : ''}` : null },
    { icon: Car, label: t('parking'), value: listing.parkingSpaces > 0 ? `${listing.parkingSpaces} ${t('parkingSpaceUnit')}` : null },
    { icon: Home, label: t('yearBuilt'), value: listing.yearBuilt ? `${listing.yearBuilt}` : null },
    { icon: Thermometer, label: t('heating'), value: listing.heatingType ? listing.heatingType.replace('_', ' ') : null },
    { icon: Zap, label: t('energy'), value: listing.energyRating ? `${t('energyClassPrefix')} ${listing.energyRating.replace('_', '+')}` : null },
  ].filter(s => s.value);

  const FEATURES = [
    { key: 'hasGarden', label: t('featureGarden') },
    { key: 'hasPool', label: t('featurePool') },
    { key: 'hasBalcony', label: t('featureBalcony') },
    { key: 'hasTerrace', label: t('featureTerrace') },
    { key: 'hasElevator', label: t('featureElevator') },
    { key: 'hasSecurity', label: t('featureSecurity') },
    { key: 'hasAirCon', label: t('featureAirCon') },
    { key: 'hasHeating', label: t('heating') },
    { key: 'hasFurnished', label: t('featureFurnished') },
    { key: 'hasStorage', label: t('featureStorage') },
  ].filter(f => (listing as any)[f.key]);

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="container-page py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
            <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300">{t('home')}</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-neutral-700 dark:hover:text-neutral-300">{t('properties')}</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white line-clamp-1">{listing.title}</span>
          </nav>

          <div className="mb-6">
            <ImageGallery images={listing.images} title={listing.title} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex gap-2 mb-3">
                      <span className={cn('badge', listing.listingType === 'SALE' ? 'bg-primary-600 text-white' : 'bg-secondary-600 text-white')}>
                        {tType(listing.listingType)}
                      </span>
                      <span className="badge-gray">{tType(listing.propertyType)}</span>
                      {listing.isFeatured && <span className="badge bg-amber-500 text-white">{tType('FEATURED')}</span>}
                    </div>
                    <h1 className="font-display font-bold text-2xl lg:text-3xl text-neutral-900 dark:text-white mb-2">{listing.title}</h1>
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{listing.neighborhood?.name ? `${listing.neighborhood.name}, ` : ''}{listing.city.name} — {listing.address}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-3xl text-primary-600 dark:text-primary-400">
                      {formatPrice(listing.price, listing.currency, listing.listingType)}
                    </div>
                    {listing.priceNegotiable && <p className="text-xs text-neutral-500 mt-0.5">{t('priceNegotiable')}</p>}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-6 py-4 border-y border-primary-100 dark:border-primary-900/40">
                  {listing.bedrooms != null && (
                    <div className="flex items-center gap-2"><Bed className="w-5 h-5 text-primary-500 dark:text-primary-400" /><span className="text-sm text-neutral-700 dark:text-neutral-300"><strong>{listing.bedrooms}</strong> {t('bedrooms')}</span></div>
                  )}
                  {listing.bathrooms != null && (
                    <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-primary-500 dark:text-primary-400" /><span className="text-sm text-neutral-700 dark:text-neutral-300"><strong>{listing.bathrooms}</strong> {t('bathrooms')}</span></div>
                  )}
                  <div className="flex items-center gap-2"><Maximize className="w-5 h-5 text-primary-500 dark:text-primary-400" /><span className="text-sm text-neutral-700 dark:text-neutral-300"><strong>{formatArea(listing.area)}</strong></span></div>
                  <div className="flex items-center gap-1.5 ml-auto"><Eye className="w-4 h-4 text-neutral-400" /><span className="text-sm text-neutral-500">{listing.viewCount} {t('views')}</span></div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={handleShare} className="btn btn-secondary btn-sm"><Share2 className="w-4 h-4" /> {t('share')}</button>
                    <button onClick={() => window.print()} className="btn btn-secondary btn-sm hidden sm:flex">{t('print')}</button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-4">{t('description')}</h2>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Property Details */}
              <div className="card p-6">
                <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-5">{t('propertyDetails')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {SPECS.map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div key={spec.label} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/40">
                        <Icon className="w-4 h-4 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{spec.label}</p>
                          <p className="text-sm font-medium text-neutral-900 dark:text-white">{spec.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              {FEATURES.length > 0 && (
                <div className="card p-6">
                  <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-5">{t('featuresAmenities')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {FEATURES.map((f) => (
                      <div key={f.key} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <CheckCircle className="w-4 h-4 text-secondary-500 flex-shrink-0" /> {f.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="card p-6">
                <h2 className="font-display font-semibold text-xl text-neutral-900 dark:text-white mb-4">{t('location')}</h2>
                {listing.lat && listing.lng ? (
                  <div className="rounded-xl overflow-hidden h-64 border border-primary-100 dark:border-primary-900/40">
                    <iframe
                      title={t('propertyLocationTitle')}
                      className="w-full h-full border-0"
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.lng - 0.01}%2C${listing.lat - 0.01}%2C${listing.lng + 0.01}%2C${listing.lat + 0.01}&layer=mapnik&marker=${listing.lat}%2C${listing.lng}`}
                    />
                  </div>
                ) : (
                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-xl h-64 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary-400" />
                  </div>
                )}
                <p className="text-sm text-neutral-500 mt-2">{listing.address}, {listing.city.name}</p>
              </div>

              {/* Mortgage Calculator */}
              <MortgageCalculator price={listing.price} />
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-6">
              {/* Agent card */}
              {agent && (
                <div className="card p-6">
                  <h3 className="font-display font-semibold text-neutral-900 dark:text-white mb-4">{t('listedBy')}</h3>
                  <Link href={`/agents/${agent.id}`} className="flex items-center gap-3 mb-4 group">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
                      {agent.user.avatar
                        ? <img src={agent.user.avatar} alt={agent.user.firstName} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-neutral-500 font-semibold">{agent.user.firstName[0]}</div>
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                        {agent.user.firstName} {agent.user.lastName}
                      </p>
                      {agent.agency && <p className="text-xs text-neutral-500">{agent.agency.name}</p>}
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{agent.rating} ({agent.reviewCount} {t('reviews')})</span>
                      </div>
                    </div>
                  </Link>

                  <div className="space-y-2 mb-5">
                    {agent.user.phone && (
                      <a href={`tel:${agent.user.phone}`} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                        <Phone className="w-4 h-4 text-neutral-400" /> {agent.user.phone}
                      </a>
                    )}
                    <a href={`mailto:${agent.user.email}`} className="flex items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 transition-colors">
                      <Mail className="w-4 h-4 text-neutral-400" /> {agent.user.email}
                    </a>
                  </div>

                  {/* Contact form */}
                  <form onSubmit={handleSendMessage} className="space-y-3">
                    <input type="text" placeholder={t('yourName')} value={contactForm.name} onChange={e => setContactForm(p => ({...p, name: e.target.value}))} className="input" required />
                    <input type="email" placeholder={t('yourEmail')} value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} className="input" required />
                    <input type="tel" placeholder={t('yourPhone')} value={contactForm.phone} onChange={e => setContactForm(p => ({...p, phone: e.target.value}))} className="input" />
                    <textarea rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} className="input resize-none" />
                    <button type="submit" disabled={sending} className="btn-primary btn-md w-full">
                      <Mail className="w-4 h-4" /> {sending ? t('sending') : t('sendMessage')}
                    </button>
                    <button type="button" className="btn-secondary btn-md w-full">
                      <Calendar className="w-4 h-4" /> {t('bookViewing')}
                    </button>
                  </form>
                </div>
              )}

              {/* Price per m² */}
              <div className="card p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">{t('pricePerSqm')}</p>
                    <p className="font-display font-bold text-xl text-neutral-900 dark:text-white">€{Math.round(listing.price / listing.area).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">{t('published')}</p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">{listing.publishedAt ? formatRelativeDate(listing.publishedAt, locale) : t('recently')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">{t('id')}</p>
                    <p className="text-sm font-mono text-neutral-700 dark:text-neutral-300">#{listing.id.slice(-6).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar properties */}
          {similarData?.listings?.length > 0 && (
            <div className="mt-16">
              <h2 className="section-heading text-2xl mb-6">{t('similarProperties')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarData.listings.map((l: any) => <PropertyCard key={l.id} listing={l} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
