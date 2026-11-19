"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Raw mouse coordinates
  const mouse = useRef({ x: -100, y: -100 });
  // Dot position (fast lerp)
  const dot = useRef({ x: -100, y: -100 });
  // Ring follower position (smooth elastic lerp)
  const ring = useRef({ x: -100, y: -100 });
  // Velocity and stretch
  const prevPos = useRef({ x: -100, y: -100 });
  const velocity = useRef(0);
  const angle = useRef(0);

  // Magnetic element attraction target
  const magneticTarget = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  // DOM Refs for direct GPU transform manipulation (60 FPS guaranteed without React re-render lag)
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch-only screens (coarse pointer)
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Check for magnetic elements (buttons, links, or items with [data-magnetic])
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest<HTMLElement>("button, a, [role='button'], [data-magnetic]");

      if (interactiveEl) {
        setIsHovered(true);
        const rect = interactiveEl.getBoundingClientRect();
        // Calculate center of magnetic element
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // If cursor is within pull distance, apply magnetic attraction
        const distToCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        if (distToCenter < Math.max(rect.width, rect.height) * 0.9) {
          // Magnetic pull: pull ring toward center by 40%
          magneticTarget.current = {
            x: centerX + (e.clientX - centerX) * 0.35,
            y: centerY + (e.clientY - centerY) * 0.35,
            width: rect.width,
            height: rect.height,
          };
        } else {
          magneticTarget.current = null;
        }
      } else {
        setIsHovered(false);
        magneticTarget.current = null;
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    let animationFrameId: number;

    const render = () => {
      // 1. Center dot follows almost instantly
      dot.current.x += (mouse.current.x - dot.current.x) * 0.75;
      dot.current.y += (mouse.current.y - dot.current.y) * 0.75;

      // 2. Ring follows with amaterasu.ai spring lerp (0.16)
      const targetX = magneticTarget.current ? magneticTarget.current.x : mouse.current.x;
      const targetY = magneticTarget.current ? magneticTarget.current.y : mouse.current.y;

      ring.current.x += (targetX - ring.current.x) * 0.16;
      ring.current.y += (targetY - ring.current.y) * 0.16;

      // 3. Calculate speed and angle for kinetic fluid elongation
      const dx = mouse.current.x - prevPos.current.x;
      const dy = mouse.current.y - prevPos.current.y;
      const dist = Math.hypot(dx, dy);
      velocity.current = Math.min(dist * 0.04, 0.45); // Clamp elongation
      angle.current = Math.atan2(dy, dx);

      prevPos.current = { x: mouse.current.x, y: mouse.current.y };

      // Apply transforms directly via style for true 60 FPS performance
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.current.x}px, ${dot.current.y}px, 0)`;
      }

      if (ringRef.current) {
        const scaleX = 1 + velocity.current;
        const scaleY = 1 - velocity.current * 0.5;
        const rotDeg = (angle.current * 180) / Math.PI;

        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) rotate(${rotDeg}deg) scale(${scaleX}, ${scaleY})`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{ opacity: mouse.current.x < 0 ? 0 : 1 }}
      >
        <div
          className={`rounded-full bg-amber-400 transition-all duration-150 ${
            isClicked ? "w-1 h-1 scale-75" : "w-1.5 h-1.5 scale-100"
          }`}
        />
      </div>

      {/* Smooth Elastic Outer Ring Follower */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
        style={{ opacity: mouse.current.x < 0 ? 0 : 1 }}
      >
        <div
          className={`rounded-full border transition-all duration-200 ${
            isHovered
              ? "w-12 h-12 border-amber-400/80 bg-amber-400/10 shadow-[0_0_16px_rgba(229,169,60,0.3)]"
              : isClicked
              ? "w-6 h-6 border-amber-400/90 scale-90"
              : "w-8 h-8 border-amber-400/40"
          }`}
        >
          {/* Tactical Crosshair Ticks on Ring */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-0.5 bg-amber-400/70" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-0.5 bg-amber-400/70" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-0.5 h-1 bg-amber-400/70" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0.5 h-1 bg-amber-400/70" />
        </div>
      </div>
    </div>
  );
}
