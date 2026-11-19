"use client";

import React, { useState, useEffect, useRef } from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fingerprint,
  MapPin,
  Crosshair,
  Shield,
  Activity,
  Eye,
  Camera,
  ChevronRight,
} from "lucide-react";

// Blueprint-exact roster — 3 hero profiles, 102 queued
const HERO_TIGERS = [
  {
    id: "T-54",
    name: "RUDRA",
    epithet: "The Sovereign of Taru",
    status: "RESIDENT MALE",
    statusColor: "emerald",
    territory: "TARU CORE // 42 KM²",
    lastSeen: "SECTOR 4 JAFRABAD BEAT",
    collarFreq: "147.820 MHz",
    weight: "218 KG",
    age: "7 YRS",
    sightings: 94,
    bio: "Alpha territorial male. Dominant across the central Tadoba core zone. Responsible for 3 documented litter events with T-72. Stripe signature confirmed across 94 camera-trap events in M-STrIPES.",
    stripePattern: [0.9, 0.3, 0.7, 0.1, 0.8, 0.5, 0.95, 0.2, 0.6, 0.4, 0.85, 0.15],
    coords: "20.228°N 79.308°E",
  },
  {
    id: "T-114",
    name: "CHOTI TARA",
    epithet: "Star of Moharli",
    status: "TERRITORIAL FEMALE",
    statusColor: "amber",
    territory: "MOHARLI BUFFER // 28 KM²",
    lastSeen: "WATERHOLE 7 MOHARLI",
    collarFreq: "149.100 MHz",
    weight: "142 KG",
    age: "5 YRS",
    sightings: 71,
    bio: "Sub-adult female who established her own territory at age 3. Known for daylight traversals of the Moharli buffer zone. PIRS Iris Engine has catalogued her as a high-confidence ID with 71 verified sightings.",
    stripePattern: [0.4, 0.8, 0.2, 0.9, 0.35, 0.75, 0.1, 0.65, 0.5, 0.88, 0.3, 0.6],
    coords: "20.251°N 79.335°E",
  },
  {
    id: "T-60",
    name: "VEER",
    epithet: "The Kolsa Nomad",
    status: "DOMINANT MALE",
    statusColor: "emerald",
    territory: "KOLSA RANGE // 35 KM²",
    lastSeen: "FIREBREAK KOLSA NORTH",
    collarFreq: "152.440 MHz",
    weight: "196 KG",
    age: "9 YRS",
    sightings: 118,
    bio: "Aging dominant male maintaining a large eastern range. Known for extraordinary longevity and territorial persistence. Highest camera-trap detection rate in the entire Tadoba-Andhari ecosystem at 118 events.",
    stripePattern: [0.6, 0.15, 0.85, 0.4, 0.95, 0.25, 0.7, 0.5, 0.1, 0.8, 0.45, 0.9],
    coords: "20.198°N 79.362°E",
  },
];

// Animated stripe SVG — procedural biometric stripe visualization
function StripeViz({ pattern }: { pattern: number[] }) {
  return (
    <svg viewBox="0 0 120 48" className="w-full h-12 opacity-80" preserveAspectRatio="none">
      {pattern.map((v, i) => {
        const x = (i / pattern.length) * 120;
        const width = (120 / pattern.length) * 0.6;
        const h = v * 44 + 2;
        const y = (48 - h) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={width}
            height={h}
            fill={i % 3 === 0 ? "#e5a93c" : i % 3 === 1 ? "#d97706" : "#78350f"}
            opacity={0.7 + v * 0.3}
            rx={1}
          />
        );
      })}
      {/* Overlay scan line */}
      <line x1="0" y1="24" x2="120" y2="24" stroke="rgba(229,169,60,0.3)" strokeWidth="0.5" strokeDasharray="2,2" />
    </svg>
  );
}

// Live blinking hex ID display
function HexIdDisplay({ id }: { id: string }) {
  const [display, setDisplay] = useState(id);
  const HEX = "0123456789ABCDEF";

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      if (frame < 6) {
        setDisplay(
          id.split("").map((c, i) => (i < frame ? c : (c === "-" ? "-" : HEX[Math.floor(Math.random() * 16)]))).join("")
        );
        frame++;
      } else {
        setDisplay(id);
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [id]);

  return <span>{display}</span>;
}

