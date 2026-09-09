'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function PrivacyPage() {
  const { t } = useTranslation('staticPages');

  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        <div className="container-page py-16 max-w-3xl">
          <h1 className="font-display font-bold text-3xl text-neutral-900 dark:text-white mb-2">{t('privacyTitle')}</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-10">{t('lastUpdated')}: January 2026</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Information We Collect</h2>
              <p>When you use Molla Real Estate, we collect information you provide directly, such as your name, email, and phone number when you submit a property, contact us, or create an account as a site administrator. We also collect basic usage data (pages visited, browser type) to help us improve the platform.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">How We Use It</h2>
              <p>We use the information you provide to respond to property submissions and contact requests, operate and improve the site, and communicate with you about your inquiries. We do not sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Data Sharing</h2>
              <p>Information submitted through our forms is shared only with our team for the purpose of responding to your inquiry. We may use third-party services (such as email delivery providers) solely to operate the platform.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Your Rights</h2>
              <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at info@kosovorealestate.com.</p>
            </section>
            <section>
              <h2 className="font-display font-semibold text-lg text-neutral-900 dark:text-white mb-2">Contact</h2>
              <p>Questions about this policy can be sent to info@kosovorealestate.com.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
