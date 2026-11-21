import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link rel="stylesheet" href="/omkar-header.css" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('ins.look');if(l==='day'||l==='night'){document.documentElement.setAttribute('data-look',l);}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
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
