"use client";

import React, { useState, useEffect } from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import { motion } from "framer-motion";
import {
  Leaf,
  Thermometer,
  Droplets,
  Wind,
  Radio,
  Activity,
  MapPin,
  Eye,
} from "lucide-react";

// Simulated LiDAR canopy telemetry layers — Tadoba forest ecology
const CANOPY_LAYERS = [
  {
    id: "emergent",
    name: "EMERGENT LAYER",
    elevation: "24–32M",
    species: ["Teak (Tectona grandis)", "Ain (Terminalia elliptica)"],
    density: 0.18,
    color: "#68d391",
    ndvi: 0.84,
    description: "Uppermost crown layer. Primary canopy of mature teak and ain. High solar interception rate. Tiger movement rare — observed only during territorial boundary patrols.",
  },
  {
    id: "canopy",
    name: "CANOPY LAYER",
    elevation: "14–24M",
    species: ["Bija (Pterocarpus marsupium)", "Dhawda (Anogeissus latifolia)"],
    density: 0.52,
    color: "#4ade80",
    ndvi: 0.76,
    description: "Principal forest canopy. Dense interlocking crowns providing primary thermoregulation. Langur sentinel colonies at 18–22M. Tiger sub-adult sightings at dawn perimeter crossings.",
  },
  {
    id: "understory",
    name: "UNDERSTORY",
    elevation: "5–14M",
    species: ["Bamboo (Dendrocalamus strictus)", "Tendu (Diospyros melanoxylon)"],
    density: 0.71,
    color: "#a3e635",
    ndvi: 0.62,
    description: "High-density bamboo and tendu thickets. Primary tiger movement corridor. Camera-trap placement tier — sectors 3, 4, 7, 11. 68% of T-54 Rudra sightings recorded at this elevation band.",
  },
  {
    id: "shrub",
    name: "SHRUB LAYER",
    elevation: "0.5–5M",
    species: ["Lantana (invasive)", "Ziziphus mauritiana"],
    density: 0.88,
    color: "#fbbf24",
    ndvi: 0.48,
    description: "Dense shrub layer. Lantana invasive management active. High alarm call frequency — primary indicator zone for tiger proximity. Ground patrol primary terrain.",
  },
];

const LIVE_SENSORS = [
  { label: "AMBIENT TEMP", value: "19.4°C", delta: "+0.3°C", icon: Thermometer, color: "text-amber-400" },
  { label: "REL. HUMIDITY", value: "84%", delta: "+2%", icon: Droplets, color: "text-blue-400" },
  { label: "WIND SPEED", value: "2.1 m/s", delta: "NNE", icon: Wind, color: "text-slate-300" },
  { label: "NDVI INDEX", value: "0.76", delta: "PEAK", icon: Leaf, color: "text-emerald-400" },
  { label: "ACTIVE ALARMS", value: "3", delta: "CHITAL", icon: Radio, color: "text-red-400" },
  { label: "CAM-TRAPS", value: "24 / 24", delta: "ALL ONLINE", icon: Eye, color: "text-emerald-400" },
];

function NDVIBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full bg-slate-900 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${value * 100}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums" style={{ color }}>
        {value.toFixed(2)}
      </span>
    </div>
  );
}

function PulsingSensor({ sensor, delay }: { sensor: typeof LIVE_SENSORS[0]; delay: number }) {
  const [val, setVal] = useState(sensor.value);
  // Subtle value flicker every 4s
  useEffect(() => {
    const id = setInterval(() => {
      setVal(sensor.value); // In production: fetch real data
    }, 4000 + delay * 300);
    return () => clearInterval(id);
  }, [sensor.value, delay]);

  const Icon = sensor.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <Icon className={`w-4 h-4 ${sensor.color}`} />
        <span className="font-mono text-[10px] text-slate-500 tracking-wider">{sensor.label}</span>
      </div>
      <div className={`font-mono text-xl font-bold tabular-nums ${sensor.color}`}>{val}</div>
      <div className="font-mono text-[10px] text-slate-500">{sensor.delta}</div>
    </motion.div>
  );
}

