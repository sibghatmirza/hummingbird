"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { siteContent } from "@/lib/content";

const links = siteContent.nav;

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Logo />
        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-blue ${
                    active ? "text-ink" : "text-ink/60"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
