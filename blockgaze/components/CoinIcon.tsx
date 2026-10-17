import Image from "next/image";

export function CoinIcon({ src, name, size = 28 }: { src: string; name: string; size?: number }) {
  if (!src) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center rounded-full bg-line text-xs font-semibold text-muted"
      >
        {name.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  // Decorative: the coin name is always rendered as text next to the logo.
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className="shrink-0 rounded-full"
    />
  );
}
