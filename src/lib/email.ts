import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "CornerPost <onboarding@resend.dev>";

// Only construct the client when configured; otherwise we log to the console
// so local dev works end-to-end without an API key.
const resend = apiKey ? new Resend(apiKey) : null;

type SendArgs = { to: string; subject: string; html: string; text: string };

export async function sendEmail({ to, subject, html, text }: SendArgs) {
  if (!resend) {
    console.log(
      `\n[email:stub] (set RESEND_API_KEY to actually send)\n  to: ${to}\n  subject: ${subject}\n  ${text}\n`
    );
    return { stubbed: true as const };
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html, text });
    return { sent: true as const };
  } catch (err) {
    // Never let a mail failure break the user's action.
    console.error("[email] send failed:", err);
    return { error: true as const };
  }
}

/** Email the poster their one-time manage link so they never lose edit access. */
export async function sendManageLinkEmail(opts: {
  to: string;
  listingId: string;
  title: string;
  editToken: string;
}) {
  const url = `${SITE_URL}/listing/${opts.listingId}/manage?token=${opts.editToken}`;
  const subject = `Your CornerPost listing is live: ${opts.title}`;
  const text = [
    `Your listing "${opts.title}" is now live on CornerPost.`,
    ``,
    `Manage it (edit, mark sold, renew, or delete) here — keep this link private:`,
    url,
    ``,
    `This link is the only way to manage your listing, since CornerPost doesn't use accounts.`,
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px">
      <h2 style="margin:0 0 8px">Your listing is live 🎉</h2>
      <p style="color:#475569">“${escapeHtml(opts.title)}” is now on CornerPost.</p>
      <p style="margin:20px 0">
        <a href="${url}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:9999px;text-decoration:none;font-weight:600">Manage your listing</a>
      </p>
      <p style="color:#94a3b8;font-size:13px">Keep this link private — it's the only way to edit or remove your listing, since we don't use accounts.</p>
    </div>`;
  return sendEmail({ to: opts.to, subject, html, text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
