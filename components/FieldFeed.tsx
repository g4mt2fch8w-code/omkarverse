"use client";

import React, { useState, useMemo } from "react";

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {/* =========================================================================
          INTERACTIVE CONTROL BAR: 108.supply Tactile Switcher & Filter Matrix
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
          {/* Status Counter (108.supply monospace corner indicator) */}
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

          {/* 108.supply-Style Mechanical View Toggle */}
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
          DISPATCHES CONTENT RENDERER (GRID VS LIST)
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
        /* ================= GRID VIEW ================= */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(560px, 1fr))",
            gap: "36px",
            transition: "opacity 0.25s ease",
          }}
        >
          {filteredDispatches.map((dispatch, idx) => (
            <article
              key={dispatch.id}
              id={dispatch.id}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "border-color 0.25s ease, transform 0.25s ease",
              }}
            >
              {/* Visual Hero */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 10",
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
                    transition: "transform 0.5s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(4, 19, 41, 0.88)",
                      backdropFilter: "blur(8px)",
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
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#94A3B8",
                    }}
                  >
                    LOG #{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "14px",
                    right: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    color: "rgba(255, 255, 255, 0.8)",
                    textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  <span>{dispatch.date}</span>
                  <span>{dispatch.readTime}</span>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: "28px",
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
                      fontSize: "10.5px",
                      letterSpacing: "0.12em",
                      color: "#FFB800",
                      textTransform: "uppercase",
                      marginBottom: "10px",
                    }}
                  >
                    {dispatch.sector}
                  </div>

                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      lineHeight: 1.25,
                      letterSpacing: "-0.02em",
                      margin: "0 0 10px 0",
                      color: "#FFFFFF",
                    }}
                  >
                    {dispatch.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "13.5px",
                      lineHeight: 1.5,
                      color: "#94A3B8",
                      margin: "0 0 20px 0",
                      fontStyle: "italic",
                    }}
                  >
                    {dispatch.subtitle}
                  </p>

                  {/* HAVEN Spec Sheet */}
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "8px",
                      padding: "14px",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase" }}>COORDINATES</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#E2E8F0" }}>{dispatch.coordinates}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase" }}>TERRAIN</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#E2E8F0" }}>{dispatch.terrain}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "6px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase" }}>WEATHER</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#E2E8F0" }}>{dispatch.weather}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", color: "#64748B", textTransform: "uppercase" }}>OPTICS</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#FFB800" }}>{dispatch.optics}</span>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.65,
                      color: "#CBD5E1",
                      margin: 0,
                    }}
                  >
                    {dispatch.content[0]}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* ================= LIST VIEW (HAVEN Editorial Technical Rows) ================= */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            transition: "opacity 0.25s ease",
          }}
        >
          {filteredDispatches.map((dispatch, idx) => (
            <article
              key={dispatch.id}
              id={dispatch.id}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "180px 1fr auto",
                alignItems: "center",
                gap: "24px",
                padding: "16px 20px",
                transition: "border-color 0.2s ease, background-color 0.2s ease",
              }}
            >
              {/* Left Thumbnail */}
              <div
                style={{
                  position: "relative",
                  width: "180px",
                  height: "115px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  backgroundColor: "#000",
                  flexShrink: 0,
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
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    left: "6px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.1em",
                    padding: "3px 6px",
                    borderRadius: "3px",
                    backgroundColor: "rgba(4, 19, 41, 0.9)",
                    border: "1px solid rgba(255, 184, 0, 0.4)",
                    color: "#FFB800",
                    fontWeight: 600,
                  }}
                >
                  LOG #{String(idx + 1).padStart(2, "0")}
                </div>
              </div>

              {/* Middle: Title, Sector & Technical Specs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      color: "#FFB800",
                      textTransform: "uppercase",
                    }}
                  >
                    {dispatch.category}
                  </span>
                  <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>·</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10.5px",
                      color: "#94A3B8",
                    }}
                  >
                    {dispatch.sector}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    margin: 0,
                    color: "#FFFFFF",
                  }}
                >
                  {dispatch.title}
                </h3>

                {/* Specs inline row */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "14px",
                    marginTop: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10.5px",
                    color: "#94A3B8",
                  }}
                >
                  <span>📍 {dispatch.coordinates}</span>
                  <span>🌲 {dispatch.terrain}</span>
                  <span>🌡 {dispatch.weather}</span>
                  <span style={{ color: "#FFB800" }}>📷 {dispatch.optics.split("·")[0]}</span>
                </div>
              </div>

              {/* Right: Date & Status indicator */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10.5px",
                    color: "#64748B",
                  }}
                >
                  {dispatch.date}
                </span>

                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#E2E8F0",
                  }}
                >
                  {dispatch.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
