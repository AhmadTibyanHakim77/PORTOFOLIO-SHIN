"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- GLSL Shader for sand particles (GPU-driven) ---
const VERTEX_SHADER = /* glsl */`
  attribute float aId;
  attribute vec3 aHome;

  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uScrollProgress;
  uniform float uBurst;
  uniform float uDpr;

  varying float vAlpha;
  varying vec2 vUv;

  // --- Simplex-style value noise ---
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(mix(mix(hash(n), hash(n+1.0), f.x), mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
               mix(mix(hash(n+113.0), hash(n+114.0), f.x), mix(hash(n+170.0), hash(n+171.0), f.x), f.y), f.z);
  }

  // Curl-like drift from gradient of noise
  vec3 curlNoise(vec3 p, float t) {
    float eps = 0.1;
    float nx = noise(p + vec3(eps, 0, 0)) - noise(p - vec3(eps, 0, 0));
    float ny = noise(p + vec3(0, eps, 0)) - noise(p - vec3(0, eps, 0));
    float nz = noise(p + vec3(0, 0, eps)) - noise(p - vec3(0, 0, eps));
    return vec3(ny - nz, nz - nx, nx - ny) * 0.3;
  }

  void main() {
    float id = aId;
    float phase = id * 0.37 + uTime * 0.12;
    float r = 0.015;

    // === Scroll-driven morphing ===
    // 0–0.2: sphere  0.2–0.5: ring  0.5–0.8: dune plane  0.8–1.0: vortex
    float scroll = clamp(uScrollProgress, 0.0, 1.0);

    vec3 sphere = aHome;

    // Ring: flatten Y, radial spread
    float angle = atan(aHome.z, aHome.x);
    float radius = 2.3 + sin(id * 2.3) * 0.6;
    vec3 ring = vec3(cos(angle) * radius, aHome.y * 0.1, sin(angle) * radius);

    // Dune plane: wave pattern
    vec3 dune = vec3(aHome.x * 2.1, sin(aHome.x * 1.4 + aHome.z * 0.9 + uTime * 0.15) * 0.4 - 0.6, aHome.z * 2.1);

    // Vortex: spiral inward
    float vAngle = angle + scroll * uTime * 0.05;
    float vR = max(0.3, radius * (1.0 - scroll * 0.5));
    vec3 vortex = vec3(cos(vAngle) * vR, (sin(id * 4.0 + uTime * 0.2) * 0.8), sin(vAngle) * vR);

    vec3 target;
    if (scroll < 0.25) {
      float t = scroll / 0.25;
      target = mix(sphere, ring, smoothstep(0.0, 1.0, t));
    } else if (scroll < 0.55) {
      float t = (scroll - 0.25) / 0.3;
      target = mix(ring, dune, smoothstep(0.0, 1.0, t));
    } else if (scroll < 0.80) {
      float t = (scroll - 0.55) / 0.25;
      target = mix(dune, vortex, smoothstep(0.0, 1.0, t));
    } else {
      target = vortex;
    }

    // === Curl drift per-particle ===
    vec3 drift = curlNoise(aHome + uTime * 0.08, uTime) * 0.18;
    target += drift;

    // === Pointer repulsion / attraction ===
    vec3 wp = vec3(uPointer.x * 3.5, uPointer.y * 2.5, 0.0);
    vec3 delta = target - wp;
    float dist = length(delta);
    float influence = smoothstep(2.2, 0.0, dist);
    target += normalize(delta) * influence * 0.9;

    // === Burst pulse ===
    float burst = uBurst * sin(id * 1.73 + uTime * 6.0);
    target += normalize(aHome) * burst * 0.6;

    // === Oscillation / shimmer ===
    target.y += sin(phase + uTime * 0.6) * r;
    target.x += cos(phase * 0.7 + uTime * 0.4) * r;

    vec4 mvPosition = modelViewMatrix * vec4(target, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Size attenuation + depth fading
    float depthFade = 1.0 - clamp(-mvPosition.z / 12.0, 0.0, 0.7);
    gl_PointSize = (2.4 / -mvPosition.z) * 180.0 * depthFade;

    vAlpha = 0.55 + 0.45 * sin(id * 2.3 + uTime * 0.4);
    vUv = vec2(id, 0.5);
  }
`;

const FRAGMENT_SHADER = /* glsl */`
  uniform vec3 uColorA; // dune gold
  uniform vec3 uColorB; // ember orange
  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    // Round soft sprite
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    // Soft glow falloff
    float alpha = (1.0 - r) * vAlpha;
    alpha = pow(alpha, 1.3);

    // Color gradient by particle id
    vec3 col = mix(uColorA, uColorB, vUv.x);
    gl_FragColor = vec4(col, alpha);
  }
`;

