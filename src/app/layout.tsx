import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// Fraunces — a soft optical serif. This is the face that gives Stouchi its
// editorial, hand-made character (used for the wordmark + every money figure).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

// PWA metadata so Stouchi is installable on a phone home screen.
export const metadata: Metadata = {
  title: "Stouchi — my pocket money",
  description: "Speak or type your spending. Stouchi tracks it.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Stouchi", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#221E1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${arabic.variable}`}>
      <body className="grain">
        <main className="mx-auto min-h-screen max-w-md px-5 pb-28 pt-7">{children}</main>
      </body>
    </html>
  );
}
