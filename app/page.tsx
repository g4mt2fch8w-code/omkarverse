"use client";

import React, { useState } from "react";
import Preloader4s from "@/components/ui/Preloader4s";
import FluidNavbar from "@/components/ui/FluidNavbar";
import SceneOrchestrator, { SceneStage } from "@/components/3d/SceneOrchestrator";
import TextScrub from "@/components/ui/TextScrub";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import Link from "next/link";
import { Shield, Globe, Cpu, ArrowUpRight, Compass, Terminal } from "lucide-react";

export default function Home() {
  const [isBooted, setIsBooted] = useState<boolean>(false);
  const [sceneStage, setSceneStage] = useState<SceneStage>("orbit");
  const [is3DActive, setIs3DActive] = useState<boolean>(true);

  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 overflow-x-hidden">
      {/* 4-Second Preloader Sequence */}
      {!isBooted && <Preloader4s onComplete={() => setIsBooted(true)} />}

      {/* Global Fluid Navigation */}
      <FluidNavbar
        is3DActive={is3DActive}
        onToggle3D={() => setIs3DActive(!is3DActive)}
      />

      {/* Hero 3D WebGL Canvas Viewport */}
      {is3DActive && (
        <section className="relative w-full h-[85vh] md:h-[92vh] flex items-center justify-center">
          <SceneOrchestrator
            onStageChange={(stage) => setSceneStage(stage)}
            onSkip={() => setSceneStage("settled")}
          />

          {/* Top-Left Tactical Coordinates Overlay */}
          <div className="absolute top-24 left-6 z-20 hidden md:flex flex-col gap-1 font-mono text-[11px] text-slate-400 glass-pill px-4 py-2.5 rounded-xl border border-white/10 pointer-events-none">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>OMKARVERSE // TACTICAL HUB</span>
            </div>
            <div className="text-slate-500">CORE: 20.246° N, 79.312° E</div>
            <div className="text-emerald-400/90">ELEVATION: 208M AMSL // TARU</div>
          </div>

          {/* Bottom-Right Blinkit Radar Mini-Map */}
          <div className="absolute bottom-6 right-6 z-20">
            <BlinkitMiniMap />
          </div>
        </section>
      )}

      {/* Primary Mission Brief & Editorial Hero (remote.com TextScrub) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-amber-500 uppercase mb-4">
          <Terminal className="w-3.5 h-3.5" />
          <span>SPECIFICATION // DIGITAL SANCTUARY</span>
        </div>

        <TextScrub
          text="An authentic, high-performance WebGL digital universe fusing high-resolution satellite cartography, Central Indian tiger intelligence, and real-time field telemetry. Built with absolute engineering rigor as a personal sanctuary and live systems showcase."
          className="mb-14"
        />

        {/* Tactical Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 font-mono">
          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-xs text-slate-400">NAMED WILD TIGERS</div>
            <div className="text-2xl md:text-3xl font-bold text-amber-400 mt-1">105</div>
            <div className="text-[10px] text-emerald-400 mt-1">CATALOGUED PROFILES</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-xs text-slate-400">HIGHWAY CORRIDOR</div>
            <div className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">5,846 KM</div>
            <div className="text-[10px] text-slate-400 mt-1">GOLDEN QUADRILATERAL</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-xs text-slate-400">LiDAR DENSITY</div>
            <div className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1">65K PTS</div>
            <div className="text-[10px] text-amber-400/80 mt-1">HOOKIAN DAMPED MATRIX</div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10">
            <div className="text-xs text-slate-400">SYSTEM ARCHITECTURE</div>
            <div className="text-2xl md:text-3xl font-bold text-slate-100 mt-1">60 FPS</div>
            <div className="text-[10px] text-emerald-400 mt-1">GPU ACCELERATED</div>
          </div>
        </div>

        {/* 3 Core Tactical System Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Tiger Intelligence */}
          <Link
            href="/telemetry"
            className="group p-6 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/50 transition-all hover:shadow-[0_0_24px_rgba(229,169,60,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-slate-100 group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>The Royal Stripes</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                PIRS deep metric learning stripe re-identification engine trained on Panthera17K, alongside TIGRIS and M-STrIPES databases.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-amber-500/80">
              EXPLORE TIGER AI ➔
            </div>
          </Link>

          {/* Pillar 2: Geospatial Systems */}
          <Link
            href="/telemetry"
            className="group p-6 rounded-2xl glass-panel border border-white/10 hover:border-emerald-400/50 transition-all hover:shadow-[0_0_24px_rgba(104,211,145,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>Geospatial Systems</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                GeoGlobe 3D interactive telemetry sphere, 5,846 km Golden Quadrilateral GIS, and Vandrishti Junnar 7-forest-range GeoJSON vector networks.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-emerald-400/80">
              INSPECT GIS DEPLOYMENTS ➔
            </div>
          </Link>

          {/* Pillar 3: Field Platforms & Editorial */}
          <Link
            href="/field"
            className="group p-6 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/50 transition-all hover:shadow-[0_0_24px_rgba(229,169,60,0.15)] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-mono text-lg font-semibold text-slate-100 group-hover:text-amber-400 transition-colors flex items-center justify-between">
                <span>Field Dispatches</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Apple-grade classified dispatches from the Tadoba core, real field acoustic telemetry, Sony A7IV and Garmin 66sr patrol route logs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[11px] text-amber-500/80">
              READ DISPATCHES ➔
            </div>
          </Link>
        </div>
      </section>

      {/* Footer / Architectural Verification Notice */}
      <footer className="relative border-t border-white/10 py-10 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-500">
        <div>
          ARCHITECT & AUTHOR: <span className="text-slate-300 font-semibold">ONKAR BHOPLE PATIL</span>
        </div>
        <div className="flex items-center gap-4">
          <span>SPEC-2026-V1</span>
          <span>•</span>
          <span>OMKARVERSE.VERCEL.APP</span>
          <span>•</span>
          <span className="text-emerald-400">60 FPS VERIFIED</span>
        </div>
      </footer>
    </main>
  );
}
