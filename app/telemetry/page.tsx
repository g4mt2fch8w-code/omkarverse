"use client";

import React, { useState } from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import RadarSweep from "@/components/ui/RadarSweep";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import { Terminal, Shield, Globe, Cpu, Radio, Activity } from "lucide-react";

const CLUSTER_1_ROYAL_STRIPES = [
  {
    id: "pirs-engine",
    category: "THE ROYAL STRIPES // AI",
    title: "PIRS // IRIS ENGINE",
    subtitle:
      "Deep metric learning pipeline trained on Panthera17K dataset for automated tiger flank stripe re-identification and individual recognition.",
    coords: "20.246° N, 79.312° E",
    status: "ACTIVE MODEL",
    stats: "PANTHERA17K / PYTORCH",
  },
  {
    id: "pirs-app",
    category: "THE ROYAL STRIPES // OPS",
    title: "PIRS FIELD APP & ADMIN",
    subtitle:
      "Cross-platform Tauri / Capacitor / Firebase operational surveillance system for forest guards and anti-poaching strike forces.",
    coords: "CENTRAL INDIA COMMAND",
    status: "FIELD READY",
    stats: "TAURI / CAPACITOR",
  },
  {
    id: "tigris-atlas",
    category: "THE ROYAL STRIPES // GIS",
    title: "TIGRIS FOREST ATLAS",
    subtitle:
      "All-India Tiger Geographic & Forest Atlas with high-resolution reserve boundaries, hydrological perimeters, and administrative beats.",
    coords: "53 TIGER RESERVES",
    status: "MAPPED",
    stats: "ALL-INDIA VECTOR ATLAS",
  },
  {
    id: "mstripes-db",
    category: "THE ROYAL STRIPES // DATA",
    title: "M-STRIPES DATABASE",
    subtitle:
      "Official NTCA monitoring hierarchy SQLite / SQL architecture modeling patrol paths, conflict incidents, and camera-trap grids.",
    coords: "NTCA PROTOCOL",
    status: "SYNCHRONIZED",
    stats: "SQLITE / POSTGRES",
  },
];

const CLUSTER_2_GIS = [
  {
    id: "geoglobe-3d",
    category: "GEOSPATIAL SYSTEMS",
    title: "GEOGLOBE 3D",
    subtitle:
      "Interactive WebGL 3D geospatial earth globe rendering real-time orbital passes, high-res telemetry layers, and tactical coordinates.",
    coords: "ORBITAL: 8,000 KM",
    link: "https://geoglobe3d.vercel.app",
    status: "LIVE PORTAL",
  },
  {
    id: "gquad-gis",
    category: "GEOSPATIAL SYSTEMS",
    title: "GOLDEN QUADRILATERAL GIS",
    subtitle:
      "5,846 km high-definition national highway geospatial mapping platform tracking multi-lane corridors, logistics, and terrain profiles.",
    coords: "5,846 KM CORRIDOR",
    link: "https://gquad.vercel.app",
    status: "LIVE PORTAL",
  },
  {
    id: "vandrishti-gis",
    category: "GEOSPATIAL SYSTEMS",
    title: "VANDRISHTI GIS DATASET",
    subtitle:
      "Precision spatial GeoJSON datasets detailing Junnar territorial division boundary and all 7 sub-divisional forest ranges.",
    coords: "JUNNAR DIVISION // 7 RANGES",
    status: "GEOJSON VERIFIED",
    stats: "7 FOREST RANGES",
  },
];

const CLUSTER_3_FIELD = [
  {
    id: "dastavez-app",
    category: "TOOLS & PLATFORMS",
    title: "DASTAVEZ DOCUMENT READER",
    subtitle:
      "Cross-platform Universal Document Engine packaged for Web PWA, Android APK, and macOS DMG for rapid offline field inspection.",
    coords: "MULTI-PLATFORM",
    status: "PRODUCTION",
    stats: "PWA + APK + DMG",
  },
  {
    id: "kisan-alert",
    category: "TOOLS & PLATFORMS",
    title: "VANDRISHTI AI & KISAN ALERT",
    subtitle:
      "Edge AI camera-trap siren and SMS/IVR early-warning farmer broadcast network preventing leopard and tiger livestock predation.",
    coords: "PERIPHERAL BUFFER ZONES",
    status: "EDGE ACTIVE",
    stats: "SMS / SIREN MESH",
  },
  {
    id: "wildjobs-portal",
    category: "TOOLS & PLATFORMS",
    title: "WILDJOBS CONSERVATION",
    subtitle:
      "Dedicated ecological careers and conservation fellowship platform connecting researchers, biostatisticians, and field biologists.",
    coords: "ECOLOGY RECRUITMENT",
    link: "https://wildjobstemp.vercel.app",
    status: "LIVE PORTAL",
  },
  {
    id: "sangai-app",
    category: "TOOLS & PLATFORMS",
    title: "SANGAI WILD ENVIRONMENT",
    subtitle:
      "Interactive Next.js 16 + GSAP ecosystem application built to highlight endangered ungulates in Keibul Lamjao floating phumdis.",
    coords: "24.50° N, 93.85° E",
    status: "NEXT.JS + GSAP",
    stats: "INTERACTIVE EXP",
  },
];

