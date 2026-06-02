/**
 * Resolves the user's role ("buyer" or "seller") based on their secure access token.
 * Returns null if the token does not match either the buyerToken or sellerToken.
 */
export function resolveConversationRole(
  conversation: { buyerToken: string; sellerToken: string },
  token: string
): "buyer" | "seller" | null {
  if (!token) return null;
  if (token === conversation.buyerToken) return "buyer";
  if (token === conversation.sellerToken) return "seller";
  return null;
}
