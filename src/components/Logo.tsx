import Link from "next/link";
import Image from "next/image";
import { siteContent } from "@/lib/content";

/**
 * Hummingbird mark + wordmark.
 * The mark lives at /public/logo-mark.svg — replace that file to swap the art
 * (keep the same viewBox / aspect ratio for a clean drop-in).
 */
export default function Logo({
  withWordmark = true,
  size = 30,
}: {
  /** Show the "humming bird" wordmark next to the mark. */
  withWordmark?: boolean;
  /** Height of the mark in px (width scales automatically). */
  size?: number;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="humming bird, home"
    >
      <Image
        src="/logo-mark.svg"
        alt="Hummingbird logo"
        width={Math.round(size * (320 / 265))}
        height={size}
        priority
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
      {withWordmark && (
        <span className="hidden whitespace-nowrap text-lg font-bold lowercase tracking-tight text-ink sm:inline">
          {siteContent.brand}
        </span>
      )}
    </Link>
  );
}
