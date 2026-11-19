"use client";

/**
 * PostFX — OMKARVERSE post-processing stack
 * Blueprint spec: UnrealBloom (threshold 0.85, strength 1.4, radius 0.65)
 *                 FilmGrain noise 0.12
 *                 ChromaticAberration during dive
 */

import { useEffect } from "react";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

interface PostFXProps {
  isDiving: boolean;
}

export default function PostFX({ isDiving }: PostFXProps) {
  return (
    <EffectComposer multisampling={0}>
      {/* UnrealBloom — selective glow on telemetry arcs, node pins, tiger particles */}
      <Bloom
        luminanceThreshold={0.85}
        luminanceSmoothing={0.025}
        intensity={isDiving ? 2.2 : 1.4}
        radius={0.65}
        mipmapBlur
      />

      {/* Subtle film grain — blueprint noise 0.12 */}
      <Noise
        premultiply
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.12}
      />

      {/* Radial vignette — deepens the obsidian edges */}
      <Vignette
        offset={0.35}
        darkness={isDiving ? 0.9 : 0.6}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Chromatic aberration — spikes during hypersonic plunge */}
      {isDiving && (
        <ChromaticAberration
          offset={new THREE.Vector2(0.0025, 0.0018)}
          radialModulation
          modulationOffset={0.6}
        />
      )}
    </EffectComposer>
  );
}
