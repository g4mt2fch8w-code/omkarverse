"use client";

import React, { useState, useEffect, useRef } from "react";
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

  // Radar sweep at ω=1.4 rad/s — same spec as main radar
  useEffect(() => {
    const animate = (ts: number) => {
      const dt = Math.min((ts - lastRef.current) / 1000, 0.05);
      lastRef.current = ts;
      setSweepAngle((a) => (a + 1.4 * dt * (180 / Math.PI)) % 360);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame((ts) => { lastRef.current = ts; rafRef.current = requestAnimationFrame(animate); });
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Coordinate flicker every 2s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const coords = tick % 2 === 0 ? "20.246°N" : "79.312°E";

  const handleClick = () => {
    soundEngine?.playRadarPing?.();
    if (onExpand) {
      onExpand();
    } else {
      window.open("https://geoglobe3d.vercel.app", "_blank");
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
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
      className={`relative overflow-hidden cursor-pointer rounded-xl border transition-all duration-300 bg-[#060a0f] shadow-2xl ${
        isHovered
          ? "border-amber-400/60 shadow-[0_0_20px_rgba(229,169,60,0.2)] scale-105"
          : "border-white/15"
      }`}
      style={{ width: SIZE, height: SIZE }}
      title="Click to inspect Taru Core in GeoGlobe 3D"
    >
      {/* SVG canvas — all tactical elements drawn precisely */}
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="absolute inset-0"
      >
        {/* Tactical grid */}
        <defs>
          <pattern id="mmGrid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>
          {/* Radar sweep gradient */}
          <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e5a93c" stopOpacity="0" />
          </radialGradient>
          <clipPath id="circleClip">
            <circle cx={CX} cy={CY} r={CX - 1} />
          </clipPath>
        </defs>

        {/* Background grid */}
        <rect width={SIZE} height={SIZE} fill="url(#mmGrid)" />

        {/* Topographic contour rings — Taru Core elevation model */}
        <circle cx={CX} cy={CY} r={42} fill="none" stroke="#e5a93c" strokeWidth="0.4" strokeDasharray="3 3" opacity={0.25} />
        <circle cx={CX} cy={CY} r={30} fill="none" stroke="#68d391" strokeWidth="0.4" opacity={0.2} />
        <circle cx={CX} cy={CY} r={18} fill="none" stroke="#e5a93c" strokeWidth="0.6" opacity={0.3} />
        <circle cx={CX} cy={CY} r={8}  fill="none" stroke="#e5a93c" strokeWidth="0.8" opacity={0.5} />

        {/* Cross-hair axis */}
        <line x1={CX} y1={4} x2={CX} y2={SIZE - 4} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        <line x1={4} y1={CY} x2={SIZE - 4} y2={CY} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {/* Radar sweep — conic wedge, rotating */}
        <g clipPath="url(#circleClip)">
          <g transform={`rotate(${sweepAngle}, ${CX}, ${CY})`}>
            {/* Trailing glow wedge */}
            <path
              d={`M ${CX} ${CY} L ${CX + 50 * Math.cos(-40 * Math.PI / 180)} ${CY + 50 * Math.sin(-40 * Math.PI / 180)} A 50 50 0 0 1 ${CX + 50} ${CY} Z`}
              fill="url(#sweepGrad)"
              opacity={0.35}
            />
            {/* Leading sweep line */}
            <line x1={CX} y1={CY} x2={CX + 50} y2={CY} stroke="#e5a93c" strokeWidth="1" opacity={0.7} />
          </g>
        </g>

        {/* Outer radar ring */}
        <circle cx={CX} cy={CY} r={CX - 1} fill="none" stroke="rgba(229,169,60,0.2)" strokeWidth="1" />

        {/* Satellite nodes at known positions (simulated nearby reserves) */}
        {[
          { angle: 35,  r: 36, color: "#68d391", label: "MOHARLI",  size: 1.8 },
          { angle: 160, r: 32, color: "#68d391", label: "KOLSA",    size: 1.6 },
          { angle: 290, r: 40, color: "#e5a93c", label: "NAVEGAON", size: 1.5 },
        ].map(({ angle, r, color, label, size }) => {
          const rad = angle * Math.PI / 180;
          const x = CX + r * Math.cos(rad);
          const y = CY + r * Math.sin(rad);
          return (
            <g key={label}>
              <circle cx={x} cy={y} r={size} fill={color} opacity={0.7} />
              <circle cx={x} cy={y} r={size + 2} fill="none" stroke={color} strokeWidth="0.5" opacity={0.3} />
            </g>
          );
        })}

        {/* Taru Core — central target */}
        <circle cx={CX} cy={CY} r={3} fill="#e5a93c" />
        <circle cx={CX} cy={CY} r={6} fill="none" stroke="#e5a93c" strokeWidth="1" opacity={0.6} />
        <circle
          cx={CX} cy={CY} r={9}
          fill="none"
          stroke="#e5a93c"
          strokeWidth="0.5"
          opacity={0.3}
          strokeDasharray="2 2"
        />
      </svg>

      {/* LIVE badge */}
      <div className="absolute top-1.5 left-2 flex items-center gap-1 font-mono text-[8px] text-emerald-400 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>LIVE</span>
      </div>

      {/* Coordinate flicker */}
      <div className="absolute top-1.5 right-2 font-mono text-[8px] text-amber-400/70 tabular-nums">
        {coords}
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-1.5 inset-x-1.5 py-0.5 px-1.5 rounded-md glass-panel flex items-center justify-between font-mono text-[8px] text-slate-300">
        <span className="text-amber-400 font-semibold">TARU 87PX+7FV</span>
        <span className="text-slate-500">{Math.round(sweepAngle)}°</span>
      </div>

      {/* Hover glow ring */}
      {isHovered && (
        <div className="absolute inset-0 rounded-xl border-2 border-amber-400/60 pointer-events-none" />
      )}
    </div>
  );
}
