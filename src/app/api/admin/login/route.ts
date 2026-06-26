import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PASSWORD = process.env.ADMIN_PASSWORD || "hummingbird";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (password === PASSWORD) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: false }, { status: 401 });
}
