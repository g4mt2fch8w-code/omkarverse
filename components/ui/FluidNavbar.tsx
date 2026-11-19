"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { soundEngine } from "@/components/audio/soundManager";

interface FluidNavbarProps {
  onToggle3D?: () => void;
  is3DActive?: boolean;
}

const NAV_ITEMS = [
  { name: "Telemetry", path: "/telemetry" },
  { name: "Forest", path: "/forest" },
  { name: "Tiger", path: "/tiger" },
  { name: "Field", path: "/field" },
];

export default function FluidNavbar({ onToggle3D, is3DActive = true }: FluidNavbarProps) {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine?.getMuted?.() ?? false);

  const handleSoundToggle = () => {
    const muted = soundEngine?.toggleMute?.() ?? false;
    setIsMuted(muted);
  };

  return (
    <header className="fixed top-5 inset-x-0 z-30 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto pointer-events-none">
      {/* Brand Identity */}
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2 rounded-full glass-pill border border-white/10 hover:border-amber-400/40 transition-colors group"
      >
        <span className="text-base group-hover:rotate-12 transition-transform duration-300">🪐</span>
        <span className="font-mono text-xs md:text-sm tracking-widest font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
          OMKARVERSE
        </span>
      </Link>

      {/* Main Navigation (108.supply Physics) */}
      <nav
        onMouseLeave={() => setHoveredTab(null)}
        className="pointer-events-auto relative hidden sm:flex items-center p-1 rounded-full glass-panel border border-white/10 shadow-2xl"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path || (item.path === "/telemetry" && pathname.startsWith("/telemetry"));
          const isHovered = hoveredTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.path}
              onMouseEnter={() => {
                setHoveredTab(item.name);
                soundEngine?.playTargetLock?.();
              }}
              className="relative px-4 py-1.5 font-mono text-xs tracking-wider transition-colors z-10 select-none"
            >
              <span
                className={
                  isActive
                    ? "text-amber-400 font-medium"
                    : isHovered
                    ? "text-slate-100"
                    : "text-slate-400 hover:text-slate-200"
                }
              >
                {item.name}
              </span>

              {/* Active / Hover Background Pill with 108.supply spring physics */}
              {(isHovered || (isActive && !hoveredTab)) && (
                <motion.div
                  layoutId="fluidNavbarPill"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                    mass: 0.8,
                  }}
                  className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/15 backdrop-blur-md -z-10 shadow-inner"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action Controls: Sound & 3D Exp */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={handleSoundToggle}
          type="button"
          aria-label={isMuted ? "Unmute soundscape" : "Mute soundscape"}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-400 font-mono text-xs transition-colors"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
          <span className="hidden md:inline">{isMuted ? "MUTED" : "SOUND"}</span>
        </button>

        {/* 3D EXP Trigger */}
        <button
          onClick={onToggle3D}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill border font-mono text-xs transition-all ${
            is3DActive
              ? "border-emerald-400/40 text-emerald-400 shadow-[0_0_12px_rgba(104,211,145,0.2)]"
              : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">3D EXP</span>
        </button>
      </div>
    </header>
  );
}
