"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

const folderBack = {
  blue: "bg-blue/15 border-blue/40",
  coral: "bg-coral/15 border-coral/40",
  yellow: "bg-yellow/20 border-yellow/50",
};

const folderFront = {
  blue: "bg-blue/30 border-blue/40",
  coral: "bg-coral/30 border-coral/40",
  yellow: "bg-yellow/45 border-yellow/50",
};

const accentDot = {
  blue: "bg-blue",
  coral: "bg-coral",
  yellow: "bg-yellow",
};

export default function ProjectCard({ project }: { project: Project }) {
  const accent = project.accent;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link href={`/projects/${project.slug}`} className="group block">
        {/* Folder */}
        <div className="relative pt-5">
          {/* Back panel + tab */}
          <div
            className={`absolute inset-x-0 bottom-0 top-5 rounded-2xl rounded-tl-none border ${folderBack[accent]}`}
          >
            <div
              className={`absolute -top-3 left-5 h-3.5 w-2/5 rounded-t-xl border border-b-0 ${folderBack[accent]}`}
            />
          </div>

          {/* The "document" — peeks above the front flap, tucks in on hover */}
          <div className="relative z-10 mx-3 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-transform duration-300 ease-out group-hover:translate-y-5">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={project.cover}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Front flap (pocket) */}
          <div
            className={`absolute inset-x-0 bottom-0 z-20 h-[34%] rounded-2xl rounded-t-none border border-t-0 ${folderFront[accent]}`}
          />
        </div>

        {/* Label */}
        <div className="flex items-end justify-between px-2 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${accentDot[accent]}`} />
              <h3 className="text-lg font-medium tracking-tight">
                {project.title}
              </h3>
            </div>
            <p className="mt-1 text-sm text-ink/50">{project.category}</p>
          </div>
          <span className="text-sm text-ink/40">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
}
