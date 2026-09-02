import type { SVGProps } from 'react';

export const CatIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14 42 L18 10 L36 25 Q50 20 64 25 L82 10 L86 42 Z" fill="currentColor" />
    <path d="M19 18 L21 34 L34 27 Z M81 18 L79 34 L66 27 Z" fill="#d5a6a6" opacity="0.9" />
    <path d="M12 51 Q12 31 31 25 Q50 18 69 25 Q88 31 88 51 L94 57 L86 63 Q84 78 70 84 Q50 93 30 84 Q16 78 14 63 L6 57 Z" fill="currentColor" />
    <path d="M24 68 Q30 58 40 61 Q50 65 60 61 Q70 58 76 68 Q70 82 50 84 Q30 82 24 68 Z" fill="#e4e8ec" opacity="0.92" />
    <ellipse cx="35" cy="48" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="65" cy="48" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="35" cy="49" rx="2.5" ry="5" fill="#39434c" />
    <ellipse cx="65" cy="49" rx="2.5" ry="5" fill="#39434c" />
    <path d="M46 63 Q50 67 54 63 L50 60 Z" fill="#7d4f57" />
    <path d="M50 66 Q46 72 40 71 M50 66 Q54 72 60 71" stroke="#39434c" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M28 65 L8 61 M29 69 L8 72 M72 65 L92 61 M71 69 L92 72" stroke="#e4e8ec" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
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
