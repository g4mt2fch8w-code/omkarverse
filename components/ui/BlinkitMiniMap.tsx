"use client";

import React, { useState } from "react";
import { Crosshair, Radio } from "lucide-react";
import { soundEngine } from "@/components/audio/soundManager";

interface BlinkitMiniMapProps {
  onExpand?: () => void;
}

export default function BlinkitMiniMap({ onExpand }: BlinkitMiniMapProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    soundEngine?.playRadarPing?.();
    if (onExpand) {
      onExpand();
    } else {
      window.open("https://geoglobe3d.vercel.app", "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className="relative w-[96px] h-[96px] md:w-[110px] md:h-[110px] rounded-xl border border-white/15 overflow-hidden cursor-pointer shadow-2xl transition-transform duration-300 hover:scale-105 group bg-[#060a0f]"
      title="Click to inspect Taru Core in GeoGlobe 3D"
    >
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 tactical-grid opacity-40 group-hover:opacity-60 transition-opacity" />

      {/* Simulated Satellite/Topographic Contour Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25 group-hover:opacity-40 transition-opacity"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5a93c" strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#68d391" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="16" fill="none" stroke="#e5a93c" strokeWidth="0.75" />
        <path d="M 10 50 H 90 M 50 10 V 90" stroke="#ffffff" strokeWidth="0.3" strokeOpacity="0.3" />
      </svg>

      {/* Pulsing Concentric Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="absolute w-8 h-8 rounded-full border border-amber-400/40 animate-ping" />
        <span className="absolute w-14 h-14 rounded-full border border-amber-400/20 animate-pulse" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#e5a93c]" />
      </div>

      {/* Top Tag */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1 font-mono text-[9px] text-emerald-400 tracking-wider">
        <Radio className="w-2.5 h-2.5 animate-pulse" />
        <span>LIVE</span>
      </div>

      {/* Micro HUD Overlay */}
      <div className="absolute bottom-1.5 inset-x-1.5 py-0.5 px-1.5 rounded-md glass-panel flex items-center justify-between font-mono text-[8px] md:text-[9px] text-slate-300">
        <span className="text-amber-400 font-semibold truncate">TARU CORE</span>
        <Crosshair className="w-2.5 h-2.5 text-slate-400" />
      </div>

      {/* Hover Highlight Ring */}
      {isHovered && (
        <div className="absolute inset-0 border-2 border-amber-400/50 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}
