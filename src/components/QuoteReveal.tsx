"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function QuoteReveal({
  lead,
  full,
  subline,
}: {
  lead: string;
  full: string;
  subline: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl text-center">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer select-none focus:outline-none"
        aria-expanded={open}
      >
        <span className="font-display border-b-4 border-yellow pb-1 text-4xl font-bold tracking-tight text-ink transition-colors hover:text-blue sm:text-6xl">
          {lead}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <span className="mt-4 block text-lg text-ink/55 sm:text-xl">
              “{full}”
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mt-4 text-sm text-ink/40">{subline}</p>
    </div>
  );
}
