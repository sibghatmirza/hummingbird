import { siteContent } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto flex max-w-content flex-col items-start justify-between gap-2 px-5 py-8 text-sm text-ink/50 sm:flex-row sm:items-center">
        <span>{siteContent.footerLeft}</span>
        <span>{siteContent.footerRight}</span>
      </div>
    </footer>
  );
}
