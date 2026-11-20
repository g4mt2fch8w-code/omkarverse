"use client";

import React, { useState, useMemo, useEffect } from "react";

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

  // rejouice.com Hover Cursor Preview State
  const [hoveredDispatch, setHoveredDispatch] = useState<Dispatch | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Derive unique categories with counts
  const categories = useMemo(() => {
    const cats = ["ALL", "EXPEDITIONS", "APEX TRACKING", "TELEMETRY", "CAMERA TRAPS"];
    return cats.map((cat) => {
      const count =
        cat === "ALL"
          ? initialDispatches.length
          : initialDispatches.filter(
              (d) => d.category.toUpperCase() === cat.toUpperCase()
            ).length;
      return { name: cat, count };
    });
  }, [initialDispatches]);

  // Filtered dispatches
  const filteredDispatches = useMemo(() => {
    if (selectedCategory === "ALL") return initialDispatches;
    return initialDispatches.filter(
      (d) => d.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [initialDispatches, selectedCategory]);

  const currentCount = String(filteredDispatches.length).padStart(2, "0");
  const totalCount = String(initialDispatches.length).padStart(2, "0");

  const featured = filteredDispatches[0];
  const secondary = filteredDispatches.slice(1);

  // Mouse move handler for hover cursor preview
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* =========================================================================
          CONTROL BAR: 108.supply Tactile Switcher & Filter Matrix
          ========================================================================= */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          padding: "16px 20px",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "10px",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Left: Tactical Filter Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            maxWidth: "100%",
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: isActive
                    ? "1px solid rgba(255, 184, 0, 0.45)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: isActive
                    ? "rgba(255, 184, 0, 0.1)"
                    : "rgba(255, 255, 255, 0.02)",
                  color: isActive ? "#FFB800" : "#94A3B8",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  whiteSpace: "nowrap",
                }}
              >
                {isActive && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: "#FFB800",
                      boxShadow: "0 0 8px #FFB800",
                    }}
                  />
                )}
                <span>
                  {cat.name} ({cat.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Tactile View Mode Capsule + Status Counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flexShrink: 0,
          }}
        >
          {/* Status Counter */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              color: "#64748B",
              textTransform: "uppercase",
            }}
          >
            SHOWING: <span style={{ color: "#FFB800", fontWeight: 600 }}>{currentCount}</span> / {totalCount} LOGS · SECTOR INDEX LOCKED
          </div>

          {/* 108.supply Mechanical View Toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "6px",
              padding: "2px",
              gap: "2px",
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-pressed={viewMode === "grid"}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                padding: "5px 11px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                backgroundColor: viewMode === "grid" ? "#FFB800" : "transparent",
                color: viewMode === "grid" ? "#041329" : "#94A3B8",
                fontWeight: viewMode === "grid" ? 700 : 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>⊞</span>
              <span>GRID</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10.5px",
                letterSpacing: "0.08em",
                padding: "5px 11px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                backgroundColor: viewMode === "list" ? "#FFB800" : "transparent",
                color: viewMode === "list" ? "#041329" : "#94A3B8",
                fontWeight: viewMode === "list" ? 700 : 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span>☰</span>
              <span>LIST</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: GRID MODE (HAVEN Tactical Spec Cards & rejouice Hero)
          ========================================================================= */}
      {filteredDispatches.length === 0 ? (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.01)",
            border: "1px dashed rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              letterSpacing: "0.14em",
              color: "#FFB800",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            NO LOGS FOUND IN SELECTED CATEGORY
          </div>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
            Select another filter chip or reset to ALL to inspect active logs.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* 1. Featured Hero Card (First Dispatch) */}
          {featured && (
            <article
              key={featured.id}
              onClick={() => setSelectedDispatch(featured)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "14px",
                overflow: "hidden",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 184, 0, 0.4)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(0, 0, 0, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Left Column: Cinematic 16:9 Image */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  minHeight: "420px",
                  backgroundColor: "#000",
                  overflow: "hidden",
                }}
              >
                <img
                  src={featured.heroImage}
                  alt={featured.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: 0.92,
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                />
                {/* Vignette & Badges */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(4,19,41,0.2) 0%, rgba(4,19,41,0.7) 100%)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "18px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10.5px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(4, 19, 41, 0.92)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 184, 0, 0.45)",
                      color: "#FFB800",
                      fontWeight: 600,
                    }}
                  >
                    FEATURED // {featured.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#94A3B8",
                    }}
                  >
                    LOG #01
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "18px",
                    right: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    color: "rgba(255, 255, 255, 0.85)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  <span>{featured.date}</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>

              {/* Right Column: Tactical Dossier & HAVEN Spec Box */}
              <div
                style={{
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "rgba(4, 19, 41, 0.4)",
                  borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      color: "#FFB800",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                    }}
                  >
                    {featured.sector}
                  </div>

                  {/* rejouice.com-Style Bold Headline */}
                  <h2
                    style={{
                      fontSize: "clamp(24px, 2.5vw, 34px)",
                      fontWeight: 800,
                      lineHeight: 1.15,
                      letterSpacing: "-0.025em",
                      margin: "0 0 14px 0",
                      color: "#FFFFFF",
                    }}
                  >
                    {featured.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "14.5px",
                      lineHeight: 1.6,
                      color: "#94A3B8",
                      margin: "0 0 24px 0",
                      fontStyle: "italic",
                    }}
                  >
                    {featured.subtitle}
                  </p>

                  {/* HAVEN Tactical Technical Spec Box (2x2 Monospace Grid) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase", marginBottom: "3px" }}>
                        TERRAIN
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color: "#E2E8F0", fontWeight: 500 }}>
                        {featured.terrain}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase", marginBottom: "3px" }}>
                        WEATHER
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color: "#E2E8F0", fontWeight: 500 }}>
                        {featured.weather}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase", marginBottom: "3px" }}>
                        OPTICS
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color: "#FFB800", fontWeight: 500 }}>
                        {featured.optics}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase", marginBottom: "3px" }}>
                        COORDINATES
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color: "#E2E8F0", fontWeight: 500 }}>
                        {featured.coordinates}
                      </div>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "13.5px",
                      lineHeight: 1.65,
                      color: "#CBD5E1",
                      margin: "0 0 24px 0",
                    }}
                  >
                    {featured.content[0]}
                  </p>
                </div>

                {/* [ READ DISPATCH ➔ ] trigger button */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDispatch(featured);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(255, 184, 0, 0.08)",
                      border: "1px solid rgba(255, 184, 0, 0.35)",
                      color: "#FFB800",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 184, 0, 0.18)";
                      e.currentTarget.style.boxShadow = "0 0 16px rgba(255, 184, 0, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 184, 0, 0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span>[ READ DISPATCH ➔ ]</span>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* 2. Secondary Dispatches Grid (3-Column Layout) */}
          {secondary.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "28px",
              }}
            >
              {secondary.map((dispatch, idx) => (
                <article
                  key={dispatch.id}
                  onClick={() => setSelectedDispatch(dispatch)}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.015)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 184, 0, 0.35)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Aspect Ratio 16:9 Image */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      backgroundColor: "#000",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={dispatch.heroImage}
                      alt={dispatch.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        opacity: 0.9,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        display: "flex",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9.5px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(4, 19, 41, 0.9)",
                          border: "1px solid rgba(255, 184, 0, 0.4)",
                          color: "#FFB800",
                          fontWeight: 600,
                        }}
                      >
                        {dispatch.category}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9.5px",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(0, 0, 0, 0.75)",
                          color: "#94A3B8",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        LOG #{String(idx + 2).padStart(2, "0")}
                      </span>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "12px",
                        right: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <span>{dispatch.date.split("·")[0]}</span>
                      <span>{dispatch.readTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div
                    style={{
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-between",
                      backgroundColor: "rgba(4, 19, 41, 0.4)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          letterSpacing: "0.12em",
                          color: "#FFB800",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                        }}
                      >
                        {dispatch.sector}
                      </div>

                      <h3
                        style={{
                          fontSize: "19px",
                          fontWeight: 700,
                          lineHeight: 1.25,
                          letterSpacing: "-0.015em",
                          margin: "0 0 10px 0",
                          color: "#FFFFFF",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {dispatch.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.55,
                          color: "#94A3B8",
                          margin: "0 0 16px 0",
                        }}
                      >
                        {dispatch.subtitle}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          color: "#64748B",
                        }}
                      >
                        📍 {dispatch.coordinates.split("·")[0]}
                      </span>

                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#FFB800",
                        }}
                      >
                        VIEW ➔
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            VIEW MODE 2: LIST MODE (108.supply Dense Rows + rejouice.com Hover Photo Cursor)
            ========================================================================= */
        <div
          onMouseMove={handleMouseMove}
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {filteredDispatches.map((dispatch, idx) => (
            <div
              key={dispatch.id}
              onClick={() => setSelectedDispatch(dispatch)}
              onMouseEnter={() => setHoveredDispatch(dispatch)}
              onMouseLeave={() => setHoveredDispatch(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr 240px 140px 100px",
                alignItems: "center",
                gap: "16px",
                padding: "20px 16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                cursor: "pointer",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.03)")}
            >
              {/* Col 1: Date */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#FFB800",
                  letterSpacing: "0.05em",
                }}
              >
                {dispatch.date.split("·")[0]}
              </div>

              {/* Col 2: Title & Subtitle */}
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    letterSpacing: "-0.01em",
                    marginBottom: "3px",
                    transition: "color 0.2s ease",
                  }}
                >
                  {dispatch.title}
                </div>
                <div style={{ fontSize: "12.5px", color: "#64748B", fontStyle: "italic" }}>
                  {dispatch.subtitle}
                </div>
              </div>

              {/* Col 3: Sector & Coordinates */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10.5px",
                  color: "#94A3B8",
                  lineHeight: 1.4,
                }}
              >
                <div>{dispatch.sector.split("//")[1] || dispatch.sector}</div>
                <div style={{ color: "#64748B" }}>{dispatch.coordinates.split("·")[0]}</div>
              </div>

              {/* Col 4: Category chip */}
              <div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9.5px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#CBD5E1",
                  }}
                >
                  {dispatch.category}
                </span>
              </div>

              {/* Col 5: Read Time & Arrow */}
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "#94A3B8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "6px",
                }}
              >
                <span>{dispatch.readTime}</span>
                <span style={{ color: "#FFB800" }}>➔</span>
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
          style={{
            position: "fixed",
            left: `${cursorPos.x + 22}px`,
            top: `${cursorPos.y - 75}px`,
            width: "220px",
            height: "135px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid rgba(255, 184, 0, 0.45)",
            backgroundColor: "#000",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.8)",
            pointerEvents: "none",
            zIndex: 99999,
            transition: "opacity 0.15s ease",
          }}
        >
          <img
            src={hoveredDispatch.heroImage}
            alt={hoveredDispatch.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              right: "8px",
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#FFF",
              textShadow: "0 1px 4px rgba(0,0,0,0.9)",
            }}
          >
            <span>{hoveredDispatch.category}</span>
            <span>{hoveredDispatch.readTime}</span>
          </div>
        </div>
      )}

      {/* Interactivity Indicator for selected dispatch (Step 4 bridge) */}
      {selectedDispatch && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "rgba(4, 19, 41, 0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 184, 0, 0.4)",
            borderRadius: "8px",
            padding: "12px 18px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 10px #10B981",
            }}
          />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#E2E8F0" }}>
            SELECTED LOG: <span style={{ color: "#FFB800" }}>{selectedDispatch.title}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDispatch(null)}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
