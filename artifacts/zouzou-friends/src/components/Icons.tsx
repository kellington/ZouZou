import type { SVGProps } from 'react';
import type { Critter } from '../lib/critters';

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

export const DogIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M20 30 Q4 46 9 68 Q15 86 30 79 Q23 58 27 37 Z M80 30 Q96 46 91 68 Q85 86 70 79 Q77 58 73 37 Z" fill="currentColor" />
    <path d="M14 56 Q14 30 50 25 Q86 30 86 56 L93 62 L85 68 Q83 83 67 89 Q50 95 33 89 Q17 83 15 68 L7 62 Z" fill="currentColor" />
    <path d="M22 34 L24 62 L33 45 Z M78 34 L76 62 L67 45 Z" fill="#d5a6a6" opacity="0.9" />
    <ellipse cx="50" cy="68" rx="19" ry="15" fill="#e4e8ec" opacity="0.92" />
    <ellipse cx="35" cy="50" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="65" cy="50" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="35" cy="51" rx="2.5" ry="5" fill="#39434c" />
    <ellipse cx="65" cy="51" rx="2.5" ry="5" fill="#39434c" />
    <ellipse cx="50" cy="63" rx="6" ry="4.5" fill="#7d4f57" />
    <path d="M50 67 Q50 72 44 74 M50 67 Q50 72 56 74" stroke="#39434c" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const DinoIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M30 32 L34 15 L40 32 Z M45 29 L50 10 L55 29 Z M60 32 L66 15 L70 32 Z" fill="currentColor" />
    <path d="M13 58 Q13 33 50 29 Q87 33 87 58 L94 64 L86 70 Q84 85 68 90 Q50 96 32 90 Q16 85 14 70 L6 64 Z" fill="currentColor" />
    <ellipse cx="50" cy="70" rx="20" ry="15" fill="#e4e8ec" opacity="0.92" />
    <ellipse cx="34" cy="52" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="66" cy="52" rx="7" ry="8" fill="#c7a84b" />
    <ellipse cx="34" cy="53" rx="1.6" ry="5" fill="#39434c" />
    <ellipse cx="66" cy="53" rx="1.6" ry="5" fill="#39434c" />
    <ellipse cx="44" cy="68" rx="2.2" ry="3" fill="#39434c" />
    <ellipse cx="56" cy="68" rx="2.2" ry="3" fill="#39434c" />
    <path d="M38 78 Q50 84 62 78" stroke="#39434c" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

export const MonkeyIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="18" cy="46" r="15" fill="currentColor" />
    <circle cx="82" cy="46" r="15" fill="currentColor" />
    <path d="M15 58 Q15 32 50 27 Q85 32 85 58 L92 64 L84 70 Q82 85 66 90 Q50 96 34 90 Q18 85 16 70 L8 64 Z" fill="currentColor" />
    <circle cx="18" cy="46" r="8.5" fill="#d5a6a6" opacity="0.9" />
    <circle cx="82" cy="46" r="8.5" fill="#d5a6a6" opacity="0.9" />
    <ellipse cx="50" cy="66" rx="27" ry="25" fill="#e4e8ec" opacity="0.92" />
    <ellipse cx="38" cy="54" rx="6.5" ry="7.5" fill="#c7a84b" />
    <ellipse cx="62" cy="54" rx="6.5" ry="7.5" fill="#c7a84b" />
    <ellipse cx="38" cy="55" rx="2.3" ry="4.5" fill="#39434c" />
    <ellipse cx="62" cy="55" rx="2.3" ry="4.5" fill="#39434c" />
    <ellipse cx="44" cy="70" rx="2" ry="2.6" fill="#7d4f57" />
    <ellipse cx="56" cy="70" rx="2" ry="2.6" fill="#7d4f57" />
    <path d="M50 74 Q46 80 40 79 M50 74 Q54 80 60 79" stroke="#39434c" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const CRITTER_ICON_COMPONENTS: Record<Critter, typeof CatIcon> = {
  cat: CatIcon,
  dog: DogIcon,
  dino: DinoIcon,
  monkey: MonkeyIcon,
};

export const CritterIcon = ({
  critter,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { critter: Critter }) => {
  const Icon = CRITTER_ICON_COMPONENTS[critter] ?? CatIcon;
  return <Icon className={className} {...props} />;
};

export const PawIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="30" cy="35" r="10" />
    <circle cx="50" cy="22" r="11" />
    <circle cx="70" cy="35" r="10" />
    <path d="M 25 65 Q 50 45 75 65 Q 85 85 50 90 Q 15 85 25 65 Z" />
  </svg>
);

// Broader pad, four claw-tipped toes — visibly different from the cat's round paw.
export const DogPawIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="20" cy="42" r="9" />
    <circle cx="38" cy="27" r="9.5" />
    <circle cx="62" cy="27" r="9.5" />
    <circle cx="80" cy="42" r="9" />
    <path d="M 22 68 Q 50 48 78 68 Q 90 88 50 94 Q 10 88 22 68 Z" />
    <path d="M14 39 L19 29 M35 21 L37 10 M65 21 L63 10 M86 39 L81 29" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

// Three-toed bird-like track, converging at a heel point.
export const DinoFootIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M50 88 Q46 60 47 40 Q48 27 50 20 Q52 27 53 40 Q54 60 50 88 Z" />
    <path d="M50 88 Q34 66 24 48 Q17 37 21 31 Q27 28 34 39 Q42 58 50 88 Z" />
    <path d="M50 88 Q66 66 76 48 Q83 37 79 31 Q73 28 66 39 Q58 58 50 88 Z" />
    <circle cx="50" cy="86" r="6" />
  </svg>
);

// A small handprint: palm plus thumb and four fingers.
export const MonkeyHandIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="50" cy="64" rx="25" ry="21" />
    <ellipse cx="22" cy="46" rx="7" ry="12" transform="rotate(-25 22 46)" />
    <ellipse cx="34" cy="23" rx="6" ry="13" />
    <ellipse cx="49" cy="17" rx="6.5" ry="14" />
    <ellipse cx="64" cy="23" rx="6" ry="13" />
    <ellipse cx="77" cy="38" rx="6" ry="11" transform="rotate(25 77 38)" />
  </svg>
);

const CRITTER_MARK_ICON_COMPONENTS: Record<Critter, typeof PawIcon> = {
  cat: PawIcon,
  dog: DogPawIcon,
  dino: DinoFootIcon,
  monkey: MonkeyHandIcon,
};

export const CritterMarkIcon = ({
  critter,
  className,
  ...props
}: SVGProps<SVGSVGElement> & { critter: Critter }) => {
  const Icon = CRITTER_MARK_ICON_COMPONENTS[critter] ?? PawIcon;
  return <Icon className={className} {...props} />;
};

export const HeartIcon = ({ className, filled = true, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
