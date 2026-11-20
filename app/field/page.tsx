import React from "react";
import fs from "fs";
import path from "path";
import Script from "next/script";
import { GlobalNav } from "@/components/GlobalNav";
import { FieldFeed, Dispatch } from "@/components/FieldFeed";

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
            marginBottom: "40px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: "40px",
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
              fontSize: "clamp(32px, 5.2vw, 64px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "0 0 18px 0",
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
              fontSize: "clamp(15px, 1.25vw, 17.5px)",
              lineHeight: 1.6,
              color: "#94A3B8",
              maxWidth: "820px",
              margin: 0,
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
              marginTop: "32px",
              paddingTop: "22px",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                SECTOR GRID
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "#F1F5F9", fontWeight: 600 }}>
                CENTRAL DECCAN TRANSECT
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                SURVEILLANCE RADIAL
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "#F1F5F9", fontWeight: 600 }}>
                1,727 KM² CORE &amp; BUFFER
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                PATROL PROTOCOL
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "#F1F5F9", fontWeight: 600 }}>
                OPTICAL / THERMAL / PUGMARK
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                LOG ARCHIVE
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "#FFB800", fontWeight: 600 }}>
                04 ACTIVE DISPATCHES
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CONTROL BAR + DYNAMIC FEED */}
        <FieldFeed initialDispatches={dispatches} />
      </main>

      {/* Interactive Scripts */}
      <Script src="/js/sound-manager.js" strategy="afterInteractive" />
      <Script src="/js/nav-physics.js" strategy="afterInteractive" />
    </div>
  );
}
