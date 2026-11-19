"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const targetRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch-only devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.getAttribute("role") === "button" ||
          target.closest("button") ||
          target.closest("a"))
      ) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animId: number;
    let currX = -100;
    let currY = -100;

    const loop = () => {
      currX += (targetRef.current.x - currX) * 0.2;
      currY += (targetRef.current.y - currY) * 0.2;
      setPosition({ x: currX, y: currY });
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: position.x < 0 ? 0 : 1,
      }}
    >
      {/* Outer Tactical Reticle */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/50 transition-all duration-200 ${
          isHoveringInteractive
            ? "w-10 h-10 border-amber-400 bg-amber-400/10 scale-125"
            : "w-6 h-6 scale-100"
        }`}
      />
      {/* Center Target Dot */}
      <div className="absolute -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
    </div>
  );
}
