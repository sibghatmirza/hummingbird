import type { Metadata } from "next";
import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import PolaroidCollage, { type Polaroid } from "@/components/PolaroidCollage";
import Faq from "@/components/Faq";
import { aboutContent as c } from "@/lib/content";

export const metadata: Metadata = {
  title: "About me · Hummingbird",
};

const dot: Record<string, string> = {
  blue: "bg-blue",
  coral: "bg-coral",
  yellow: "bg-yellow",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {c.heading}
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          {/* About me text */}
          <div>
            <div className="space-y-4 text-lg text-ink/70">
              {c.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <ul className="mt-8 flex flex-wrap gap-3 text-sm">
              {c.loves.map((l) => (
                <li
                  key={l.label}
                  className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2"
                >
                  <span className={`h-2 w-2 rounded-full ${l.color}`} />
                  {l.label}
                </li>
              ))}
            </ul>
          </div>

          {/* A few photos */}
          <PolaroidCollage photos={c.polaroids as Polaroid[]} />
        </div>
      </FadeIn>

      {/* FAQs */}
      <FadeIn delay={0.1}>
        <h2 className="mt-20 text-2xl font-bold tracking-tight sm:text-3xl">
          {c.faqHeading}
        </h2>
        <div className="mt-6 max-w-3xl">
          <Faq items={c.faq} />
        </div>
      </FadeIn>

      {/* How I work */}
      <FadeIn delay={0.1}>
        <h2 className="mt-20 text-2xl font-bold tracking-tight sm:text-3xl">
          {c.howHeading}
        </h2>
        <p className="mt-2 text-ink/60">{c.howSub}</p>
      </FadeIn>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {c.traits.map((t, i) => (
          <FadeIn key={t.title} delay={i * 0.05}>
            <div className="h-full rounded-card border border-ink/10 bg-white p-7">
              <span
                className={`mb-4 block h-2.5 w-2.5 rounded-full ${dot[t.accent]}`}
              />
              <h3 className="text-lg font-bold tracking-tight">{t.title}</h3>
              <p className="mt-2 text-ink/60">{t.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Closing */}
      <FadeIn delay={0.2}>
        <div className="mt-16 max-w-xl space-y-3 text-lg text-ink/80">
          {c.closing.map((line, i) => (
            <p key={i}>
              {i === c.closing.length - 1 ? (
                <span className="glow-coral">{line}</span>
              ) : (
                line
              )}
            </p>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/contact">Say hello →</Button>
        </div>
      </FadeIn>
    </div>
  );
}
