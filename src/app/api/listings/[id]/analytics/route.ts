import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bucketViewsByDate } from "@/lib/analytics";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.nextUrl.searchParams.get("token") || "";

  const currentUser = await getCurrentUser();

  if (!token && !currentUser) {
    return NextResponse.json({ error: "Missing authorization token or session" }, { status: 400 });
  }

  // Find the listing and verify authorization
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { editToken: true, contactEmail: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const matchesToken = Boolean(token && listing.editToken === token);
  const matchesUser = Boolean(
    currentUser &&
    listing.contactEmail.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
  );

  if (!matchesToken && !matchesUser) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }


  // Generate date ranges for the last 7 calendar days
  const now = new Date();
  const past7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d;
  });

  const startDate = new Date(past7Days[0]);
  startDate.setHours(0, 0, 0, 0); // Start at midnight of the first day in sequence

  // Retrieve matching view records
  const views = await prisma.listingView.findMany({
    where: {
      listingId: id,
      createdAt: { gte: startDate },
    },
    select: { createdAt: true },
  });

  // Bucketing views by matching calendar date string using helper
  const analytics = bucketViewsByDate(views, past7Days);

  return NextResponse.json({ analytics });
}
