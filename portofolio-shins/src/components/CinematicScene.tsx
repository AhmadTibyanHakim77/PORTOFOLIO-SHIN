"use client";

// CinematicScene.tsx — Full cel-shaded anime scene
// Sand Warden + Spirit Beast + GPU sand effects + scroll-driven camera

import React, {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeWarmGradient, makeBeastGradient, makeOutlineMesh } from "@/lib/toonUtils";

// ─── GLSL: Sand Particles ─────────────────────────────────────
const SAND_VERT = /* glsl */`
  attribute float aId;
  attribute vec3 aHome;
  attribute float aPhase;

  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uScrollT;   // 0-1 overall scroll progress
  uniform float uBurst;
  uniform float uChapter;   // 0-5 chapter index (float)
  uniform float uVortex;    // 0-1 vortex blend
  uniform float uShield;    // 0-1 shield dome blend

  varying float vAlpha;
  varying vec3  vCol;

  // --- Value noise ---
  float hash(float n) { return fract(sin(n)*43758.5453); }
  float noise3(vec3 p){
    vec3 i=floor(p); vec3 f=fract(p); f=f*f*(3.-2.*f);
    float n=i.x+i.y*57.+i.z*113.;
    return mix(mix(mix(hash(n),hash(n+1.),f.x),mix(hash(n+57.),hash(n+58.),f.x),f.y),
               mix(mix(hash(n+113.),hash(n+114.),f.x),mix(hash(n+170.),hash(n+171.),f.x),f.y),f.z);
  }
  vec3 curl(vec3 p, float t){
    float e=0.12;
    float nx=noise3(p+vec3(e,0,0))-noise3(p-vec3(e,0,0));
    float ny=noise3(p+vec3(0,e,0))-noise3(p-vec3(0,e,0));
    float nz=noise3(p+vec3(0,0,e))-noise3(p-vec3(0,0,e));
    return vec3(ny-nz,nz-nx,nx-ny)*0.25;
  }

  // Morph targets
  vec3 sphere(vec3 h){ return h; }

  vec3 dome(vec3 h, float t){
    float a=atan(h.z,h.x);
    float el=acos(clamp(h.y/max(length(h),0.001),-1.,1.));
    float r=2.0+aPhase*0.3;
    el=clamp(el,0.05,1.5);
    return vec3(cos(a)*sin(el)*r, abs(cos(el))*r*0.7+0.3, sin(a)*sin(el)*r);
  }

  vec3 wave(vec3 h, float t){
    float px=h.x*2.2; float pz=h.z*2.2;
    float y=sin(px+t*0.4)*0.6+cos(pz*0.7+t*0.3)*0.4;
    return vec3(px, y-0.5, pz);
  }

  vec3 vortexPos(vec3 h, float t){
    float a=atan(h.z,h.x)+t*0.4*(0.5+aPhase*0.5);
    float r=0.8+aPhase*1.6;
    float yy=h.y*0.6+sin(aPhase*6.28+t*0.6)*0.3;
    return vec3(cos(a)*r, yy, sin(a)*r);
  }

  vec3 spikes(vec3 h, float t){
    // Snap to cursor-like direction from origin
    float a=atan(h.z,h.x)+aPhase*6.28;
    float r=0.1+aPhase*2.5;
    float y=aPhase*3.0-1.5;
    return vec3(cos(a)*r, y, sin(a)*r);
  }

  vec3 nameForm(vec3 h, float t){
    // Swirling convergence toward center-top
    float a=aPhase*6.28*3.0+t*0.15;
    float r=0.1+aPhase*1.2;
    float y=0.8+sin(a*2.0)*0.3;
    return vec3(cos(a)*r, y, sin(a)*r)*0.6;
  }

  void main(){
    float id = aId;
    vec3 drift = curl(aHome*0.8+uTime*0.07, uTime)*0.2;

    // Chapter morph blend (0=sphere,1=dome,2=wave,3=vortex,4=spikes,5=name)
    float ch = clamp(uChapter, 0., 5.);
    int ci = int(floor(ch));
    float cf = fract(ch);

    vec3 targets[6];
    targets[0] = sphere(aHome);
    targets[1] = dome(aHome, uTime);
    targets[2] = wave(aHome, uTime);
    targets[3] = vortexPos(aHome, uTime);
    targets[4] = spikes(aHome, uTime);
    targets[5] = nameForm(aHome, uTime);

    vec3 target;
    if(ci==0) target=mix(targets[0],targets[1],smoothstep(0.,1.,cf));
    else if(ci==1) target=mix(targets[1],targets[2],smoothstep(0.,1.,cf));
    else if(ci==2) target=mix(targets[2],targets[3],smoothstep(0.,1.,cf));
    else if(ci==3) target=mix(targets[3],targets[4],smoothstep(0.,1.,cf));
    else if(ci==4) target=mix(targets[4],targets[5],smoothstep(0.,1.,cf));
    else target=targets[5];

    target += drift;

    // Pointer repulsion
    vec3 wp = vec3(uPointer.x*3.5, uPointer.y*2.5, 0.0);
    vec3 delta = target - wp;
    float dist = length(delta);
    float influence = smoothstep(2.0, 0.0, dist);
    target += normalize(delta+0.001) * influence * 0.9;

    // Burst pulse
    float burst = uBurst * sin(aPhase*12.566+uTime*8.0);
    target += normalize(aHome+0.001) * burst * 1.2;

    // Shimmer
    target.y += sin(aPhase*6.28+uTime*0.9)*0.012;

    vec4 mv = modelViewMatrix * vec4(target, 1.0);
    gl_Position = projectionMatrix * mv;

    float depth = -mv.z;
    float depthFade = 1.0 - clamp(depth/14.0, 0.0, 0.75);
    gl_PointSize = (2.6/depth) * 200.0 * depthFade;

    // Color shift by chapter
    float warm = smoothstep(0., 3., ch);
    vCol = mix(vec3(0.85, 0.72, 0.47), vec3(1.0, 0.42, 0.17), warm);
    vAlpha = (0.5 + 0.5*sin(aPhase*6.28+uTime*0.5)) * depthFade;
  }
`;

