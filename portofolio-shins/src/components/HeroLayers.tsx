"use client";
// HeroLayers.tsx
// 2.5D parallax composition: desert bg → beast → sand (behind) → hero → fg dunes → text scrim
// When /public/art/*.webp assets exist, they swap in automatically.
// Fallback: original detailed SVG illustrations.

import React, { useRef, useEffect, useState, useCallback } from "react";

// ─── Asset detection hook ─────────────────────────────────────────────────
function useArtAsset(path: string): boolean {
  const [exists, setExists] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
    img.src = path;
  }, [path]);
  return exists;
}

// ─── Original SVG: Desert Night Background ───────────────────────────────
function BgDunesSVG() {
  return (
    <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a1208" />
          <stop offset="45%" stopColor="#120d0a" />
          <stop offset="100%" stopColor="#08050a" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="75%" cy="20%" r="20%">
          <stop offset="0%" stopColor="#ff9050" stopOpacity="0.18" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="dune1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1a0c" />
          <stop offset="100%" stopColor="#120d0a" />
        </linearGradient>
        <linearGradient id="dune2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c1008" />
          <stop offset="100%" stopColor="#120d0a" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width="1440" height="900" fill="url(#skyGrad)" />
      <rect width="1440" height="900" fill="url(#moonGlow)" />

      {/* Stars */}
      {[...Array(80)].map((_, i) => (
        <circle
          key={i}
          cx={Math.sin(i * 137.508) * 720 + 720}
          cy={Math.cos(i * 137.508) * 200 + 200}
          r={i % 7 === 0 ? 1.4 : 0.7}
          fill="#f1e3c4"
          opacity={0.3 + (i % 5) * 0.14}
        />
      ))}

      {/* Far dune horizon */}
      <path d="M0,620 Q200,540 420,580 Q650,620 850,555 Q1050,490 1200,560 Q1340,610 1440,570 L1440,900 L0,900Z"
        fill="url(#dune1)" />
      {/* Mid dune */}
      <path d="M0,700 Q180,640 400,670 Q640,700 820,640 Q1000,580 1200,650 Q1360,700 1440,660 L1440,900 L0,900Z"
        fill="url(#dune2)" />

      {/* Ember moon glow */}
      <circle cx="1080" cy="140" r="40" fill="none" stroke="#ff6a2b" strokeWidth="1" opacity="0.15" />
      <circle cx="1080" cy="140" r="25" fill="#ffb06a" opacity="0.12" />

      {/* Atmospheric haze bands */}
      <rect x="0" y="500" width="1440" height="80" fill="#ff6a2b" opacity="0.025" />
      <rect x="0" y="560" width="1440" height="60" fill="#a8321a" opacity="0.04" />
    </svg>
  );
}

