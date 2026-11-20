"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { soundEngine } from "@/components/audio/soundManager";

interface BlinkitMiniMapProps {
  onExpand?: () => void;
}

export default function BlinkitMiniMap({ onExpand }: BlinkitMiniMapProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [tick, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  // Radar sweep rotation (ω=1.4 rad/s)
  useEffect(() => {
    const animate = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      setSweepAngle((a) => (a + 1.4 * dt * (180 / Math.PI)) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame((ts) => {
      lastRef.current = ts;
      rafRef.current = requestAnimationFrame(animate);
    });
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Coordinate toggle
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  const coords = tick % 2 === 0 ? "20.336°N" : "79.299°E";

  const handleClick = () => {
    soundEngine?.playRadarPing?.();
    if (onExpand) {
      onExpand();
    } else {
      // Open exact Google Maps location for Tadoba Temple
      window.open("https://maps.app.goo.gl/c3B6dLV5q9VDyHp57", "_blank");
    }
  };

  const SIZE = 110;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

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
      className={`relative overflow-hidden cursor-pointer rounded-2xl border transition-all duration-300 bg-[#060a0f] shadow-2xl group select-none ${
        isHovered
          ? "border-amber-400/80 shadow-[0_0_24px_rgba(229,169,60,0.35)] scale-105"
          : "border-white/20 hover:border-amber-400/50"
      }`}
      style={{ width: SIZE, height: SIZE }}
      title="Click to view Tadoba Temple on Google Maps"
    >
      {/* 1. Pure High-Res Satellite Image (Non-hybrid, real terrain & canopy) */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/tadoba_satellite.jpg"
          alt="Tadoba Satellite Imagery"
          fill
          sizes="110px"
          priority
          className="object-cover scale-110 filter contrast-110 brightness-90 group-hover:scale-125 transition-transform duration-700 ease-out"
        />
        {/* Obsidian tactical vignette overlay for aesthetic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050709]/80 via-transparent to-[#050709]/40 pointer-events-none" />
      </div>

      {/* 2. Tactical Overlay SVG (Concentric Radar Rings, Subtle Crosshair, & Sweep) */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="absolute inset-0 pointer-events-none"
      >
        <defs>
          <radialGradient id="miniRadarSweepGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e5a93c" stopOpacity="0" />
          </radialGradient>
          <clipPath id="miniMapClip">
            <rect width={SIZE} height={SIZE} rx="16" />
          </clipPath>
        </defs>

        {/* Tactical Crosshair axis lines */}
        <line x1={CX} y1={6} x2={CX} y2={SIZE - 6} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="2,3" />
        <line x1={6} y1={CY} x2={SIZE - 6} y2={CY} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" strokeDasharray="2,3" />

        {/* Concentric telemetry rings */}
        <circle cx={CX} cy={CY} r={44} fill="none" stroke="rgba(229,169,60,0.25)" strokeWidth="0.6" strokeDasharray="3,3" />
        <circle cx={CX} cy={CY} r={28} fill="none" stroke="rgba(104,211,145,0.22)" strokeWidth="0.5" />
        <circle cx={CX} cy={CY} r={14} fill="none" stroke="rgba(229,169,60,0.3)" strokeWidth="0.75" />

        {/* Rotating Radar Sweep Wedge */}
        <g clipPath="url(#miniMapClip)">
          <g transform={`rotate(${sweepAngle}, ${CX}, ${CY})`}>
            <path
              d={`M ${CX} ${CY} L ${CX + 54 * Math.cos((-35 * Math.PI) / 180)} ${
                CY + 54 * Math.sin((-35 * Math.PI) / 180)
              } A 54 54 0 0 1 ${CX + 54} ${CY} Z`}
              fill="url(#miniRadarSweepGrad)"
              opacity={0.4}
            />
            <line x1={CX} y1={CY} x2={CX + 54} y2={CY} stroke="#e5a93c" strokeWidth="1.2" opacity={0.8} />
          </g>
        </g>
      </svg>

      {/* 3. Aesthetic Jumping Tactical Pin at exact center (Tadoba Temple) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Animated ground pulse rings */}
        <span className="absolute w-8 h-8 rounded-full border border-amber-400/50 animate-ping opacity-75" />
        <span className="absolute w-4 h-4 rounded-full bg-amber-400/20 blur-[2px]" />

        {/* Jumping Pin Marker */}
        <div className="relative flex flex-col items-center animate-bounce duration-700 -translate-y-2">
          {/* Glowing Pin Head */}
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 shadow-[0_0_12px_#e5a93c] border border-white" />
            <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-950" />
          </div>
          {/* Pin Pointer Needle */}
          <div className="w-0.5 h-2 bg-gradient-to-b from-amber-400 to-transparent shadow-[0_0_4px_#e5a93c]" />
          {/* Ground Contact Shadow */}
          <div className="w-2.5 h-1 rounded-full bg-black/60 blur-[1px] mt-0.5" />
        </div>
      </div>

      {/* 4. Top Header Coordinates chip */}
      <div className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 font-mono text-[8px] text-amber-300 font-semibold tracking-wider tabular-nums">
        {coords}
      </div>

      {/* 5. Bottom HUD Badge */}
      <div className="absolute bottom-1.5 inset-x-1.5 py-1 px-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between font-mono text-[8px] text-slate-200">
        <span className="text-amber-400 font-semibold tracking-wider truncate">
          TADOBA TEMPLE
        </span>
        <span className="text-emerald-400 font-medium ml-1">MAP ↗</span>
      </div>

      {/* 6. Border Focus Glow */}
      {isHovered && (
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-400 pointer-events-none shadow-[inset_0_0_12px_rgba(229,169,60,0.3)]" />
      )}
    </div>
  );
}
