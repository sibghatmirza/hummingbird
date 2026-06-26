"use client";

import { motion } from "framer-motion";

export default function SectionHeader({
  title,
  subtitle,
  dot = "blue",
}: {
  title: string;
  subtitle?: string;
  dot?: "blue" | "coral" | "yellow";
}) {
  const dotColor = {
    blue: "bg-blue",
    coral: "bg-coral",
    yellow: "bg-yellow",
  }[dot];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 text-ink/60">{subtitle}</p>
      )}
    </motion.div>
  );
}