const SAND_FRAG = /* glsl */`
  varying float vAlpha;
  varying vec3  vCol;
  void main(){
    vec2 cxy = 2.0*gl_PointCoord - 1.0;
    float r = dot(cxy,cxy);
    if(r > 1.0) discard;
    float alpha = (1.0-r)*vAlpha;
    alpha = pow(alpha, 1.4);
    gl_FragColor = vec4(vCol, alpha);
  }
`;

// ─── GLSL: Dune Ground Plane ──────────────────────────────────
const DUNE_VERT = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  varying float vHeight;
  void main(){
    vUv = uv;
    vec3 p = position;
    p.y += sin(p.x*1.1+uTime*0.25)*0.18 + cos(p.z*0.9+uTime*0.18)*0.14;
    vHeight = p.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
  }
`;
const DUNE_FRAG = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  varying float vHeight;
  void main(){
    float edge = smoothstep(-0.4, 0.3, vHeight);
    vec3 dark  = vec3(0.07, 0.05, 0.03);
    vec3 mid   = vec3(0.47, 0.35, 0.18);
    vec3 light = vec3(0.72, 0.60, 0.33);
    vec3 col = mix(dark, mix(mid, light, edge), 0.85);
    // Subtle grid ripple
    float grid = smoothstep(0.97, 1.0, abs(sin(vUv.x*20.0+uTime*0.1)*sin(vUv.y*20.0)));
    col += grid*0.08;
    gl_FragColor = vec4(col, 0.6);
  }
`;

// ─── GLSL: Spirit Beast Aura ──────────────────────────────────
const BEAST_AURA_VERT = /* glsl */`
  uniform float uTime;
  uniform float uBreath;
  varying vec3 vNorm;
  varying float vFresnel;
  void main(){
    vNorm = normalize(normalMatrix * normal);
    vec3 p = position * (1.0 + uBreath*0.08 + sin(uTime*1.2+position.y)*0.015);
    vec4 mv = modelViewMatrix * vec4(p,1.0);
    vec3 viewDir = normalize(-mv.xyz);
    vFresnel = 1.0 - abs(dot(viewDir, vNorm));
    gl_Position = projectionMatrix * mv;
  }
`;
const BEAST_AURA_FRAG = /* glsl */`
  uniform vec3 uColor;
  uniform float uBreath;
  varying float vFresnel;
  void main(){
    float rim = pow(vFresnel, 2.0);
    float alpha = rim * 0.6 + uBreath * 0.1;
    gl_FragColor = vec4(uColor * (0.8 + rim*0.5), alpha);
  }
`;

