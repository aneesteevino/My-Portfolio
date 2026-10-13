import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PROFILE } from "@/lib/data";
import "./globals.css";

const inter = localFont({
  src: "../fonts/inter-tight-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});
const serif = localFont({
  src: [
    {
      path: "../fonts/instrument-serif-latin-400-normal.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../fonts/instrument-serif-latin-400-italic.woff2",
      style: "italic",
      weight: "400",
    },
  ],
  variable: "--font-serif",
  display: "swap",
});
const mono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  display: "swap",
  weight: "100 800",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: `${PROFILE.name} — ${PROFILE.role}`,
  description: PROFILE.resumeSummary,
  openGraph: {
    title: `${PROFILE.name} — ${PROFILE.role}`,
    description: PROFILE.resumeSummary,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${PROFILE.name}, ${PROFILE.role}`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PROFILE.name} — ${PROFILE.role}`,
    images: ["/og.jpg"],
  },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#f4f2ee" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
