import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/Toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Kosovo Real Estate — Buy, Sell & Rent Properties',
    template: '%s | Kosovo Real Estate',
  },
  description: 'Find your perfect property in Kosovo. Browse thousands of verified apartments, houses, villas, and commercial properties across all municipalities.',
  keywords: ['Kosovo real estate', 'property Kosovo', 'apartments Prishtinë', 'houses for sale Kosovo'],
  openGraph: {
    type: 'website',
    locale: 'sq_AL',
    siteName: 'Kosovo Real Estate',
    title: 'Kosovo Real Estate — Buy, Sell & Rent Properties',
    description: 'Find your perfect property in Kosovo.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="sq"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-sans antialiased bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