// ─── Original SVG: Spirit Beast ──────────────────────────────────────────
function BeastSVG() {
  return (
    <svg viewBox="0 0 700 580" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
      <defs>
        <radialGradient id="beastBody" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.65" />
          <stop offset="40%" stopColor="#a8321a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3a0a08" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="beastHead" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff8040" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#a8321a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe080" />
          <stop offset="60%" stopColor="#ff9020" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="beastBlur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d9b778" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Outer aura halo */}
      <ellipse cx="350" cy="300" rx="300" ry="250" fill="url(#beastBody)" filter="url(#beastBlur)" />

      {/* Seven flowing tails — bezier ribbons */}
      {[
        "M 350 400 Q 480 380 580 320 Q 650 270 680 180",
        "M 350 400 Q 500 350 600 260 Q 660 200 650 100",
        "M 350 400 Q 460 420 560 380 Q 650 340 700 290",
        "M 350 400 Q 240 380 140 310 Q 60 250 20 160",
        "M 350 400 Q 230 350 120 250 Q 50 180 30 80",
        "M 350 400 Q 250 440 150 410 Q 60 370 10 310",
        "M 350 400 Q 350 460 320 520 Q 290 570 240 580",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="url(#tailGrad)"
          strokeWidth={8 - i * 0.6}
          strokeLinecap="round"
          opacity={0.65 - i * 0.05}
        />
      ))}
      {/* Tail glow overlay (thinner, brighter) */}
      {[
        "M 350 400 Q 480 380 580 320 Q 650 270 680 180",
        "M 350 400 Q 500 350 600 260 Q 660 200 650 100",
        "M 350 400 Q 460 420 560 380 Q 650 340 700 290",
        "M 350 400 Q 240 380 140 310 Q 60 250 20 160",
        "M 350 400 Q 230 350 120 250 Q 50 180 30 80",
        "M 350 400 Q 250 440 150 410 Q 60 370 10 310",
        "M 350 400 Q 350 460 320 520 Q 290 570 240 580",
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="#ffe4a0"
          strokeWidth={2 - i * 0.1}
          strokeLinecap="round"
          opacity={0.3 - i * 0.02}
        />
      ))}

      {/* Body mass */}
      <ellipse cx="350" cy="300" rx="175" ry="145" fill="url(#beastBody)" />

      {/* Neck */}
      <path d="M 290 200 Q 350 165 410 200 Q 390 250 350 255 Q 310 250 290 200Z"
        fill="#a8321a" opacity="0.7" />

      {/* Head — wolf-stag skull shape */}
      <path d="M 280 155 Q 290 110 350 95 Q 410 110 420 155 Q 430 190 410 200 Q 350 215 290 200 Q 268 190 280 155Z"
        fill="#3a1a0a" opacity="0.9" />
      {/* Head highlight */}
      <path d="M 310 125 Q 350 110 390 125 Q 395 150 380 160 Q 350 168 320 160 Q 305 150 310 125Z"
        fill="#ff6a2b" opacity="0.25" />

      {/* Horns — stag style, wide branch */}
      {/* Left horn */}
      <path d="M 302 135 Q 265 95 240 60 Q 230 40 215 25"
        fill="none" stroke="#c8a060" strokeWidth="5" strokeLinecap="round" />
      <path d="M 265 95 Q 240 85 220 70"
        fill="none" stroke="#c8a060" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 248 112 Q 225 108 208 100"
        fill="none" stroke="#c8a060" strokeWidth="3" strokeLinecap="round" />
      {/* Right horn */}
      <path d="M 398 135 Q 435 95 460 60 Q 470 40 485 25"
        fill="none" stroke="#c8a060" strokeWidth="5" strokeLinecap="round" />
      <path d="M 435 95 Q 460 85 480 70"
        fill="none" stroke="#c8a060" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 452 112 Q 475 108 492 100"
        fill="none" stroke="#c8a060" strokeWidth="3" strokeLinecap="round" />

      {/* Glowing eyes */}
      <ellipse cx="318" cy="160" rx="14" ry="11" fill="url(#eyeGlow)" />
      <ellipse cx="382" cy="160" rx="14" ry="11" fill="url(#eyeGlow)" />
      <ellipse cx="318" cy="160" rx="7" ry="5.5" fill="#fff8e0" />
      <ellipse cx="382" cy="160" rx="7" ry="5.5" fill="#fff8e0" />
      {/* Pupils — vertical slit */}
      <ellipse cx="318" cy="160" rx="2.5" ry="5" fill="#120d0a" />
      <ellipse cx="382" cy="160" rx="2.5" ry="5" fill="#120d0a" />

      {/* Flame wisps rising from body */}
      {[300, 330, 360, 390, 420].map((x, i) => (
        <path
          key={i}
          d={`M ${x} 200 Q ${x + 10 - i * 4} 170 ${x - 5 + i * 3} 145`}
          fill="none"
          stroke="#ff9040"
          strokeWidth="2"
          opacity={0.3 + i * 0.08}
          strokeLinecap="round"
        />
      ))}

      {/* Sand particle aura dots around beast */}
      {[...Array(24)].map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 170 + Math.sin(i * 2.5) * 35;
        return (
          <circle
            key={i}
            cx={350 + Math.cos(angle) * r}
            cy={290 + Math.sin(angle) * r * 0.6}
            r={1.5 + (i % 3) * 0.8}
            fill="#d9b778"
            opacity={0.3 + (i % 4) * 0.1}
          />
        );
      })}
    </svg>
  );
}

