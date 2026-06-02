import { describe, it, expect } from "vitest";
import { resolveConversationRole } from "./conversations";

describe("resolveConversationRole", () => {
  const conv = {
    buyerToken: "buyer-token-123",
    sellerToken: "seller-token-456",
  };

  it("resolves the buyer role correctly", () => {
    expect(resolveConversationRole(conv, "buyer-token-123")).toBe("buyer");
  });

  it("resolves the seller role correctly", () => {
    expect(resolveConversationRole(conv, "seller-token-456")).toBe("seller");
  });

  it("returns null for an invalid token", () => {
    expect(resolveConversationRole(conv, "invalid-token")).toBeNull();
  });

  it("returns null for an empty token", () => {
    expect(resolveConversationRole(conv, "")).toBeNull();
  });
});
