"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "@/components/audio/soundManager";

interface RadarCardItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  coords: string;
  link?: string;
  status: string;
  stats?: string;
}

interface RadarSweepProps {
  items: RadarCardItem[];
}

const HEX_CHARS = "0123456789ABCDEF!@#$%^&*<>[]{}";

export default function RadarSweep({ items }: RadarSweepProps) {
  const [decryptedTitles, setDecryptedTitles] = useState<Record<string, string>>({});
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Decryption scramble effect on mount or card trigger
  const triggerScramble = (id: string, targetText: string) => {
    let iteration = 0;
    const maxIterations = 8;
    const interval = setInterval(() => {
      setDecryptedTitles((prev) => ({
        ...prev,
        [id]: targetText
          .split("")
          .map((char, index) => {
            if (char === " " || char === "/" || char === "-") return char;
            if (index < iteration * 2) {
              return targetText[index];
            }
            return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          })
          .join(""),
      }));

      iteration++;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDecryptedTitles((prev) => ({ ...prev, [id]: targetText }));
      }
    }, 40);
  };

  useEffect(() => {
    // Initial sequential decryption
    items.forEach((item, index) => {
      setTimeout(() => {
        triggerScramble(item.id, item.title);
        soundEngine?.playRadarPing?.();
      }, index * 120);
    });
  }, [items]);

  return (
    <div ref={containerRef} className="relative w-full py-6">
      {/* Visual Rotating Radar Sweep Line */}
      <div className="absolute top-0 right-10 w-48 h-48 md:w-64 md:h-64 pointer-events-none opacity-20 -z-10">
        <div
          className="w-full h-full rounded-full radar-sweep-conic animate-spin"
          style={{ animationDuration: "4.48s" }} // omega = 1.4 rad/s => T = 2*pi/1.4 ~ 4.48s
        />
        <div className="absolute inset-0 rounded-full border border-amber-400/30" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-emerald-400/20" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const isTargeted = activeCardId === item.id;
          const displayTitle = decryptedTitles[item.id] || item.title;

          return (
            <div
              key={item.id}
              onMouseEnter={() => {
                setActiveCardId(item.id);
                triggerScramble(item.id, item.title);
                soundEngine?.playTargetLock?.();
              }}
              onMouseLeave={() => setActiveCardId(null)}
              className={`relative p-5 rounded-2xl glass-panel transition-all duration-300 border ${
                isTargeted
                  ? "border-amber-400/60 shadow-[0_0_24px_rgba(229,169,60,0.18)] translate-y-[-2px]"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Target Acquisition Brackets [ ⤹ ⤸ ] */}
              {isTargeted && (
                <>
                  <span className="absolute top-2 left-2 font-mono text-xs text-amber-400 animate-pulse">
                    ⤹
                  </span>
                  <span className="absolute top-2 right-2 font-mono text-xs text-amber-400 animate-pulse">
                    ⤸
                  </span>
                </>
              )}

              {/* Category Badge & Live Pulse */}
              <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-slate-400">
                <span className="text-amber-500/90 font-medium tracking-wider">
                  {item.category}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {item.status}
                </span>
              </div>

              {/* Scrambling Title */}
              <h3 className="font-mono text-base md:text-lg font-semibold text-slate-100 tracking-tight mb-1.5 min-h-[1.75rem]">
                {displayTitle}
              </h3>

              {/* Subtitle / Narrative */}
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {item.subtitle}
              </p>

              {/* Coords & Stats Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span className="text-slate-400">{item.coords}</span>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1"
                  >
                    DEPLOYMENT ➔
                  </a>
                ) : (
                  <span className="text-slate-500">{item.stats}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
