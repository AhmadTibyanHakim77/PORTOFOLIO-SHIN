"use client";
// Scene.tsx — Orchestrates: hero (HeroLayers + SandCanvas) + scroll-based opacity fade

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import HeroLayers from "./HeroLayers";

const SandCanvasLazy = dynamic(() => import("./SandCanvas"), {
  ssr: false,
  loading: () => null,
});

interface SceneProps {
  scrollRef: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
}

export default function Scene({ scrollRef, burstRef, chapterRef }: SceneProps) {
  const [webglOk, setWebglOk] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sceneOpacity, setSceneOpacity] = useState(1);
  const heroSectionRef = useRef<Element | null>(null);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
      const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsMobile(window.innerWidth < 768);
      setWebglOk(ok && !noMotion);
    } catch {
      setWebglOk(false);
    }

    // Scroll-based scene opacity: 100% in prolog, fade to 25% after
    const prologEl = document.getElementById("prolog");
    heroSectionRef.current = prologEl;

    const handleScroll = () => {
      if (!prologEl) return;
      const { bottom } = prologEl.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Fade starts at prolog bottom, complete 300px after
      const t = Math.max(0, Math.min(1, (-bottom + viewH * 0.1) / 300));
      setSceneOpacity(1 - t * 0.75); // fades to 0.25
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (webglOk === null) return null;

  // Fallback: static poster (reduced-motion or no WebGL)
  if (!webglOk) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#120d0a] to-[#08050a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_35%,rgba(255,106,43,0.2)_0%,rgba(168,50,26,0.08)_40%,transparent_65%)]" />
        <HeroLayers />
      </div>
    );
  }

  const sandCanvas = (
    <SandCanvasLazy
      scrollRef={scrollRef}
      burstRef={burstRef}
      chapterRef={chapterRef}
      isMobile={isMobile}
      opacity={1}
    />
  );

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ opacity: sceneOpacity, transition: "opacity 0.4s ease" }}
      aria-hidden="true"
    >
      <HeroLayers SandCanvasComponent={sandCanvas} />
    </div>
  );
}