// ─── Original SVG: Desert Guardian Hero ──────────────────────────────────
function HeroSVG() {
  return (
    <svg viewBox="0 0 360 580" preserveAspectRatio="xMidYMax meet" className="h-full w-full">
      <defs>
        <radialGradient id="heroAura" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="skinGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#e8b880" />
          <stop offset="60%" stopColor="#c8814a" />
          <stop offset="100%" stopColor="#8a4a1a" />
        </radialGradient>
        <radialGradient id="eyeAmber" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe090" />
          <stop offset="50%" stopColor="#ff9020" />
          <stop offset="100%" stopColor="#a85010" />
        </radialGradient>
        <linearGradient id="cloakGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#d4b870" />
          <stop offset="40%" stopColor="#b89840" />
          <stop offset="100%" stopColor="#6a5420" />
        </linearGradient>
        <linearGradient id="cloakShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8a6820" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3a2a0a" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="innerRobe" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#f0dca8" />
          <stop offset="50%" stopColor="#d4b870" />
          <stop offset="100%" stopColor="#8a7030" />
        </linearGradient>
        <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8090b8" />
          <stop offset="50%" stopColor="#5868a0" />
          <stop offset="100%" stopColor="#38487a" />
        </linearGradient>
        <radialGradient id="handGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9050" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#ff6a2b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="heroGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Character aura */}
      <ellipse cx="180" cy="380" rx="140" ry="200" fill="url(#heroAura)" />

      {/* Sand ribbons swirling around — 3 spiral arms */}
      {/* Left arm ribbon */}
      <path d="M 80 200 Q 60 240 80 290 Q 100 340 70 380 Q 50 410 90 430"
        fill="none" stroke="#d9b778" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M 60 215 Q 45 250 65 295 Q 82 335 55 375"
        fill="none" stroke="#b9915a" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Right arm ribbon */}
      <path d="M 280 200 Q 300 240 280 290 Q 260 340 290 380 Q 310 410 270 430"
        fill="none" stroke="#d9b778" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M 300 215 Q 315 250 295 295 Q 278 335 305 375"
        fill="none" stroke="#b9915a" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      {/* Orbital sand arc */}
      <path d="M 90 170 Q 180 120 270 170 Q 310 190 290 230 Q 270 270 180 265 Q 90 270 70 230 Q 50 190 90 170Z"
        fill="none" stroke="#d9b778" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.35" />
      {/* Sand dots orbiting */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 - 0.3;
        const rx = 120, ry = 55;
        return (
          <circle
            key={i}
            cx={180 + Math.cos(angle) * rx}
            cy={195 + Math.sin(angle) * ry}
            r={1.5 + (i % 3)}
            fill="#d9b778"
            opacity={0.5 + (i % 2) * 0.2}
          />
        );
      })}

      {/* ── CLOAK (main outer layer) ── */}
      {/* Outer cloak silhouette — wide dramatic shape */}
      <path d="M 108 190 Q 85 230 80 310 Q 75 390 95 450 Q 110 490 180 510 Q 250 490 265 450 Q 285 390 280 310 Q 275 230 252 190 Z"
        fill="url(#cloakGrad)" />
      {/* Cloak shadow / cel-shade fold */}
      <path d="M 180 192 Q 160 230 150 310 Q 145 390 155 450 Q 165 490 180 500"
        fill="none" stroke="#6a4810" strokeWidth="1" opacity="0.4" />
      <path d="M 108 190 Q 125 220 140 310 Q 148 390 148 450"
        fill="url(#cloakShadow)" opacity="0.5" />
      {/* Cloak inner fold detail */}
      <path d="M 150 200 Q 145 260 142 330 Q 140 390 148 440"
        fill="none" stroke="#c8a040" strokeWidth="1.2" opacity="0.5" />
      <path d="M 210 200 Q 215 260 218 330 Q 220 390 212 440"
        fill="none" stroke="#c8a040" strokeWidth="1.2" opacity="0.5" />
      {/* Cloak bottom fringe */}
      {[95, 115, 135, 160, 180, 200, 225, 245, 265].map((x, i) => (
        <path key={i} d={`M ${x} ${498 + (i % 2) * 6} Q ${x + 3} ${514 + (i % 2) * 4} ${x + 2} ${520 + (i % 2) * 6}`}
          fill="none" stroke="#c8a040" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      ))}

      {/* Inner robe (visible at chest opening) */}
      <path d="M 148 196 Q 155 210 160 250 Q 170 310 175 360 L 185 360 Q 190 310 200 250 Q 205 210 212 196 Q 196 188 180 188 Q 164 188 148 196Z"
        fill="url(#innerRobe)" />

      {/* Belt / waist band */}
      <rect x="145" y="285" width="70" height="12" rx="3" fill="#8a6820" opacity="0.8" />
      <rect x="171" y="282" width="18" height="18" rx="2" fill="#c8a040" opacity="0.9" />
      {/* Belt buckle — abstract geometric */}
      <circle cx="180" cy="291" r="5" fill="none" stroke="#ff9040" strokeWidth="1.5" />
      <line x1="177" y1="291" x2="183" y2="291" stroke="#ff9040" strokeWidth="1" />
      <line x1="180" y1="288" x2="180" y2="294" stroke="#ff9040" strokeWidth="1" />

      {/* ── BODY / ARMS ── */}
      {/* Left arm raised — in line art style */}
      {/* Upper arm */}
      <path d="M 112 196 Q 85 185 68 162 Q 55 145 58 128"
        fill="none" stroke="#1e1008" strokeWidth="14" strokeLinecap="round" />
      <path d="M 112 196 Q 85 185 68 162 Q 55 145 58 128"
        fill="none" stroke="#c8814a" strokeWidth="10" strokeLinecap="round" />
      {/* Forearm */}
      <path d="M 58 128 Q 50 110 48 90"
        fill="none" stroke="#1e1008" strokeWidth="12" strokeLinecap="round" />
      <path d="M 58 128 Q 50 110 48 90"
        fill="none" stroke="#c8814a" strokeWidth="9" strokeLinecap="round" />
      {/* Arm sleeve (cloak extension) */}
      <path d="M 108 192 Q 85 182 68 160 Q 55 142 56 128 Q 46 148 50 165 Q 60 185 85 198Z"
        fill="url(#cloakGrad)" opacity="0.85" />

      {/* Right arm raised */}
      <path d="M 248 196 Q 275 185 292 162 Q 305 145 302 128"
        fill="none" stroke="#1e1008" strokeWidth="14" strokeLinecap="round" />
      <path d="M 248 196 Q 275 185 292 162 Q 305 145 302 128"
        fill="none" stroke="#c8814a" strokeWidth="10" strokeLinecap="round" />
      <path d="M 302 128 Q 310 110 312 90"
        fill="none" stroke="#1e1008" strokeWidth="12" strokeLinecap="round" />
      <path d="M 302 128 Q 310 110 312 90"
        fill="none" stroke="#c8814a" strokeWidth="9" strokeLinecap="round" />
      <path d="M 252 192 Q 275 182 292 160 Q 305 142 304 128 Q 314 148 310 165 Q 300 185 275 198Z"
        fill="url(#cloakGrad)" opacity="0.85" />

      {/* Glowing hands — sand-controlling chakra */}
      {/* Left hand glow */}
      <circle cx="48" cy="84" r="22" fill="url(#handGlow)" filter="url(#softGlow)" />
      <circle cx="48" cy="84" r="12" fill="#ff6a2b" opacity="0.7" />
      <circle cx="48" cy="84" r="6" fill="#ffe8c0" />
      {/* Sand wisps from left hand */}
      {[-30, -15, 0, 15, 30].map((offset, i) => (
        <path key={i}
          d={`M ${48 + offset * 0.3} ${72} Q ${35 + offset} ${55 + i * 2} ${28 + offset * 1.2} ${42}`}
          fill="none" stroke="#d9b778" strokeWidth={1.5 - i * 0.1}
          strokeLinecap="round" opacity={0.5 - i * 0.05} />
      ))}

      {/* Right hand glow */}
      <circle cx="312" cy="84" r="22" fill="url(#handGlow)" filter="url(#softGlow)" />
      <circle cx="312" cy="84" r="12" fill="#ff6a2b" opacity="0.7" />
      <circle cx="312" cy="84" r="6" fill="#ffe8c0" />
      {/* Sand wisps from right hand */}
      {[-30, -15, 0, 15, 30].map((offset, i) => (
        <path key={i}
          d={`M ${312 + offset * 0.3} ${72} Q ${325 + offset} ${55 + i * 2} ${332 + offset * 1.2} ${42}`}
          fill="none" stroke="#d9b778" strokeWidth={1.5 - i * 0.1}
          strokeLinecap="round" opacity={0.5 - i * 0.05} />
      ))}

      {/* Legs visible at bottom of cloak */}
      <path d="M 158 496 Q 160 530 162 560" fill="none" stroke="#1e1008" strokeWidth="16" strokeLinecap="round" />
      <path d="M 158 496 Q 160 530 162 560" fill="none" stroke="#c8814a" strokeWidth="12" strokeLinecap="round" />
      <path d="M 202 496 Q 200 530 198 560" fill="none" stroke="#1e1008" strokeWidth="16" strokeLinecap="round" />
      <path d="M 202 496 Q 200 530 198 560" fill="none" stroke="#c8814a" strokeWidth="12" strokeLinecap="round" />

      {/* ── HEAD ── */}
      {/* Neck */}
      <path d="M 165 148 Q 180 142 195 148 L 192 172 Q 180 176 168 172Z"
        fill="#c8814a" />
      {/* Head base shape */}
      <path d="M 148 118 Q 150 85 180 78 Q 210 85 212 118 Q 215 148 200 162 Q 192 170 180 172 Q 168 170 160 162 Q 145 148 148 118Z"
        fill="url(#skinGrad)" />
      {/* Jawline cel-shade shadow */}
      <path d="M 155 140 Q 165 155 180 158 Q 195 155 205 140"
        fill="none" stroke="#8a4a1a" strokeWidth="1.5" opacity="0.4" />

      {/* ── HAIR — silver-white short spiky ── */}
      {/* Hair base layer */}
      <path d="M 148 118 Q 148 90 165 78 Q 180 70 195 78 Q 212 90 212 118 Q 215 102 210 90 Q 205 76 195 70 Q 185 65 180 64 Q 175 65 165 70 Q 155 76 150 90 Q 145 102 148 118Z"
        fill="#e8e8f0" />
      {/* Hair spikes / strands */}
      <path d="M 148 110 Q 138 100 132 85 Q 128 72 134 62"
        fill="none" stroke="#c8c8d8" strokeWidth="5" strokeLinecap="round" />
      <path d="M 152 100 Q 143 88 140 72 Q 139 60 144 50"
        fill="none" stroke="#d8d8e8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 165 80 Q 160 68 162 55 Q 165 44 170 38"
        fill="none" stroke="#e0e0f0" strokeWidth="5" strokeLinecap="round" />
      <path d="M 180 75 Q 180 62 180 50 Q 180 40 182 32"
        fill="none" stroke="#e8e8f8" strokeWidth="5" strokeLinecap="round" />
      <path d="M 195 80 Q 200 68 198 55 Q 196 44 191 38"
        fill="none" stroke="#e0e0f0" strokeWidth="4" strokeLinecap="round" />
      <path d="M 208 100 Q 217 88 220 72 Q 221 60 216 50"
        fill="none" stroke="#d8d8e8" strokeWidth="4" strokeLinecap="round" />
      <path d="M 212 110 Q 222 100 228 85 Q 232 72 226 62"
        fill="none" stroke="#c8c8d8" strokeWidth="5" strokeLinecap="round" />
      {/* Hair highlight */}
      <path d="M 165 85 Q 180 76 195 85"
        fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* ── SCARF — ash-blue, flowing ── */}
      {/* Main scarf wrap */}
      <path d="M 158 158 Q 155 165 155 172 Q 160 178 180 180 Q 200 178 205 172 Q 205 165 202 158"
        fill="url(#scarfGrad)" />
      {/* Scarf tail — flowing to right, behind */}
      <path d="M 200 165 Q 230 158 255 148 Q 280 138 300 125 Q 318 115 320 100"
        fill="none" stroke="#6878b0" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
      <path d="M 200 165 Q 230 158 255 148 Q 280 138 300 125 Q 318 115 320 100"
        fill="none" stroke="#8898c8" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      {/* Scarf tail tip */}
      <path d="M 318 102 Q 325 92 322 80"
        fill="none" stroke="#6878b0" strokeWidth="8" strokeLinecap="round" opacity="0.6" />

      {/* ── EYES — amber glowing ── */}
      {/* Eye sockets */}
      <ellipse cx="166" cy="124" rx="11" ry="8.5" fill="#120d0a" />
      <ellipse cx="194" cy="124" rx="11" ry="8.5" fill="#120d0a" />
      {/* Iris */}
      <ellipse cx="166" cy="124" rx="8" ry="6.5" fill="url(#eyeAmber)" />
      <ellipse cx="194" cy="124" rx="8" ry="6.5" fill="url(#eyeAmber)" />
      {/* Pupil */}
      <ellipse cx="166" cy="124" rx="3" ry="6" fill="#120d0a" />
      <ellipse cx="194" cy="124" rx="3" ry="6" fill="#120d0a" />
      {/* Eye shine */}
      <circle cx="169" cy="121" r="2" fill="#ffe8c0" opacity="0.9" />
      <circle cx="197" cy="121" r="2" fill="#ffe8c0" opacity="0.9" />
      {/* Eye glow rings */}
      <ellipse cx="166" cy="124" rx="10" ry="8" fill="none" stroke="#ff9040" strokeWidth="1" opacity="0.4" />
      <ellipse cx="194" cy="124" rx="10" ry="8" fill="none" stroke="#ff9040" strokeWidth="1" opacity="0.4" />
      {/* Eyelids / brows — sharp anime style */}
      <path d="M 155 118 Q 166 114 177 118" fill="none" stroke="#8a5020" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 183 118 Q 194 114 205 118" fill="none" stroke="#8a5020" strokeWidth="2.5" strokeLinecap="round" />
      {/* Upper lid line */}
      <path d="M 156 123 Q 166 119 177 123" fill="none" stroke="#120d0a" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 183 123 Q 194 119 205 123" fill="none" stroke="#120d0a" strokeWidth="1.5" strokeLinecap="round" />

      {/* Nose */}
      <path d="M 178 134 Q 180 136 182 134" fill="none" stroke="#8a4a1a" strokeWidth="1.5" strokeLinecap="round" />
      {/* Mouth */}
      <path d="M 173 142 Q 180 146 187 142" fill="none" stroke="#8a4a1a" strokeWidth="1.8" strokeLinecap="round" />

      {/* Ear (left side visible) */}
      <path d="M 148 122 Q 142 125 142 132 Q 142 140 148 142"
        fill="none" stroke="#c8814a" strokeWidth="4" strokeLinecap="round" />

      {/* Chin shadow */}
      <path d="M 165 158 Q 180 165 195 158"
        fill="none" stroke="#8a4a1a" strokeWidth="1" opacity="0.3" />

      {/* Original emblem on chest — geometric sigil */}
      <circle cx="180" cy="225" r="11" fill="none" stroke="#ff9040" strokeWidth="1.5" opacity="0.7" />
      <circle cx="180" cy="225" r="6" fill="none" stroke="#d9b778" strokeWidth="1" opacity="0.6" />
      <polygon points="180,218 184,225 180,232 176,225" fill="none" stroke="#ff9040" strokeWidth="1" opacity="0.6" />

      {/* Outline: character edge cel-shade line */}
      <path d="M 148 118 Q 150 85 180 78 Q 210 85 212 118 Q 215 148 200 162 Q 192 172 180 172 Q 168 172 160 162 Q 145 148 148 118Z"
        fill="none" stroke="#120d0a" strokeWidth="2" opacity="0.5" />
      <path d="M 108 192 Q 85 230 80 310 Q 75 390 95 450 Q 110 490 180 510 Q 250 490 265 450 Q 285 390 280 310 Q 275 230 252 192Z"
        fill="none" stroke="#120d0a" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

