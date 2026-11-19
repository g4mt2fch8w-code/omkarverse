"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import OrbitSphere from "./OrbitSphere";
import HypersonicDive from "./HypersonicDive";
import LidarTiger from "./LidarTiger";
import { X, Navigation, Radio } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Physical ESC Key handler as specified in blueprint
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  // Downward wheel scroll threshold past 100px triggers hypersonic plunge
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
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] select-none overflow-hidden bg-[#050709]">
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

        {/* Ambient & Directional Lighting (GTA 6 Caliber Spec) */}
        <ambientLight intensity={0.5} color="#e5a93c" />
        <directionalLight position={[10, 15, 10]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-10, -5, -5]} intensity={0.8} color="#68d391" />

        {/* Interactive OrbitControls for Act 1 (damping factor = 0.05) */}
        {stage === "orbit" && (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={8}
            maxDistance={18}
            enablePan={false}
            rotateSpeed={0.55}
          />
        )}

        {/* Camera Dive Controller (Act 2) */}
        <HypersonicDive
          isDiving={stage === "diving"}
          onDiveComplete={() => handleStageUpdate("lidar")}
          onAltitudeChange={(alt) => setAltitude(alt)}
        />

        {/* Act 1: Stratosphere Orbit Sphere */}
        {(stage === "orbit" || stage === "diving") && (
          <OrbitSphere opacity={stage === "diving" ? Math.max(0, altitude / 8000) : 1} />
        )}

        {/* Act 3 & 4: LiDAR Forest & Tiger Point-Cloud */}
        {(stage === "lidar" || stage === "settled" || stage === "diving") && (
          <LidarTiger opacity={stage === "diving" ? Math.max(0, 1 - altitude / 8000) : 1} />
        )}
      </Canvas>

      {/* Act 2 Shaders: Radial Chromatic Aberration & Edge Motion Blur Lines */}
      {stage === "diving" && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(229,169,60,0.18)_75%,rgba(6,8,9,0.85)_100%)] mix-blend-screen" />
          <div className="absolute inset-0 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.06)_3px,rgba(255,255,255,0.06)_6px)]" />
        </div>
      )}

      {/* Mandatory ESC/SKIP HUD (min 48px touch target on mobile) */}
      {stage !== "settled" && (
        <button
          onClick={handleSkip}
          type="button"
          aria-label="Skip 3D intro to main dashboard"
          className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 min-h-[48px] min-w-[48px] rounded-full glass-panel border border-white/20 hover:border-amber-400/50 text-slate-200 hover:text-amber-400 font-mono text-xs tracking-wider transition-all shadow-2xl active:scale-95"
        >
          <X className="w-4 h-4 text-amber-400" />
          <span>SKIP / ESC</span>
        </button>
      )}

      {/* Act 1 Drone Recon Plunge Button */}
      {stage === "orbit" && (
        <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center justify-center gap-3 pointer-events-none px-4 text-center">
          <button
            onClick={handleStartDive}
            type="button"
            className="pointer-events-auto flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono text-xs md:text-sm font-semibold tracking-widest shadow-[0_0_24px_rgba(229,169,60,0.4)] transition-all hover:scale-105 active:scale-95"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>DEPLOY DRONE RECON</span>
          </button>
          <span className="font-mono text-[11px] text-slate-400 tracking-wider">
            SCROLL DOWN OR DRAG TO ROTATE SATELLITE ORBIT
          </span>
        </div>
      )}

      {/* Act 2 Real-Time Hypersonic Telemetry Altitude Scrubber */}
      {stage === "diving" && (
        <div className="absolute bottom-10 inset-x-0 z-20 flex flex-col items-center justify-center font-mono pointer-events-none px-4 text-center">
          <div className="px-5 py-2.5 rounded-full glass-panel border border-amber-400/40 text-amber-400 text-xs md:text-sm tracking-widest animate-pulse shadow-[0_0_20px_rgba(229,169,60,0.2)]">
            HYPERSONIC PLUNGE // ALT: {altitude.toLocaleString()}M ➔ 25M LEVEL-OFF
          </div>
        </div>
      )}

      {/* Act 3/4 Ground Level Coordinates Recon HUD */}
      {(stage === "lidar" || stage === "settled") && (
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 font-mono text-xs text-slate-400 glass-pill px-4 py-2 rounded-full border border-white/10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TADOBA CANOPY // 25M RECON HOVER</span>
          <span className="text-amber-400">20.246° N, 79.312° E</span>
        </div>
      )}
    </div>
  );
}
