"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const handleSoundToggle = () => {
    const muted = soundEngine?.toggleMute?.() ?? false;
    setIsMuted(muted);
  };

  return (
    <>
      <header className="fixed top-5 inset-x-0 z-30 flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto pointer-events-none">
        {/* Brand Identity: Replaced pill with small, high-intensity stencil logo */}
        <Link
          href="/"
          className="pointer-events-auto flex flex-col group select-none transition-transform hover:scale-105"
        >
          <div
            className="font-mono font-black tracking-tight leading-none text-glow-amber"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              WebkitTextStroke: "1px #e5a93c",
              color: "rgba(229, 169, 60, 0.15)",
              letterSpacing: "0.08em",
            }}
          >
            OMKAR
          </div>
          <div
            className="font-mono font-black tracking-tight leading-none text-glow-emerald -mt-0.5"
            style={{
              fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
              WebkitTextStroke: "1px #68d391",
              color: "rgba(104, 211, 145, 0.15)",
              letterSpacing: "0.08em",
            }}
          >
            VERSE
          </div>
        </Link>

        {/* Desktop Navigation (108.supply Physics) */}
        <nav
          onMouseLeave={() => setHoveredTab(null)}
          className="pointer-events-auto relative hidden md:flex items-center p-1 rounded-full glass-panel border border-white/10 shadow-2xl"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === "/telemetry" && pathname.startsWith("/telemetry"));
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

                {/* 108.supply Spring Physics Pill */}
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

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            type="button"
            aria-label={isMuted ? "Unmute soundscape" : "Mute soundscape"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-amber-400 font-mono text-xs transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            )}
            <span className="hidden sm:inline">{isMuted ? "MUTED" : "SOUND"}</span>
          </button>

          {/* 3D EXP Trigger — only shown on pages that support the 3D canvas */}
          {onToggle3D && (
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
              <span className="hidden sm:inline">3D EXP</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
            aria-label="Toggle mobile menu"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full glass-pill border border-white/10 text-slate-300 hover:text-amber-400 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 inset-x-4 z-40 p-4 rounded-2xl glass-panel border border-white/15 md:hidden shadow-2xl flex flex-col gap-2 font-mono text-sm"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl border transition-colors flex items-center justify-between ${
                    isActive
                      ? "border-amber-400/50 bg-amber-500/10 text-amber-400 font-semibold"
                      : "border-white/5 hover:border-white/15 text-slate-300"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-500">SPEC // 2026</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
