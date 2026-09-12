'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TermsPage() {
  const { t } = useTranslation('staticPages');

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="container-page py-16 max-w-3xl">
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2">{t('termsTitle')}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-10">{t('lastUpdated')}: January 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Using the Site</h2>
              <p>Molla Real Estate lets you browse property listings and submit properties or inquiries for our team to review. By using the site, you agree to provide accurate information and not to misuse the submission forms (for example, by sending spam or unlawful content).</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Listings</h2>
              <p>Property listings are provided for informational purposes. While we review submissions before publishing, we do not guarantee the accuracy of prices, availability, or details supplied by submitters. Always verify details directly with the listed agent before making decisions.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">No Warranty</h2>
              <p>The site is provided &quot;as is&quot; without warranties of any kind. We are not liable for any transactions, agreements, or disputes arising between buyers, sellers, or agents connected through the platform.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Changes</h2>
              <p>We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Contact</h2>
              <p>Questions about these terms can be sent to realestatemolla@gmail.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
