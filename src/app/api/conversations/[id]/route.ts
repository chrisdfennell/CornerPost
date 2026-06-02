import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  // Find the conversation
  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          imageUrl: true,
          category: true,
          status: true,
          contactName: true,
          contactEmail: true,
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conv) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Authenticate token and resolve sender role
  let role: "buyer" | "seller";
  if (token === conv.buyerToken) {
    role = "buyer";
  } else if (token === conv.sellerToken) {
    role = "seller";
  } else {
    return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
  }

  // Format response, hide sensitive raw emails from the response payload
  return NextResponse.json({
    conversation: {
      id: conv.id,
      buyerName: conv.buyerName,
      listing: conv.listing,
      role,
      createdAt: conv.createdAt,
    },
    messages: conv.messages,
  });
}

const SendMessageSchema = z.object({
  content: z.string().trim().min(1, "Message cannot be empty").max(3000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token") || "";

  if (!token) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  // Rate limiting per conversation thread to prevent abuse
  const ip = clientIp(req);
  const limit = rateLimit(`chat-msg:${id}-${ip}`, 30, 60 * 1000); // 30 messages/minute max
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many messages sent. Please slow down." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = SendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { content } = parsed.data;

  // Retrieve the conversation
  const conv = await prisma.conversation.findUnique({
    where: { id },
    include: {
      listing: true,
    },
  });

  if (!conv) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  // Authenticate token and resolve sender role
  let role: "buyer" | "seller";
  let recipientEmail: string;
  let recipientName: string;
  let senderName: string;
  let chatLink: string;

  if (token === conv.buyerToken) {
    role = "buyer";
    recipientEmail = conv.listing.contactEmail;
    recipientName = conv.listing.contactName;
    senderName = conv.buyerName;
    chatLink = `${SITE_URL}/chat/${conv.id}?token=${conv.sellerToken}`;
  } else if (token === conv.sellerToken) {
    role = "seller";
    recipientEmail = conv.buyerEmail;
    recipientName = conv.buyerName;
    senderName = conv.listing.contactName;
    chatLink = `${SITE_URL}/chat/${conv.id}?token=${conv.buyerToken}`;
  } else {
    return NextResponse.json({ error: "Invalid access token" }, { status: 401 });
  }

  // Create new message
  const msg = await prisma.message.create({
    data: {
      conversationId: id,
      sender: role,
      content,
    },
  });

  // Send a notify email to the recipient (best effort)
  const subject = `New message from ${senderName} regarding "${conv.listing.title}"`;
  const text = [
    `Hi ${recipientName},`,
    ``,
    `You have a new message from ${senderName} regarding your chat for "${conv.listing.title}":`,
    ``,
    `“${content}”`,
    ``,
    `Click here to reply securely (your email address is hidden):`,
    chatLink,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <h3 style="margin:0 0 8px">New message from ${escapeHtml(senderName)} 💬</h3>
      <p style="color:#475569">Regarding: <strong>“${escapeHtml(conv.listing.title)}”</strong></p>
      <div style="background:#f1f5f9;border-left:4px solid #4f46e5;padding:12px;margin:16px 0;border-radius:4px;font-style:italic">
        “${escapeHtml(content)}”
      </div>
      <p style="margin:20px 0">
        <a href="${chatLink}" style="background:#4f46e5;color:#fff;padding:10px 18px;border-radius:9999px;text-decoration:none;font-weight:600;display:inline-block">Reply in secure chat</a>
      </p>
      <p style="color:#94a3b8;font-size:11px">CornerPost secures your emails. Do not reply to this notification email directly.</p>
    </div>`;

  await sendEmail({
    to: recipientEmail,
    subject,
    text,
    html,
  });

  return NextResponse.json({ message: msg }, { status: 201 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
