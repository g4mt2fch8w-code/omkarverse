"use client";

import React, { useEffect, useRef } from "react";

export function DotPhysicsHeader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Particle dot interface with spring mechanics
    interface Dot {
      x: number;
      y: number;
      ox: number; // Origin / anchor x
      oy: number; // Origin / anchor y
      vx: number;
      vy: number;
      radius: number;
      baseRadius: number;
      color: string;
      phase: number;
    }

    const dots: Dot[] = [];
    const spacing = 28; // Grid spacing for technical tactical density
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);

    const offsetX = (width - cols * spacing) / 2 + spacing / 2;
    const offsetY = (height - rows * spacing) / 2 + spacing / 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const ox = offsetX + i * spacing;
        const oy = offsetY + j * spacing;
        
        // Random accent colors: mostly subtle white/blue with gold/amber telemetry accents
        const isAmber = (i * 7 + j * 13) % 17 === 0;
        const isCyan = (i * 11 + j * 5) % 19 === 0;
        const color = isAmber
          ? "rgba(245, 158, 11, 0.75)"
          : isCyan
          ? "rgba(56, 189, 248, 0.55)"
          : "rgba(255, 255, 255, 0.22)";

        dots.push({
          x: ox,
          y: oy,
          ox,
          oy,
          vx: 0,
          vy: 0,
          radius: isAmber ? 2.2 : 1.4,
          baseRadius: isAmber ? 2.2 : 1.4,
          color,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    // Mouse pointer interaction state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120, // Interaction radius
      isActive: false,
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.isActive = true;
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isActive = false;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    container.addEventListener("touchmove", handlePointerMove, { passive: true });
    container.addEventListener("touchend", handlePointerLeave);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = container.offsetWidth;
      height = container.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    // Physics parameters
    const spring = 0.06;   // Return force
    const damping = 0.86;  // Friction deceleration
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Mouse repulsion physics
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius && mouse.isActive) {
          const force = (1 - dist / mouse.radius) * 7.5;
          const angle = Math.atan2(dy, dx);
          dot.vx -= Math.cos(angle) * force;
          dot.vy -= Math.sin(angle) * force;
          dot.radius = dot.baseRadius * 1.8;
        } else {
          dot.radius += (dot.baseRadius - dot.radius) * 0.1;
        }

        // 2. Ambient harmonic breathing wave
        const waveY = Math.sin(time + dot.ox * 0.015 + dot.oy * 0.01) * 1.2;
        const targetX = dot.ox;
        const targetY = dot.oy + waveY;

        // 3. Spring physics back to equilibrium
        const ax = (targetX - dot.x) * spring;
        const ay = (targetY - dot.y) * spring;

        dot.vx = (dot.vx + ax) * damping;
        dot.vy = (dot.vy + ay) * damping;

        dot.x += dot.vx;
        dot.y += dot.vy;

        // 4. Render the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
      container.removeEventListener("touchmove", handlePointerMove);
      container.removeEventListener("touchend", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#041329]/90 py-12 px-6 sm:px-10 mb-10 select-none group"
    >
      {/* Interactive Dot Physics Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Subtle radial ambient glow behind text */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-start">
        {/* Big Bold Commanding Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase leading-[0.9] drop-shadow-sm font-sans">
          FIELD DISPATCHES
        </h1>
      </div>
    </div>
  );
}