export default function ForestPage() {
  const [activeLayer, setActiveLayer] = useState<string>("understory");
  const active = CANOPY_LAYERS.find((l) => l.id === activeLayer) ?? CANOPY_LAYERS[2];

  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 px-4 md:px-8 max-w-6xl mx-auto selection:bg-emerald-500/20 selection:text-emerald-200">
      <FluidNavbar />

      {/* Subtle forest topography background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #68d391 0px, #68d391 1px, transparent 1px, transparent 36px)",
        }}
      />

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-500 tracking-widest uppercase mb-3">
          <Leaf className="w-3.5 h-3.5 animate-pulse" />
          <span>TADOBA CANOPY // LiDAR TELEMETRY // 25M HOVER</span>
        </div>
        <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 leading-none mb-3">
          FOREST<br />
          <span className="text-emerald-400">INTELLIGENCE</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Real-time LiDAR canopy stratification, NDVI indices, and acoustic bio-telemetry from
          the Tadoba-Andhari Tiger Reserve core zone. Synchronized with M-STrIPES sector 4 camera-trap network.
        </p>
      </div>

      {/* Live sensor grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {LIVE_SENSORS.map((s, i) => (
          <PulsingSensor key={s.label} sensor={s} delay={i} />
        ))}
      </div>

      {/* Canopy stratification — interactive layer selector */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">

        {/* Layer selector column */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="font-mono text-xs text-slate-500 tracking-widest mb-1">SELECT CANOPY STRATUM</div>
          {CANOPY_LAYERS.map((layer) => (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 font-mono ${
                activeLayer === layer.id
                  ? "glass-panel border-opacity-60 shadow-lg"
                  : "glass-panel border-white/10 hover:border-white/20 opacity-70 hover:opacity-90"
              }`}
              style={
                activeLayer === layer.id
                  ? { borderColor: layer.color + "60", boxShadow: `0 0 20px ${layer.color}18` }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider" style={{ color: layer.color }}>
                  {layer.name}
                </span>
                <span className="text-[10px] text-slate-500">{layer.elevation}</span>
              </div>
              <NDVIBar value={layer.ndvi} color={layer.color} />
              <div className="mt-2 text-[10px] text-slate-500">
                DENSITY: {Math.round(layer.density * 100)}% COVER
              </div>
            </button>
          ))}
        </div>

        {/* Layer detail panel */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
          className="lg:col-span-3 p-6 md:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden"
        >
          {/* Ambient glow tinted to layer color */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-10"
            style={{ backgroundColor: active.color }}
          />

          <div className="relative z-10">
            <div className="font-mono text-xs tracking-widest mb-1" style={{ color: active.color }}>
              {active.name} // {active.elevation}
            </div>
            <h2 className="font-mono text-2xl md:text-3xl font-bold text-slate-100 mb-2">
              Stratum Analysis
            </h2>

            {/* Visual LiDAR density bar */}
            <div className="my-5 p-4 rounded-xl bg-black/40 border border-white/5">
              <div className="font-mono text-[10px] text-slate-500 mb-3 tracking-widest">
                LiDAR POINT DENSITY PROFILE
              </div>
              <div className="flex items-end gap-1 h-16">
                {Array.from({ length: 24 }).map((_, i) => {
                  const h =
                    active.density * (0.5 + Math.abs(Math.sin((i + active.id.length) * 0.9)) * 0.5);
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{ backgroundColor: active.color, opacity: 0.5 + h * 0.5 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 100}%` }}
                      transition={{ delay: i * 0.03, duration: 0.5, ease: "easeOut" }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between font-mono text-[9px] text-slate-600 mt-1">
                <span>SECTOR W</span>
                <span>SECTOR E</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-5">{active.description}</p>

            {/* Species list */}
            <div>
              <div className="font-mono text-[10px] text-slate-500 tracking-widest mb-2">
                DOMINANT FLORA
              </div>
              <div className="flex flex-col gap-2">
                {active.species.map((sp) => (
                  <div
                    key={sp}
                    className="flex items-center gap-2 font-mono text-xs text-slate-300 p-2.5 rounded-xl border border-white/5 bg-black/20"
                  >
                    <Leaf className="w-3.5 h-3.5 flex-shrink-0" style={{ color: active.color }} />
                    {sp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: patrol map + coordinate HUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Acoustic alarm call heatmap — simplified SVG */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-4">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>ACOUSTIC ALARM CALL EVENTS // LAST 6 HRS</span>
          </div>
          <svg viewBox="0 0 320 80" className="w-full h-20 rounded-lg bg-black/30 border border-white/5">
            {/* Time axis */}
            {[0, 1, 2, 3, 4, 5].map((h) => (
              <text key={h} x={h * 56 + 12} y={76} fontSize="7" fill="#475569" fontFamily="monospace">
                {`-${5 - h}h`}
              </text>
            ))}
            {/* Alarm events as vertical bars */}
            {[
              { t: 0.05, v: 0.3 }, { t: 0.12, v: 0.7 }, { t: 0.18, v: 0.45 },
              { t: 0.35, v: 0.9 }, { t: 0.42, v: 0.6 }, { t: 0.55, v: 0.4 },
              { t: 0.68, v: 0.8 }, { t: 0.74, v: 1.0 }, { t: 0.82, v: 0.55 },
              { t: 0.91, v: 0.35 }, { t: 0.97, v: 0.65 },
            ].map(({ t, v }, i) => (
              <rect
                key={i}
                x={t * 310 + 5}
                y={62 - v * 54}
                width={4}
                height={v * 54}
                fill={v > 0.75 ? "#f59e0b" : "#68d391"}
                opacity={0.75}
                rx={1}
              />
            ))}
            <line x1={5} y1={62} x2={315} y2={62} stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
          </svg>
          <div className="flex items-center gap-4 mt-3 font-mono text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-amber-400" />HIGH INTENSITY</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-emerald-400" />NORMAL</span>
          </div>
        </div>

        {/* GIS coordinate panel + minimap */}
        <div className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>CURRENT RECON COORDINATES</span>
          </div>
          <div className="font-mono text-2xl font-bold text-slate-100 tabular-nums">
            20.246° N<br />
            <span className="text-emerald-400">79.312° E</span>
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            GEO-HASH: 87PX+7FV // WGS 84 DATUM<br />
            ELEVATION: 208M AMSL // TARU CORE
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="font-mono text-[10px] text-slate-500">SATELLITE RADAR</div>
            <BlinkitMiniMap />
          </div>
        </div>
      </div>
    </main>
  );
}
