import data from "@/content/testimonials.json";

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  accent: "blue" | "coral" | "yellow";
};

export const testimonials = data as Testimonial[];
