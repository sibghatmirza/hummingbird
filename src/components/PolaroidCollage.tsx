"use client";

import { motion } from "framer-motion";

export type Polaroid = {
  src: string;
  caption: string;
  left: string;
  top: string;
  rotate: number;
  z: number;
};

export default function PolaroidCollage({ photos }: { photos: Polaroid[] }) {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-md sm:h-[420px]">
      {photos.map((p, i) => (
        <motion.div
          key={p.src + i}
          initial={{ opacity: 0, y: 28, scale: 0.9, rotate: p.rotate }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: p.rotate }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            delay: i * 0.09,
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
          whileHover={{ scale: 1.12, rotate: 0, zIndex: 60 }}
          style={{ left: p.left, top: p.top, zIndex: p.z }}
          className="absolute w-32 cursor-pointer rounded-sm bg-white p-2 pb-6 shadow-xl sm:w-40"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.src}
            alt={p.caption}
            className="aspect-square w-full rounded-[2px] object-cover"
          />
          <span className="absolute inset-x-0 bottom-1.5 text-center text-xs text-ink/50">
            {p.caption}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
