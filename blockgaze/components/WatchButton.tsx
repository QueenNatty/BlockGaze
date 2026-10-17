import { cn } from "@/lib/cn";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8 6.8 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z"
        strokeWidth="1.8"
        strokeLinejoin="round"
        className={cn("stroke-current", filled ? "fill-current" : "fill-none")}
      />
    </svg>
  );
}

/** Icon-only toggle used in table rows. */
export function WatchIconButton({ name, watched, onToggle }: { name: string; watched: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={watched}
      aria-label={watched ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-md hover:bg-ink/5",
        watched ? "text-accent" : "text-muted",
      )}
    >
      <Star filled={watched} />
    </button>
  );
}

/** Text button used as the main action on a coin page. */
export function WatchTextButton({ name, watched, onToggle }: { name: string; watched: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={watched}
      aria-label={watched ? `Remove ${name} from watchlist` : `Add ${name} to watchlist`}
      className={watched ? "btn-quiet" : "btn-primary"}
    >
      <Star filled={watched} />
      {watched ? "On your watchlist" : "Add to watchlist"}
    </button>
  );
}
