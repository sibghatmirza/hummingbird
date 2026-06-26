import Button from "@/components/Button";
import FadeIn from "@/components/FadeIn";
import FloatingLogo from "@/components/FloatingLogo";
import QuoteReveal from "@/components/QuoteReveal";
import SectionHeader from "@/components/SectionHeader";
import ProjectGrid from "@/components/ProjectGrid";
import Testimonials from "@/components/Testimonials";
import ClientLogos from "@/components/ClientLogos";
import { projects } from "@/data/projects";
import { homeContent as c } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-5">
      {/* Hero — just the quote */}
      <section className="flex min-h-[calc(100svh-73px)] flex-col items-center justify-center py-16 text-center">
        <FloatingLogo />

        <FadeIn delay={0.3}>
          <div className="mt-4">
            <QuoteReveal
              lead={c.hero.quoteLead}
              full={c.hero.quoteFull}
              subline={c.hero.subline}
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <p className="mt-8 text-ink/60">{c.hero.tagline}</p>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="mt-12">
            <Button href={c.hero.ctaHref}>{c.hero.ctaLabel}</Button>
          </div>
        </FadeIn>
      </section>

      {/* Intro — Hi, I'm Sib */}
      <section className="py-12">
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-14">
          <FadeIn className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {c.intro.heading}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">{c.intro.lead}</p>
            <p className="mt-4 max-w-xl text-ink/55">
              {c.intro.statementPrefix}{" "}
              <span className="glow-blue">{c.intro.glowWord}</span>
              {c.intro.statementRest}
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="w-56 overflow-hidden rounded-card border border-ink/10 bg-white p-2 sm:w-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sib.gif"
                alt="Sib, waving hello"
                className="aspect-square w-full rounded-[18px] object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Work I'm proud of */}
      <section className="py-12">
        <SectionHeader title={c.workTitle} dot="coral" />
        <ProjectGrid projects={projects} />
      </section>

      {/* Why work with me */}
      <section className="py-12">
        <SectionHeader title={c.whyTitle} dot="coral" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {c.why.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.06}>
              <div className="h-full rounded-card border border-ink/10 bg-white p-7">
                <span
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${r.tint}`}
                >
                  {r.icon}
                </span>
                <h3 className="text-lg font-bold tracking-tight">{r.title}</h3>
                <p className="mt-2 text-ink/60">{r.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Client logos */}
      <section className="py-12">
        <SectionHeader title={c.clientsTitle} dot="blue" />
        <ClientLogos />
      </section>

      {/* Nice things people said */}
      <section className="py-12">
        <SectionHeader title={c.testimonialsTitle} dot="yellow" />
        <Testimonials />
      </section>

      {/* Contact preview */}
      <section className="py-20">
        <div className="rounded-card border border-ink/10 bg-white p-10 sm:p-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {c.contactTitle}
          </h2>
          <div className="mt-8">
            <Button href="/contact">{c.contactCtaLabel}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
