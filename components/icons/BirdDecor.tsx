interface IconProps {
  className?: string;
}

export function BirdSilhouette({ className = "h-16 w-16 text-primary" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="currentColor" aria-hidden>
      <path d="M32 8c-6 0-11 4-12 10-8 2-14 8-14 16 0 4 2 8 5 10-3 4-5 9-5 14 0 8 6 14 14 14h4c8 0 14-6 14-14 0-5-2-10-5-14 3-2 5-6 5-10 0-8-6-14-14-16 1-6 6-10 12-10z" />
      <circle cx="26" cy="28" r="2" fill="white" opacity="0.8" />
      <circle cx="38" cy="28" r="2" fill="white" opacity="0.8" />
    </svg>
  );
}

export function Footprints({ className = "h-8 w-8 text-fields" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 24" fill="currentColor" aria-hidden>
      <ellipse cx="8" cy="12" rx="4" ry="5" transform="rotate(-20 8 12)" />
      <ellipse cx="18" cy="8" rx="3" ry="4" transform="rotate(10 18 8)" />
      <ellipse cx="28" cy="14" rx="4" ry="5" transform="rotate(-15 28 14)" />
      <ellipse cx="38" cy="10" rx="3" ry="4" transform="rotate(5 38 10)" />
    </svg>
  );
}

export function Feather({ className = "h-6 w-6 text-primary" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4c-6 2-10 6-12 12-1 3-2 5-4 6-2-4-1-8 2-12 4 2-6 6-10 10-12 2-2 4-2 6 0 2 2 4 4 4z" />
    </svg>
  );
}
