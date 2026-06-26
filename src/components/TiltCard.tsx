"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * A card that does a subtle 3D parallax rotation following the cursor.
 * Children sit on the surface; pass `depth` content to float a bit higher.
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Normalized pointer position (-0.5 … 0.5) over the card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 18,
  });

  function handleMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="rounded-card border border-ink/10 bg-white p-10 sm:p-14 will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
