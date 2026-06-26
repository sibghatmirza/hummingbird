"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "@/data/projects";

export default function ProjectsExplorer({
  projects,
}: {
  projects: Project[];
}) {
  // Filters are built automatically from the categories you set on projects.
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const [active, setActive] = useState("All");

  const shown =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === cat
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
