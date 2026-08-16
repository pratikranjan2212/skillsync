"use client";

import React, { useEffect, useRef, useCallback } from "react";

export default function ClickSpark({
  children,
  sparkColor = "#ffffff",
  sparkSize = 13,
  sparkRadius = 28,
  sparkCount = 4,
  angleSpread = (110 * Math.PI) / 180,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.2,
  className = "",
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);
  const rafRef = useRef(null);

  const easeFunc = useCallback(
    (t) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        case "ease-out":
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = (timestamp) => {
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        const sparkDuration = spark.duration || duration;
        if (elapsed >= sparkDuration) return false;

        const progress = elapsed / sparkDuration;
        const eased = easeFunc(progress);

        const lineLength = sparkSize * (1 - eased);
        const distance = eased * sparkRadius * extraScale;

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = spark.color;
        ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, easeFunc, sparkSize, sparkRadius, extraScale]);

  const parseColorToRgb = (colorStr) => {
    if (!colorStr) return null;

    const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
    if (rgbMatch) {
      const alpha = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10),
        alpha,
      };
    }

    const hexMatch = colorStr.match(/#([0-9a-f]{3,8})/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split("").map((c) => c + c).join("");
      }
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const alpha = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
      return { r, g, b, alpha };
    }

    return null;
  };

  const getLuminance = (r, g, b) => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const resolveColor = (target, clientX, clientY) => {
    const explicitEl = target.closest?.("[data-spark-color]");
    if (explicitEl?.dataset?.sparkColor) {
      return explicitEl.dataset.sparkColor;
    }

    let candidates = [];
    if (typeof document !== "undefined" && document.elementsFromPoint && clientX !== undefined && clientY !== undefined) {
      candidates = Array.from(document.elementsFromPoint(clientX, clientY) || []);
    }

    let curr = target;
    while (curr && curr !== document.documentElement) {
      if (!candidates.includes(curr)) {
        candidates.push(curr);
      }
      if (curr.children && curr.children.length > 0) {
        for (const child of Array.from(curr.children)) {
          if (!candidates.includes(child)) {
            candidates.push(child);
          }
        }
      }
      curr = curr.parentElement;
    }

    const solidWhiteRegex = /(?:^|\s)(?:[a-z0-9_-]+:)*bg-white(?:$|\s)/;
    const darkBgRegex = /(?:^|\s)(?:[a-z0-9_-]+:)*(?:bg-neutral-900|bg-neutral-950|bg-slate-900|bg-slate-950|bg-[#0d1f18]|bg-[#091510]|bg-[#0f241c]|bg-[#111111]|bg-[#1C1C1C]|from-slate-900|from-slate-950|from-neutral-900|from-neutral-950|from-black|from-[#0d1f18]|bg-black)(?:$|\s)/;

    for (const el of candidates) {
      if (!el || el === document.documentElement || el === document.body) continue;

      if (el.dataset?.sparkColor) {
        return el.dataset.sparkColor;
      }

      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      const bgImage = style.backgroundImage;
      const className = typeof el.className === "string" ? el.className : "";

      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const rgb = parseColorToRgb(bg);
        if (rgb && rgb.alpha > 0.4) {
          const lum = getLuminance(rgb.r, rgb.g, rgb.b);
          return lum < 135 ? "#ffffff" : "#111111";
        }
      }

      if (className) {
        if (solidWhiteRegex.test(className) || className.includes("bg-[#F5F5F3]") || className.includes("bg-[#F2F3F5]") || className.includes("bg-[#F8F9FA]")) {
          return "#111111";
        }
        if (darkBgRegex.test(className)) {
          return "#ffffff";
        }
      }

      if (bgImage && bgImage !== "none") {
        const matches = bgImage.match(/(?:rgb|rgba|#)[^\s,)]+/g);
        if (matches && matches.length > 0) {
          let totalLum = 0;
          let count = 0;
          for (const m of matches) {
            const rgb = parseColorToRgb(m);
            if (rgb) {
              totalLum += getLuminance(rgb.r, rgb.g, rgb.b);
              count++;
            }
          }
          if (count > 0) {
            const avgLum = totalLum / count;
            return avgLum < 135 ? "#ffffff" : "#111111";
          }
        }
      }
    }

    if (target) {
      const fg = window.getComputedStyle(target).color;
      if (fg) {
        const rgb = parseColorToRgb(fg);
        if (rgb && rgb.alpha > 0.5) {
          const lum = getLuminance(rgb.r, rgb.g, rgb.b);
          return lum > 150 ? "#ffffff" : "#111111";
        }
      }
    }

    return "#ffffff";
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = resolveColor(e.target, e.clientX, e.clientY);
    const now = performance.now();

    const durationAttr = e.target.closest?.("[data-spark-duration]")?.dataset?.sparkDuration;
    const sparkDuration = durationAttr ? parseInt(durationAttr, 10) : duration;

    const centerAngle = -Math.PI / 2;
    const newSparks = Array.from({ length: sparkCount }, (_, i) => {
      const t = sparkCount > 1 ? i / (sparkCount - 1) : 0.5;
      const angle = centerAngle - angleSpread / 2 + angleSpread * t;
      return { x, y, angle, startTime: now, color, duration: sparkDuration };
    });

    sparksRef.current.push(...newSparks);
  };

  return (
    <div ref={containerRef} onClick={handleClick} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-50" />
      {children}
    </div>
  );
}

