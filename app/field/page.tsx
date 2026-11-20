import React from "react";
import fs from "fs";
import path from "path";
import Script from "next/script";
import { GlobalNav } from "@/components/GlobalNav";

interface Dispatch {
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

export const metadata = {
  title: "FIELD DISPATCHES // TACTICAL EXPEDITION CHRONICLES — THE OMKAR DEN",
  description:
    "Tactical field intelligence, GPS patrol logs, and apex predator telemetry from Central Indian forest corridors.",
};

export default function FieldPage() {
  const dataPath = path.join(process.cwd(), "data", "field_dispatches.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const dispatches: Dispatch[] = JSON.parse(rawData);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#041329",
        color: "#F8F8F8",
        fontFamily: "'Inter', -apple-system, sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <link rel="stylesheet" href="/omkar-header.css" />
      {/* Global Navbar */}
      <GlobalNav active="field" />

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "130px 24px 100px",
        }}
      >
        {/* TACTICAL HEADER (108.supply & field.io inspired) */}
        <section
          style={{
            marginBottom: "56px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "48px",
          }}
        >
          {/* Top Row: Category Badge + 108.supply Monospace Status Pill */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "#FFB800",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#FFB800",
                  boxShadow: "0 0 10px #FFB800",
                }}
              />
              FIELD DISPATCHES // CLASSIFIED CHRONICLES
            </div>

            {/* 108.supply-style Status Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 184, 0, 0.25)",
                backdropFilter: "blur(12px)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: "#E2E8F0",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#10B981",
                  boxShadow: "0 0 8px #10B981",
                }}
              />
              <span>OUTPOST ACTIVE: TADOBA CORE · 20.246° N, 79.312° E · ELEVATION 208M</span>
            </div>
          </div>

          {/* Bold Commanding Headline (rejouice.com inspired) */}
          <h1
            style={{
              fontSize: "clamp(34px, 5.5vw, 68px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 20px 0",
              color: "#FFFFFF",
              textTransform: "uppercase",
              maxWidth: "1100px",
            }}
          >
            Tactical Expedition Chronicles &amp; Apex Telemetry
          </h1>

          {/* Pure, Grounded Mission Statement */}
          <p
            style={{
              fontSize: "clamp(15px, 1.3vw, 18px)",
              lineHeight: 1.6,
              color: "#94A3B8",
              maxWidth: "820px",
              margin: 0,
              fontStyle: "normal",
            }}
          >
            Tactical field intelligence, GPS patrol logs, and apex predator telemetry from Central Indian forest corridors.
          </p>

          {/* Metrics Ribbon (field.io inspired density) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "36px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                SECTOR GRID
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#F1F5F9", fontWeight: 600 }}>
                CENTRAL DECCAN TRANSECT
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                SURVEILLANCE RADIAL
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#F1F5F9", fontWeight: 600 }}>
                1,727 KM² CORE &amp; BUFFER
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                PATROL PROTOCOL
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#F1F5F9", fontWeight: 600 }}>
                OPTICAL / THERMAL / PUGMARK
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                LOG ARCHIVE
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#FFB800", fontWeight: 600 }}>
                04 ACTIVE DISPATCHES
              </div>
            </div>
          </div>
        </section>

        {/* DISPATCHES FEED (HAVEN-style Spec Sheets & Editorial Physics) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {dispatches.map((dispatch, index) => (
            <article
              key={dispatch.id}
              id={dispatch.id}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "border-color 0.3s ease, transform 0.3s ease",
              }}
            >
              {/* Dispatch Grid Layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "0",
                }}
              >
                {/* Visual Frame */}
                <div
                  style={{
                    position: "relative",
                    minHeight: "380px",
                    backgroundColor: "#000",
                    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
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
                  {/* Floating Badges */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
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
                        padding: "5px 10px",
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
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        color: "#94A3B8",
                      }}
                    >
                      LOG #{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
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

                {/* Editorial Body & Spec Sheet */}
                <div
                  style={{
                    padding: "36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(4, 19, 41, 0.4)",
                  }}
                >
                  <div>
                    {/* Sector Breadcrumb */}
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "11px",
                        letterSpacing: "0.12em",
                        color: "#FFB800",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                      }}
                    >
                      {dispatch.sector}
                    </div>

                    {/* Headline */}
                    <h2
                      style={{
                        fontSize: "clamp(22px, 2.2vw, 30px)",
                        fontWeight: 800,
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        margin: "0 0 12px 0",
                        color: "#FFFFFF",
                      }}
                    >
                      {dispatch.title}
                    </h2>

                    {/* Subtitle */}
                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.5,
                        color: "#94A3B8",
                        margin: "0 0 24px 0",
                        fontStyle: "italic",
                      }}
                    >
                      {dispatch.subtitle}
                    </p>

                    {/* HAVEN-style Technical Spec Sheet */}
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "8px" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", textTransform: "uppercase" }}>COORDINATES</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#E2E8F0", fontWeight: 500 }}>{dispatch.coordinates}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "8px" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", textTransform: "uppercase" }}>TERRAIN</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#E2E8F0", fontWeight: 500 }}>{dispatch.terrain}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", paddingBottom: "8px" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", textTransform: "uppercase" }}>WEATHER</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#E2E8F0", fontWeight: 500 }}>{dispatch.weather}</span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "6px" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", textTransform: "uppercase" }}>OPTICS SPEC</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#FFB800", fontWeight: 500 }}>{dispatch.optics}</span>
                      </div>
                    </div>

                    {/* Grounded Field Notes Content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {dispatch.content.map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          style={{
                            fontSize: "13.5px",
                            lineHeight: 1.65,
                            color: "#CBD5E1",
                            margin: 0,
                          }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Interactive Scripts */}
      <Script src="/js/sound-manager.js" strategy="afterInteractive" />
      <Script src="/js/nav-physics.js" strategy="afterInteractive" />
    </div>
  );
}
