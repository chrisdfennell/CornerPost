import type { Metadata } from "next";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/site";

const description =
  "Buy, sell, rent, hire, and connect with your community. A modern, beautiful classifieds board.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CornerPost — local classifieds, done right",
    template: "%s · CornerPost",
  },
  description,
  openGraph: {
    siteName: "CornerPost",
    type: "website",
    title: "CornerPost — local classifieds, done right",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
