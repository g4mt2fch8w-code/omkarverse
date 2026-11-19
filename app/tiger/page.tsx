"use client";

import React from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import { Shield, Sparkles, Fingerprint } from "lucide-react";

const SAMPLE_NAMED_TIGERS = [
  { id: "T-54", name: "RUDRA", territory: "TARU CORE // 42 KM²", status: "RESIDENT MALE" },
  { id: "T-114", name: "CHOTI TARA", territory: "MOHARLI BUFFER // 28 KM²", status: "TERRITORIAL FEMALE" },
  { id: "T-60", name: "VEER", territory: "KOLSA RANGE // 35 KM²", status: "DOMINANT MALE" },
];

export default function TigerPage() {
  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 px-4 md:px-8 max-w-5xl mx-auto tactical-grid selection:bg-amber-500/20 selection:text-amber-300">
      <FluidNavbar />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10 mb-10">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-amber-500 tracking-widest mb-2 uppercase">
            <Fingerprint className="w-3.5 h-3.5" />
            <span>CENTRAL INDIA ROSTER // 105 PROFILES</span>
          </div>
          <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tight text-slate-100">
            THE 105 NAMED TIGERS
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
            Curated lineage database and biometrical stripe registries. PIRS Iris Engine flank vectors linking historical sightings with current GPS collar telemetry.
          </p>
        </div>

        <BlinkitMiniMap />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {SAMPLE_NAMED_TIGERS.map((tiger) => (
          <div key={tiger.id} className="p-5 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-2">
              <span className="text-amber-400 font-semibold">{tiger.id}</span>
              <span className="text-emerald-400 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                {tiger.status}
              </span>
            </div>
            <h3 className="font-mono text-lg font-bold text-slate-100 mb-1">
              {tiger.name}
            </h3>
            <p className="font-mono text-[11px] text-slate-400">
              {tiger.territory}
            </p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl glass-panel border border-amber-500/20 text-center font-mono text-xs text-slate-400">
        <Sparkles className="w-5 h-5 text-amber-400 mx-auto mb-2" />
        <p className="text-slate-200 font-semibold">
          102 ADDITIONAL PROFILES QUEUED FOR INGESTION
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Full camera-trap flank identification matrices and age-class demographic tables will unlock in Day 2 pipeline sync.
        </p>
      </div>
    </main>
  );
}
