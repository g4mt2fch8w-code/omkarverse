"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface LidarTigerProps {
  opacity?: number;
}

const PARTICLE_COUNT = 65000;

export default function LidarTiger({ opacity = 1 }: LidarTigerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  // Mouse / Pointer 3D ray projection
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const pointer3D = useRef<THREE.Vector3>(new THREE.Vector3(9999, 9999, 0));

  // Particle positions & original resting positions & velocities
  const { positions, originalPositions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const amberColor = new THREE.Color("#e5a93c");
    const emeraldColor = new THREE.Color("#68d391");
    const darkAmber = new THREE.Color("#d97706");

    let pIdx = 0;

    // 1. Central Tiger Silhouette & Core Body (~25,000 points)
    const TIGER_POINTS = 25000;
    for (let i = 0; i < TIGER_POINTS; i++) {
      // Procedural stylized tiger quad-torso + head + tail curve
      const u = Math.random();
      const v = Math.random();
      
      let x = 0;
      let y = 0;
      let z = 0;

      if (u < 0.45) {
        // Torso cylinder / barrel
        const angle = v * Math.PI * 2;
        const length = (Math.random() - 0.5) * 3.2;
        const rad = 0.75 + Math.sin(length * 1.5) * 0.15 + (Math.random() - 0.5) * 0.1;
        x = length;
        y = Math.cos(angle) * rad;
        z = Math.sin(angle) * rad;
      } else if (u < 0.65) {
        // Head & Muzzle
        const headU = Math.random();
        const headRad = 0.55 * (1 - headU * 0.3);
        const theta = Math.random() * Math.PI * 2;
        x = 1.6 + headU * 0.8;
        y = 0.35 + Math.cos(theta) * headRad;
        z = Math.sin(theta) * headRad * 0.85;
      } else if (u < 0.85) {
        // 4 Legs & Paws
        const legIdx = Math.floor(Math.random() * 4);
        const legX = (legIdx < 2 ? 1.1 : -1.1) + (Math.random() - 0.5) * 0.2;
        const legZ = (legIdx % 2 === 0 ? 0.55 : -0.55) + (Math.random() - 0.5) * 0.15;
        const legY = -0.5 - Math.random() * 1.4;
        x = legX;
        y = legY;
        z = legZ;
      } else {
        // S-Curve Tail
        const t = Math.random();
        x = -1.6 - t * 1.4;
        y = 0.2 + Math.sin(t * Math.PI) * 0.6 - t * 0.3;
        z = Math.sin(t * 2) * 0.3;
      }

      pos[pIdx * 3] = x;
      pos[pIdx * 3 + 1] = y;
      pos[pIdx * 3 + 2] = z;

      orig[pIdx * 3] = x;
      orig[pIdx * 3 + 1] = y;
      orig[pIdx * 3 + 2] = z;

      // Color stripes: alternating amber & dark tones
      const stripePattern = Math.sin(x * 12 + z * 6);
      const chosenColor = stripePattern > 0.2 ? amberColor : darkAmber;
      col[pIdx * 3] = chosenColor.r;
      col[pIdx * 3 + 1] = chosenColor.g;
      col[pIdx * 3 + 2] = chosenColor.b;

      pIdx++;
    }

    // 2. Forest Canopy & Ground Terrain (~40,000 points)
    const CANOPY_POINTS = PARTICLE_COUNT - TIGER_POINTS;
    for (let i = 0; i < CANOPY_POINTS; i++) {
      const radius = 2.5 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Canopy height with wave variations
      const terrainHeight = -1.8 + Math.sin(x * 0.8) * Math.cos(z * 0.8) * 0.4;
      const canopyHeight = terrainHeight + Math.random() * 2.8;

      pos[pIdx * 3] = x;
      pos[pIdx * 3 + 1] = canopyHeight;
      pos[pIdx * 3 + 2] = z;

      orig[pIdx * 3] = x;
      orig[pIdx * 3 + 1] = canopyHeight;
      orig[pIdx * 3 + 2] = z;

      // Forest emerald & ambient teal
      col[pIdx * 3] = emeraldColor.r * (0.6 + Math.random() * 0.4);
      col[pIdx * 3 + 1] = emeraldColor.g * (0.6 + Math.random() * 0.4);
      col[pIdx * 3 + 2] = emeraldColor.b * (0.6 + Math.random() * 0.4);

      pIdx++;
    }

    return {
      positions: pos,
      originalPositions: orig,
      velocities: vel,
      colors: col,
    };
  }, []);

  // Update pointer 3D position in plane
  useFrame(({ camera }) => {
    raycaster.setFromCamera(mouse, camera);
    const target = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, target);
    if (target) {
      pointer3D.current.copy(target);
    }
  });

  // Physics animation loop: Hooke's Law + Repulsion Wave
  useFrame(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const currentPos = posAttr.array as Float32Array;

    const px = pointer3D.current.x;
    const py = pointer3D.current.y;
    const pz = pointer3D.current.z;

    // Constants from Blueprint Specification:
    // F_repel = G / (dist^2 + eps) * normalVector
    // F_return = -k * Delta_x - c * v (k = 0.18, c = 0.85)
    const G = 0.28;
    const eps = 0.05;
    const repelRadiusSq = 1.8 * 1.8;
    const k = 0.18;
    const c = 0.85;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      const x = currentPos[idx];
      const y = currentPos[idx + 1];
      const z = currentPos[idx + 2];

      const origX = originalPositions[idx];
      const origY = originalPositions[idx + 1];
      const origZ = originalPositions[idx + 2];

      let vx = velocities[idx];
      let vy = velocities[idx + 1];
      let vz = velocities[idx + 2];

      // Distance to pointer
      const dx = x - px;
      const dy = y - py;
      const dz = z - pz;
      const distSq = dx * dx + dy * dy + dz * dz;

      // Repulsion force
      let fx = 0;
      let fy = 0;
      let fz = 0;

      if (distSq < repelRadiusSq) {
        const force = G / (distSq + eps);
        fx += (dx / Math.sqrt(distSq + eps)) * force;
        fy += (dy / Math.sqrt(distSq + eps)) * force;
        fz += (dz / Math.sqrt(distSq + eps)) * force;
      }

      // Hooke's Law Return Force: -k * (x - origX) - c * v
      fx += -k * (x - origX) - c * vx;
      fy += -k * (y - origY) - c * vy;
      fz += -k * (z - origZ) - c * vz;

      // Integrate velocity and position (dt ~ 1)
      vx += fx;
      vy += fy;
      vz += fz;

      currentPos[idx] = x + vx;
      currentPos[idx + 1] = y + vy;
      currentPos[idx + 2] = z + vz;

      velocities[idx] = vx;
      velocities[idx + 1] = vy;
      velocities[idx + 2] = vz;
    }

    posAttr.needsUpdate = true;
  });

  // Mobile Device Orientation Holographic Depth
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (!pointsRef.current || e.gamma === null || e.beta === null) return;
      const deltaAlpha = (e.gamma / 90) * 0.15;
      const deltaBeta = ((e.beta - 45) / 90) * 0.15;
      pointsRef.current.rotation.y = deltaAlpha;
      pointsRef.current.rotation.x = deltaBeta;
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.88 * opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
