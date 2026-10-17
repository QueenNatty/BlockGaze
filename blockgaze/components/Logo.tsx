export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="6" className="fill-accent" />
      <circle cx="16" cy="16" r="8" fill="none" strokeWidth="2.5" className="stroke-on-accent" />
      <circle cx="18.5" cy="14" r="3" className="fill-on-accent" />
    </svg>
  );
}
