import { resolve } from '$app/paths';

export const TEXTURELIST: Record<string, { name: string; composite?: string; source: string; source_bump: string; material: string }> = {
  'none': {
    name: 'none',
    source: '',
    source_bump: '',
    material: 'none'
  },
  'astral': {
    name: 'Astral',
    source: resolve('/textures/astral.webp'),
    source_bump: '',
    material: 'astral'
  },
  'bronze01': {
    name: 'Bronze 01',
    composite: 'difference',
    source: resolve('/textures/bronze01.webp'),
    source_bump: '',
    material: 'metal'
  },
  'bronze02': {
    name: 'Bronze 02',
    composite: 'difference',
    source: resolve('/textures/bronze02.webp'),
    source_bump: '',
    material: 'metal'
  },
  'bronze03': {
    name: 'Bronze 03',
    composite: 'difference',
    source: resolve('/textures/bronze03.webp'),
    source_bump: '',
    material: 'metal'
  },
  'bronze03a': {
    name: 'Bronze 03a',
    composite: 'difference',
    source: resolve('/textures/bronze03a.webp'),
    source_bump: '',
    material: 'metal'
  },
  'bronze03b': {
    name: 'Bronze 03b',
    composite: 'difference',
    source: resolve('/textures/bronze03b.webp'),
    source_bump: '',
    material: 'metal'
  },
  'bronze04': {
    name: 'Bronze 04',
    composite: 'difference',
    source: resolve('/textures/bronze04.webp'),
    source_bump: '',
    material: 'metal'
  },
  'cheetah': {
    name: 'Cheetah',
    source: resolve('/textures/cheetah.webp'),
    source_bump: '',
    material: 'silk'
  },
  'cloudy': {
    name: 'Cloudy',
    source: resolve('/textures/cloudy.webp'),
    source_bump: '',
    material: 'glass'
  },
  'cloudy_alt': {
    name: 'Cloudy Alt',
    source: resolve('/textures/cloudy.alt.webp'),
    source_bump: '',
    material: 'glass'
  },
  'dragon': {
    name: 'Dragon',
    source: resolve('/textures/dragon.webp'),
    source_bump: resolve('/textures/dragon-bump.webp'),
    material: 'stone'
  },
  'feather': {
    name: 'Feather',
    source: resolve('/textures/feather.webp'),
    source_bump: resolve('/textures/feather-bump.webp'),
    material: 'silk'
  },
  'fire': {
    name: 'Fire',
    source: resolve('/textures/fire.webp'),
    source_bump: '',
    material: 'none'
  },
  'glitter': {
    name: 'Glitter',
    source: resolve('/textures/glitter.webp'),
    source_bump: resolve('/textures/glitter-bump.webp'),
    material: 'glitter'
  },
  'ice': {
    name: 'Ice',
    source: resolve('/textures/ice.webp'),
    source_bump: '',
    material: 'ice'
  },
  'leopard': {
    name: 'Leopard',
    source: resolve('/textures/leopard.webp'),
    source_bump: '',
    material: 'silk'
  },
  'lizard': {
    name: 'Lizard',
    source: resolve('/textures/lizard.webp'),
    source_bump: resolve('/textures/lizard-bump.webp'),
    material: 'stone'
  },
  'marble': {
    name: 'Marble',
    source: resolve('/textures/marble.webp'),
    source_bump: '',
    material: 'marble'
  },
  'metal': {
    name: 'Metal',
    source: resolve('/textures/metal.webp'),
    source_bump: resolve('/textures/metal-bump.webp'),
    material: 'metal'
  },
  'paper': {
    name: 'Paper',
    source: resolve('/textures/paper.webp'),
    source_bump: resolve('/textures/paper-bump.webp'),
    material: 'paper'
  },
  'skulls': {
    name: 'Skulls',
    source: resolve('/textures/skulls.webp'),
    source_bump: '',
    material: 'stone'
  },
  'speckles': {
    name: 'Speckles',
    source: resolve('/textures/speckles.webp'),
    source_bump: '',
    material: 'none'
  },
  'stainedglass': {
    name: 'Stained Glass',
    source: resolve('/textures/stainedglass.webp'),
    source_bump: resolve('/textures/stainedglass-bump.webp'),
    material: 'glass'
  },
  'stars': {
    name: 'Stars',
    source: resolve('/textures/stars.webp'),
    source_bump: '',
    material: 'astral'
  },
  'stone': {
    name: 'Stone',
    source: resolve('/textures/stone.webp'),
    source_bump: '',
    material: 'stone'
  },
  'tiger': {
    name: 'Tiger',
    source: resolve('/textures/tiger.webp'),
    source_bump: '',
    material: 'silk'
  },
  'water': {
    name: 'Water',
    source: resolve('/textures/water.webp'),
    source_bump: '',
    material: 'glass'
  },
  'wood': {
    name: 'Wood',
    source: resolve('/textures/wood.webp'),
    source_bump: '',
    material: 'wood'
  }
};
