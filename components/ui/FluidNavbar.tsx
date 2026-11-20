"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Menu, X } from "lucide-react";
import { soundEngine } from "@/components/audio/soundManager";

interface FluidNavbarProps {
  onToggle3D?: () => void;
  is3DActive?: boolean;
  onSkip?: () => void;
  canSkip?: boolean;
}

// All 5 core navigation points unified into ONE floating dynamic island
const NAV_ITEMS = [
  { name: "OMKARVERSE", path: "/", isHome: true },
  { name: "Telemetry", path: "/telemetry" },
  { name: "Forest", path: "/forest" },
  { name: "Tiger", path: "/tiger" },
  { name: "Field", path: "/field" },
];

export default function FluidNavbar({
  onToggle3D,
  is3DActive = true,
  onSkip,
  canSkip = false,
}: FluidNavbarProps) {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine?.getMuted?.() ?? false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // iOS 26 fluid pointer tilt & dynamic floating physics
  const navRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 280, mass: 0.6 };
  const floatX = useSpring(mouseX, springConfig);
  const floatY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Calculate subtle 3D translation pull (-12px to +12px)
    mouseX.set((e.clientX - centerX) * 0.12);
    mouseY.set((e.clientY - centerY) * 0.18);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredTab(null);
  };

  const handleSoundToggle = () => {
    const muted = soundEngine?.toggleMute?.() ?? false;
    setIsMuted(muted);
  };

  return (
    <>
      <header className="fixed top-5 inset-x-0 z-40 flex items-center justify-center px-4 pointer-events-none">
        {/* Unified iOS 26 Floating Capsule Navbar */}
        <motion.div
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ x: floatX, y: floatY }}
          className="pointer-events-auto relative flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-full glass-panel border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.65)] backdrop-blur-2xl transition-shadow duration-300 hover:shadow-[0_16px_50px_rgba(229,169,60,0.18)] hover:border-white/25"
        >
          {/* Unified Navigation Items: OMKARVERSE + Telemetry + Forest + Tiger + Field */}
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname === item.path ||
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
                  className={`relative px-3 sm:px-4 md:px-5 py-2 rounded-full font-mono text-xs tracking-wider transition-all z-10 select-none whitespace-nowrap flex items-center gap-1.5 ${
                    item.isHome ? "font-bold tracking-widest" : "font-medium"
                  }`}
                >
                  {/* Home Brand Dot / Icon */}
                  {item.isHome && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#e5a93c] animate-pulse" />
                  )}

                  <span
                    className={
                      item.isHome
                        ? isActive
                          ? "text-amber-400 font-black tracking-widest text-glow-amber"
                          : "text-slate-100 font-bold group-hover:text-amber-300"
                        : isActive
                        ? "text-amber-400 font-semibold"
                        : isHovered
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }
                  >
                    {item.name}
                  </span>

                  {/* iOS 26 Spring Physics Pill indicator */}
                  {(isHovered || (isActive && !hoveredTab)) && (
                    <motion.div
                      layoutId="ios26FluidNavPill"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.7,
                      }}
                      className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/20 backdrop-blur-md -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Vertical Tactical Divider */}
          <div className="w-[1px] h-5 bg-white/15 my-auto mx-0.5 sm:mx-1" />

          {/* Action Cluster inside the same floating pill */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Unified SKIP action */}
            {canSkip && onSkip && (
              <button
                onClick={onSkip}
                type="button"
                aria-label="Skip 3D intro"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 font-mono text-[11px] font-semibold tracking-wider transition-all shadow-[0_0_12px_rgba(229,169,60,0.2)] active:scale-95"
              >
                <X className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">SKIP</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={handleSoundToggle}
              type="button"
              aria-label={isMuted ? "Unmute soundscape" : "Mute soundscape"}
              className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-amber-400 transition-colors"
              title={isMuted ? "Sound Muted" : "Sound Active"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
            </button>

            {/* 3D EXP Toggle */}
            {onToggle3D && (
              <button
                onClick={onToggle3D}
                type="button"
                className={`flex items-center justify-center p-2 rounded-full transition-all ${
                  is3DActive
                    ? "text-emerald-400 bg-emerald-400/10 shadow-[0_0_12px_rgba(104,211,145,0.25)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
                }`}
                title="Toggle 3D WebGL Viewport"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Menu trigger for small screens */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              aria-label="Toggle mobile menu"
              className="md:hidden flex items-center justify-center p-2 rounded-full text-slate-300 hover:text-amber-400"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Drawer Navigation (Small Screens) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.85, 0, 0.15, 1] }}
            className="fixed top-24 inset-x-4 z-40 p-4 rounded-2xl glass-panel border border-white/20 md:hidden shadow-2xl flex flex-col gap-2 font-mono text-sm backdrop-blur-2xl bg-[#050709]/90"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname === item.path ||
                    (item.path === "/telemetry" && pathname.startsWith("/telemetry"));
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${
                    isActive
                      ? "border-amber-400/60 bg-amber-500/15 text-amber-400 font-bold"
                      : "border-white/5 hover:border-white/15 text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.isHome && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                    {item.name}
                  </span>
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