// ─── Sand Particles Component ─────────────────────────────────
interface SandUniforms {
  uTime: { value: number };
  uPointer: { value: THREE.Vector2 };
  uScrollT: { value: number };
  uBurst: { value: number };
  uChapter: { value: number };
  uVortex: { value: number };
  uShield: { value: number };
}

interface SandParticlesProps {
  count: number;
  scrollRef: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
}

function SandParticles({ count, scrollRef, burstRef, chapterRef }: SandParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const uniformsRef = useRef<SandUniforms>({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScrollT: { value: 0 },
    uBurst: { value: 0 },
    uChapter: { value: 0 },
    uVortex: { value: 0 },
    uShield: { value: 0 },
  });

  const { positions, ids, phases, home } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const idArr = new Float32Array(count);
    const phArr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 1.5 + Math.random() * 1.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.set([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      ], i * 3);
      idArr[i] = Math.random();
      phArr[i] = Math.random();
    }
    return { positions: pos, ids: idArr, phases: phArr, home: pos.slice() };
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SAND_VERT,
        fragmentShader: SAND_FRAG,
        uniforms: uniformsRef.current as unknown as { [key: string]: THREE.IUniform },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ pointer, clock }) => {
    const u = uniformsRef.current;
    u.uTime.value = clock.elapsedTime;
    u.uPointer.value.set(pointer.x, pointer.y);
    u.uScrollT.value = scrollRef.current;
    u.uBurst.value *= 0.88;
    if (burstRef.current > 0) {
      u.uBurst.value = burstRef.current;
      burstRef.current = 0;
    }
    u.uChapter.value += (chapterRef.current - u.uChapter.value) * 0.03;
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aId" args={[ids, 1]} />
        <bufferAttribute attach="attributes-aHome" args={[home, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
    </points>
  );
}

// ─── Dune Ground ─────────────────────────────────────────────
function DuneGround() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const uTime = useRef({ value: 0 });

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: DUNE_VERT,
    fragmentShader: DUNE_FRAG,
    uniforms: { uTime: uTime.current },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  useFrame(({ clock }) => { uTime.current.value = clock.elapsedTime; });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
      <planeGeometry args={[24, 24, 60, 60]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

// ─── Spirit Beast ─────────────────────────────────────────────
interface BeastProps {
  scrollRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
}

function SpiritBeast({ scrollRef, chapterRef }: BeastProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const breathRef = useRef(0);
  const warmGrad = useMemo(() => makeWarmGradient(), []);
  const beastGrad = useMemo(() => makeBeastGradient(), []);
  _ = beastGrad; // used below

  // Nine tails geometry
  const tailGeos = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => {
      const baseAngle = (i / 9) * Math.PI * 2;
      const pts = [0, 0.25, 0.5, 0.75, 1.0].map((s, j) =>
        new THREE.Vector3(
          Math.cos(baseAngle + j * 0.28) * (0.3 + s * 2.4),
          Math.sin(baseAngle * 1.8 + j * 0.5) * 0.55 * s + s * 0.4,
          Math.sin(baseAngle + j * 0.28) * (0.3 + s * 2.4)
        )
      );
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.045 - i * 0.003, 8);
    }), []);

  // Aura material
  const auraMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: BEAST_AURA_VERT,
    fragmentShader: BEAST_AURA_FRAG,
    uniforms: {
      uTime: { value: 0 },
      uBreath: { value: 0 },
      uColor: { value: new THREE.Color("#ff6a2b") },
    },
    transparent: true,
    side: THREE.FrontSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const breath = Math.sin(t * 0.9) * 0.5 + 0.5;
    breathRef.current = breath;

    // Intensity by chapter (vortex / misi chapters)
    const intensity = 0.3 + chapterRef.current * 0.12;
    auraMat.uniforms.uTime.value = t;
    auraMat.uniforms.uBreath.value = breath * intensity;

    // Beast group slow float + sway
    groupRef.current.position.y = -0.4 + Math.sin(t * 0.6) * 0.12;
    groupRef.current.position.x = Math.sin(t * 0.3) * 0.08;
    groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.08;

    // Tail sway
    groupRef.current.children.forEach((child, i) => {
      if (i < 9) {
        child.rotation.y = Math.sin(t * 0.8 + i * 0.42) * 0.14;
        child.position.y = Math.sin(t * 1.1 + i * 0.6) * 0.07;
      }
    });
  });

  const toonMat = useMemo(() => new THREE.MeshToonMaterial({
    color: new THREE.Color("#ff6a2b"),
    gradientMap: warmGrad,
    transparent: true,
    opacity: 0.72,
  }), [warmGrad]);

  const bodyMat = useMemo(() => new THREE.MeshToonMaterial({
    color: new THREE.Color("#2a0a18"),
    gradientMap: warmGrad,
    transparent: true,
    opacity: 0.85,
  }), [warmGrad]);

  return (
    <group ref={groupRef} position={[0.6, 0.6, -3.5]} scale={[1.1, 1.1, 1.1]}>
      {/* Nine tails */}
      {tailGeos.map((geo, i) => (
        <mesh key={i} geometry={geo} material={toonMat} />
      ))}

      {/* Body — large torso */}
      <mesh position={[0, 0, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.65, 1.0, 8, 16]} />
      </mesh>
      {/* Aura overlay */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.75, 1.1, 8, 16]} />
        <primitive object={auraMat} attach="material" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.1, 0]} material={bodyMat}>
        <sphereGeometry args={[0.52, 16, 16]} />
      </mesh>
      {/* Head aura */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <primitive object={auraMat} attach="material" />
      </mesh>

      {/* Horns */}
      {[[-0.28, 1.5, -0.1], [0.28, 1.5, -0.1]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[i === 0 ? -0.4 : 0.4, 0, i === 0 ? -0.5 : 0.5]}>
          <coneGeometry args={[0.07, 0.42, 6]} />
          <meshToonMaterial color="#d9b778" gradientMap={warmGrad} />
        </mesh>
      ))}

      {/* Glowing eyes */}
      {[[-0.18, 1.08, 0.46], [0.18, 1.08, 0.46]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff6a2b" />
        </mesh>
      ))}
      {/* Eye glow rings */}
      {[[-0.18, 1.08, 0.44], [0.18, 1.08, 0.44]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshBasicMaterial color="#ff6a2b" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Sand Warden Character ─────────────────────────────────────
function SandWarden() {
  const groupRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const cloakRef = useRef<THREE.Mesh>(null!);
  const scarfRef = useRef<THREE.Mesh>(null!);

  const warmGrad = useMemo(() => makeWarmGradient(), []);

  const skinMat = useMemo(() => new THREE.MeshToonMaterial({ color: "#c8814a", gradientMap: warmGrad }), [warmGrad]);
  const cloakMat = useMemo(() => new THREE.MeshToonMaterial({ color: "#c4a84a", gradientMap: warmGrad, side: THREE.DoubleSide }), [warmGrad]);
  const darkMat = useMemo(() => new THREE.MeshToonMaterial({ color: "#1e1008", gradientMap: warmGrad }), [warmGrad]);
  const emberMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ff6a2b" }), []);
  const scarfMat = useMemo(() => new THREE.MeshToonMaterial({ color: "#a85028", gradientMap: warmGrad, side: THREE.DoubleSide }), [warmGrad]);

  // Cloak shape (custom rounded cone-ish)
  const cloakGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.72, 1.4, 12, 1, true);
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    // Float animation
    groupRef.current.position.y = 0.08 + Math.sin(t * 0.9) * 0.07;
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.05;

    // Arms raised, sine sway
    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = 0.7 + Math.sin(t * 1.1) * 0.12;
      leftArmRef.current.rotation.x = Math.sin(t * 0.7) * 0.08;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -(0.7 + Math.sin(t * 1.1 + 0.5) * 0.12);
      rightArmRef.current.rotation.x = Math.sin(t * 0.7 + 0.3) * 0.08;
    }

    // Cloak cloth sine sway
    if (cloakRef.current) {
      cloakRef.current.rotation.x = Math.sin(t * 1.2) * 0.04;
      cloakRef.current.rotation.z = Math.sin(t * 0.8 + 1.0) * 0.05;
      cloakRef.current.scale.x = 1 + Math.sin(t * 1.5) * 0.025;
    }

    // Scarf tail wave
    if (scarfRef.current) {
      scarfRef.current.rotation.y = Math.sin(t * 1.4) * 0.3;
      scarfRef.current.rotation.x = Math.sin(t * 1.0 + 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[-0.5, 0.0, -1.2]} scale={[0.9, 0.9, 0.9]}>
      {/* Head */}
      <mesh position={[0, 1.68, 0]} material={skinMat}>
        <sphereGeometry args={[0.26, 14, 14]} />
      </mesh>
      {/* Head outline */}
      <mesh position={[0, 1.68, 0]}>
        <sphereGeometry args={[0.26, 14, 14]} />
        {makeOutlineMesh(new THREE.SphereGeometry(0.26, 14, 14), 0.06) && null}
      </mesh>

      {/* Hair / top (dark cap) */}
      <mesh position={[0, 1.86, 0]} material={darkMat}>
        <sphereGeometry args={[0.22, 10, 10]} />
      </mesh>

      {/* Glowing eyes */}
      {[[-0.1, 1.68, 0.24], [0.1, 1.68, 0.24]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} material={emberMat}>
          <sphereGeometry args={[0.038, 6, 6]} />
        </mesh>
      ))}

      {/* Neck */}
      <mesh position={[0, 1.44, 0]} material={skinMat}>
        <cylinderGeometry args={[0.09, 0.09, 0.22, 8]} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.0, 0]} material={darkMat}>
        <capsuleGeometry args={[0.24, 0.52, 6, 10]} />
      </mesh>

      {/* Cloak — wide cone, cloth-sway */}
      <mesh ref={cloakRef} position={[0, 0.86, 0]} material={cloakMat} geometry={cloakGeo} />

      {/* Left arm group */}
      <group ref={leftArmRef} position={[-0.28, 1.1, 0]}>
        <mesh material={darkMat}>
          <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.32, 0]} material={skinMat}>
          <capsuleGeometry args={[0.055, 0.3, 4, 8]} />
        </mesh>
        {/* Hand glow */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff9040" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Right arm group */}
      <group ref={rightArmRef} position={[0.28, 1.1, 0]}>
        <mesh material={darkMat}>
          <capsuleGeometry args={[0.07, 0.38, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.32, 0]} material={skinMat}>
          <capsuleGeometry args={[0.055, 0.3, 4, 8]} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshBasicMaterial color="#ff9040" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Legs (peeking below cloak) */}
      {[[-0.13, 0.08, 0], [0.13, 0.08, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} material={darkMat}>
          <capsuleGeometry args={[0.09, 0.42, 4, 8]} />
        </mesh>
      ))}

      {/* Scarf tail — flowing behind head */}
      <mesh ref={scarfRef} position={[0, 1.6, -0.2]} material={scarfMat}>
        <planeGeometry args={[0.18, 0.7, 2, 8]} />
      </mesh>

      {/* Original emblem sigil (geometric, aria-hidden) */}
      <mesh position={[0, 1.02, 0.25]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.09, 0.012, 6, 16]} />
        <meshBasicMaterial color="#ff6a2b" />
      </mesh>
      <mesh position={[0, 1.02, 0.25]}>
        <octahedronGeometry args={[0.055, 0]} />
        <meshBasicMaterial color="#d9b778" />
      </mesh>
    </group>
  );
}

