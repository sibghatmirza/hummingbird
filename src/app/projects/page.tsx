import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects · Hummingbird",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-content px-5 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="mt-3 text-ink/60">
          A small collection of things I’ve made.
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </FadeIn>
    </div>
  );
}