// ─── Foreground Dunes SVG ────────────────────────────────────────────────
function FgDunesSVG() {
  return (
    <svg viewBox="0 0 1440 240" preserveAspectRatio="xMidYMax slice" className="h-full w-full">
      <defs>
        <linearGradient id="fgDune" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a1a0a" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#1c1008" />
          <stop offset="100%" stopColor="#120d0a" />
        </linearGradient>
        <linearGradient id="fgRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c8a040" stopOpacity="0.3" />
          <stop offset="30%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {/* Near dune with rim light */}
      <path d="M0,120 Q200,60 480,90 Q700,115 900,70 Q1100,25 1300,80 Q1400,100 1440,85 L1440,240 L0,240Z"
        fill="url(#fgDune)" />
      {/* Rim highlight */}
      <path d="M0,120 Q200,60 480,90 Q700,115 900,70 Q1100,25 1300,80 Q1400,100 1440,85"
        fill="none" stroke="url(#fgRim)" strokeWidth="2" />
      {/* Rocks */}
      <ellipse cx="120" cy="175" rx="55" ry="25" fill="#1c1008" opacity="0.9" />
      <ellipse cx="380" cy="195" rx="38" ry="17" fill="#1c1008" opacity="0.8" />
      <ellipse cx="1200" cy="170" rx="62" ry="22" fill="#1c1008" opacity="0.9" />
      <ellipse cx="980" cy="190" rx="42" ry="16" fill="#1c1008" opacity="0.75" />
      {/* Rock rim lights */}
      <path d="M 70 165 Q 120 155 170 165" fill="none" stroke="#c8a040" strokeWidth="1.5" opacity="0.25" />
      <path d="M 1150 160 Q 1200 150 1255 162" fill="none" stroke="#c8a040" strokeWidth="1.5" opacity="0.25" />
      {/* Ground dust wisps */}
      {[200, 400, 650, 850, 1100, 1350].map((x, i) => (
        <path key={i}
          d={`M ${x} ${210 - i % 2 * 10} Q ${x + 30} ${200 - i % 2 * 8} ${x + 60} ${208 - i % 2 * 6}`}
          fill="none" stroke="#b9915a" strokeWidth="1" opacity="0.15" />
      ))}
    </svg>
  );
}

