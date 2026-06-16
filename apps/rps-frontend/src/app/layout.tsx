import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Rascal Pixels Studio',
    default: 'Rascal Pixels Studio | OS'
  },
  description: "Architecting reality-shattering digital experiences. Global operational nodes active.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Rascal Pixels Studio",
    description: "Official Platform Core & Developer Network",
    siteName: "RPS_OS",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import CustomCursor from "@/components/CustomCursor";
import CommandPalette from "@/components/CommandPalette";
import { GlobalContextMenu } from "@/components/ContextMenu";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`antialiased ${inter.className}`}>
      <body className="bg-[#030303] text-white overflow-x-hidden">
        <CustomCursor />
        <CommandPalette />
        <GlobalContextMenu />
        {children}
      </body>
    </html>
  );
}