// ─── Scroll-Driven Camera ─────────────────────────────────────
interface CameraRigProps {
  scrollRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
}

function CameraRig({ scrollRef, chapterRef }: CameraRigProps) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 6));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    const ch = chapterRef.current;
    const s = scrollRef.current;

    // Dramatic camera positions per chapter
    const positions: [number, number, number][] = [
      [0, 0.4, 6],      // prolog — front/center
      [-1.2, 0.2, 5.5], // path — slight left drift
      [0.8, -0.3, 5.0], // expertise — right low angle
      [0, 0.8, 4.5],    // jutsu — elevated
      [1.0, 0.0, 5.2],  // missions — cinematic right
      [-0.6, 0.6, 5.8], // training — over-shoulder
    ];
    const looks: [number, number, number][] = [
      [0, 0.3, 0],
      [-0.3, 0.3, 0],
      [0.2, 0.0, 0],
      [0, 0.5, 0],
      [0.4, 0.0, 0],
      [-0.2, 0.3, 0],
    ];

    const idx = Math.min(Math.floor(ch), positions.length - 1);
    const nxt = Math.min(idx + 1, positions.length - 1);
    const frac = ch - Math.floor(ch);

    const p0 = positions[idx];
    const p1 = positions[nxt];
    const l0 = looks[idx];
    const l1 = looks[nxt];

    const tf = THREE.MathUtils.smoothstep(frac, 0, 1);

    targetPos.current.set(
      p0[0] + (p1[0] - p0[0]) * tf,
      p0[1] + (p1[1] - p0[1]) * tf,
      p0[2] + (p1[2] - p0[2]) * tf
    );
    targetLook.current.set(
      l0[0] + (l1[0] - l0[0]) * tf,
      l0[1] + (l1[1] - l0[1]) * tf,
      l0[2] + (l1[2] - l0[2]) * tf
    );

    // Slight idle float
    const t = performance.now() * 0.001;
    targetPos.current.y += Math.sin(t * 0.6) * 0.04;

    camera.position.lerp(targetPos.current, 0.028);
    const lp = new THREE.Vector3().lerpVectors(camera.position, targetLook.current, 0.3);
    camera.lookAt(lp);
  });

  return null;
}

