import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const CreateConversationSchema = z.object({
  listingId: z.string().min(1),
  buyerName: z.string().trim().min(1, "Enter your name").max(80),
  buyerEmail: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(5, "Add a message of at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit(`chat-init:${ip}`, 10, 60 * 60 * 1000); // 10 conversation inquiries per hour
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many inquiries sent. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { listingId, buyerName, buyerEmail, message } = parsed.data;

  // Find the listing
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.status !== "active") {
    return NextResponse.json(
      { error: "This listing is no longer active or could not be found." },
      { status: 404 }
    );
  }

  // Create conversation and first message nested
  const conversation = await prisma.conversation.create({
    data: {
      listingId,
      buyerName,
      buyerEmail,
      messages: {
        create: {
          sender: "buyer",
          content: message,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  // Prepare links
  const buyerChatUrl = `${SITE_URL}/chat/${conversation.id}?token=${conversation.buyerToken}`;
  const sellerChatUrl = `${SITE_URL}/chat/${conversation.id}?token=${conversation.sellerToken}`;

  // Send email to Seller (best effort)
  const sellerSubject = `New inquiry on your listing: ${listing.title}`;
  const sellerText = [
    `Hi ${listing.contactName},`,
    ``,
    `${buyerName} has sent you a secure message regarding your listing "${listing.title}":`,
    ``,
    `“${message}”`,
    ``,
    `To reply, click this private chat link (we hide your email for privacy):`,
    sellerChatUrl,
    ``,
    `Do not share this link with anyone else.`,
  ].join("\n");

  const sellerHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <h2 style="margin:0 0 8px">New inquiry on your listing 💬</h2>
      <p style="color:#475569"><strong>${escapeHtml(buyerName)}</strong> is interested in your listing: <strong>“${escapeHtml(listing.title)}”</strong></p>
      <div style="background:#f1f5f9;border-left:4px solid #4f46e5;padding:12px;margin:16px 0;border-radius:4px;font-style:italic">
        “${escapeHtml(message)}”
      </div>
      <p style="margin:20px 0">
        <a href="${sellerChatUrl}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">Reply to secure chat</a>
      </p>
      <p style="color:#94a3b8;font-size:12px">Your email address remains private. Replies happen securely inside CornerPost.</p>
    </div>`;

  await sendEmail({
    to: listing.contactEmail,
    subject: sellerSubject,
    text: sellerText,
    html: sellerHtml,
  });

  // Send email to Buyer (best effort)
  const buyerSubject = `Message sent: ${listing.title}`;
  const buyerText = [
    `Hi ${buyerName},`,
    ``,
    `Your message has been sent to the seller of "${listing.title}".`,
    ``,
    `Keep this private link to view replies and continue chatting:`,
    buyerChatUrl,
    ``,
    `Replies will also be notified to you at this email address.`,
  ].join("\n");

  const buyerHtml = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <h2 style="margin:0 0 8px">Message sent! 🚀</h2>
      <p style="color:#475569">Your message was sent to the seller of <strong>“${escapeHtml(listing.title)}”</strong>.</p>
      <p style="margin:20px 0">
        <a href="${buyerChatUrl}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">View your secure chat workspace</a>
      </p>
      <p style="color:#94a3b8;font-size:12px">Keep this link safe. We'll notify you here if the seller replies.</p>
    </div>`;

  await sendEmail({
    to: buyerEmail,
    subject: buyerSubject,
    text: buyerText,
    html: buyerHtml,
  });

  return NextResponse.json({
    conversationId: conversation.id,
    buyerToken: conversation.buyerToken,
  }, { status: 201 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
