import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days
const OTP_EXPIRY_MINUTES = 10;

/** Retrieves the currently logged-in user by validating the secure "session" cookie against the SQLite database. */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session) return null;

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.user;
  } catch (err) {
    console.error("[auth] getCurrentUser error:", err);
    return null;
  }
}

/** Generates a secure, randomized 6-digit numeric OTP and saves a VerificationToken in SQLite. */
export async function createVerificationToken(email: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Generate cryptographically secure 6-digit passcode
  const passcode = Math.floor(100000 + crypto.randomInt(900000)).toString();
  
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

  // Clean up any existing verification tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { email: normalizedEmail },
  }).catch(() => {});

  // Create the new verification token
  await prisma.verificationToken.create({
    data: {
      email: normalizedEmail,
      token: passcode,
      expiresAt,
    },
  });

  return passcode;
}

/** Verifies the email & OTP, registers the User if they don't exist, establishes a session, and sets the secure session cookie. */
export async function verifyTokenAndCreateSession(email: string, passcode: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Look up the verification token
  const pendingToken = await prisma.verificationToken.findUnique({
    where: { token: passcode },
  });

  if (!pendingToken || pendingToken.email !== normalizedEmail) {
    return false;
  }

  // Check if token has expired
  if (pendingToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: pendingToken.id } }).catch(() => {});
    return false;
  }

  // OTP is valid! Delete it so it cannot be reused
  await prisma.verificationToken.delete({ where: { id: pendingToken.id } }).catch(() => {});

  // Find or create the user
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedEmail.split("@")[0] || "User",
      },
    });
  }

  // Generate secure random session token
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const sessionExpiresAt = new Date();
  sessionExpiresAt.setSeconds(sessionExpiresAt.getSeconds() + SESSION_MAX_AGE_SECONDS);

  // Store the session
  await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt: sessionExpiresAt,
    },
  });

  // Inject the secure, HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return true;
}

/** Destroys the active session in SQLite and clears the secure cookie. */
export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (token) {
      // Revoke in DB
      await prisma.session.delete({ where: { token } }).catch(() => {});
    }
  } catch (err) {
    console.error("[auth] clearSession database revoke failed:", err);
  } finally {
    // Clear cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}
