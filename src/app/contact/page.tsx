import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { contactContent as c } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact · Hummingbird",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {c.heading}
        </h1>
        <p className="mt-3 text-ink/60">{c.sub}</p>
      </FadeIn>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        {/* Links */}
        <FadeIn delay={0.1}>
          <ul className="divide-y divide-ink/10 overflow-hidden rounded-card border border-ink/10 bg-white">
            {c.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-6 py-5 transition-colors hover:bg-cream"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${link.accent}`}
                    />
                    <span>
                      <span className="block font-medium">{link.label}</span>
                      <span className="block text-sm text-ink/50">
                        {link.value}
                      </span>
                    </span>
                  </span>
                  <span className="text-ink/30 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </FadeIn>

        {/* Photo placeholder */}
        <FadeIn delay={0.18}>
          <div className="flex aspect-[4/3] items-center justify-center rounded-card border border-dashed border-ink/20 bg-white text-sm text-ink/35">
            {c.photoPlaceholder}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
