"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({
  children,
  className = "",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [sheenPosition, setSheenPosition] = useState({ x: -100, y: -100, opacity: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setSheenPosition({ x, y, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setTransform("perspective(1000px) translateY(-4px) scale3d(1.02, 1.02, 1.02)");
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={{
        transform,
        transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.25s ease",
        transformStyle: "preserve-3d",
      }}
      className={`glass group relative overflow-hidden transition-all duration-300 ${
        isFocused ? "ring-2 ring-chakra shadow-[0_0_30px_rgba(255,106,43,0.35)]" : ""
      } ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Sheen Highlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: sheenPosition.opacity,
          background: `radial-gradient(400px circle at ${sheenPosition.x}px ${sheenPosition.y}px, rgba(255, 106, 43, 0.16), rgba(217, 183, 120, 0.08) 40%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Subtle Inner Highlight */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-dune/20 opacity-80 group-hover:border-chakra/60 transition-colors duration-300"
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

