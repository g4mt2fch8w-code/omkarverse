import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OMKARVERSE // Digital Territory & Tactical GIS Universe",
  description:
    "An immersive, high-performance WebGL digital universe fusing high-resolution satellite cartography, tiger conservation intelligence, and ground telemetry. Architect: Onkar Bhople Patil.",
  keywords: [
    "GIS",
    "Three.js",
    "WebGL",
    "Tiger Conservation",
    "Remote Sensing",
    "PIRS",
    "TIGRIS",
    "Onkar Bhople Patil",
  ],
  authors: [{ name: "Onkar Bhople Patil" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#050709] text-slate-100 selection:bg-amber-500/20 selection:text-amber-300 min-h-screen`}
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
