import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidPlace, getPlace } from "@/lib/places";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const SubscriptionSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  query: z.string().trim().min(2, "Search alert keyword is too short").max(80),
  place: z.string().trim().min(1),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit(`sub-signup:${ip}`, 10, 60 * 60 * 1000); // 10 signups/hour/IP max
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many subscription attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { email, query, place } = parsed.data;

  if (!isValidPlace(place)) {
    return NextResponse.json({ error: "Choose a valid local city area" }, { status: 400 });
  }

  const placeDetails = getPlace(place)!;

  // Check if identical subscription already exists
  const existing = await prisma.subscription.findFirst({
    where: {
      email,
      query: { equals: query },
      place,
    },
  });

  if (existing) {
    return NextResponse.json(
      { message: "You are already subscribed to this search!" },
      { status: 200 }
    );
  }

  // Create the subscription row
  await prisma.subscription.create({
    data: { email, query, place },
  });

  // Send a confirmation email (best effort)
  const subject = `Search alert activated: "${query}" in ${placeDetails.name}`;
  const text = [
    `Hi there,`,
    ``,
    `Your saved search alert has been activated!`,
    ``,
    `We will email you at this address the moment a new listing matching "${query}" is posted in the ${placeDetails.label} area.`,
    ``,
    `Thank you for using CornerPost.`,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <h2 style="margin:0 0 8px">Search Alert Activated! 🔔</h2>
      <p style="color:#475569">You will receive an email alert the moment a new listing matches <strong>“${escapeHtml(query)}”</strong> in <strong>${escapeHtml(placeDetails.label)}</strong>.</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:20px">No account required. CornerPost is local classifieds done right.</p>
    </div>`;

  await sendEmail({
    to: email,
    subject,
    text,
    html,
  });

  return NextResponse.json({ ok: true, message: "Subscription activated!" }, { status: 201 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function DELETE(req: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const DeleteSchema = z.object({
    id: z.string().min(1),
  });

  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: parsed.data.id },
  });

  if (!subscription) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (subscription.email.toLowerCase() !== currentUser.email.toLowerCase()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.subscription.delete({
    where: { id: parsed.data.id },
  });

  return NextResponse.json({ ok: true });
}

