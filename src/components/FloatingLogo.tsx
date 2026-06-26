"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion";
import Logo from "./Logo";

/** Gap (px) the bird keeps between itself and the cursor. */
const GAP = 78;
/** Angles (deg) to try when looking for a spot that isn't over text. */
const ANGLES = [0, 30, -30, 60, -60, 90, -90, 120, -120, 150, -150, 180];
const MARGIN = 36;

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/** Is the point sitting on readable text / a control? */
function overText(px: number, py: number) {
  const el = document.elementFromPoint(px, py) as Element | null;
  if (!el) return true; // off-screen / nothing → avoid
  return !!el.closest(
    "p,h1,h2,h3,h4,h5,li,a,em,strong,button,figcaption,label"
  );
}

export default function FloatingLogo({ size = 72 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 110, damping: 18, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 110, damping: 18, mass: 0.8 });

  // Bank in the direction of travel (settles to 0 when still).
  const vx = useVelocity(sx);
  const rotate = useSpring(useTransform(vx, [-1200, 1200], [-16, 16]), {
    stiffness: 150,
    damping: 20,
  });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const homeX = centerX - sx.get();
      const homeY = centerY - sy.get();

      // Direction the bird is currently sitting, relative to the cursor —
      // it trails on that side, so it stays "a little away".
      let dirX = centerX - e.clientX;
      let dirY = centerY - e.clientY;
      const len = Math.hypot(dirX, dirY) || 1;
      dirX /= len;
      dirY /= len;
      const baseAngle = Math.atan2(dirY, dirX);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Try the trailing spot first, then rotate around the cursor until
      // we find a gap that isn't on top of text.
      let bestX = e.clientX + dirX * GAP;
      let bestY = e.clientY + dirY * GAP;
      for (const deg of ANGLES) {
        const a = baseAngle + (deg * Math.PI) / 180;
        const cx = clamp(e.clientX + Math.cos(a) * GAP, MARGIN, vw - MARGIN);
        const cy = clamp(e.clientY + Math.sin(a) * GAP, MARGIN, vh - MARGIN);
        if (!overText(cx, cy)) {
          bestX = cx;
          bestY = cy;
          break;
        }
      }

      x.set(bestX - homeX);
      y.set(bestY - homeY);
    }

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [x, y, sx, sy]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, rotate }}
      className="pointer-events-none relative z-50 mb-10 will-change-transform"
    >
      {/* Inner element keeps the idle bob, independent of the follow offset. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5 },
          scale: { duration: 0.5 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Logo withWordmark={false} size={size} />
      </motion.div>
    </motion.div>
  );
}
