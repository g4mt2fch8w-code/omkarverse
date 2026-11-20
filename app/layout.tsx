import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Omkar Den",
  description: "Tactical 3D Sensory Realm & Museum",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#041329",
          color: "#F8F8F8",
          fontFamily: "'Inter', sans-serif",
          WebkitFontSmoothing: "antialiased",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