// --- Sand Particles Component ---
interface SandProps {
  n: number;
  scrollProgress: React.MutableRefObject<number>;
  burstRef: React.MutableRefObject<number>;
}

function Sand({ n, scrollProgress, burstRef }: SandProps) {
  const meshRef = useRef<THREE.Points>(null!);
  const uniformsRef = useRef<Record<string, THREE.IUniform>>({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uScrollProgress: { value: 0 },
    uBurst: { value: 0 },
    uColorA: { value: new THREE.Color("#d9b778") },
    uColorB: { value: new THREE.Color("#ff6a2b") },
    uDpr: { value: 1 },
  });

  const { positions, ids, home } = useMemo(() => {
    const pos = new Float32Array(n * 3);
    const idArr = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = 1.6 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.set(
        [r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)],
        i * 3
      );
      idArr[i] = Math.random();
    }
    return { positions: pos, ids: idArr, home: pos.slice() };
  }, [n]);

  useFrame(({ pointer, clock }, _dt) => {
    if (!meshRef.current) return;
    const u = uniformsRef.current;
    u.uTime.value = clock.elapsedTime;
    u.uPointer.value.set(pointer.x, pointer.y);
    u.uScrollProgress.value = scrollProgress.current;
    // Decay burst
    u.uBurst.value *= 0.92;
    if (burstRef.current > 0) {
      u.uBurst.value = burstRef.current;
      burstRef.current = 0;
    }
  });

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniformsRef.current,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <points ref={meshRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aId" args={[ids, 1]} />
        <bufferAttribute attach="attributes-aHome" args={[home, 3]} />
      </bufferGeometry>
    </points>
  );
}

// --- Chakra Core + Nine Tails ---
function ChakraCore() {
  const groupRef = useRef<THREE.Group>(null!);

  const tailGeos = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => {
      const angleBase = (i / 9) * Math.PI * 2;
      const pts = [0, 0.3, 0.6, 0.85, 1.0].map((s, j) =>
        new THREE.Vector3(
          Math.cos(angleBase + j * 0.3) * (0.4 + s * 1.8),
          Math.sin(angleBase * 2 + j * 0.4) * 0.45 * s,
          Math.sin(angleBase + j * 0.3) * (0.4 + s * 1.8)
        )
      );
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 50, 0.028 - i * 0.002, 8);
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.12;

    // Animate each tail individually
    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && i < 9) {
        child.rotation.y = Math.sin(t * 0.7 + i * 0.4) * 0.08;
        child.position.y = Math.sin(t * 1.2 + i * 0.6) * 0.04;
        (child.material as THREE.MeshBasicMaterial).opacity =
          0.3 + Math.sin(t * 1.5 + i) * 0.2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Nine Tails */}
      {tailGeos.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial
            color={i % 2 === 0 ? "#ff6a2b" : "#d9b778"}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Core Glow Layers (additive, Fresnel-like) */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffe8d0" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#ff6a2b" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color="#ff6a2b" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#a8321a" transparent opacity={0.04} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

// --- Dust Layer: slow-drifting ambient particles ---
function DustLayer({ n }: { n: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return p;
  }, [n]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < n; i++) {
      p[i * 3 + 1] += 0.0008;
      if (p[i * 3 + 1] > 5) p[i * 3 + 1] = -5;
      p[i * 3] += Math.sin(clock.elapsedTime * 0.2 + i) * 0.0005;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#d9b778" transparent opacity={0.25} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// --- Scroll tracker ---
function ScrollTracker({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const { size } = useThree();
  useFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - size.height;
    scrollProgress.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  });
  return null;
}

// --- Main SandScene export ---
export default function SandScene() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 1500 : 4500;
  const dustCount = isMobile ? 50 : 150;

  const scrollProgress = useRef(0);
  const burstRef = useRef(0);

  // Click burst
  useEffect(() => {
    const handler = () => { burstRef.current = 1.0; };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Canvas
        dpr={[1, Math.min(1.5, typeof window !== "undefined" ? window.devicePixelRatio : 1.5)]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop="demand"
      >
        <ScrollTracker scrollProgress={scrollProgress} />
        <Sand n={particleCount} scrollProgress={scrollProgress} burstRef={burstRef} />
        <ChakraCore />
        <DustLayer n={dustCount} />
      </Canvas>
    </div>
  );
}