export default function TigerPage() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeTiger = HERO_TIGERS[activeIdx];

  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 overflow-x-hidden selection:bg-amber-500/20 selection:text-amber-300">
      <FluidNavbar />

      {/* Tactical stripe pattern full-bleed background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(105deg, #e5a93c 0px, #e5a93c 2px, transparent 2px, transparent 28px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-amber-500 tracking-widest mb-2 uppercase">
              <Fingerprint className="w-3.5 h-3.5" />
              <span>PIRS IRIS ENGINE // CENTRAL INDIA ROSTER</span>
            </div>
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight text-slate-100 leading-none">
              THE 105<br />
              <span className="text-amber-400">NAMED TIGERS</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
              Curated lineage database and biometrical stripe registries. PIRS Iris Engine flank vectors
              linking historical sightings with current GPS collar telemetry across Tadoba-Andhari Tiger Reserve.
            </p>
          </div>

          {/* Live stats strip */}
          <div className="flex flex-row md:flex-col gap-3 font-mono text-xs">
            <div className="px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-center">
              <div className="text-2xl font-bold text-amber-400">105</div>
              <div className="text-slate-500 text-[10px] mt-0.5">CATALOGUED</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl glass-panel border border-white/10 text-center">
              <div className="text-2xl font-bold text-emerald-400">3</div>
              <div className="text-slate-500 text-[10px] mt-0.5">HERO PROFILES</div>
            </div>
          </div>
        </div>

        {/* Profile selector tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {HERO_TIGERS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setActiveIdx(i)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs tracking-wider border transition-all whitespace-nowrap ${
                activeIdx === i
                  ? "bg-amber-500/15 border-amber-400/60 text-amber-400 shadow-[0_0_16px_rgba(229,169,60,0.2)]"
                  : "glass-pill border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {t.id} — {t.name}
            </button>
          ))}
        </div>

        {/* Main dossier panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTiger.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10"
          >
            {/* Left — dossier card */}
            <div className="lg:col-span-3 p-6 md:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

              {/* Tiger ID header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-mono text-xs text-amber-500/80 tracking-widest mb-1">DOSSIER // ACTIVE PROFILE</div>
                  <h2 className="font-mono text-4xl md:text-5xl font-bold text-amber-400 leading-none tracking-tight">
                    <HexIdDisplay id={activeTiger.id} />
                  </h2>
                  <div className="font-mono text-xl md:text-2xl font-semibold text-slate-100 mt-1 tracking-wide">
                    {activeTiger.name}
                  </div>
                  <div className="font-mono text-xs text-slate-500 mt-0.5 italic">{activeTiger.epithet}</div>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border ${
                  activeTiger.statusColor === "emerald"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {activeTiger.status}
                </span>
              </div>

              {/* Biometric stripe viz */}
              <div className="mb-6">
                <div className="font-mono text-[10px] text-slate-500 mb-2 tracking-widest">FLANK STRIPE SIGNATURE — PIRS BIOMETRIC VECTOR</div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <StripeViz pattern={activeTiger.stripePattern} />
                </div>
              </div>

              {/* Bio */}
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">{activeTiger.bio}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                {[
                  { label: "WEIGHT", value: activeTiger.weight, icon: <Shield className="w-3 h-3" /> },
                  { label: "AGE CLASS", value: activeTiger.age, icon: <Activity className="w-3 h-3" /> },
                  { label: "CT EVENTS", value: String(activeTiger.sightings), icon: <Camera className="w-3 h-3" /> },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-1">
                    <span className="text-slate-500 flex items-center gap-1">{s.icon}{s.label}</span>
                    <span className="text-amber-400 font-bold text-base md:text-lg">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — tactical intel sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* GPS & Telemetry */}
              <div className="p-5 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-4 pb-2 border-b border-white/5">
                  <MapPin className="w-4 h-4" />
                  <span>FIELD TELEMETRY</span>
                </div>
                <div className="space-y-3 text-slate-400">
                  {[
                    { k: "TERRITORY", v: activeTiger.territory, c: "text-amber-400" },
                    { k: "LAST SIGHTING", v: activeTiger.lastSeen, c: "text-slate-100" },
                    { k: "COLLAR FREQ", v: activeTiger.collarFreq, c: "text-emerald-400" },
                    { k: "GPS COORDS", v: activeTiger.coords, c: "text-slate-100" },
                    { k: "DATABASE", v: "M-STrIPES v3 / NTCA", c: "text-slate-300" },
                  ].map(({ k, v, c }) => (
                    <div key={k} className="flex justify-between items-center">
                      <span className="text-slate-500">{k}</span>
                      <span className={`${c} font-medium text-right`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detection grid — sighting bar */}
              <div className="p-5 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-semibold mb-4">
                  <Eye className="w-4 h-4" />
                  <span>DETECTION RECORD</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>CAMERA TRAP EVENTS</span>
                    <span className="text-amber-400 font-bold">{activeTiger.sightings}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(229,169,60,0.5)]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min((activeTiger.sightings / 120) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    />
                  </div>
                  <div className="text-slate-600 text-[10px] mt-1">RELATIVE TO RESERVE MAX (120 EVENTS)</div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">IDENTITY CONFIDENCE: {activeTiger.sightings > 90 ? "98.7%" : activeTiger.sightings > 70 ? "97.2%" : "96.1%"}</span>
                </div>
              </div>

              {/* Quick nav to other profiles */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
                <div className="text-slate-500 mb-3 tracking-widest">OTHER PROFILES</div>
                <div className="flex flex-col gap-2">
                  {HERO_TIGERS.filter((_, i) => i !== activeIdx).map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveIdx(HERO_TIGERS.indexOf(t))}
                      type="button"
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-white/5 hover:border-amber-400/30 hover:bg-amber-500/5 text-slate-400 hover:text-amber-400 transition-all group"
                    >
                      <span>{t.id} — {t.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 102 Queued notice — elevated design */}
        <div className="relative p-6 md:p-8 rounded-3xl border border-amber-500/20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, #e5a93c 0px, #e5a93c 1px, transparent 1px, transparent 24px)",
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-mono text-xs text-amber-500 tracking-widest mb-2">PIPELINE STATUS</div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-slate-100">
                102 PROFILES <span className="text-amber-400">QUEUED</span>
              </div>
              <p className="text-slate-500 text-xs mt-2 max-w-lg leading-relaxed">
                Full camera-trap flank identification matrices, age-class demographic tables, and GPS collar histories
                will ingest through the PIRS Iris Engine pipeline in the Day 2 sync cycle.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 font-mono text-xs">
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="34"
                    fill="none"
                    stroke="#e5a93c"
                    strokeWidth="6"
                    strokeDasharray={`${(3 / 105) * 213.6} 213.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-amber-400 font-bold text-sm">3%</span>
                </div>
              </div>
              <span className="text-slate-500">INGESTED</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
