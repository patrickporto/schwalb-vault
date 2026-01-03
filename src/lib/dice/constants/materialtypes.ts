export type MaterialType = 'standard' | 'physical' | 'phong';

export interface MaterialOptions {
  name: string;
  type?: MaterialType;
  color?: number;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  iridescenceThicknessRange?: [number, number];
  roughnessMap?: string;
  transmission?: number;
  thickness?: number;
}

export const MATERIALTYPES: Record<string, MaterialOptions> = {
  'none': {
    name: 'Plastic',
    type: 'standard',
    roughness: 0.6,
    metalness: 0,
    envMapIntensity: 1,
    roughnessMap: 'roughnessMap_fingerprint'
  },
  'perfectmetal': { // Kept for backward compatibility, mapped to Chrome-like
    name: 'Perfect Metal',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0,
    metalness: 1,
    envMapIntensity: 1,
    roughnessMap: 'roughnessMap_fingerprint'
  },
  'metal': {
    name: 'Metal',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0.6,
    metalness: 1,
    envMapIntensity: 1,
    roughnessMap: 'roughnessMap_metal'
  },
  'wood': {
    name: 'Wood',
    type: 'standard',
    color: 0xdddddd,
    roughness: 1,
    metalness: 0,
    envMapIntensity: 1,
    roughnessMap: 'roughnessMap_wood'
  },
  'glass': {
    name: 'Glass',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.1,
    metalness: 0,
    envMapIntensity: 1,
    transmission: 0.95,
    thickness: 1.5,
    roughnessMap: 'roughnessMap_fingerprint'
  },
  'chrome': {
    name: 'Chrome',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0.1,
    metalness: 1,
    envMapIntensity: 1,
    roughnessMap: 'roughnessMap_fingerprint'
  },
  'pristine': {
    name: 'Pristine',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1
  },
  'iridescent': {
    name: 'Iridescent',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.2,
    metalness: 1,
    envMapIntensity: 1,
    iridescence: 1,
    iridescenceIOR: 1.8,
    iridescenceThicknessRange: [485, 515]
  },
  'stone': {
    name: 'Stone',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0.8,
    metalness: 0,
    envMapIntensity: 0.5,
    roughnessMap: 'roughnessMap_stone'
  },
  // Legacy mappings update
  'ice': {
    name: 'Ice',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.05,
    metalness: 0,
    envMapIntensity: 1.5, // High env map for ice
    transmission: 0.8,
    thickness: 1,
    clearcoat: 1
  },
  'marble': {
    name: 'Marble',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0.3,
    metalness: 0,
    envMapIntensity: 1
  },
  'glitter': {
    name: 'Glitter',
    type: 'standard', // Physical fits better but Standard is faster for particles
    color: 0xdddddd,
    roughness: 0.4,
    metalness: 0.8,
    envMapIntensity: 1
  },
  'paper': {
    name: 'Paper',
    type: 'standard',
    color: 0xdddddd,
    roughness: 1.0,
    metalness: 0,
    envMapIntensity: 0.2
  },
  'silk': {
    name: 'Silk',
    type: 'standard',
    color: 0xdddddd,
    roughness: 0.6,
    metalness: 0.1,
    envMapIntensity: 0.8
  },
  'astral': {
    name: 'Astral',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.1,
    metalness: 0.3,
    envMapIntensity: 2.0,
    clearcoat: 1,
    clearcoatRoughness: 0.5
  },
  'gem': {
    name: 'Gem',
    type: 'physical',
    color: 0xdddddd,
    roughness: 0.0,
    metalness: 0.0,
    envMapIntensity: 2.0,
    transmission: 0.6,
    thickness: 1
  }
}
