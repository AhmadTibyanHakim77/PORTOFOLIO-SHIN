"use client";
// SandCanvas.tsx — Crisp GPU sand particles: small grains, no blowout, NormalBlending
// Two draw calls: main grains (NormalBlending) + ember sparks (AdditiveBlending, tiny subset)

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────────────────────
// GLSL — Main Grain Particles (NormalBlending, crisp round sprite)
// ─────────────────────────────────────────────────────────────────────────────
const GRAIN_VERT = /* glsl */`
  attribute float aPhase;
  attribute float aPaletteIdx; // 0-3 picks color
  attribute vec3  aHome;

  uniform float uTime;
  uniform vec2  uPointer;    // NDC -1..1
  uniform float uScrollT;    // 0-1
  uniform float uChapter;    // float 0-5
  uniform float uBurst;
  uniform float uDpr;
  uniform float uViewH;      // canvas height in px

  varying float vAlpha;
  varying vec3  vColor;

  // --- palette: 4 crisp earth tones ---
  vec3 palette(float idx){
    if(idx < 0.5) return vec3(0.541, 0.416, 0.227); // #8a6a3a
    if(idx < 1.5) return vec3(0.725, 0.569, 0.353); // #b9915a
    if(idx < 2.5) return vec3(0.851, 0.718, 0.471); // #d9b778
    return          vec3(0.945, 0.890, 0.769);       // #f1e3c4
  }

  // --- compact value noise ---
  float h(float n){ return fract(sin(n)*43758.5453); }
  float noise(vec3 p){
    vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.-2.*f);
    float n=i.x+i.y*57.+i.z*113.;
    return mix(mix(mix(h(n),h(n+1.),f.x),mix(h(n+57.),h(n+58.),f.x),f.y),
               mix(mix(h(n+113.),h(n+114.),f.x),mix(h(n+170.),h(n+171.),f.x),f.y),f.z);
  }
  // curl-noise wind
  vec3 curl(vec3 p){
    float e=0.1;
    return vec3(
      noise(p+vec3(0,e,0))-noise(p-vec3(0,e,0)),
      noise(p+vec3(0,0,e))-noise(p-vec3(0,0,e)),
      noise(p+vec3(e,0,0))-noise(p-vec3(e,0,0))
    )*0.3;
  }

  // ─ morph targets ─
  vec3 ribbonOrbit(vec3 h, float t){
    // 3 spiral arms orbiting origin, following hero position
    float arm = floor(aPhase*3.0);
    float angBase = arm*(2.09333)+t*0.5*(1.0+arm*0.3);
    float angOff  = aPhase*3.0 - arm;
    float r = 1.1 + angOff*1.4;
    float ang = angBase + angOff*6.28;
    float yy  = h.y*0.4 + sin(angOff*6.28+t*0.8)*0.3;
    return vec3(cos(ang)*r, yy, sin(ang)*r*0.5);
  }
  vec3 vortexPos(vec3 h, float t){
    float ang = atan(h.z,h.x)+t*0.5;
    float r   = 0.6+aPhase*2.0;
    return vec3(cos(ang)*r, h.y*0.5+sin(aPhase*6.28+t)*0.4, sin(ang)*r);
  }
  vec3 wavePos(vec3 h, float t){
    return vec3(h.x*2.5, sin(h.x*1.3+t*0.4)*0.6+cos(h.z*0.9+t*0.3)*0.3-0.3, h.z*2.5);
  }
  vec3 dustSettle(vec3 h){
    // flat near ground
    float r = length(h.xz)*1.8;
    float ang = atan(h.z,h.x);
    return vec3(cos(ang)*r, -1.5+aPhase*0.5, sin(ang)*r);
  }

  void main(){
    // wind drift (curl)
    vec3 windDrift = curl(aHome*0.7+uTime*0.09)*0.22;

    // chapter morph (0=ribbon 1=vortex 2=wave 3=dust 4=settle 5=dust)
    float ch = clamp(uChapter,0.,5.);
    int   ci = int(floor(ch));
    float cf = fract(ch);

    vec3 t0,t1;
    if(ci==0){ t0=ribbonOrbit(aHome,uTime); t1=vortexPos(aHome,uTime); }
    else if(ci==1){ t0=vortexPos(aHome,uTime); t1=wavePos(aHome,uTime); }
    else if(ci==2){ t0=wavePos(aHome,uTime); t1=dustSettle(aHome); }
    else if(ci==3){ t0=dustSettle(aHome); t1=ribbonOrbit(aHome,uTime); }
    else{ t0=ribbonOrbit(aHome,uTime); t1=dustSettle(aHome); }

    vec3 target = mix(t0, t1, smoothstep(0.,1.,cf)) + windDrift;

    // vertical lift near hero (center of screen)
    float dxy = length(target.xz);
    target.y += smoothstep(2.0,0.0,dxy)*0.6;

    // pointer attraction — stream toward cursor (NDC → world approx)
    vec3 pWorld = vec3(uPointer.x*3.5, uPointer.y*2.0, 0.0);
    vec3 delta  = pWorld - target;
    float d     = length(delta);
    float pull  = smoothstep(2.2, 0.0, d) * 0.65;
    target += normalize(delta+0.001) * pull;

    // burst shockwave
    float burst = uBurst * sin(aPhase*12.566+uTime*9.0);
    target += normalize(aHome+0.001) * burst * 1.4;

    // shimmer
    target.y += sin(aPhase*6.28+uTime*1.1)*0.009;
    target.x += cos(aPhase*6.28+uTime*0.7)*0.006;

    vec4 mv = modelViewMatrix * vec4(target, 1.0);
    gl_Position = projectionMatrix * mv;

    // ── CRISP SIZE: target ~1.5-2.5 visual pixels ──
    // grainPx: physical px we want. uViewH gives canvas height.
    float depth = max(-mv.z, 0.5);
    // fov=46deg → tan(23°)=0.4245; focal = viewH/(2*0.4245)
    float focal = uViewH / 0.849;
    float grainPx = clamp(focal * 1.6 / depth, 1.0, 3.5);
    gl_PointSize = grainPx * uDpr;

    vColor = palette(aPaletteIdx);
    // slight brightness variation
    vColor *= 0.82 + aPhase*0.36;
    // depth fade
    float depthFade = 1.0 - clamp((depth-4.0)/9.0, 0.0, 0.7);
    vAlpha = (0.55 + 0.35*sin(aPhase*6.28+uTime*0.4)) * depthFade;
  }
`;

