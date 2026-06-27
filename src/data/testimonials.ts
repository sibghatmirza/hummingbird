import data from "@/content/testimonials.json";

export type Testimonial = {
  name: string;
  role: string;
  image: string;
  accent: "blue" | "coral" | "yellow";
};

export const testimonials = (data as unknown[]).filter(
  (t): t is Testimonial =>
    !!t && typeof t === "object" && typeof (t as Testimonial).name === "string"
) as Testimonial[];
