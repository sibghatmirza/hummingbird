"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
};

export default function Button({
  href,
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-ink text-cream hover:bg-blue"
      : "border border-ink/15 text-ink hover:border-ink/40";

  const isInternal = href.startsWith("/");

  const inner = (
    <motion.span
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.span>
  );

  if (isInternal) {
    return <Link href={href}>{inner}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  );
}
