import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChatWorkspace } from "@/components/ChatWorkspace";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Secure Workspace · CornerPost",
  robots: { index: false, follow: false },
};

export default async function ChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token = "" } = await searchParams;

  if (!token) {
    return <AccessDeniedNotice message="Access token is missing in the URL." />;
  }

  // Find the conversation with database joins
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
    notFound();
  }

  // Authenticate token and resolve roles
  let role: "buyer" | "seller";
  if (token === conv.buyerToken) {
    role = "buyer";
  } else if (token === conv.sellerToken) {
    role = "seller";
  } else {
    return <AccessDeniedNotice message="This secure access token is invalid or expired." />;
  }

  // Format messages correctly for JSON transport
  const initialMessages = conv.messages.map((m) => ({
    id: m.id,
    sender: m.sender as "buyer" | "seller",
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }));

  const conversationData = {
    id: conv.id,
    buyerName: conv.buyerName,
    listing: conv.listing,
    role,
    createdAt: conv.createdAt.toISOString(),
  };

  return (
    <ChatWorkspace
      conversation={conversationData}
      initialMessages={initialMessages}
      token={token}
    />
  );
}

function AccessDeniedNotice({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div className="text-5xl">🔒</div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
        Access Denied
      </h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {message} Please make sure you are using the exact link from your email notification.
      </p>
      <Link
        href="/browse"
        className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Browse Listings
      </Link>
    </div>
  );
}
