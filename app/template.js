"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// Hierarchy ranking to determine forward vs backward slide direction
const ROUTE_HIERARCHY = {
  "/": 0,
  "/docs": 1,
  "/privacy": 1,
  "/terms": 1,
  "/support": 1,
  "/opportunities": 2,
  "/passport": 3,
  "/dashboard": 4,
  "/signin": 5,
  "/signup": 6,
  "/admin": 7,
  "/profile": 8,
};

function getRouteRank(path) {
  if (!path) return 0;
  if (path in ROUTE_HIERARCHY) return ROUTE_HIERARCHY[path];
  for (const [key, rank] of Object.entries(ROUTE_HIERARCHY)) {
    if (key !== "/" && path.startsWith(key)) return rank + 0.5;
  }
  return 1;
}

/**
 * Root Template for Next.js App Router.
 * Wraps page navigation with a subtle, silky-smooth horizontal slide & fade transition.
 * Automatically detects direction (forward slides from right, backward slides from left).
 */
export default function Template({ children }) {
  const pathname = usePathname();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const prevPathnameRef = useRef(pathname);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
      const handler = (e) => setPrefersReducedMotion(e.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, []);

  useEffect(() => {
    const prevRank = getRouteRank(prevPathnameRef.current);
    const currRank = getRouteRank(pathname);
    if (currRank < prevRank) {
      setDirection(-1); // Backwards navigation: slides from left
    } else {
      setDirection(1); // Forward navigation: slides from right
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  if (prefersReducedMotion) {
    return <div className="flex-1 flex flex-col w-full">{children}</div>;
  }

  const initialX = direction === -1 ? -28 : 28;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.52,
        ease: [0.16, 1, 0.3, 1], // Slower, silky-smooth luxury deceleration curve
      }}
      className="flex-1 flex flex-col w-full overflow-x-clip"
    >
      {children}
    </motion.div>
  );
}
