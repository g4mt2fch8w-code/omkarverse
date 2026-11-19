"use client";

/**
 * PageTransition — framer-motion route-level fade+slide wrapper.
 * Wraps every page in layout.tsx so transitions are global.
 */

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
