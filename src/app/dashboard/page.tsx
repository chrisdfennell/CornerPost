import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Load user's listings
  const listings = await prisma.listing.findMany({
    where: { contactEmail: user.email },
    orderBy: { createdAt: "desc" },
  });

  // Load user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
  });

  // Load user's active conversations (where they are either the buyer or the seller of the listing)
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { buyerEmail: user.email },
        { listing: { contactEmail: user.email } },
      ],
    },
    include: {
      listing: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <DashboardClient
      user={{ email: user.email, name: user.name ?? "User" }}
      initialListings={listings}
      initialSubscriptions={subscriptions}
      initialConversations={conversations.map((c) => ({
        id: c.id,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        buyerName: c.buyerName,
        buyerEmail: c.buyerEmail,
        buyerToken: c.buyerToken,
        sellerToken: c.sellerToken,
        listing: {
          id: c.listing.id,
          title: c.listing.title,
          imageUrl: c.listing.imageUrl,
          price: c.listing.price,
          contactEmail: c.listing.contactEmail,
        },
        lastMessage: c.messages[0]
          ? {
              content: c.messages[0].content,
              createdAt: c.messages[0].createdAt.toISOString(),
              sender: c.messages[0].sender,
            }
          : null,
      }))}
    />
  );
}
