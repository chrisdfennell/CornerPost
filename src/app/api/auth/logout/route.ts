import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    await clearSession();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/auth/logout] error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
