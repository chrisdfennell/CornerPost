import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createVerificationToken } from "@/lib/auth";
import { sendLoginOtpEmail } from "@/lib/email";

const Schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    
    // Generate one-time passcode
    const otp = await createVerificationToken(email);
    
    // Send email with the OTP passcode
    await sendLoginOtpEmail({ to: email, token: otp });
    
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/auth/login] error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