const GRAIN_FRAG = /* glsl */`
  varying float vAlpha;
  varying vec3  vColor;
  void main(){
    vec2 cxy = 2.0*gl_PointCoord - 1.0;
    float r = dot(cxy,cxy);
    // ── CRISP edge: sharp cutoff, not soft glow ──
    float alpha = smoothstep(0.50, 0.42, r);
    if(alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL — Ember Sparks (AdditiveBlending, tiny, ≤800)
// ─────────────────────────────────────────────────────────────────────────────
const SPARK_VERT = /* glsl */`
  attribute float aPhase;
  attribute vec3  aHome;
  uniform float uTime;
  uniform float uDpr;
  uniform float uViewH;
  varying float vAlpha;
  void main(){
    float t = uTime;
    float ang = aPhase*6.28*4.0 + t*(0.6+aPhase*0.8);
    float r   = 0.3 + aPhase*2.0;
    float yy  = sin(aPhase*6.28*2.0+t*1.2)*0.8;
    vec3 pos  = vec3(cos(ang)*r, yy, sin(ang)*r*0.6);
    // flicker
    pos.xy   += vec2(sin(t*4.0+aPhase*9.0), cos(t*3.5+aPhase*7.0))*0.04;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = max(-mv.z, 0.5);
    float focal = uViewH / 0.849;
    // sparks smaller: 0.6-1.5px
    float px = clamp(focal*0.6/depth, 0.6, 1.8);
    gl_PointSize = px * uDpr;

    vAlpha = 0.4 + 0.5*sin(aPhase*6.28+t*3.0);
  }
