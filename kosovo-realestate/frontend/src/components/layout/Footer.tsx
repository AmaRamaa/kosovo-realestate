import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const FOOTER_LINKS = {
  'Buy': [
    { label: 'Apartments for Sale', href: '/properties?listingType=SALE&propertyType=APARTMENT' },
    { label: 'Houses for Sale', href: '/properties?listingType=SALE&propertyType=HOUSE' },
    { label: 'Villas', href: '/properties?listingType=SALE&propertyType=VILLA' },
    { label: 'Land', href: '/properties?listingType=SALE&propertyType=LAND' },
    { label: 'Commercial', href: '/properties?listingType=SALE&propertyType=COMMERCIAL' },
  ],
  'Rent': [
    { label: 'Apartments for Rent', href: '/properties?listingType=RENT&propertyType=APARTMENT' },
    { label: 'Houses for Rent', href: '/properties?listingType=RENT&propertyType=HOUSE' },
    { label: 'Studios', href: '/properties?listingType=RENT&propertyType=STUDIO' },
    { label: 'Offices', href: '/properties?listingType=RENT&propertyType=OFFICE' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'List Your Property', href: '/list-your-property' },
    { label: 'Agents', href: '/agents' },
    { label: 'Agencies', href: '/agencies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  'Resources': [
    { label: 'Buying Guide', href: '/blog?category=buying-guide' },
    { label: 'Selling Guide', href: '/blog?category=selling-guide' },
    { label: 'Mortgage Calculator', href: '/tools/mortgage-calculator' },
    { label: 'Market Reports', href: '/blog?category=market-analysis' },
  ],
};

const CITIES = ['Prishtinë', 'Prizren', 'Pejë', 'Gjilan', 'Ferizaj', 'Mitrovicë', 'Gjakovë', 'Podujevë'];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-8">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-neutral-800">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <Logo className="h-9 text-white" />
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-xs">
              The most trusted platform to buy, sell, and rent properties across all 38 municipalities of Kosovo.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-neutral-400">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                Rr. Nënë Tereza, Prishtinë, Kosovo
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                +383 38 123 456
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                info@kosovorealestate.com
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-white mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-neutral-400 hover:text-primary-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Cities */}
        <div className="py-6 border-b border-neutral-800">
          <h4 className="font-display font-semibold text-white mb-3 text-sm">Popular Cities</h4>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <Link
                key={city}
                href={`/properties?city=${city}`}
                className="px-3 py-1.5 rounded-full bg-neutral-800 text-xs text-neutral-300 hover:bg-primary-600 hover:text-white transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Kosovo Real Estate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-300">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-300">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Icon className="w-4 h-4 text-neutral-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
