"use client";
// CinematicOverlays.tsx
// Impact frame, speed lines, custom cursor with sand trail, floating sigils
// All effects respect prefers-reduced-motion automatically via CSS

import React, { useEffect, useRef, useCallback } from "react";

// ── Custom Cursor + Sand Trail ──────────────────────────────────
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const lagRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);
  const hovering = useRef(false);

  // Trail particles
  const particles = useRef<{ x: number; y: number; alpha: number; size: number }[]>([]);

  const tick = useCallback(() => {
    // Ring lags behind
    lagRef.current.x += (posRef.current.x - lagRef.current.x) * 0.14;
    lagRef.current.y += (posRef.current.y - lagRef.current.y) * 0.14;

    if (dotRef.current) {
      dotRef.current.style.left = posRef.current.x + "px";
      dotRef.current.style.top = posRef.current.y + "px";
    }
    if (ringRef.current) {
      ringRef.current.style.left = lagRef.current.x + "px";
      ringRef.current.style.top = lagRef.current.y + "px";
    }

    // Sand trail canvas
    const canvas = trailRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Add new particle at cursor
        if (Math.random() < 0.5) {
          particles.current.push({
            x: posRef.current.x + (Math.random() - 0.5) * 6,
            y: posRef.current.y + (Math.random() - 0.5) * 6,
            alpha: 0.6,
            size: 1.2 + Math.random() * 1.8,
          });
        }
        // Draw + decay
        particles.current = particles.current.filter((p) => p.alpha > 0.02);
        for (const p of particles.current) {
          p.alpha *= 0.88;
          p.y -= 0.4;
          p.x += (Math.random() - 0.5) * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(217,183,120,${p.alpha.toFixed(2)})`;
          ctx.fill();
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    // Only on pointer:fine devices
    if (!window.matchMedia("(pointer:fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onEnter = () => {
      hovering.current = true;
      dotRef.current?.classList.add("hovering");
      ringRef.current?.classList.add("hovering");
    };
    const onLeave = () => {
      hovering.current = false;
      dotRef.current?.classList.remove("hovering");
      ringRef.current?.classList.remove("hovering");
    };

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a,button,[role=button],[role=tab]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    // Size trail canvas
    const canvas = trailRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const resizeObs = new ResizeObserver(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
      resizeObs.observe(document.body);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
    };
  }, [tick]);

  return (
    <>
      <canvas ref={trailRef} className="sand-trail-canvas" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}

// ── Impact Frame ──────────────────────────────────────────────
export function ImpactFrame({ triggerRef }: { triggerRef: React.MutableRefObject<boolean> }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const lastFlash = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;

    let raf: number;
    const check = () => {
      if (triggerRef.current) {
        const now = Date.now();
        if (now - lastFlash.current > 1000) { // max 1 flash/sec
          lastFlash.current = now;
          triggerRef.current = false;
          frameRef.current?.classList.add("flash");
          setTimeout(() => frameRef.current?.classList.remove("flash"), 90);
        } else {
          triggerRef.current = false;
        }
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [triggerRef]);

  return <div ref={frameRef} className="impact-frame" aria-hidden="true" />;
}

// ── Speed Lines ───────────────────────────────────────────────
export function SpeedLines({ activeRef }: { activeRef: React.MutableRefObject<boolean> }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    let raf: number;
    const check = () => {
      if (ref.current) {
        ref.current.classList.toggle("active", activeRef.current);
      }
      raf = requestAnimationFrame(check);
    };
    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [activeRef]);

  return <div ref={ref} className="speed-lines" aria-hidden="true" />;
}

// ── Floating Sigils ───────────────────────────────────────────
export function FloatingSigils() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      <svg className="sigil-cw absolute left-[7%] top-[18%] h-20 w-20 opacity-[0.038]" viewBox="0 0 100 100">
        <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="none" stroke="#d9b778" strokeWidth="1.5" />
        <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="#ff6a2b" strokeWidth="1" />
        <circle cx="50" cy="50" r="7" fill="none" stroke="#d9b778" strokeWidth="1" />
      </svg>
      <svg className="sigil-ccw absolute right-[5%] top-[30%] h-16 w-16 opacity-[0.035]" viewBox="0 0 100 100">
        <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="#ff6a2b" strokeWidth="1.5" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="#d9b778" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="#d9b778" strokeWidth="1" />
      </svg>
      <svg className="sigil-cw absolute left-[11%] bottom-[22%] h-14 w-14 opacity-[0.03]" viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#d9b778" strokeWidth="1.5" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="14" fill="none" stroke="#ff6a2b" strokeWidth="1" />
      </svg>
      <svg className="sigil-ccw absolute right-[12%] bottom-[12%] h-24 w-24 opacity-[0.03]" viewBox="0 0 100 100">
        <polygon points="50,5 100,50 50,95 0,50" fill="none" stroke="#ff6a2b" strokeWidth="1.5" />
        <polygon points="50,20 85,50 50,80 15,50" fill="none" stroke="#d9b778" strokeWidth="1" />
        <circle cx="50" cy="50" r="6" fill="#ff6a2b" opacity="0.5" />
      </svg>
    </div>
  );
}

// ── Atmospheric Layers ────────────────────────────────────────
export function Atmosphere() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="heat-top" aria-hidden="true" />
      <div className="heat-bot" aria-hidden="true" />
    </>
  );
}

