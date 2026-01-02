export const TEXTURELIST: Record<string, { name: string; composite?: string; source: string; source_bump: string; material: string }> = {
  'none': {
    name: 'none',
    source: '',
    source_bump: '',
    material: 'none'
  },
  'bronze01': {
    name: 'bronze01',
    composite: 'difference',
    source: '/dice/textures/bronze01.webp',
    source_bump: '',
    material: 'metal'
  },
};
