"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";

export interface Dispatch {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  sector: string;
  coordinates: string;
  terrain: string;
  weather: string;
  optics: string;
  category: string;
  readTime: string;
  heroImage: string;
  content: string[];
}

interface FieldFeedProps {
  initialDispatches: Dispatch[];
}

export function FieldFeed({ initialDispatches }: FieldFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(null);

  // Scroll Progress Engine
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const drawerScrollRef = useRef<HTMLDivElement>(null);

  // Hover cursor preview
  const [hoveredDispatch, setHoveredDispatch] = useState<Dispatch | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // URL deep-linking: Check on mount if ?id=<dispatch-id> is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        const found = initialDispatches.find((d) => d.id === id);
        if (found) setSelectedDispatch(found);
      }
    }
  }, [initialDispatches]);

  // URL deep-linking: Update ?id=<dispatch-id> on open, clear on close
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (selectedDispatch) {
        url.searchParams.set("id", selectedDispatch.id);
        window.history.replaceState({}, "", url.toString());
      } else {
        url.searchParams.delete("id");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [selectedDispatch]);

  // Keyboard navigation & ESC dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDispatch) return;
      if (e.key === "Escape") {
        setSelectedDispatch(null);
      } else if (e.key === "ArrowLeft") {
        navigateDispatch(-1);
      } else if (e.key === "ArrowRight") {
        navigateDispatch(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDispatch, initialDispatches]);

  // Reset scroll progress when active dispatch changes
  useEffect(() => {
    setScrollProgress(0);
    if (drawerScrollRef.current) {
      drawerScrollRef.current.scrollTop = 0;
    }
  }, [selectedDispatch]);

  const handleDrawerScroll = () => {
    const el = drawerScrollRef.current;
    if (!el) return;
    const totalHeight = el.scrollHeight - el.clientHeight;
    if (totalHeight <= 0) {
      setScrollProgress(100);
      return;
    }
    const progress = (el.scrollTop / totalHeight) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  const navigateDispatch = (dir: number) => {
    if (!selectedDispatch) return;
    const currentIdx = initialDispatches.findIndex((d) => d.id === selectedDispatch.id);
    if (currentIdx === -1) return;
    const nextIdx = (currentIdx + dir + initialDispatches.length) % initialDispatches.length;
    setSelectedDispatch(initialDispatches[nextIdx]);
  };

  const categories = ["ALL", "EXPEDITIONS", "APEX TRACKING", "TELEMETRY", "CAMERA TRAPS"];

  const filteredDispatches = useMemo(() => {
    if (selectedCategory === "ALL") return initialDispatches;
    return initialDispatches.filter(
      (d) => d.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [initialDispatches, selectedCategory]);

  const featured = filteredDispatches[0];
  const secondary = filteredDispatches.slice(1);

  const selectedIdx = selectedDispatch
    ? initialDispatches.findIndex((d) => d.id === selectedDispatch.id)
    : -1;

  return (
    <div className="flex flex-col gap-12">
      {/* =========================================================================
          1. MINIMALIST TACTICAL HEADER (Pure National Geographic × 108.supply)
          ========================================================================= */}
      <header className="border-b border-white/10 pb-6">
        {/* Top Line: Dispatch Origin & Coordinates */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 tracking-widest font-semibold uppercase">
              FIELD DISPATCHES // TADOBA ARCHIVE
            </span>
            <span className="text-white/20">/</span>
            <span className="text-slate-400 tracking-wider hidden sm:inline">
              20.246° N, 79.312° E · TADOBA CORE
            </span>
          </div>

          {/* 108.supply Ultra-Minimalist View Toggle */}
          <div className="flex items-center border border-white/10 rounded p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              [ GRID ]
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white/10 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              [ LIST ]
            </button>
          </div>
        </div>

        {/* Category Filter Row */}
        <div className="mt-8 flex items-center gap-6 overflow-x-auto text-xs font-mono tracking-wider no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-1 transition-colors whitespace-nowrap uppercase ${
                  isActive
                    ? "text-amber-400 border-b border-amber-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                [ {cat} ]
              </button>
            );
          })}
        </div>
      </header>

      {/* =========================================================================
          2. GRID VIEW: THE PHOTOGRAPHIC EDITORIAL FLOW
          ========================================================================= */}
      {filteredDispatches.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-white/10 rounded">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-400">
            NO DISPATCHES FILED IN SELECTED SECTOR
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="space-y-16">
          {/* Featured Lead Story (Massive 16:9 Cinematic Hero) */}
          {featured && (
            <article
              onClick={() => setSelectedDispatch(featured)}
              className="group cursor-pointer block"
            >
              {/* Massive 16:9 photo */}
              <div className="w-full aspect-[16/9] overflow-hidden rounded-sm bg-black/40">
                <img
                  src={featured.heroImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </div>

              {/* Editorial Breathing Room Below Photo */}
              <div className="mt-6 space-y-3">
                {/* Monospace Metadata Line */}
                <div className="font-mono text-xs text-amber-400/90 tracking-wider uppercase">
                  {featured.date.split("·")[0].trim()} · {featured.sector.toUpperCase()} · {featured.readTime}
                </div>

                {/* Bold Commanding Headline */}
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors leading-[1.1]">
                  {featured.title}
                </h2>

                {/* Quiet Atmospheric Excerpt */}
                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl line-clamp-2">
                  {featured.subtitle}
                </p>
              </div>
            </article>
          )}

          {/* Secondary Dispatches (Clean Editorial Grid with Negative Space) */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-6 border-t border-white/5">
              {secondary.map((dispatch) => (
                <article
                  key={dispatch.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* 16:9 Photo */}
                    <div className="w-full aspect-[16/9] overflow-hidden rounded-sm bg-black/40">
                      <img
                        src={dispatch.heroImage}
                        alt={dispatch.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata Line */}
                    <div className="font-mono text-[11px] text-amber-400/80 tracking-wider mt-4 uppercase">
                      {dispatch.date.split("·")[0].trim()} · {dispatch.readTime}
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors mt-2 leading-snug">
                      {dispatch.title}
                    </h3>

                    {/* 1-Line Excerpt */}
                    <p className="text-slate-400 text-sm leading-relaxed mt-2 line-clamp-2">
                      {dispatch.subtitle}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            3. LIST VIEW: 108.supply Swiss Density + rejouice.com Hover Cursor
            ========================================================================= */
        <div
          onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
          className="border-t border-white/5 divide-y divide-white/5"
        >
          {filteredDispatches.map((dispatch) => (
            <div
              key={dispatch.id}
              onClick={() => setSelectedDispatch(dispatch)}
              onMouseEnter={() => setHoveredDispatch(dispatch)}
              onMouseLeave={() => setHoveredDispatch(null)}
              className="group py-5 px-2 flex items-baseline justify-between gap-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              {/* Date */}
              <div className="font-mono text-xs text-amber-400/80 tracking-wider shrink-0 w-28">
                {dispatch.date.split("·")[0].trim()}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                  {dispatch.title}
                </div>
              </div>

              {/* Location */}
              <div className="font-mono text-xs text-slate-400 tracking-wider hidden md:block shrink-0">
                {dispatch.sector.split("//")[1]?.trim() || dispatch.sector}
              </div>

              {/* Read Time */}
              <div className="font-mono text-xs text-slate-500 shrink-0 w-20 text-right">
                {dispatch.readTime}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          rejouice.com FLOATING PHOTO HOVER CURSOR (DESKTOP)
          ========================================================================= */}
      {hoveredDispatch && viewMode === "list" && (
        <div
          className="pointer-events-none fixed z-50 w-52 aspect-[16/10] overflow-hidden rounded border border-white/20 bg-black shadow-2xl transition-opacity duration-150 hidden md:block"
          style={{
            left: `${cursorPos.x + 20}px`,
            top: `${cursorPos.y - 65}px`,
          }}
        >
          <img
            src={hoveredDispatch.heroImage}
            alt={hoveredDispatch.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* =========================================================================
          4. ARISTIDE BENOIST SLIDE-OVER READING DRAWER
          ========================================================================= */}
      {selectedDispatch && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedDispatch(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99990] transition-opacity duration-300"
          />

          {/* Reader Sheet */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={selectedDispatch.title}
            className="fixed top-0 right-0 bottom-0 w-full md:max-w-2xl bg-[#041329] border-l border-white/10 z-[99999] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Top Amber 2px Scroll Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-50">
              <div
                className="h-full bg-[#FFB800] transition-all duration-75"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 shrink-0 bg-[#041329]/80 backdrop-blur-md">
              <div className="font-mono text-xs text-amber-400 tracking-widest uppercase">
                {selectedDispatch.category} · {selectedDispatch.date.split("·")[0].trim()}
              </div>

              <button
                type="button"
                onClick={() => setSelectedDispatch(null)}
                className="font-mono text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded transition-colors"
              >
                ✕ CLOSE [ESC]
              </button>
            </div>

            {/* Scrollable Editorial Body */}
            <div
              ref={drawerScrollRef}
              onScroll={handleDrawerScroll}
              className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-10 selection:bg-amber-400 selection:text-black"
            >
              {/* High-Res Hero Photo */}
              <div className="space-y-2">
                <div className="w-full aspect-[16/10] overflow-hidden rounded-sm bg-black/40">
                  <img
                    src={selectedDispatch.heroImage}
                    alt={selectedDispatch.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-mono text-[10px] text-slate-500 tracking-wider text-right uppercase">
                  ARCHIVIST: ONKAR BHOPLE · {selectedDispatch.optics.split("·")[0].trim()}
                </div>
              </div>

              {/* Title Block */}
              <div className="space-y-3">
                <div className="font-mono text-xs text-amber-400 tracking-wider uppercase">
                  {selectedDispatch.sector}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                  {selectedDispatch.title}
                </h1>
                <p className="text-slate-400 text-base leading-relaxed italic">
                  {selectedDispatch.subtitle}
                </p>
              </div>

              {/* Editorial Prose Section */}
              <div className="space-y-6 text-slate-300 text-base md:text-lg leading-relaxed font-sans">
                {selectedDispatch.content.map((paragraph, pIdx) => {
                  const isPullQuote = pIdx === 1;
                  return isPullQuote ? (
                    <blockquote
                      key={pIdx}
                      className="border-l-2 border-amber-500/60 pl-6 italic text-slate-200 my-8 text-lg"
                    >
                      "{paragraph}"
                    </blockquote>
                  ) : (
                    <p key={pIdx}>{paragraph}</p>
                  );
                })}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between px-8 py-4 border-t border-white/5 shrink-0 bg-[#041329]/80 font-mono text-xs">
              <button
                type="button"
                onClick={() => navigateDispatch(-1)}
                className="text-slate-400 hover:text-amber-400 transition-colors uppercase"
              >
                [← PREV DISPATCH]
              </button>

              <span className="text-slate-600">
                {String(selectedIdx + 1).padStart(2, "0")} / {String(initialDispatches.length).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() => navigateDispatch(1)}
                className="text-slate-400 hover:text-amber-400 transition-colors uppercase"
              >
                [NEXT DISPATCH →]
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