export default function TelemetryPage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "STRIPES" | "GIS" | "FIELD">("ALL");

  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 px-4 md:px-8 max-w-7xl mx-auto tactical-grid selection:bg-amber-500/20 selection:text-amber-300">
      <FluidNavbar />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-amber-500 tracking-widest mb-2 uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>RADAR PING & TARGET LOCK // SPEC OPTION A</span>
          </div>
          <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
            TELEMETRY REGISTRY
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
            Live catalog of active geospatial portals, deep metric learning tiger re-identification pipelines, and tactical field deployments authored by Onkar Bhople Patil.
          </p>
        </div>

        {/* Blinkit Square Mini-Map */}
        <div className="shrink-0 flex items-center gap-4">
          <BlinkitMiniMap />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 font-mono text-xs mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveFilter("ALL")}
          type="button"
          className={`px-4 py-1.5 rounded-full glass-pill border transition-colors ${
            activeFilter === "ALL"
              ? "border-amber-400 text-amber-400 font-semibold"
              : "border-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          ALL DEPLOYMENTS [11]
        </button>
        <button
          onClick={() => setActiveFilter("STRIPES")}
          type="button"
          className={`px-4 py-1.5 rounded-full glass-pill border transition-colors ${
            activeFilter === "STRIPES"
              ? "border-amber-400 text-amber-400 font-semibold"
              : "border-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          🐅 ROYAL STRIPES [4]
        </button>
        <button
          onClick={() => setActiveFilter("GIS")}
          type="button"
          className={`px-4 py-1.5 rounded-full glass-pill border transition-colors ${
            activeFilter === "GIS"
              ? "border-emerald-400 text-emerald-400 font-semibold"
              : "border-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          🛰️ GEOSPATIAL SYSTEMS [3]
        </button>
        <button
          onClick={() => setActiveFilter("FIELD")}
          type="button"
          className={`px-4 py-1.5 rounded-full glass-pill border transition-colors ${
            activeFilter === "FIELD"
              ? "border-amber-400 text-amber-400 font-semibold"
              : "border-white/10 text-slate-400 hover:text-slate-200"
          }`}
        >
          ⚡ FIELD TOOLS [4]
        </button>
      </div>

      {/* Cluster 1: The Royal Stripes */}
      {(activeFilter === "ALL" || activeFilter === "STRIPES") && (
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-amber-400 font-semibold mb-4">
            <Shield className="w-4 h-4" />
            <span>1. THE ROYAL STRIPES 🐅 (TIGER INTELLIGENCE & AI)</span>
          </div>
          <RadarSweep items={CLUSTER_1_ROYAL_STRIPES} />
        </section>
      )}

      {/* Cluster 2: GIS Deployments */}
      {(activeFilter === "ALL" || activeFilter === "GIS") && (
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-emerald-400 font-semibold mb-4">
            <Globe className="w-4 h-4" />
            <span>2. GIS DEPLOYMENTS 🛰️ (GEOSPATIAL SYSTEMS)</span>
          </div>
          <RadarSweep items={CLUSTER_2_GIS} />
        </section>
      )}

      {/* Cluster 3: Field Deployments */}
      {(activeFilter === "ALL" || activeFilter === "FIELD") && (
        <section className="mb-14">
          <div className="flex items-center gap-2.5 font-mono text-xs tracking-wider text-amber-400 font-semibold mb-4">
            <Cpu className="w-4 h-4" />
            <span>3. FIELD DEPLOYMENTS ⚡ (TOOLS & PLATFORMS)</span>
          </div>
          <RadarSweep items={CLUSTER_3_FIELD} />
        </section>
      )}
    </main>
  );
}
