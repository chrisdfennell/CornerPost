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

/** Email the user their one-time passcode for secure passwordless login. */
export async function sendLoginOtpEmail(opts: { to: string; token: string }) {
  const subject = `Your CornerPost sign-in code: ${opts.token}`;
  const text = [
    `Your CornerPost login verification code is: ${opts.token}`,
    ``,
    `Enter this code on the verification screen. This code will expire in 10 minutes.`,
    `If you did not request this, you can safely ignore this email.`,
  ].join("\n");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;padding:20px;border:1px solid #e2e8f0;border-radius:16px">
      <h2 style="margin:0 0 12px;color:#0f172a">Sign in to CornerPost 📮</h2>
      <p style="color:#475569;font-size:15px;line-height:1.5">Enter the following verification code to log in to your account. This code is valid for 10 minutes.</p>
      <div style="margin:24px 0;background:#f8fafc;padding:16px;border-radius:12px;text-align:center">
        <span style="font-family:monospace;font-size:32px;font-weight:700;letter-spacing:6px;color:#4f46e5">${opts.token}</span>
      </div>
      <p style="color:#94a3b8;font-size:13px;margin:20px 0 0">If you did not request this code, you can safely ignore this email.</p>
    </div>`;
  return sendEmail({ to: opts.to, subject, html, text });
}

