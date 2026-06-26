import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} · Hummingbird` : "Hummingbird" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Stacked images: cover first, then the rest (no dupes).
  const images = [
    project.cover,
    ...project.gallery.filter((g) => g !== project.cover),
  ];

  return (
    <div className="pb-20">
      {/* Top bar */}
      <div className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-8">
        <Link
          href="/projects"
          className="text-sm text-ink/50 transition-colors hover:text-blue"
        >
          ← Back to projects
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-[1200px] px-4 pb-8 pt-6 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sib.gif"
            alt="Sib"
            className="h-11 w-11 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold leading-tight">Sib</p>
            <p className="text-sm text-ink/50">Hummingbird</p>
          </div>
        </div>
      </header>

      {/* Intro — client + project */}
      <section className="mx-auto max-w-[1000px] px-4 pb-10 sm:px-0">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              The client
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/75">
              {project.client ??
                "A client who needed something that looked good and made sense."}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
              The project
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-ink/75">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stacked image column — natural heights, seamless */}
      <main className="mx-auto max-w-[1000px]">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src + i}
            src={src}
            alt={`${project.title}, image ${i + 1}`}
            className="block w-full"
          />
        ))}
      </main>

      {/* Footer meta */}
      <section className="mx-auto mt-12 max-w-[1000px] px-4 sm:px-0">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-6">
            {project.credits && project.credits.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Credits
                </h3>
                <ul className="mt-3 space-y-1 text-ink/70">
                  {project.credits.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.tags && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink/5 px-3 py-1 text-sm text-ink/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 text-sm sm:w-64 sm:shrink-0 sm:border-l sm:border-ink/10 sm:pl-8">
            {project.tools && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                  Tools used
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.tools.map((t) => (
                    <li
                      key={t}
                      className="rounded-lg border border-ink/10 px-3 py-1.5 text-ink/70"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Published
              </h3>
              <p className="mt-2 text-ink/70">
                {project.published ?? project.year}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink/40">
                Category
              </h3>
              <p className="mt-2 text-ink/70">{project.category}</p>
            </div>
          </aside>
        </div>
      </section>

    </div>
  );
}
