import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyTokenAndCreateSession } from "@/lib/auth";

const Schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  code: z.string().trim().min(6, "Verification code must be 6 digits").max(6, "Verification code must be 6 digits"),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid verification code" },
        { status: 400 }
      );
    }

    const { email, code } = parsed.data;
    
    const verified = await verifyTokenAndCreateSession(email, code);
    
    if (!verified) {
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/auth/verify] error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
