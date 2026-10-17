import Link from "next/link";
import { LogoMark } from "./Logo";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-2 text-lg font-semibold tracking-tight">
          <LogoMark />
          BlockGaze
        </Link>
        <Nav />
      </div>
    </header>
  );
}
