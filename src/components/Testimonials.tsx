"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

const accentDot = {
  blue: "bg-blue",
  coral: "bg-coral",
  yellow: "bg-yellow",
};

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.figure
          key={t.name}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ y: -6 }}
          className="overflow-hidden rounded-card border border-ink/10 bg-white p-3"
        >
          {/* Screenshot — swap files in /public/testimonials */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[16px] bg-cream">
            <Image
              src={t.image}
              alt={`Message from ${t.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
          <figcaption className="flex items-center gap-2 px-2 pb-1 pt-4">
            <span className={`h-2 w-2 rounded-full ${accentDot[t.accent]}`} />
            <span className="font-semibold">{t.name}</span>
            <span className="text-sm text-ink/40">· {t.role}</span>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
