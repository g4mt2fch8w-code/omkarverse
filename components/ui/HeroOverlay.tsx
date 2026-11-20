"use client";

/**
 * HeroOverlay — Ultra-minimal Awwwards HUD
 * Zero text overlapping. Keeps the 3D WebGL scene breathing.
 * Top-left: Minimal stencil brand tag
 * Bottom-left: Exactly ONE clean tactical coordinate chip:
 *   [ 📍 TADOBA CORE // 20.246° N, 79.312° E ]
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { SceneStage } from "@/components/3d/SceneOrchestrator";
import { MapPin } from "lucide-react";

interface HeroOverlayProps {
  stage: SceneStage;
  isBooted: boolean;
}

export default function HeroOverlay({ stage, isBooted }: HeroOverlayProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide when diving — full immersion focus
  if (!mounted || !isBooted || stage === "diving") return null;

  const isOrbit = stage === "orbit";

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none overflow-hidden">
      {/* Top-Left: Elegant Stencil Branding — Only in Orbit */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: isOrbit ? 1 : 0, x: isOrbit ? 0 : -20 }}
        transition={{ duration: 0.6, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
        className="absolute top-24 left-6 md:left-10"
      >
        <div
          className="font-mono font-black tracking-tighter leading-none select-none"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            WebkitTextStroke: "1.2px rgba(229,169,60,0.6)",
            color: "rgba(229,169,60,0.04)",
            textShadow: "0 0 30px rgba(229,169,60,0.2)",
            lineHeight: 0.88,
          }}
        >
          OMKAR<br />
          <span
            style={{
              WebkitTextStroke: "1.2px rgba(104,211,145,0.6)",
              color: "rgba(104,211,145,0.04)",
              textShadow: "0 0 30px rgba(104,211,145,0.2)",
            }}
          >
            VERSE
          </span>
        </div>
        <div className="mt-2.5 font-mono text-[10px] md:text-xs tracking-[0.25em] text-slate-400 uppercase">
          Digital Sanctuary // Tactical GIS Universe
        </div>
      </motion.div>

      {/* Bottom-Left: EXACTLY ONE clean, minimal coordinate chip (Rule 3) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
        className="absolute bottom-6 left-6"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-white/15 font-mono text-[11px] text-slate-200 shadow-xl backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="text-amber-400 font-semibold tracking-wider">
            {isOrbit ? "TADOBA CORE" : "TADOBA CANOPY"}
          </span>
          <span className="text-slate-500">//</span>
          <span className="text-slate-300 font-medium">20.246° N, 79.312° E</span>
        </div>
      </motion.div>

      {/* Subtle Right Edge Scroll Guide */}
      {isOrbit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute top-1/2 right-6 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3"
        >
          <span
            className="font-mono text-[9px] tracking-[0.35em] text-slate-400 uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll to Dive · Drag to Rotate
          </span>
          <div className="w-px h-14 bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />
        </motion.div>
      )}
    </div>
  );
}
