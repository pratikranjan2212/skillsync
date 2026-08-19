"use client";

import React, { useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@/app/components/icons";

export default function MagnifyingEvidence({ text = "evidence", className = "" }) {
  const containerRef = useRef(null);
  const letterRefs = useRef([]);
  const glassRef = useRef(null);

  const letters = text.split("");

  useEffect(() => {
    let animationFrameId;
    let isMounted = true;

    const getLetterCenters = () => {
      if (!containerRef.current) return [];
      const containerRect = containerRef.current.getBoundingClientRect();
      return letterRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - containerRect.left + rect.width / 2;
      });
    };

    const getContainerHeight = () => {
      if (!containerRef.current) return 40;
      return containerRef.current.getBoundingClientRect().height;
    };

    let letterCenters = getLetterCenters();
    let containerHeight = getContainerHeight();

    const handleResize = () => {
      letterCenters = getLetterCenters();
      containerHeight = getContainerHeight();
    };

    window.addEventListener("resize", handleResize);

    const T_TOTAL = 5200;
    const T_ENTER_END = 450;
    const T_SWEEP_END = 3300;
    const T_FOCUS_END = 3700;
    const T_EXIT_END = 4250;

    const MAGNIFY_RADIUS = 36;
    const LENS_CENTER_PCT = 38;

    let startTime = null;

    const tick = (now) => {
      if (!isMounted) return;

      if (!startTime) startTime = now;
      const elapsed = (now - startTime) % T_TOTAL;

      if (letterCenters.length === 0 || letterCenters[0] === 0) {
        letterCenters = getLetterCenters();
        containerHeight = getContainerHeight();
      }

      const startX = letterCenters[0] || 12;
      const endX = letterCenters[letterCenters.length - 1] || 160;
      const centerY = containerHeight / 2;

      let currentX = startX;
      let opacity = 0;
      let scale = 0.75;
      let offsetY = 0;

      if (elapsed < T_ENTER_END) {
        const p = elapsed / T_ENTER_END;
        const easeP = Math.min(Math.max(1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2), 0), 1);
        currentX = startX;
        opacity = p;
        scale = 0.75 + 0.25 * easeP;
        offsetY = (1 - p) * -10;
      } else if (elapsed < T_SWEEP_END) {
        const p = (elapsed - T_ENTER_END) / (T_SWEEP_END - T_ENTER_END);
        const easeP = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        currentX = startX + (endX - startX) * easeP;
        opacity = 1;
        scale = 1;
        offsetY = 0;
      } else if (elapsed < T_FOCUS_END) {
        currentX = endX;
        opacity = 1;
        scale = 1;
        offsetY = 0;
      } else if (elapsed < T_EXIT_END) {
        const p = (elapsed - T_FOCUS_END) / (T_EXIT_END - T_FOCUS_END);
        const easeP = p * p;
        currentX = endX;
        opacity = Math.max(0, 1 - p);
        scale = 1 - 0.18 * easeP;
        offsetY = -14 * easeP;
      } else {
        opacity = 0;
        scale = 0.75;
        currentX = startX;
        offsetY = 0;
      }

      if (glassRef.current) {
        glassRef.current.style.left = `${currentX}px`;
        glassRef.current.style.top = `${centerY}px`;
        glassRef.current.style.opacity = opacity;
        glassRef.current.style.transform = `translate(-${LENS_CENTER_PCT}%, -${LENS_CENTER_PCT}%) translateY(${offsetY}px) scale(${scale})`;
      }

      letterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const charCenter = letterCenters[idx] || 0;
        const isVisible = opacity > 0.05;
        const dist = Math.abs(currentX - charCenter);

        let factor = 0;
        if (isVisible && dist < MAGNIFY_RADIUS) {
          factor = Math.pow(Math.max(0, 1 - dist / MAGNIFY_RADIUS), 1.3) * opacity;
        }

        const letterScale = 1 + factor * 0.45;
        const letterY = -factor * 4;

        el.style.transform = `translate3d(0, ${letterY}px, 0) scale(${letterScale})`;
        el.style.fontWeight = factor > 0.35 ? "900" : "800";
        el.style.color = factor > 0.4 ? "#000000" : "#111111";
        el.style.textShadow =
          factor > 0.2
            ? `0 4px 16px rgba(16, 185, 129, ${factor * 0.45})`
            : "none";
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={`relative inline-block align-baseline select-none cursor-default ${className}`}
      style={{ isolation: "isolate" }}
    >
      <span className="inline-flex items-baseline relative z-10">
        {letters.map((char, idx) => (
          <span
            key={idx}
            ref={(el) => (letterRefs.current[idx] = el)}
            className="inline-block transition-transform duration-75 ease-out"
            style={{
              transformOrigin: "center 70%",
              willChange: "transform",
            }}
          >
            {char}
          </span>
        ))}
      </span>

      <div
        ref={glassRef}
        className="absolute pointer-events-none z-20"
        style={{
          left: "0px",
          top: "0px",
          opacity: 0,
          transform: "translate(-38%, -38%) scale(0.75)",
          transformOrigin: "38% 38%",
          willChange: "transform, opacity, left, top",
        }}
      >
        <MagnifyingGlassIcon />
      </div>
    </span>
  );
}

