"use client";

/**
 * HeroOverlay — editorial stencil title that sits atop the 3D WebGL canvas.
 * Inspired by awwwards.com/sites with typographic anchoring and live telemetry chips.
 * Fades in after boot. Never obscures the 3D scene center.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SceneStage } from "@/components/3d/SceneOrchestrator";

interface HeroOverlayProps {
  stage: SceneStage;
  isBooted: boolean;
}

export default function HeroOverlay({ stage, isBooted }: HeroOverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Hide when diving / settled — the 3D scene takes full focus
  if (!mounted || !isBooted || stage === "diving") return null;

  const isOrbit = stage === "orbit";
  const isGround = stage === "lidar" || stage === "settled";

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">

      {/* Top-Left: massive stencil wordmark — appears only on orbit */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: isOrbit ? 1 : 0, x: isOrbit ? 0 : -24 }}
        transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
        className="absolute top-24 left-6 md:left-10"
      >
        {/* Giant stencil letterforms — with enhanced visible intensity & subtle glow */}
        <div
          className="font-mono font-black tracking-tighter leading-none select-none"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            WebkitTextStroke: "1.5px rgba(229,169,60,0.65)",
            color: "rgba(229,169,60,0.06)",
            textShadow: "0 0 35px rgba(229,169,60,0.25)",
            lineHeight: 0.88,
          }}
        >
          OMKAR<br />
          <span
            style={{
              WebkitTextStroke: "1.5px rgba(104,211,145,0.65)",
              color: "rgba(104,211,145,0.06)",
              textShadow: "0 0 35px rgba(104,211,145,0.25)",
            }}
          >
            VERSE
          </span>
        </div>

        {/* Sub-label */}
        <div className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.3em] text-slate-500 uppercase">
          Digital Sanctuary // Tactical GIS Universe
        </div>
      </motion.div>

      {/* Bottom-Left: live telemetry ticker strip — always visible in orbit */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: isOrbit ? 1 : 0, y: isOrbit ? 0 : 24 }}
        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
        className="absolute bottom-6 left-6 flex flex-col gap-1.5"
      >
        <LiveChip label="ALT" value="8,000 M" color="amber" />
        <LiveChip label="CORE" value="87PX+7FV" color="emerald" />
        <LiveChip label="SYS" value="60 FPS LOCKED" color="slate" />
      </motion.div>

      {/* Right edge: vertical text — rotated editorial tag */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: isOrbit ? 0.5 : 0, x: isOrbit ? 0 : 24 }}
        transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.3 }}
        className="absolute top-1/2 right-6 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3"
      >
        <span
          className="font-mono text-[10px] tracking-[0.4em] text-slate-500 uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to Dive · Drag to Rotate
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" />
      </motion.div>

      {/* Ground-level reveal: different editorial overlay after landing */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: isGround ? 1 : 0, y: isGround ? 0 : 16 }}
        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1] }}
        className="absolute top-24 left-6 md:left-10"
      >
        <div className="font-mono text-[10px] tracking-widest text-emerald-400 mb-1 uppercase">
          LiDAR Active // 65,000 Pts
        </div>
        <div className="font-mono text-xs md:text-sm text-slate-300 font-semibold tracking-wide">
          TADOBA CANOPY — 25M HOVER
        </div>
      </motion.div>
    </div>
  );
}

function LiveChip({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "amber" | "emerald" | "slate";
}) {
  const textCls =
    color === "amber"
      ? "text-amber-400"
      : color === "emerald"
      ? "text-emerald-400"
      : "text-slate-400";

  return (
    <div className="flex items-center gap-2 glass-pill px-2.5 py-1 rounded-full border border-white/10 font-mono text-[10px]">
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${textCls} animate-pulse`} />
      <span className="text-slate-500">{label}</span>
      <span className={`${textCls} font-semibold`}>{value}</span>
    </div>
  );
}
