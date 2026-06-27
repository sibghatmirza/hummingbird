import data from "@/content/projects.json";

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  accent: "blue" | "coral" | "yellow";
  description: string;
  cover: string;
  gallery: string[];
  /** Show this project on the homepage "Work I'm proud of" grid. */
  featured?: boolean;
  credits?: string[];
  client?: string;
  tools?: string[];
  tags?: string[];
  published?: string;
};

// Tolerate malformed content so a bad CMS edit never breaks the build.
export const projects = (data as unknown[]).filter(
  (p): p is Project =>
    !!p && typeof p === "object" && typeof (p as Project).slug === "string"
) as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
