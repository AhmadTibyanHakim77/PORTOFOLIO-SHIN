"use client";

import React from "react";

interface ProjectArtworkProps {
  id: string;
  cat: "web" | "ai" | "data";
  title?: string;
}

export default function ProjectArtwork({ id, cat }: ProjectArtworkProps) {
  // Original geometric artwork tailored to each project and category
  // Using theme palette: night #120D0A, ember #A8321A, chakra #FF6A2B, dune #D9B778, sand #F1E3C4
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-dune/20 bg-gradient-to-br from-night via-[#1c140f] to-[#120d0a] shadow-inner">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-chakra/15 via-transparent to-transparent pointer-events-none" />

      {id === "studymate-ai" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          <defs>
            <radialGradient id="sm-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sm-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d9b778" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a8321a" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="125" r="70" fill="url(#sm-glow)" />
          {/* Neural Synapse Nodes */}
          <line x1="120" y1="80" x2="200" y2="125" stroke="#d9b778" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="280" y1="80" x2="200" y2="125" stroke="#d9b778" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="130" y1="180" x2="200" y2="125" stroke="#d9b778" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="270" y1="180" x2="200" y2="125" stroke="#d9b778" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Concentric Knowledge Rings */}
          <circle cx="200" cy="125" r="45" stroke="#f1e3c4" strokeWidth="1" fill="none" opacity="0.6" />
          <polygon points="200,95 226,140 174,140" stroke="#ff6a2b" strokeWidth="1.5" fill="none" opacity="0.8" />
          <polygon points="200,155 174,110 226,110" stroke="#d9b778" strokeWidth="1.5" fill="none" opacity="0.8" />
          {/* Orbital nodes */}
          <circle cx="120" cy="80" r="5" fill="#f1e3c4" />
          <circle cx="280" cy="80" r="5" fill="#d9b778" />
          <circle cx="130" cy="180" r="5" fill="#a8321a" />
          <circle cx="270" cy="180" r="5" fill="#ff6a2b" />
          <circle cx="200" cy="125" r="7" fill="#ff6a2b" />
        </svg>
      )}

      {id === "careerly" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          <defs>
            <linearGradient id="cr-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8321a" />
              <stop offset="50%" stopColor="#ff6a2b" />
              <stop offset="100%" stopColor="#d9b778" />
            </linearGradient>
          </defs>
          {/* Stepped Career Pathway / Vectors */}
          <path d="M 60 190 L 140 160 L 220 120 L 300 70 L 350 50" fill="none" stroke="url(#cr-grad)" strokeWidth="3" strokeLinecap="round" />
          <path d="M 60 190 L 140 160 L 220 120 L 300 70 L 350 50 L 350 210 L 60 210 Z" fill="#ff6a2b" opacity="0.08" />
          {/* Target Milestone Nodes */}
          <circle cx="60" cy="190" r="6" fill="#a8321a" stroke="#f1e3c4" strokeWidth="1" />
          <circle cx="140" cy="160" r="7" fill="#ff6a2b" stroke="#f1e3c4" strokeWidth="1" />
          <circle cx="220" cy="120" r="8" fill="#d9b778" stroke="#120d0a" strokeWidth="1.5" />
          <circle cx="300" cy="70" r="9" fill="#f1e3c4" stroke="#ff6a2b" strokeWidth="2" />
          {/* Radar target arcs */}
          <circle cx="300" cy="70" r="22" stroke="#d9b778" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.5" />
          <line x1="220" y1="120" x2="220" y2="210" stroke="#d9b778" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
          <line x1="140" y1="160" x2="140" y2="210" stroke="#d9b778" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
        </svg>
      )}

      {id === "tetra-coffee" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          {/* Modern Geometric Artisan Coffee Alchemy */}
          <defs>
            <linearGradient id="tc-steam" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ff6a2b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#d9b778" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Geometric Chemex / Flask Shape */}
          <polygon points="160,70 240,70 215,130 250,195 150,195 185,130" stroke="#d9b778" strokeWidth="2" fill="none" />
          <line x1="185" y1="130" x2="215" y2="130" stroke="#ff6a2b" strokeWidth="3" />
          {/* Liquid level */}
          <polygon points="158,180 242,180 250,195 150,195" fill="#a8321a" opacity="0.5" />
          {/* Rising Aroma Sine Waves */}
          <path d="M 190 60 Q 200 45 190 30 T 190 10" fill="none" stroke="url(#tc-steam)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 210 60 Q 220 45 210 30 T 210 10" fill="none" stroke="url(#tc-steam)" strokeWidth="2" strokeLinecap="round" />
          {/* Hexagonal Aromas */}
          <circle cx="100" cy="120" r="28" stroke="#d9b778" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
          <circle cx="300" cy="120" r="28" stroke="#d9b778" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.4" />
        </svg>
      )}

      {id === "adult-income-prediction" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          {/* Classification Decision Boundary & High-Dimensional Scatter */}
          <line x1="60" y1="200" x2="340" y2="200" stroke="#d9b778" strokeWidth="1.5" opacity="0.6" />
          <line x1="60" y1="200" x2="60" y2="40" stroke="#d9b778" strokeWidth="1.5" opacity="0.6" />
          {/* Sigmoid / Boundary curve */}
          <path d="M 70 180 C 150 180, 210 120, 260 60 C 290 50, 320 45, 340 45" fill="none" stroke="#ff6a2b" strokeWidth="2.5" />
          {/* Class A points (>50K) */}
          <circle cx="120" cy="90" r="4.5" fill="#f1e3c4" opacity="0.9" />
          <circle cx="160" cy="70" r="4.5" fill="#f1e3c4" opacity="0.9" />
          <circle cx="210" cy="55" r="4.5" fill="#f1e3c4" opacity="0.9" />
          <circle cx="240" cy="40" r="4.5" fill="#f1e3c4" opacity="0.9" />
          <circle cx="280" cy="30" r="4.5" fill="#f1e3c4" opacity="0.9" />
          {/* Class B points (<=50K) */}
          <circle cx="110" cy="170" r="4" fill="#a8321a" opacity="0.8" />
          <circle cx="150" cy="160" r="4" fill="#a8321a" opacity="0.8" />
          <circle cx="190" cy="165" r="4" fill="#a8321a" opacity="0.8" />
          <circle cx="270" cy="140" r="4" fill="#a8321a" opacity="0.8" />
          <circle cx="310" cy="130" r="4" fill="#a8321a" opacity="0.8" />
        </svg>
      )}

      {id === "stock-market-analysis" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          {/* Candlesticks & Moving Average Wave */}
          <defs>
            <linearGradient id="sma-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a8321a" />
              <stop offset="70%" stopColor="#ff6a2b" />
              <stop offset="100%" stopColor="#d9b778" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          <line x1="50" y1="80" x2="350" y2="80" stroke="#d9b778" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.25" />
          <line x1="50" y1="130" x2="350" y2="130" stroke="#d9b778" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.25" />
          <line x1="50" y1="180" x2="350" y2="180" stroke="#d9b778" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.25" />
          {/* Candlesticks */}
          {/* 1 */}
          <line x1="90" y1="130" x2="90" y2="180" stroke="#a8321a" strokeWidth="1" />
          <rect x="84" y="145" width="12" height="25" fill="#a8321a" opacity="0.8" />
          {/* 2 */}
          <line x1="140" y1="110" x2="140" y2="160" stroke="#d9b778" strokeWidth="1" />
          <rect x="134" y="125" width="12" height="20" fill="#d9b778" opacity="0.8" />
          {/* 3 */}
          <line x1="190" y1="100" x2="190" y2="150" stroke="#ff6a2b" strokeWidth="1" />
          <rect x="184" y="110" width="12" height="30" fill="#ff6a2b" opacity="0.9" />
          {/* 4 */}
          <line x1="240" y1="70" x2="240" y2="130" stroke="#d9b778" strokeWidth="1" />
          <rect x="234" y="85" width="12" height="35" fill="#d9b778" opacity="0.9" />
          {/* 5 */}
          <line x1="290" y1="50" x2="290" y2="105" stroke="#f1e3c4" strokeWidth="1" />
          <rect x="284" y="60" width="12" height="30" fill="#f1e3c4" opacity="0.9" />
          {/* Exponential Moving Average Trendline */}
          <path d="M 60 170 Q 120 150 170 135 T 260 90 T 340 55" fill="none" stroke="url(#sma-grad)" strokeWidth="2.5" />
        </svg>
      )}

      {id === "gold-price-forecasting" && (
        <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
          {/* Gold Bars & Predictive Corridor */}
          <defs>
            <linearGradient id="gold-bar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f1e3c4" />
              <stop offset="50%" stopColor="#d9b778" />
              <stop offset="100%" stopColor="#a8321a" />
            </linearGradient>
          </defs>
          {/* Shaded Forecast Cone */}
          <polygon points="210,120 340,65 340,175" fill="#ff6a2b" opacity="0.12" />
          <path d="M 60 150 C 110 160, 150 110, 210 120" fill="none" stroke="#d9b778" strokeWidth="2.5" />
          <path d="M 210 120 L 340 90" stroke="#f1e3c4" strokeWidth="2" strokeDasharray="5 4" fill="none" />
          <circle cx="210" cy="120" r="5" fill="#ff6a2b" />
          <circle cx="340" cy="90" r="5" fill="#f1e3c4" />
          {/* Isometric Ingot Accent */}
          <polygon points="120,70 160,55 190,65 150,80" fill="url(#gold-bar)" opacity="0.75" />
          <polygon points="120,70 150,80 150,90 120,80" fill="#a8321a" opacity="0.7" />
          <polygon points="150,80 190,65 190,75 150,90" fill="#d9b778" opacity="0.85" />
        </svg>
      )}

      {/* Default / Fallback for other Web and AI apps */}
      {id !== "studymate-ai" &&
        id !== "careerly" &&
        id !== "tetra-coffee" &&
        id !== "adult-income-prediction" &&
        id !== "stock-market-analysis" &&
        id !== "gold-price-forecasting" && (
          <svg viewBox="0 0 400 250" className="h-full w-full object-cover p-4" aria-hidden="true">
            {cat === "web" && (
              <>
                {/* Browser Frame / Architecture Canvas */}
                <rect x="70" y="45" width="260" height="160" rx="8" fill="none" stroke="#d9b778" strokeWidth="1.5" opacity="0.7" />
                <line x1="70" y1="75" x2="330" y2="75" stroke="#d9b778" strokeWidth="1" opacity="0.4" />
                <circle cx="90" cy="60" r="3" fill="#ff6a2b" />
                <circle cx="102" cy="60" r="3" fill="#d9b778" />
                <circle cx="114" cy="60" r="3" fill="#f1e3c4" />
                <rect x="90" y="95" width="70" height="90" rx="4" fill="#a8321a" opacity="0.25" />
                <rect x="175" y="95" width="135" height="38" rx="4" fill="#ff6a2b" opacity="0.2" />
                <rect x="175" y="145" width="135" height="40" rx="4" fill="#d9b778" opacity="0.15" />
              </>
            )}
            {cat === "ai" && (
              <>
                <polygon points="200,60 270,100 270,180 200,220 130,180 130,100" fill="none" stroke="#ff6a2b" strokeWidth="1.5" opacity="0.75" />
                <polygon points="200,90 240,115 240,165 200,190 160,165 160,115" fill="none" stroke="#d9b778" strokeWidth="1" opacity="0.6" />
                <circle cx="200" cy="140" r="10" fill="#ff6a2b" opacity="0.8" />
              </>
            )}
            {cat === "data" && (
              <>
                <rect x="80" y="140" width="25" height="60" rx="2" fill="#a8321a" opacity="0.6" />
                <rect x="125" y="110" width="25" height="90" rx="2" fill="#ff6a2b" opacity="0.7" />
                <rect x="170" y="80" width="25" height="120" rx="2" fill="#d9b778" opacity="0.8" />
                <rect x="215" y="125" width="25" height="75" rx="2" fill="#a8321a" opacity="0.5" />
                <rect x="260" y="60" width="25" height="140" rx="2" fill="#f1e3c4" opacity="0.85" />
                <path d="M 92 135 L 137 105 L 182 75 L 227 120 L 272 55" fill="none" stroke="#ff6a2b" strokeWidth="2" />
              </>
            )}
          </svg>
        )}

      <div className="absolute bottom-2 right-3 font-mono text-[10px] tracking-wider text-dune/60 uppercase">
        {cat}{" // "}{id}
      </div>
    </div>
  );
}

