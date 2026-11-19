"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitSphereProps {
  opacity?: number;
}

// Blueprint constant: globe radius
const GLOBE_RADIUS = 4.2;

// Convert Lat/Lon to 3D Cartesian coordinates on sphere radius R
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Generate quadratic bezier arc between two points on globe
function createTelemetryArc(start: THREE.Vector3, end: THREE.Vector3, altitudeFactor: number): THREE.Vector3[] {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  mid.setLength(mid.length() + distance * altitudeFactor);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  return curve.getPoints(50);
}

export default function OrbitSphere({ opacity = 1 }: OrbitSphereProps) {
  const globeGroupRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const RADIUS = GLOBE_RADIUS;

  // Tadoba Core coordinates: 20.246° N, 79.312° E
  const tadobaPos = useMemo(() => latLonToVector3(20.246, 79.312, GLOBE_RADIUS), []);

  // Telemetry satellite hubs connected to Central India
  const satHubs = useMemo(
    () => [
      latLonToVector3(28.6139, 77.209, GLOBE_RADIUS),  // Delhi / Dehradun WII
      latLonToVector3(12.9716, 77.5946, GLOBE_RADIUS), // Bengaluru ISRO
      latLonToVector3(22.5726, 88.3639, GLOBE_RADIUS), // Sundarbans
      latLonToVector3(26.8467, 80.9462, GLOBE_RADIUS), // Dudhwa
      latLonToVector3(19.076, 72.8777, GLOBE_RADIUS),  // Mumbai HQ
    ],
    []
  );

  // Precompute telemetry arcs geometries & materials once to eliminate memory leaks
  const { arcLines, arcGeometries, arcMaterials } = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.LineBasicMaterial[] = [];
    const lines: THREE.Line[] = [];

    satHubs.forEach((hub, idx) => {
      const pts = createTelemetryArc(tadobaPos, hub, 0.45);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? "#e5a93c" : "#68d391",
        transparent: true,
        opacity: 0.55,
        linewidth: 1.5,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geom, mat);
      geometries.push(geom);
      materials.push(mat);
      lines.push(line);
    });

    return { arcLines: lines, arcGeometries: geometries, arcMaterials: materials };
  }, [satHubs, tadobaPos]);

  // Dynamically update arc material opacity based on scene transition
  useEffect(() => {
    arcMaterials.forEach((mat) => {
      mat.opacity = 0.55 * opacity;
    });
  }, [opacity, arcMaterials]);

  // Explicit WebGL memory disposal on unmount
  useEffect(() => {
    return () => {
      arcGeometries.forEach((g) => g.dispose());
      arcMaterials.forEach((m) => m.dispose());
    };
  }, [arcGeometries, arcMaterials]);

  // Mouse pitch/yaw parallax (clamped: θx, θy in [-15°, +15°] = [-0.26 rad, +0.26 rad])
  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += delta * 0.05;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.07;
    }

    if (parallaxGroupRef.current) {
      const targetRotY = THREE.MathUtils.clamp(-mouse.x * 0.26, -0.26, 0.26);
      const targetRotX = THREE.MathUtils.clamp(mouse.y * 0.26, -0.26, 0.26);
      parallaxGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        parallaxGroupRef.current.rotation.y,
        targetRotY,
        0.05
      );
      parallaxGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        parallaxGroupRef.current.rotation.x,
        targetRotX,
        0.05
      );
    }
  });

  return (
    <group ref={parallaxGroupRef}>
      <group ref={globeGroupRef}>
        {/* Dark Luxury Geospatial Sphere Base */}
        <mesh>
          <sphereGeometry args={[RADIUS, 64, 64]} />
          <meshStandardMaterial
            color="#06090e"
            roughness={0.7}
            metalness={0.3}
            wireframe={false}
            transparent
            opacity={opacity}
          />
        </mesh>

        {/* Wireframe Lat/Lon Tactical Coordinate Grid */}
        <mesh>
          <sphereGeometry args={[RADIUS * 1.002, 36, 18]} />
          <meshBasicMaterial
            color="#1e293b"
            wireframe
            transparent
            opacity={0.35 * opacity}
          />
        </mesh>

        {/* Atmospheric Haze Glow */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[RADIUS * 1.06, 48, 48]} />
          <meshBasicMaterial
            color="#0ea5e9"
            side={THREE.BackSide}
            transparent
            opacity={0.12 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Equatorial & Polar Tactical Orbital Rings */}
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[RADIUS * 1.35, 0.015, 16, 100]} />
          <meshBasicMaterial
            color="#e5a93c"
            transparent
            opacity={0.25 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[RADIUS * 1.45, 0.01, 16, 100]} />
          <meshBasicMaterial
            color="#68d391"
            transparent
            opacity={0.2 * opacity}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Tadoba Central Node Pin */}
        <group position={tadobaPos}>
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#e5a93c" />
          </mesh>
          <mesh>
            <ringGeometry args={[0.12, 0.16, 24]} />
            <meshBasicMaterial
              color="#e5a93c"
              side={THREE.DoubleSide}
              transparent
              opacity={0.7 * opacity}
            />
          </mesh>
        </group>

        {/* Sat Hub Nodes */}
        {satHubs.map((hub, idx) => (
          <mesh key={idx} position={hub}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#68d391" />
          </mesh>
        ))}

        {/* Glowing Telemetry Arcs */}
        <group>
          {arcLines.map((line, idx) => (
            <primitive key={idx} object={line} />
          ))}
        </group>
      </group>
    </group>
  );
}
