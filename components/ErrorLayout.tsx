"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface ErrorLayoutProps {
  code: string;
  title: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorLayout({ code, title, message, onRetry }: ErrorLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalized mouse coordinates: -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Framer Motion spring physics
  const springConfig = { damping: 25, stiffness: 140 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Tilt based on cursor position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const numberTranslateZ = 45;

  // Ambient dynamic glow offset
  const glowX = useTransform(smoothX, [-0.5, 0.5], ["35%", "65%"]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ["30%", "60%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#041329",
        color: "#F8F8F8",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "32px 24px",
      }}
    >
      {/* Subtle Breathing Ambient Radial Glow */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.38, 0.55, 0.38],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 90vw)",
          height: "min(720px, 90vw)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 184, 0, 0.12) 0%, rgba(129, 143, 255, 0.06) 45%, rgba(4, 19, 41, 0) 72%)",
          pointerEvents: "none",
          filter: "blur(48px)",
          zIndex: 0,
        }}
      />

      {/* Subtle Dynamic Cursor-Tracking Ambient Specular */}
      <motion.div
        style={{
          position: "absolute",
          top: glowY,
          left: glowX,
          transform: "translate(-50%, -50%)",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 184, 0, 0.08) 0%, transparent 65%)",
          pointerEvents: "none",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* Top Brand Lockup Header */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 4vw, 48px)",
          zIndex: 10,
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <svg
            viewBox="0 0 32 36"
            width="22"
            height="25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 2px 8px rgba(255, 184, 0, 0.35))" }}
          >
            <path
              d="M16 19C11.5 19 8 22.8 8 27.5C8 30.5 10 33 13 33C14.5 33 15.5 32 16 32C16.5 32 17.5 33 19 33C22 33 24 30.5 24 27.5C24 22.8 20.5 19 16 19Z"
              fill="#FFB800"
            />
            <ellipse cx="6.5" cy="14" rx="3.5" ry="5.5" fill="#FFB800" />
            <ellipse cx="12.5" cy="8.5" rx="3.5" ry="5.5" fill="#FFB800" />
            <ellipse cx="19.5" cy="8.5" rx="3.5" ry="5.5" fill="#FFB800" />
            <ellipse cx="25.5" cy="14" rx="3.5" ry="5.5" fill="#FFB800" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.22em",
                color: "rgba(255, 255, 255, 0.45)",
                textTransform: "uppercase",
              }}
            >
              The
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              Omkar Den
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content with 3D Perspective */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "680px",
          width: "100%",
          textAlign: "center",
          perspective: 1200,
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Massive 3D Tilt Status Number */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            willChange: "transform",
            userSelect: "none",
            marginBottom: "-12px",
          }}
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
              fontSize: "clamp(6.5rem, 18vw, 13.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              background:
                "linear-gradient(145deg, #FFF8E7 0%, #FFB800 45%, #E5A93C 70%, #92400E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 16px 42px rgba(255, 184, 0, 0.24))",
              transform: `translateZ(${numberTranslateZ}px)`,
            }}
          >
            {code}
          </span>
        </motion.div>

        {/* Clean Luxury Title & Message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <h1
            style={{
              margin: "0 0 12px 0",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.5rem, 3.2vw, 2.25rem)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: "460px",
            }}
          >
            {message}
          </p>
        </motion.div>

        {/* Fluid Magnetic Pill Actions */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "14px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "38px",
          }}
        >
          {/* Primary Return to Home */}
          <Link
            href="/"
            style={{ textDecoration: "none" }}
          >
            <motion.button
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 184, 0, 0.12)",
                color: "#FFB800",
                border: "1px solid rgba(255, 184, 0, 0.38)",
                boxShadow: "0 8px 24px rgba(255, 184, 0, 0.14)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                transition: "border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
              }}
            >
              <span>←</span>
              <span>Return to Home</span>
            </motion.button>
          </Link>

          {/* Secondary Explore Tigers */}
          <Link
            href="/tiger"
            style={{ textDecoration: "none" }}
          >
            <motion.button
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 26px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.25)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                transition: "border-color 0.2s, background-color 0.2s",
              }}
            >
              <span>Explore Tigers</span>
              <span>→</span>
            </motion.button>
          </Link>

          {/* Optional Retry Action */}
          {onRetry && (
            <motion.button
              onClick={onRetry}
              whileHover={{ scale: 1.035, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 20 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                color: "rgba(255, 255, 255, 0.72)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <span>Try Again</span>
              <span>↻</span>
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Minimal Footer Signature */}
      <footer
        style={{
          position: "absolute",
          bottom: "24px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "rgba(255, 255, 255, 0.28)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        The Omkar Den // Core Telemetry
      </footer>
    </div>
  );
}

export default ErrorLayout;
