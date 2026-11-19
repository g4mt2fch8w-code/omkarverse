"use client";

import React from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import { Trees, Compass, Layers, ShieldCheck } from "lucide-react";

export default function ForestPage() {
  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 px-4 md:px-8 max-w-5xl mx-auto tactical-grid selection:bg-amber-500/20 selection:text-amber-300">
      <FluidNavbar />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 tracking-widest mb-2 uppercase">
            <Trees className="w-3.5 h-3.5" />
            <span>CANOPY TOPOLOGY // TADOBA CORE</span>
          </div>
          <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
            FOREST MATRIX
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
            Reserved sector for Day 2 satellite vegetative index (NDVI), canopy density maps, and hydrological waterbody telemetry across Central Indian reserves.
          </p>
        </div>

        <BlinkitMiniMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <div className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>SAL & BAMBOO CANOPY</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            LiDAR elevation points capturing upper crown density (18m - 28m) and understory visibility for predator stalk corridors.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>HYDROLOGY ATLAS</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Perennial waterholes, ephemeral monsoon streams, and lake perimeters mapped with Sentinel-2 SAR bands.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10">
          <div className="text-slate-200 font-semibold mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DAY 2 TELEMETRY SYNC</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            High-precision shapefiles and GeoJSON spatial polygons ready for live pipeline binding.
          </p>
        </div>
      </div>
    </main>
  );
}
