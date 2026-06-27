"use client";

import Image from "next/image";
import { clients } from "@/data/clients";

function LogoCard({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-2xl border border-ink/10 bg-white px-8 py-5">
      <Image
        src={logo}
        alt={name}
        width={260}
        height={110}
        className="h-20 w-auto object-contain"
      />
    </div>
  );
}

export default function ClientLogos() {
  const withLogos = clients.filter((c) => c.logo);
  if (withLogos.length === 0) return null;

  // Only loop/scroll once there are enough logos to fill the row.
  const scroll = withLogos.length >= 5;

  if (!scroll) {
    return (
      <div className="flex flex-wrap justify-center gap-5">
        {withLogos.map((c) => (
          <LogoCard key={c.name} name={c.name} logo={c.logo} />
        ))}
      </div>
    );
  }

  // Duplicated so the marquee loop is seamless.
  const row = [...withLogos, ...withLogos];
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
      <div className="marquee-track flex w-max gap-5 group-hover:[animation-play-state:paused]">
        {row.map((c, i) => (
          <LogoCard key={`${c.name}-${i}`} name={c.name} logo={c.logo} />
        ))}
      </div>
    </div>
  );
}
