"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import OrbitSphere from "./OrbitSphere";
import HypersonicDive from "./HypersonicDive";
import LidarTiger from "./LidarTiger";
import { X, Navigation } from "lucide-react";
import { soundEngine } from "@/components/audio/soundManager";

export type SceneStage = "orbit" | "diving" | "lidar" | "settled";

interface SceneOrchestratorProps {
  onSkip?: () => void;
  onStageChange?: (stage: SceneStage) => void;
}

export default function SceneOrchestrator({
  onSkip,
  onStageChange,
}: SceneOrchestratorProps) {
  const [stage, setStage] = useState<SceneStage>("orbit");
  const [altitude, setAltitude] = useState<number>(8000);

  const handleStageUpdate = useCallback(
    (newStage: SceneStage) => {
      setStage(newStage);
      onStageChange?.(newStage);
    },
    [onStageChange]
  );

  const handleSkip = useCallback(() => {
    soundEngine?.playTargetLock?.();
    setStage("settled");
    setAltitude(25);
    onStageChange?.("settled");
    onSkip?.();
  }, [onSkip, onStageChange]);

  const handleStartDive = useCallback(() => {
    if (stage === "orbit") {
      handleStageUpdate("diving");
    }
  }, [stage, handleStageUpdate]);

  // Physical ESC Key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Downward wheel scroll threshold past 100px triggers dive
  useEffect(() => {
    let accumulatedDelta = 0;
    const handleWheel = (e: WheelEvent) => {
      if (stage === "orbit") {
        accumulatedDelta += e.deltaY;
        if (accumulatedDelta > 100) {
          handleStartDive();
        }
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [stage, handleStartDive]);

  return (
    <div className="relative w-full h-full min-h-[500px] select-none overflow-hidden">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 42 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={["#050709"]} />
        <fogExp2 attach="fog" args={["#060809", 0.00015]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} color="#e5a93c" />
        <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#68d391" />

        {/* Camera Dive Controller */}
        <HypersonicDive
          isDiving={stage === "diving"}
          onDiveComplete={() => handleStageUpdate("lidar")}
          onAltitudeChange={(alt) => setAltitude(alt)}
        />

        {/* Act 1: Stratosphere Orbit */}
        {(stage === "orbit" || stage === "diving") && (
          <OrbitSphere opacity={stage === "diving" ? Math.max(0, altitude / 8000) : 1} />
        )}

        {/* Act 3 & 4: LiDAR Tiger and Canopy Point-Cloud */}
        {(stage === "lidar" || stage === "settled" || stage === "diving") && (
          <LidarTiger opacity={stage === "diving" ? Math.max(0, 1 - altitude / 8000) : 1} />
        )}
      </Canvas>

      {/* Mandatory ESC/SKIP HUD */}
      {stage !== "settled" && (
        <button
          onClick={handleSkip}
          type="button"
          aria-label="Skip to main dashboard"
          className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 min-h-[48px] min-w-[48px] rounded-full glass-panel border border-white/20 hover:border-amber-400/50 text-slate-200 hover:text-amber-400 font-mono text-xs tracking-wider transition-all shadow-2xl active:scale-95"
        >
          <X className="w-4 h-4 text-amber-400" />
          <span>SKIP / ESC</span>
        </button>
      )}

      {/* Act 1 Drone Recon Button Prompt */}
      {stage === "orbit" && (
        <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <button
            onClick={handleStartDive}
            type="button"
            className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono text-xs md:text-sm font-semibold tracking-widest shadow-[0_0_24px_rgba(229,169,60,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>DEPLOY DRONE RECON</span>
          </button>
          <span className="font-mono text-[11px] text-slate-400 tracking-wider">
            OR SCROLL DOWN TO DIVE
          </span>
        </div>
      )}

      {/* Act 2 Hypersonic Telemetry Altitude Scrubber */}
      {stage === "diving" && (
        <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center justify-center font-mono pointer-events-none">
          <div className="px-5 py-2.5 rounded-full glass-panel border border-amber-400/30 text-amber-400 text-sm tracking-widest animate-pulse">
            ALTITUDE TELEMETRY: {altitude.toLocaleString()} M ➔ LEVEL-OFF
          </div>
        </div>
      )}

      {/* Act 3/4 Ground Level Coordinates HUD */}
      {(stage === "lidar" || stage === "settled") && (
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 font-mono text-xs text-slate-400 glass-pill px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TADOBA CANOPY // 25M RECON HOVER</span>
          <span className="text-amber-400">20.246° N, 79.312° E</span>
        </div>
      )}
    </div>
  );
}
