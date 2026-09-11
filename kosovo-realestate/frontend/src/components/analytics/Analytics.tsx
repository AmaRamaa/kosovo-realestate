'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { analyticsApi } from '@/lib/api';
import { getCookie, setCookie } from '@/lib/utils';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const VISITOR_COOKIE = 'visitor_id';
const ONE_YEAR = 60 * 60 * 24 * 365;

function getVisitorId(): string {
  let id = getCookie(VISITOR_COOKIE);
  if (!id) {
    id = crypto.randomUUID();
    setCookie(VISITOR_COOKIE, id, ONE_YEAR);
  }
  return id;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const visitorId = getVisitorId();
    analyticsApi.track(pathname, visitorId).catch(() => {});

    if (GA_ID && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', { page_path: pathname });
    }
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
          window.gtag = gtag;
        `}
      </Script>
    </>
  );
}
