"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair, AlertTriangle, ArrowLeft } from "lucide-react";

const HEX = "0123456789ABCDEF";

export default function NotFound() {
  const [glitch, setGlitch] = useState("404");

  useEffect(() => {
    let frame = 0;
    const id = setInterval(() => {
      if (frame < 10) {
        setGlitch(
          Array.from({ length: 3 })
            .map(() => HEX[Math.floor(Math.random() * 16)])
            .join("")
        );
        frame++;
      } else {
        setGlitch("404");
        frame = 0;
      }
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 flex flex-col items-center justify-center px-6 tactical-grid overflow-hidden selection:bg-amber-500/20">
      {/* Background conic radar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full radar-sweep-conic animate-spin opacity-10 pointer-events-none" style={{ animationDuration: "6s" }} />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* Glitch numeral */}
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 animate-pulse" />
          <span className="font-mono text-xs text-amber-500 tracking-widest">TARGET ACQUISITION FAILED</span>
        </div>

        <div
          className="font-mono font-black tracking-tighter leading-none mb-2 select-none"
          style={{
            fontSize: "clamp(6rem, 20vw, 12rem)",
            WebkitTextStroke: "2px rgba(229,169,60,0.5)",
            color: "transparent",
            textShadow: "0 0 40px rgba(229,169,60,0.15)",
          }}
        >
          {glitch}
        </div>

        <div className="font-mono text-xs md:text-sm text-slate-400 tracking-widest mb-2 uppercase">
          SECTOR COORDINATES NOT RESOLVED
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-10">
          The requested patrol sector does not exist in the OMKARVERSE territorial grid.
          Return to the command hub and re-establish your bearing.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-semibold tracking-widest shadow-[0_0_20px_rgba(229,169,60,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO HUB
          </Link>
          <Link
            href="/telemetry"
            className="flex items-center gap-2 px-6 py-3 rounded-full glass-panel border border-white/15 hover:border-amber-400/50 text-slate-200 hover:text-amber-400 font-mono text-xs tracking-wider transition-all"
          >
            <Crosshair className="w-4 h-4" />
            OPEN TELEMETRY
          </Link>
        </div>

        {/* Bottom coord strip */}
        <div className="mt-14 font-mono text-[10px] text-slate-700 tracking-widest">
          OMKARVERSE // 20.246° N 79.312° E // TARU CORE 87PX+7FV
        </div>
      </div>
    </main>
  );
}
