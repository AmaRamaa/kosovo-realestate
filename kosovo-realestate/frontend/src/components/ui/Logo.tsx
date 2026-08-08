import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Kosovo Real Estate"
      className={cn('inline-block bg-current flex-shrink-0', className)}
      style={{
        WebkitMaskImage: "url('/images/molla-logo-white.png')",
        maskImage: "url('/images/molla-logo-white.png')",
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
        aspectRatio: '808 / 302',
      }}
    />
  );
}
