import React from "react";
import fs from "fs";
import path from "path";
import Script from "next/script";
import { GlobalNav } from "@/components/GlobalNav";
import { FieldFeed, Dispatch } from "@/components/FieldFeed";

export const metadata = {
  title: "FIELD DISPATCHES — THE OMKAR DEN",
  description: "Expedition photography and field dispatches.",
};

export default function FieldPage() {
  const dataPath = path.join(process.cwd(), "data", "field_dispatches.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const dispatches: Dispatch[] = JSON.parse(rawData);

  return (
    <div className="min-h-screen bg-[#041329] text-[#F8F8F8] antialiased selection:bg-amber-400 selection:text-black">
      <link rel="stylesheet" href="/omkar-header.css" />

      {/* Global Navbar */}
      <GlobalNav active="field" />

      {/* Main Editorial Container */}
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-36">
        <FieldFeed initialDispatches={dispatches} />
      </main>

      <Script src="/js/sound-manager.js" strategy="afterInteractive" />
      <Script src="/js/nav-physics.js" strategy="afterInteractive" />
    </div>
  );
}