`;
const SPARK_FRAG = /* glsl */`
  varying float vAlpha;
  void main(){
    vec2 c = 2.0*gl_PointCoord - 1.0;
    float r = dot(c,c);
    if(r > 1.0) discard;
    // slightly softer for sparks (glow intentional but tiny)
    float a = smoothstep(1.0, 0.3, r) * vAlpha;
    gl_FragColor = vec4(1.0, 0.5, 0.15, a);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Ground-level dust sweep (flat, near bottom)
// ─────────────────────────────────────────────────────────────────────────────
const DUST_VERT = /* glsl */`
  attribute float aPhase;
  uniform float uTime;
  uniform float uDpr;
  varying float vAlpha;
  void main(){
    // sweep across bottom of scene left→right with wind drift
    float t   = uTime;
    float x   = mod(aPhase*18.0 - t*0.4, 18.0) - 9.0;
    float z   = (aPhase*0.7+0.3)*-3.0;
    float y   = -2.4 + sin(aPhase*12.566+t*0.8)*0.18;
    vec4 mv   = modelViewMatrix * vec4(x, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = max(-mv.z, 0.5);
    gl_PointSize = clamp(2.0/depth*120.0, 1.0, 4.0)*uDpr;
    vAlpha = 0.25 + 0.2*sin(aPhase*6.28+t*0.6);
  }
`;
const DUST_FRAG = /* glsl */`
  varying float vAlpha;
  void main(){
    vec2 c = 2.0*gl_PointCoord-1.0;
    float r = dot(c,c);
    float a = smoothstep(0.5,0.3,r)*vAlpha;
    if(a<0.01) discard;
    gl_FragColor = vec4(0.60,0.47,0.28, a);
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Uniforms type
// ─────────────────────────────────────────────────────────────────────────────
interface Uniforms {
  uTime: { value: number };
  uPointer: { value: THREE.Vector2 };
  uScrollT: { value: number };
  uChapter: { value: number };
  uBurst: { value: number };
  uDpr: { value: number };
  uViewH: { value: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main grain particles
// ─────────────────────────────────────────────────────────────────────────────
interface GrainProps {
  count: number;
  scrollRef: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
}

function GrainParticles({ count, scrollRef, burstRef, chapterRef }: GrainProps) {
  const { size, gl } = useThree();
  const uniforms = useRef<Uniforms>({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScrollT: { value: 0 },
    uChapter: { value: 0 },
    uBurst: { value: 0 },
    uDpr: { value: gl.getPixelRatio() },
    uViewH: { value: size.height },
  });

  const { positions, phases, paletteIdxs, home } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const pal = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.4 + Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.set([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ], i * 3);
      ph[i] = Math.random();
      pal[i] = Math.floor(Math.random() * 4);
    }
    return { positions: pos, phases: ph, paletteIdxs: pal, home: pos.slice() };
  }, [count]);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: GRAIN_VERT,
    fragmentShader: GRAIN_FRAG,
    uniforms: uniforms.current as unknown as { [k: string]: THREE.IUniform },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }), []);

  useFrame(({ pointer, clock, gl }) => {
    const u = uniforms.current;
    u.uTime.value = clock.elapsedTime;
    u.uPointer.value.set(pointer.x, pointer.y);
    u.uScrollT.value = scrollRef.current;
    u.uDpr.value = gl.getPixelRatio();
    u.uViewH.value = size.height;
    u.uBurst.value *= 0.86;
    if (burstRef.current > 0) { u.uBurst.value = burstRef.current; burstRef.current = 0; }
    u.uChapter.value += (chapterRef.current - u.uChapter.value) * 0.025;
  });

  return (
    <points material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aHome" args={[home, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aPaletteIdx" args={[paletteIdxs, 1]} />
      </bufferGeometry>
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ember sparks (additive, tiny)
// ─────────────────────────────────────────────────────────────────────────────
function EmberSparks({ count }: { count: number }) {
  const { size, gl } = useThree();
  const dpr = gl.getPixelRatio();
  const uTime = useRef({ value: 0 });
  const uDpr = useRef({ value: dpr });
  const uViewH = useRef({ value: size.height });

  const { positions, phases, home } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 4,
      ], i * 3);
      ph[i] = Math.random();
    }
    return { positions: pos, phases: ph, home: pos.slice() };
  }, [count]);
  void home;

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: SPARK_VERT,
    fragmentShader: SPARK_FRAG,
    uniforms: { uTime: uTime.current, uDpr: uDpr.current, uViewH: uViewH.current },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    uTime.current.value = clock.elapsedTime;
    uDpr.current.value = dpr;
    uViewH.current.value = size.height;
  });

  return (
    <points material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ground dust sweep
// ─────────────────────────────────────────────────────────────────────────────
function GroundDust({ count }: { count: number }) {
  const { gl } = useThree();
  const dpr = gl.getPixelRatio();
  const uTime = useRef({ value: 0 });
  const uDpr = useRef({ value: dpr });
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { p[i * 3] = 0; p[i * 3 + 1] = -2.4; p[i * 3 + 2] = -1.5; }
    return p;
  }, [count]);
  const phases = useMemo(() => {
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) ph[i] = Math.random();
    return ph;
  }, [count]);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: DUST_VERT,
    fragmentShader: DUST_FRAG,
    uniforms: { uTime: uTime.current, uDpr: uDpr.current },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }), []);
  useFrame(({ clock }) => { uTime.current.value = clock.elapsedTime; uDpr.current.value = dpr; });
  return (
    <points material={mat}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
    </points>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas wrapper — exports
// ─────────────────────────────────────────────────────────────────────────────
export interface SandCanvasProps {
  scrollRef: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
  isMobile: boolean;
  opacity?: number;
}

export default function SandCanvas({ scrollRef, burstRef, chapterRef, isMobile, opacity = 1 }: SandCanvasProps) {
  const grainCount = isMobile ? 5500 : 17000;
  const sparkCount = isMobile ? 200 : 700;
  const dustCount = isMobile ? 80 : 240;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Pause rendering when off-screen
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { el.style.visibility = e.isIntersecting ? "visible" : "hidden"; },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause when tab hidden
  useEffect(() => {
    const onVis = () => {
      if (canvasRef.current) canvasRef.current.style.visibility = document.hidden ? "hidden" : "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div
      ref={canvasRef}
      style={{ opacity, transition: "opacity 0.8s ease" }}
      className="absolute inset-0"
    >
      <Canvas
        dpr={[1, Math.min(isMobile ? 1 : 1.5, window.devicePixelRatio)]}
        camera={{ position: [0, 0.2, 5.5], fov: 46 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <ambientLight intensity={0.2} color="#fff4e8" />
        <GrainParticles
          count={grainCount}
          scrollRef={scrollRef}
          burstRef={burstRef}
          chapterRef={chapterRef}
        />
        <EmberSparks count={sparkCount} />
        <GroundDust count={dustCount} />
      </Canvas>
    </div>
  );
}
