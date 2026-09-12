'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

const WHATSAPP_NUMBER = '38345400807'; // +383 45 400 807, same number used in the Footer

export default function WhatsAppButton() {
  const { t } = useTranslation('whatsapp');
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('defaultMessage'))}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('chatOnWhatsApp')}
      title={t('chatOnWhatsApp')}
      className="fixed top-1/2 -translate-y-1/2 right-5 z-[90] w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center"
    >
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.673 4.523 1.838 6.37L4 29l7.828-1.808A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.75a9.7 9.7 0 0 1-4.95-1.356l-.355-.21-4.646 1.073 1.086-4.53-.232-.372A9.71 9.71 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.76 9.07 26.76 15 21.934 24.75 16.004 24.75z" />
        <path d="M21.62 17.507c-.306-.153-1.81-.893-2.09-.995-.28-.102-.484-.153-.688.153-.204.306-.79.995-.968 1.199-.178.204-.357.23-.663.077-.306-.153-1.292-.476-2.462-1.518-.91-.812-1.524-1.815-1.703-2.121-.178-.306-.019-.472.134-.624.138-.137.306-.357.459-.535.153-.178.204-.306.306-.51.102-.204.051-.383-.026-.535-.077-.153-.688-1.66-.943-2.273-.248-.596-.5-.516-.688-.526l-.586-.01c-.204 0-.535.077-.815.383-.28.306-1.07 1.046-1.07 2.55s1.096 2.958 1.249 3.163c.153.204 2.157 3.294 5.228 4.62.73.315 1.3.503 1.744.644.733.233 1.4.2 1.928.121.588-.088 1.81-.74 2.065-1.454.255-.714.255-1.326.178-1.454-.076-.128-.28-.204-.586-.357z" />
      </svg>
    </a>
  );
}
