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
  credits?: string[];
  client?: string;
  tools?: string[];
  tags?: string[];
  published?: string;
};

export const projects = data as Project[];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
