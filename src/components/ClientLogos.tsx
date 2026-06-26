"use client";

import Image from "next/image";
import { clients } from "@/data/clients";

export default function ClientLogos() {
  // Duplicated so the loop is seamless (track scrolls exactly one set width).
  const row = [...clients, ...clients];

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            className="flex w-44 shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-white px-4 py-6 grayscale transition hover:grayscale-0"
          >
            <Image
              src={c.logo}
              alt={c.name}
              width={140}
              height={50}
              className="h-8 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
