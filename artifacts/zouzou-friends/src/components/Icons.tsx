import type { SVGProps } from 'react';

export const CatIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M15 40 L20 15 L45 30 Z" fill="currentColor" />
    <path d="M85 40 L80 15 L55 30 Z" fill="currentColor" />
    <rect x="15" y="25" width="70" height="60" rx="30" fill="currentColor"/>
    <circle cx="35" cy="50" r="6" fill="var(--background, #FFF)"/>
    <circle cx="65" cy="50" r="6" fill="var(--background, #FFF)"/>
    <path d="M45 62 Q50 68 55 62" stroke="var(--background, #FFF)" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <path d="M50 56 L48 53 L52 53 Z" fill="var(--background, #FFF)"/>
  </svg>
);

export const PawIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="30" cy="35" r="10" />
    <circle cx="50" cy="22" r="11" />
    <circle cx="70" cy="35" r="10" />
    <path d="M 25 65 Q 50 45 75 65 Q 85 85 50 90 Q 15 85 25 65 Z" />
  </svg>
);

export const HeartIcon = ({ className, filled = true, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
