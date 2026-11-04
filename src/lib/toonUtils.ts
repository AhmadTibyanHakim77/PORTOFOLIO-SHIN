"use client";
// toonUtils.ts — Shared utilities for cel-shaded toon rendering
import * as THREE from "three";

/** Build a 4-step toon gradient texture (dark → mid1 → mid2 → bright) */
export function makeToonGradient(colors: string[] = ["#1a0d08", "#3a1a0e", "#7a3a1a", "#c06030"]): THREE.DataTexture {
  const n = colors.length;
  const data = new Uint8Array(n * 4);
  colors.forEach((hex, i) => {
    const c = new THREE.Color(hex);
    data[i * 4] = Math.round(c.r * 255);
    data[i * 4 + 1] = Math.round(c.g * 255);
    data[i * 4 + 2] = Math.round(c.b * 255);
    data[i * 4 + 3] = 255;
  });
  const tex = new THREE.DataTexture(data, n, 1);
  tex.needsUpdate = true;
  return tex;
}

/** Warm (ember/sand) toon gradient — used on character skin + cloak */
export function makeWarmGradient() {
  return makeToonGradient(["#1a0d08", "#5a2010", "#a85028", "#d9b050"]);
}

/** Dark-blue beast gradient */
export function makeBeastGradient() {
  return makeToonGradient(["#050308", "#1a0820", "#3a1545", "#ff6a2b"]);
}

/** Black outline via inverted-hull pass — returns a mesh you add as sibling */
export function makeOutlineMesh(
  geometry: THREE.BufferGeometry,
  thickness = 0.045,
  color = "#120d0a"
): THREE.Mesh {
  const mat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.BackSide,
    depthWrite: true,
  });
  const outline = new THREE.Mesh(geometry, mat);
  outline.scale.setScalar(1 + thickness);
  return outline;
}

