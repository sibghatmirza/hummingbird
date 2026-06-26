import { NextRequest, NextResponse } from "next/server";
import { writeBinary } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PASSWORD = process.env.ADMIN_PASSWORD || "hummingbird";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== PASSWORD)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const name = `${Date.now()}-${safe}`;
  await writeBinary(`public/uploads/${name}`, buf);

  return NextResponse.json({ path: `/uploads/${name}` });
}