// ─── Main HeroLayers Component ────────────────────────────────────────────
interface HeroLayersProps {
  SandCanvasComponent?: React.ReactNode;
}

export default function HeroLayers({ SandCanvasComponent }: HeroLayersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const beastRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const breathRef = useRef(0);

  // Check for real art assets
  const hasBgDunes = useArtAsset("/art/bg-dunes.webp");
  const hasBeast = useArtAsset("/art/beast.webp");
  const hasHero = useArtAsset("/art/hero.webp");
  const hasFg = useArtAsset("/art/fg-sand.webp");

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.addEventListener("mousemove", handleMouseMove);

    const tick = (time: number) => {
      breathRef.current = Math.sin(time * 0.001 * 0.9) * 0.015 + 1;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Hero parallax ±12px
      if (heroRef.current) {
        heroRef.current.style.transform = `translate(${mx * -12}px, ${my * -8 + Math.sin(time * 0.001) * 4}px)`;
      }
      // Beast parallax slower ±6px + breathing scale
      if (beastRef.current) {
        const sc = breathRef.current;
        beastRef.current.style.transform = `translate(${mx * -6}px, ${my * -4}px) scale(${sc})`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* ─── Layer 1: Desert night sky + far dunes (bg) ─── */}
      <div className="absolute inset-0">
        {hasBgDunes ? (
          <img src="/art/bg-dunes.webp" alt="" className="h-full w-full object-cover" aria-hidden="true" />
        ) : (
          <BgDunesSVG />
        )}
      </div>

      {/* ─── Layer 2: Spirit Beast (looming behind hero) ─── */}
      <div
        ref={beastRef}
        className="absolute inset-x-0"
        style={{
          top: "5%",
          bottom: "10%",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/* Beast glow aura (always rendered for effect) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_38%,rgba(255,106,43,0.18)_0%,rgba(168,50,26,0.08)_40%,transparent_70%)]" />

        {hasBeast ? (
          <img
            src="/art/beast.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            style={{ objectPosition: "55% 35%" }}
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: "5%" }}>
            <div className="relative h-full max-h-[520px] w-full max-w-[700px]">
              <BeastSVG />
            </div>
          </div>
        )}
      </div>

      {/* ─── Layer 3: Sand particles BEHIND hero ─── */}
      {SandCanvasComponent && (
        <div className="absolute inset-0 z-[3]" style={{ opacity: 0.85 }}>
          {SandCanvasComponent}
        </div>
      )}

      {/* ─── Layer 4: Hero character ─── */}
      <div
        ref={heroRef}
        className="absolute bottom-0 right-[8%] z-[4] h-[82%] max-h-[640px] w-[36%] max-w-[380px]"
        style={{ willChange: "transform" }}
      >
        {hasHero ? (
          <img
            src="/art/hero.webp"
            alt="The Sand Warden — original desert guardian character"
            className="h-full w-full object-contain object-bottom"
            priority-hint="high"
          />
        ) : (
          <HeroSVG />
        )}
      </div>

      {/* ─── Layer 5: Foreground dunes (bottom frame) ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] h-[28%]">
        {hasFg ? (
          <img src="/art/fg-sand.webp" alt="" className="h-full w-full object-cover object-top" aria-hidden="true" />
        ) : (
          <FgDunesSVG />
        )}
      </div>

      {/* ─── Atmospheric vignette + scrim ─── */}
      <div className="absolute inset-0 z-[6] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(18,13,10,0.65)_100%)]" />
    </div>
  );
}

