"use client";

import React, { useEffect, useRef } from "react";

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
        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20 sm:w-26 sm:h-26 md:w-30 md:h-30 drop-shadow-[0_14px_28px_rgba(0,0,0,0.42)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="largeLensReflect" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.16" />
              <stop offset="65%" stopColor="#10b981" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
            </radialGradient>

            <linearGradient id="largeBlackRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#323336" />
              <stop offset="45%" stopColor="#161719" />
              <stop offset="100%" stopColor="#09090a" />
            </linearGradient>

            <linearGradient id="largeBlackHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3c3d40" />
              <stop offset="40%" stopColor="#1c1d1f" />
              <stop offset="100%" stopColor="#0a0a0b" />
            </linearGradient>
          </defs>

          <circle cx="38" cy="38" r="25.5" fill="url(#largeLensReflect)" />

          <path
            d="M 21 35 A 19 19 0 0 1 37 19"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="23" cy="26" r="1.8" fill="#ffffff" opacity="0.95" />

          <circle
            cx="38"
            cy="38"
            r="27"
            stroke="#4e5054"
            strokeWidth="1"
            opacity="0.6"
          />

          <circle
            cx="38"
            cy="38"
            r="25.5"
            stroke="url(#largeBlackRimGrad)"
            strokeWidth="5"
          />

          <circle
            cx="38"
            cy="38"
            r="23"
            stroke="#ffffff"
            strokeWidth="0.8"
            opacity="0.4"
          />

          <path
            d="M 55 55 L 61 61"
            stroke="#141517"
            strokeWidth="9"
            strokeLinecap="round"
          />

          <rect
            x="58"
            y="54"
            width="11"
            height="34"
            rx="5.5"
            transform="rotate(-45 63.5 57)"
            fill="url(#largeBlackHandleGrad)"
            stroke="#09090a"
            strokeWidth="1.6"
          />

          <line
            x1="65"
            y1="70"
            x2="70"
            y2="75"
            stroke="#525458"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="75"
            x2="75"
            y2="80"
            stroke="#525458"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </span>
  );
}

