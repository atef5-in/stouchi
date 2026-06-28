import type { Metadata, Viewport } from "next";
import "./globals.css";

// PWA metadata so Stouchi is installable on a phone home screen.
export const metadata: Metadata = {
  title: "Stouchi — my pocket money",
  description: "Speak or type your spending. Stouchi tracks it.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Stouchi", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#E23A3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
