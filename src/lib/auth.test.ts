import { describe, it, expect, vi, beforeEach } from "vitest";
import { getListingForOwner } from "./listings";
import { prisma } from "./prisma";

// Mock the Prisma client
vi.mock("./prisma", () => ({
  prisma: {
    listing: {
      findUnique: vi.fn(),
    },
  },
}));

describe("getListingForOwner", () => {
  const mockListing = {
    id: "listing-123",
    title: "Awesome Road Bike",
    contactEmail: "Jamie@example.com",
    editToken: "token-abc-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("authenticates when the edit token matches exactly", async () => {
    vi.mocked(prisma.listing.findUnique).mockResolvedValue(mockListing as any);

    const result = await getListingForOwner("listing-123", "token-abc-123");
    expect(result).toEqual(mockListing);
    expect(prisma.listing.findUnique).toHaveBeenCalledWith({
      where: { id: "listing-123" },
    });
  });

  it("authenticates when the session email matches contactEmail", async () => {
    vi.mocked(prisma.listing.findUnique).mockResolvedValue(mockListing as any);

    const result = await getListingForOwner("listing-123", undefined, "jamie@example.com");
    expect(result).toEqual(mockListing);
  });

  it("is case-insensitive for session email matching", async () => {
    vi.mocked(prisma.listing.findUnique).mockResolvedValue(mockListing as any);

    const result = await getListingForOwner("listing-123", undefined, "JAMIE@EXAMPLE.COM");
    expect(result).toEqual(mockListing);
  });

  it("denies access if both edit token and session email are invalid or missing", async () => {
    vi.mocked(prisma.listing.findUnique).mockResolvedValue(mockListing as any);

    const result = await getListingForOwner("listing-123", "wrong-token", "wrong-email@example.com");
    expect(result).toBeNull();
  });

  it("returns null if the listing does not exist", async () => {
    vi.mocked(prisma.listing.findUnique).mockResolvedValue(null as any);

    const result = await getListingForOwner("nonexistent", "token-abc-123");
    expect(result).toBeNull();
  });
});
