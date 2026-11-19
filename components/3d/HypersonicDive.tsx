"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { soundEngine } from "@/components/audio/soundManager";

interface HypersonicDiveProps {
  isDiving: boolean;
  onDiveComplete: () => void;
  onAltitudeChange?: (altitude: number) => void;
}

export default function HypersonicDive({
  isDiving,
  onDiveComplete,
  onAltitudeChange,
}: HypersonicDiveProps) {
  const { camera } = useThree();
  const hasTriggered = useRef(false);
  // Track active GSAP tweens for cleanup
  const tweensRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!isDiving) {
      hasTriggered.current = false;
      // Level off camera roll on ESC/skip mid-dive
      gsap.to(camera.rotation, { z: 0, duration: 0.3, ease: "power2.out" });
      tweensRef.current.forEach((t) => t.kill());
      tweensRef.current = [];
      return;
    }

    if (isDiving && !hasTriggered.current) {
      hasTriggered.current = true;
      soundEngine?.playHypersonicDive?.();

      const timeline = {
        altitude: 8000,
        camZ: 14,
        camY: 0,
        roll: 0,
      };

      // Non-linear cubic-bezier(0.85, 0, 0.15, 1) over duration T = 1.6s
      const t1 = gsap.to(timeline, {
        altitude: 25,
        camZ: 4.8,
        camY: 0.4,
        duration: 1.6,
        ease: "power4.inOut",
        onUpdate: () => {
          camera.position.z = timeline.camZ;
          camera.position.y = timeline.camY;
          if (onAltitudeChange) {
            onAltitudeChange(Math.round(timeline.altitude));
          }
        },
        onComplete: () => {
          onDiveComplete();
        },
      });

      // Banking roll: -14 degrees (-0.244 rad) then level-off
      const t2 = gsap.to(camera.rotation, {
        z: -0.244,
        duration: 0.8,
        ease: "power2.in",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Ensure perfectly leveled after oscillation
          camera.rotation.z = 0;
        },
      });

      tweensRef.current = [t1, t2];
    }
  }, [isDiving, camera, onDiveComplete, onAltitudeChange]);

  // Cleanup all tweens on component unmount
  useEffect(() => {
    return () => {
      tweensRef.current.forEach((t) => t.kill());
      gsap.set(camera.rotation, { z: 0 });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subtle camera mouse yaw/pitch parallax
  useFrame(({ mouse }) => {
    if (!isDiving) {
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -mouse.x * 0.12, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, mouse.y * 0.12, 0.05);
    }
  });

  return null;
}
