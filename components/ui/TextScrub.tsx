"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TextScrubProps {
  text: string;
  className?: string;
}

export default function TextScrub({ text, className = "" }: TextScrubProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  return (
    <p
      ref={containerRef}
      className={`flex flex-wrap gap-x-2 gap-y-1 text-lg md:text-2xl lg:text-3xl font-light leading-relaxed ${className}`}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${word}-${i}`} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  range,
  progress,
}: {
  children: string;
  range: [number, number];
  progress: import("framer-motion").MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.25, 1]);
  const color = useTransform(
    progress,
    range,
    ["rgba(148, 163, 184, 0.4)", "rgba(254, 243, 199, 1)"]
  );

  return (
    <motion.span style={{ opacity, color }} className="transition-colors duration-150 inline-block font-normal">
      {children}
    </motion.span>
  );
}
