"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-base font-semibold tracking-tight sm:text-lg">
          {q}
        </span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink/5 text-xl leading-none text-ink/50 transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-5 leading-relaxed text-ink/65">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="rounded-card border border-ink/10 bg-white px-6 sm:px-8">
      {items.map((f) => (
        <FaqItem key={f.q} q={f.q} a={f.a} />
      ))}
    </div>
  );
}