// ─── Dust Layer ───────────────────────────────────────────────
function DustLayer({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    return p;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      p[i * 3 + 1] += 0.0006;
      if (p[i * 3 + 1] > 5) p[i * 3 + 1] = -5;
      p[i * 3] += Math.sin(t * 0.15 + i) * 0.0004;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#d9b778" transparent opacity={0.2} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// ─── Main Cinematic Scene (exported) ──────────────────────────
export interface CinematicSceneProps {
  scrollRef: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
  chapterRef: React.MutableRefObject<number>;
  isMobile: boolean;
}

function _ (x: unknown) { void x; } // suppress unused warning

export default function CinematicSceneInner({
  scrollRef,
  burstRef,
  chapterRef,
  isMobile,
}: CinematicSceneProps) {
  const particleCount = isMobile ? 2000 : 4800;
  const dustCount = isMobile ? 60 : 180;

  return (
    <Canvas
      dpr={[1, isMobile ? 1 : 1.5]}
      camera={{ position: [0, 0.4, 6], fov: 46 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance", alpha: false }}
      frameloop="always"
      style={{ background: "transparent" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} color="#fff4e8" />
      <directionalLight position={[3, 4, 2]} intensity={1.1} color="#ffe8cc" castShadow={false} />
      <directionalLight position={[-2, 1, -1]} intensity={0.4} color="#ff6a2b" />
      <pointLight position={[0, 2, 1]} intensity={0.6} color="#d9b778" distance={8} />

      {/* Scroll-driven camera rig */}
      <CameraRig scrollRef={scrollRef} chapterRef={chapterRef} />

      {/* Dune ground */}
      <DuneGround />

      {/* Dust layer */}
      <DustLayer count={dustCount} />

      {/* Sand particles */}
      <SandParticles
        count={particleCount}
        scrollRef={scrollRef}
        burstRef={burstRef}
        chapterRef={chapterRef}
      />

      {/* Characters */}
      {!isMobile && <SandWarden />}
      <SpiritBeast scrollRef={scrollRef} chapterRef={chapterRef} />
    </Canvas>
  );
}

