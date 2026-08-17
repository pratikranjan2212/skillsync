import React from "react";

export default function PassportWaves({
  className = "absolute bottom-0 left-0 w-[55%] h-[40%] opacity-35 pointer-events-none",
  ...props
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 500 200"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M0,180 C150,120 280,200 450,130 C490,110 520,70 600,60"
        stroke="#34D399"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path
        d="M0,160 C140,100 270,180 430,110 C480,90 510,50 600,40"
        stroke="#34D399"
        strokeWidth="1"
      />
      <path
        d="M0,140 C130,80 260,160 410,90 C460,70 500,30 600,20"
        stroke="#34D399"
        strokeWidth="0.75"
      />
    </svg>
  );
}
