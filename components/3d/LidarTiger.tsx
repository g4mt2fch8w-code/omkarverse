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

  // Sculpted Anatomical Tiger Point-Cloud + Forest Canopy
  const { positions, originalPositions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const amberPrimary = new THREE.Color("#e5a93c");
    const amberHighlight = new THREE.Color("#f6ad55");
    const amberDark = new THREE.Color("#b45309");
    const emeraldCanopy = new THREE.Color("#68d391");
    const emeraldDeep = new THREE.Color("#2f855a");

    let pIdx = 0;

    // 1. ANATOMICALLY SCULPTED PROWLING TIGER (30,000 particles)
    const TIGER_POINTS = 30000;

    for (let i = 0; i < TIGER_POINTS; i++) {
      let x = 0;
      let y = 0;
      let z = 0;

      const sectionRand = Math.random();

      if (sectionRand < 0.45) {
        // A. Torso & Spine with organic S-curve taper
        // t from -1.4 (pelvis/hindquarters) to +1.4 (shoulders/chest)
        const t = (Math.random() - 0.5) * 2.8;
        // Spine height variation: shoulders are higher (t > 0.5), belly tapers down
        const spineY = 0.25 + (t > 0.3 ? 0.2 * (t - 0.3) : -0.1 * Math.sin(t * 1.5));
        
        // Torso radius: wide chest near t=0.8, lean waist at t=-0.4, flank at t=-1.1
        let radY = 0.52;
        let radZ = 0.38;
        if (t > 0.2) {
          // Chest cage (deep and powerful)
          radY = 0.68 + (t - 0.2) * 0.15;
          radZ = 0.46;
        } else if (t < -0.2) {
          // Flank & abdomen
          radY = 0.44 + (t + 0.2) * 0.08;
          radZ = 0.35;
        }

        // Elliptical shell cross-section with subtle surface jitter
        const angle = Math.random() * Math.PI * 2;
        const volumeFactor = Math.cbrt(Math.random()); // filled volume with density towards surface
        x = t + (Math.random() - 0.5) * 0.08;
        y = spineY - 0.2 + Math.cos(angle) * radY * (0.8 + 0.2 * volumeFactor);
        z = Math.sin(angle) * radZ * (0.8 + 0.2 * volumeFactor);

      } else if (sectionRand < 0.62) {
        // B. Raised Head, Jaw, Muzzle & Ears
        const headT = Math.random();
        if (headT < 0.55) {
          // Cranium & Cheekbones
          const phi = Math.random() * Math.PI;
          const theta = Math.random() * Math.PI * 2;
          const r = 0.38 * Math.cbrt(Math.random());
          x = 1.65 + r * Math.sin(phi) * Math.cos(theta);
          y = 0.55 + r * Math.cos(phi) * 0.85;
          z = r * Math.sin(phi) * Math.sin(theta) * 0.95;
        } else if (headT < 0.85) {
          // Muzzle & Snout tapering forward
          const muzzleProgress = Math.random();
          const muzzleRad = 0.22 * (1 - muzzleProgress * 0.4);
          const theta = Math.random() * Math.PI * 2;
          x = 1.85 + muzzleProgress * 0.45;
          y = 0.42 + Math.cos(theta) * muzzleRad * 0.75 - muzzleProgress * 0.08;
          z = Math.sin(theta) * muzzleRad;
        } else {
          // Prowling Alert Ears (Left and Right)
          const isLeft = Math.random() > 0.5;
          const earT = Math.random();
          const earZ = (isLeft ? 0.24 : -0.24) + (Math.random() - 0.5) * 0.06;
          x = 1.55 - earT * 0.08;
          y = 0.82 + earT * 0.18;
          z = earZ;
        }

      } else if (sectionRand < 0.86) {
        // C. Muscular Prowling Quadrupedal Limbs (Front & Hind Paws)
        const leg = Math.floor(Math.random() * 4);
        const isFront = leg < 2;
        const isLeft = leg % 2 === 0;

        // Base limb coordinates
        const rootX = isFront ? 1.05 : -1.05;
        const rootZ = isLeft ? 0.36 : -0.36;
        const limbT = Math.random(); // 0 = shoulder/hip, 1 = paw

        // Prowling walk kinematics: front leg stepped forward, hind leg stretched back
        let offsetX = rootX;
        let offsetY = 0.1 - limbT * 1.45;
        let offsetZ = rootZ;

        if (isFront) {
          // Foreleg musculature: scapula bulge -> elbow -> wrist -> paw
          const forwardReach = isLeft ? 0.25 : -0.15;
          offsetX += limbT * forwardReach;
          const thickness = 0.16 * (1 - limbT * 0.4);
          const angle = Math.random() * Math.PI * 2;
          offsetY += (Math.random() - 0.5) * 0.04;
          offsetZ += Math.sin(angle) * thickness;
          offsetX += Math.cos(angle) * thickness;
          if (limbT > 0.9) {
            // Paw pad spread
            offsetZ *= 1.25;
            offsetX += 0.05;
          }
        } else {
          // Hind leg musculature: powerful thigh -> hock joint -> paw
          const hindReach = isLeft ? -0.2 : 0.18;
          offsetX += Math.sin(limbT * Math.PI * 0.8) * 0.22 + limbT * hindReach;
          const thickness = 0.22 * (1 - limbT * 0.48);
          const angle = Math.random() * Math.PI * 2;
          offsetZ += Math.sin(angle) * thickness;
          offsetX += Math.cos(angle) * thickness;
          if (limbT > 0.9) {
            offsetZ *= 1.2;
          }
        }

        x = offsetX;
        y = offsetY;
        z = offsetZ;

      } else {
        // D. Graceful S-Curved Tail with animated tip
        const tailT = Math.random(); // 0 to 1
        x = -1.35 - tailT * 1.5;
        // Tail arches up first then curls back
        y = 0.22 + Math.sin(tailT * Math.PI * 1.1) * 0.55 - tailT * 0.35;
        z = Math.sin(tailT * Math.PI * 2) * 0.28;

        const tailThickness = 0.07 * (1 - tailT * 0.5);
        const theta = Math.random() * Math.PI * 2;
        y += Math.cos(theta) * tailThickness;
        z += Math.sin(theta) * tailThickness;
      }

      pos[pIdx * 3] = x;
      pos[pIdx * 3 + 1] = y;
      pos[pIdx * 3 + 2] = z;

      orig[pIdx * 3] = x;
      orig[pIdx * 3 + 1] = y;
      orig[pIdx * 3 + 2] = z;

      // Realistic Tiger Stripe Pigmentation Mapping
      // Tiger stripes run vertically across the torso and limbs
      const verticalRib = Math.sin(x * 16 + z * 4);
      const isStripe = verticalRib > 0.35;

      const chosenColor = isStripe
        ? amberDark
        : Math.random() > 0.4
        ? amberPrimary
        : amberHighlight;

      col[pIdx * 3] = chosenColor.r;
      col[pIdx * 3 + 1] = chosenColor.g;
      col[pIdx * 3 + 2] = chosenColor.b;

      pIdx++;
    }

    // 2. FOREST CANOPY & TOPOGRAPHIC TERRAIN (35,000 points)
    const CANOPY_POINTS = PARTICLE_COUNT - TIGER_POINTS;
    for (let i = 0; i < CANOPY_POINTS; i++) {
      const radius = 2.2 + Math.random() * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Ground floor and undulating sal tree canopy
      const terrainHeight = -1.45 + Math.sin(x * 0.6) * Math.cos(z * 0.6) * 0.35;
      const canopyHeight = terrainHeight + Math.random() * 2.6;

      pos[pIdx * 3] = x;
      pos[pIdx * 3 + 1] = canopyHeight;
      pos[pIdx * 3 + 2] = z;

      orig[pIdx * 3] = x;
      orig[pIdx * 3 + 1] = canopyHeight;
      orig[pIdx * 3 + 2] = z;

      // Emerald canopy variation with ambient teal depth
      const colorMix = Math.random();
      const baseEmerald = colorMix > 0.4 ? emeraldCanopy : emeraldDeep;

      col[pIdx * 3] = baseEmerald.r * (0.65 + Math.random() * 0.35);
      col[pIdx * 3 + 1] = baseEmerald.g * (0.65 + Math.random() * 0.35);
      col[pIdx * 3 + 2] = baseEmerald.b * (0.65 + Math.random() * 0.35);

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
    const hit = raycaster.ray.intersectPlane(plane, target);
    if (hit !== null) {
      pointer3D.current.copy(hit);
    }
  });

  // 60 FPS Physics animation loop: Hooke's Law + Interactive Repulsion Wave
  useFrame(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const currentPos = posAttr.array as Float32Array;

    const px = pointer3D.current.x;
    const py = pointer3D.current.y;
    const pz = pointer3D.current.z;

    // Blueprint Specification: Hooke's Law Return (k=0.18, c=0.85)
    const G = 0.28;
    const eps = 0.05;
    const repelRadiusSq = 1.9 * 1.9;
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

      let fx = 0;
      let fy = 0;
      let fz = 0;

      // Pointer Repulsion
      if (distSq < repelRadiusSq) {
        const force = G / (distSq + eps);
        const invDist = 1 / Math.sqrt(distSq + eps);
        fx += dx * invDist * force;
        fy += dy * invDist * force;
        fz += dz * invDist * force;
      }

      // Hooke's Law: F = -k * (pos - orig) - c * v
      fx += -k * (x - origX) - c * vx;
      fy += -k * (y - origY) - c * vy;
      fz += -k * (z - origZ) - c * vz;

      // Integration
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

  // Mobile Device Orientation Gyroscope Holographic Depth
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

  // WebGL memory cleanup on unmount
  useEffect(() => {
    const pts = pointsRef.current;
    return () => {
      if (pts) {
        pts.geometry.dispose();
        if (Array.isArray(pts.material)) {
          pts.material.forEach((m) => m.dispose());
        } else {
          pts.material.dispose();
        }
      }
    };
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.038}
        vertexColors
        transparent
        opacity={0.9 * opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
