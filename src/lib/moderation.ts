// Lightweight, single-token moderation gate. Set MODERATION_TOKEN in the
// environment to enable the /moderation queue; leave it unset to disable.
export function moderationEnabled(): boolean {
  return Boolean(process.env.MODERATION_TOKEN);
}

export function isModerator(token: string | undefined | null): boolean {
  const expected = process.env.MODERATION_TOKEN;
  return Boolean(expected) && token === expected;
}
