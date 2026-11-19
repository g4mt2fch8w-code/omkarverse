"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/components/audio/soundManager";
import { Compass, ShieldCheck, Activity, Terminal } from "lucide-react";

interface Preloader4sProps {
  onComplete: () => void;
}

const SEQUENCE_STAGES = [
  {
    sec: 4,
    code: "00:04",
    tag: "SAT-SYNC",
    message: "LOCKING ORBITAL TELEMETRY VECTORS // 8,000M ALTITUDE",
    sub: "GEO-SPATIAL EPHEMERIS SYNCED WITH CARTOGRAPHIC TILES",
    progress: 25,
  },
  {
    sec: 3,
    code: "00:03",
    tag: "GRID-LOCK",
    message: "RESOLVING TADOBA CORE GEO-HASH // 87PX+7FV",
    sub: "COORDINATES: 20.246° N, 79.312° E // ELEVATION 208M",
    progress: 50,
  },
  {
    sec: 2,
    code: "00:02",
    tag: "LIDAR-CORE",
    message: "INSTANTIATING 65,000 HOOKIAN DAMPED BUFFER PARTICLES",
    sub: "HARMONIC OSCILLATOR MATRIX: k=0.18, c=0.85, R=90PX",
    progress: 75,
  },
  {
    sec: 1,
    code: "00:01",
    tag: "ENGINE",
    message: "ACES FILMIC TONE-MAPPING & 60 FPS WEBGL CALIBRATION",
    sub: "FOG DENSITY 0.00015 // VOLUMETRIC ATMOSPHERIC HAZE READY",
    progress: 95,
  },
  {
    sec: 0,
    code: "00:00",
    tag: "AUTHENTICATED",
    message: "ARCHITECT: ONKAR BHOPLE PATIL // SYSTEM ENGAGED",
    sub: "SANCTUARY & TACTICAL GIS DIGITAL TERRITORY UNLOCKED",
    progress: 100,
  },
];

export default function Preloader4s({ onComplete }: Preloader4sProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [hexFlicker, setHexFlicker] = useState<string>("0x87PX7FV");
  const hasCompleted = useRef(false);

  // Hexadecimal random stream effect
  useEffect(() => {
    const hexChars = "0123456789ABCDEF";
    const interval = setInterval(() => {
      let str = "0x";
      for (let i = 0; i < 7; i++) {
        str += hexChars[Math.floor(Math.random() * hexChars.length)];
      }
      setHexFlicker(str);
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // 4-Second Sequence Timer
  useEffect(() => {
    // Stage 0 (00:04) starts immediately
    soundEngine?.playRadarPing?.();

    const timeouts = [
      setTimeout(() => {
        setCurrentStageIdx(1); // 00:03
        soundEngine?.playRadarPing?.();
      }, 1000),

      setTimeout(() => {
        setCurrentStageIdx(2); // 00:02
        soundEngine?.playRadarPing?.();
      }, 2000),

      setTimeout(() => {
        setCurrentStageIdx(3); // 00:01
        soundEngine?.playRadarPing?.();
      }, 3000),

      setTimeout(() => {
        setCurrentStageIdx(4); // 00:00
        soundEngine?.playTargetLock?.();
      }, 4000),

      setTimeout(() => {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          setIsFinished(true);
          setTimeout(() => onComplete(), 700);
        }
      }, 4400),
    ];

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (!hasCompleted.current) {
      hasCompleted.current = true;
      soundEngine?.playTargetLock?.();
      setIsFinished(true);
      setTimeout(() => onComplete(), 300);
    }
  };

  const stage = SEQUENCE_STAGES[currentStageIdx];

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(8px)",
          }}
          transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-40 flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-[#050709] text-amber-400 select-none tactical-grid overflow-hidden"
        >
          {/* Subtle Ambient Scanline & Conic Radar Sweep */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full radar-sweep-conic animate-spin" style={{ animationDuration: "6s" }} />
          </div>

          {/* Top Tactical Status HUD */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs tracking-widest text-slate-400 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-slate-300 font-semibold">OMKARVERSE // SPEC-2026-V1</span>
              <span className="hidden sm:inline text-slate-500">[{hexFlicker}]</span>
            </div>

            <div className="hidden lg:flex items-center gap-6 text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>60 FPS KERNEL LOCK</span>
              </span>
              <span>ARCHITECT: ONKAR BHOPLE PATIL</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-amber-500 font-semibold">TARU [87PX+7FV]</span>
              <button
                onClick={handleSkip}
                type="button"
                className="px-3 py-1 rounded-full glass-panel border border-white/10 hover:border-amber-400/60 text-slate-300 hover:text-amber-400 text-[10px] tracking-wider transition-colors active:scale-95"
              >
                SKIP ➔
              </button>
            </div>
          </div>

          {/* Center Stage: Massive Digital Stencil Timer & Telemetry Logs */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* Stage Code Tag */}
            <div className="flex items-center gap-2 mb-3 font-mono text-xs md:text-sm text-emerald-400 tracking-widest uppercase">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>STAGE {currentStageIdx + 1}/5 // {stage.tag}</span>
            </div>

            {/* Countdown Numbers */}
            <div className="relative font-mono font-bold tracking-tighter text-8xl sm:text-9xl md:text-[11rem] leading-none text-amber-400 drop-shadow-[0_0_32px_rgba(229,169,60,0.3)]">
              <span>{stage.code}</span>
              <span className="absolute -bottom-3 sm:-bottom-5 right-1 sm:right-2 font-mono text-[10px] sm:text-xs tracking-widest text-amber-500/70 font-normal">
                SEC T-MINUS
              </span>
            </div>

            {/* Dynamic Telemetry Boot Log */}
            <div className="mt-8 sm:mt-10 max-w-2xl text-center px-4">
              <motion.div
                key={stage.tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-xs sm:text-sm md:text-base font-semibold tracking-wider text-slate-100"
              >
                {stage.message}
              </motion.div>
              <div className="font-mono text-[11px] sm:text-xs text-slate-500 mt-1 tracking-wide">
                {stage.sub}
              </div>
            </div>

            {/* High-Precision Progress Bar */}
            <div className="w-72 sm:w-96 md:w-[480px] h-1.5 mt-8 rounded-full bg-slate-900 overflow-hidden border border-white/10 p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(229,169,60,0.6)]"
                initial={{ width: "0%" }}
                animate={{ width: `${stage.progress}%` }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between w-72 sm:w-96 md:w-[480px] mt-2 font-mono text-[10px] text-slate-500">
              <span>INITIALIZING</span>
              <span className="text-amber-400 font-semibold">{stage.progress}%</span>
              <span>ENGAGED</span>
            </div>
          </div>

          {/* Bottom HUD Metadata */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-xs tracking-wider text-slate-500 border-t border-white/5 pt-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>LAT: 20.246° N // LON: 79.312° E</span>
              </span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span className="hidden md:inline">DATUM: WGS 84</span>
            </div>
            <div className="flex items-center gap-2 text-amber-500/80">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BENCHMARK: AMATERASU.AI // MAGNETIC PHYSICS</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
