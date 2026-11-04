// characters.ts — Character configuration system
// Drop your own artwork/model in /public/characters/ and set the flags below
// to override the procedural fallback automatically.

export interface CharacterConfig {
  id: string;
  name: string;
  /** If set, loads a .glb model from /public/characters/{glb} instead of procedural */
  glb?: string;
  /** If set, renders a flat sprite (png/webp) from /public/characters/{sprite} as billboard */
  sprite?: string;
  /** Enable procedural fallback (always true if no glb/sprite) */
  procedural: boolean;
}

/** Main hero character — The Sand Warden */
export const WARDEN_CONFIG: CharacterConfig = {
  id: "warden",
  name: "The Sand Warden",
  procedural: true, // set glb/sprite + procedural:false to use your own artwork
};

/** Spirit Beast — The Nine-Tailed Vessel */
export const BEAST_CONFIG: CharacterConfig = {
  id: "beast",
  name: "The Spirit Beast",
  procedural: true,
};

