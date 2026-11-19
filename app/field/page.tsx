"use client";

import React from "react";
import FluidNavbar from "@/components/ui/FluidNavbar";
import AmbientPlayer from "@/components/audio/AmbientPlayer";
import BlinkitMiniMap from "@/components/ui/BlinkitMiniMap";
import { Compass, Clock, Thermometer, Camera, MapPin, Radio, ShieldCheck } from "lucide-react";

export default function FieldPage() {
  return (
    <main className="relative min-h-screen bg-[#050709] text-slate-100 pb-28 pt-28 px-4 md:px-8 max-w-5xl mx-auto selection:bg-amber-500/20 selection:text-amber-300">
      <FluidNavbar />

      {/* Editorial Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 font-mono text-xs text-amber-500 tracking-widest uppercase mb-3">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>CLASSIFIED FIELD DISPATCH // DOSSIER 01</span>
        </div>
        <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100">
          DAWN RECON OVER JAFRABAD BEAT
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-3 max-w-3xl leading-relaxed">
          Ground telemetry and anti-poaching patrol logs through the core sal and bamboo thickets of Tadoba. Verified spatial tracks and camera-trap flank acoustic sync.
        </p>
      </div>

      {/* 21:9 Cinema Lead Imagery & Floating Frosted-Glass Badges */}
      <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 group bg-gradient-to-br from-slate-900 via-[#070b10] to-[#0d1620]">
        {/* Stylized Tactical Topographic Overlay */}
        <div className="absolute inset-0 tactical-grid opacity-30" />
        
        {/* Subtle Ambient Vignette & Glowing Forest Hue */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Tactical Coordinates Center Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-28 h-28 border border-white/10 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 border border-amber-400/30 rounded-full animate-ping" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="absolute -bottom-6 font-mono text-[10px] text-amber-400/80">
              JAFRABAD TRANSECT
            </span>
          </div>
        </div>

        {/* Floating Frosted-Glass Metadata Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-white/15 font-mono text-xs text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>20.246° N, 79.312° E</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-white/15 font-mono text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5" />
            <span>05:40 HRS</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill border border-white/15 font-mono text-xs text-emerald-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>19°C</span>
          </div>
        </div>

        {/* Bottom Gear Manifest Badge */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-slate-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/15">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>GEAR: SONY A7IV + FE 200-600MM G OSS // GARMIN GPSMAP 66SR</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/15 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>BEAT PATROL ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Embedded Real Field Audio Waveform Player */}
      <AmbientPlayer
        title="Tadoba Dawn Chorus // Alarm Call Hydrophone Pass"
        location="Jafrabad Beat, Core Zone"
      />

      {/* Editorial Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        {/* Left 2 Cols: Journal Article */}
        <div className="lg:col-span-2 space-y-6 text-slate-300 font-normal leading-relaxed text-sm md:text-base">
          <p>
            At 05:40 HRS, the fog hangs low over the waterholes of Taru. The ground patrol moves across the boundary of the Jafrabad beat, following fresh pugmarks etched into the clay soil along the firebreak line. The GPS tracks on the Garmin 66sr confirm a steady south-easterly transit toward the Kolsa range corridor.
          </p>
          <p>
            The infrared camera traps deployed along sector 4 registered flank profiles at 03:12 HRS. By cross-referencing the unique stripe coordinates against our PIRS (Iris Engine) Panthera17K database, the identification matched Tiger ID #T-54, an adult male maintaining a territorial radius of 42 square kilometers across the central reserve core.
          </p>

          {/* Interactive Tactical Route Vector Card */}
          <div className="p-5 rounded-2xl glass-panel border border-white/10 my-6">
            <div className="flex items-center justify-between mb-3 font-mono text-xs text-slate-400">
              <span className="text-amber-400 font-semibold">PATROL TRANSECT VECTOR</span>
              <span>12.4 KM LOGGED</span>
            </div>
            
            <svg className="w-full h-36 rounded-xl bg-black/40 border border-white/5" viewBox="0 0 500 120">
              {/* Route line */}
              <path
                d="M 20 80 Q 80 40, 160 70 T 300 30 T 420 90 T 480 50"
                fill="none"
                stroke="#e5a93c"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {/* Waypoints */}
              <circle cx="20" cy="80" r="4" fill="#68d391" />
              <text x="30" y="85" fill="#68d391" fontSize="10" fontFamily="monospace">ENTRY: TARU [87PX+7FV]</text>
              
              <circle cx="160" cy="70" r="3.5" fill="#e5a93c" />
              <text x="170" y="65" fill="#cbd5e1" fontSize="9" fontFamily="monospace">WP-02: WATERHOLE 4</text>

              <circle cx="300" cy="30" r="3.5" fill="#e5a93c" />
              <text x="310" y="25" fill="#cbd5e1" fontSize="9" fontFamily="monospace">WP-03: CAMERA TRAP #12</text>

              <circle cx="480" cy="50" r="4" fill="#f59e0b" />
              <text x="390" y="70" fill="#f59e0b" fontSize="10" fontFamily="monospace">TARGET: T-54 LOCK</text>
            </svg>
            <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 mt-2">
              <span>LAT: 20.246° N ➔ 20.210° N</span>
              <span>ELEV: 208M ➔ 245M</span>
            </div>
          </div>

          <p>
            As morning light cuts through the bamboo canopy, the chital alarm calls taper off. All field logs, telemetry coordinates, and acoustic snippets are synced directly into the M-STrIPES tactical database to maintain continuous situational awareness across the Central Indian tiger landscape.
          </p>
        </div>

        {/* Right Col: Tactical Sidebar */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-4 pb-2 border-b border-white/5">
              <Compass className="w-4 h-4" />
              <span>STATION SUMMARY</span>
            </div>
            <div className="space-y-3 text-slate-400">
              <div className="flex justify-between">
                <span>BEAT NAME</span>
                <span className="text-slate-100">JAFRABAD</span>
              </div>
              <div className="flex justify-between">
                <span>RESERVE</span>
                <span className="text-slate-100">TADOBA-ANDHARI</span>
              </div>
              <div className="flex justify-between">
                <span>SECTOR DENSITY</span>
                <span className="text-emerald-400">5.8 / 100 SQ KM</span>
              </div>
              <div className="flex justify-between">
                <span>FIELD OPERATOR</span>
                <span className="text-amber-400">ONKAR BHOPLE PATIL</span>
              </div>
            </div>
          </div>

          {/* Blinkit Mini-Map Integration */}
          <div className="flex flex-col items-center p-5 rounded-2xl glass-panel border border-white/10">
            <div className="w-full flex items-center justify-between font-mono text-xs text-slate-400 mb-3">
              <span className="text-emerald-400">SATELLITE RADAR</span>
              <span>110×110 1:1</span>
            </div>
            <BlinkitMiniMap />
            <p className="font-mono text-[10px] text-slate-500 text-center mt-3">
              CLICK TO EXPAND TACTICAL SATELLITE TILES
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
