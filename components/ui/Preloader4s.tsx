"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/components/audio/soundManager";

interface Preloader4sProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "INITIALIZING OMKARVERSE KERNEL...",
  "ESTABLISHING SAT-LINK TO TADOBA CORE [87PX+7FV]...",
  "PARSING LIDAR POINT-CLOUD BUFFER (65,000 PARTICLES)...",
  "LOCKING 60 FPS WEBGL & GSAP ENGINE...",
  "TACTICAL CLEARANCE GRANTED // SYSTEM READY",
];

export default function Preloader4s({ onComplete }: Preloader4sProps) {
  const [countdown, setCountdown] = useState<number>(4);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  
  // Custom magnetic cursor position
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    let currentX = -100;
    let currentY = -100;

    const renderCursor = () => {
      // Lerp smoothing (0.18 speed)
      currentX += (cursorRef.current.x - currentX) * 0.18;
      currentY += (cursorRef.current.y - currentY) * 0.18;
      setCursorPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(renderCursor);
    };

    animationFrameId = requestAnimationFrame(renderCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => onComplete(), 700);
          }, 300);
          return 0;
        }
        setLogIndex((i) => Math.min(i + 1, BOOT_LOGS.length - 1));
        soundEngine?.playTargetLock?.();
        return prev - 1;
      });
    }, 950);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <>
      {/* Custom Tactical Cursor Follower */}
      <div
        className="pointer-events-none fixed z-50 transition-opacity duration-300"
        style={{
          transform: `translate3d(${cursorPos.x - 16}px, ${cursorPos.y - 16}px, 0)`,
          opacity: cursorPos.x < 0 ? 0 : 1,
        }}
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          <div className="absolute w-8 h-8 rounded-full border border-amber-400/40 animate-ping" />
          <div className="absolute w-6 h-6 rounded-full border border-amber-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
      </div>

      <AnimatePresence>
        {!isFinished && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.65, ease: [0.85, 0, 0.15, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between p-8 md:p-14 bg-[#050709] text-amber-400/90 select-none tactical-grid overflow-hidden"
          >
            {/* Top Tactical Status */}
            <div className="flex items-center justify-between font-mono text-xs tracking-widest text-slate-400">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>SPEC-2026-V1 // BOOTSTRAP SEQUENCE</span>
              </div>
              <div className="hidden sm:block text-slate-500">
                ARCHITECT: ONKAR BHOPLE PATIL
              </div>
              <div>TARU [87PX+7FV]</div>
            </div>

            {/* Center Massive Countdown */}
            <div className="flex flex-col items-center justify-center my-auto">
              <div className="relative font-mono font-bold tracking-tighter text-7xl md:text-9xl text-amber-400">
                <span>00:0{countdown}</span>
                <span className="absolute -bottom-4 right-0 font-mono text-xs tracking-widest text-amber-500/70">
                  SEC REMAINING
                </span>
              </div>

              {/* Dynamic Telemetry Boot log */}
              <motion.div
                key={logIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 font-mono text-xs md:text-sm tracking-wider text-emerald-400/90 text-center"
              >
                {BOOT_LOGS[logIndex]}
              </motion.div>

              {/* Progress bar */}
              <div className="w-64 md:w-96 h-1 mt-6 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((4 - countdown) / 4) * 100}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>
            </div>

            {/* Bottom HUD info */}
            <div className="flex items-center justify-between font-mono text-xs tracking-wider text-slate-500">
              <div className="flex items-center gap-4">
                <span>LAT: 20.246° N</span>
                <span>LON: 79.312° E</span>
              </div>
              <div className="text-amber-500/80">
                BENCHMARK: AMATERASU.AI // MAGNETIC PHYSICS
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
