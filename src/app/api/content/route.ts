import { NextRequest, NextResponse } from "next/server";
import { readText, writeText } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTIONS = [
  "site",
  "home",
  "about",
  "contact",
  "projects",
  "testimonials",
  "clients",
];

const PASSWORD = process.env.ADMIN_PASSWORD || "hummingbird";

function pathFor(section: string | null) {
  if (!section || !SECTIONS.includes(section)) return null;
  return `src/content/${section}.json`;
}

export async function GET(req: NextRequest) {
  const file = pathFor(req.nextUrl.searchParams.get("section"));
  if (!file)
    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  const raw = await readText(file);
  return NextResponse.json(JSON.parse(raw));
}

export async function PUT(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = pathFor(req.nextUrl.searchParams.get("section"));
  if (!file)
    return NextResponse.json({ error: "Unknown section" }, { status: 400 });
  const body = await req.json();
  await writeText(file, JSON.stringify(body, null, 2) + "\n");
  return NextResponse.json({ ok: true });
}
