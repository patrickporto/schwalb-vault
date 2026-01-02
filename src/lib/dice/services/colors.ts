import { TEXTURELIST } from '$lib/dice/constants/texturelist';
import { COLORSETS } from '$lib/dice/constants/colorsets';

interface DiceColorsOptions {
  assetPath?: string;
}

interface ColorSetOptions {
  name?: string;
  colorset?: string;
  texture?: string;
  material?: string;
}

interface TextureData {
  source?: string;
  source_bump?: string;
  texture?: HTMLImageElement | HTMLImageElement[];
  bump?: HTMLImageElement | HTMLImageElement[];
  material?: string;
}

interface ColorSet {
  name: string;
  texture: TextureData;
  material?: string;
}

type TextureList = Record<string, TextureData>;
type ColorSets = Record<string, ColorSet>;

export class DiceColors {
  #colorsets: Map<string, ColorSet> = new Map();
  #assetPath?: string;

  constructor(options: DiceColorsOptions = {}) {
    this.#assetPath = options.assetPath;
  }

  async #loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error('Unable to load image texture:', error);
        reject(new Error('Image loading failed'));
      };
      img.crossOrigin = 'anonymous';
      img.src = src;
    });
  }

  async #imageLoader(data: TextureData): Promise<TextureData> {
    const result: TextureData = { ...data };

    if (result.source && result.source !== '') {
      result.texture = await this.#loadImage(result.source);
    }

    if (result.source_bump && result.source_bump !== '') {
      result.bump = await this.#loadImage(result.source_bump);
    }

    return result;
  }

  #getTexture(textureName: string): TextureData {
    return (TEXTURELIST as TextureList)[textureName] ?? (TEXTURELIST as TextureList).none;
  }

  async getColorSet(options: string | ColorSetOptions): Promise<ColorSet> {
    const setName = typeof options === 'string' ? options : options?.colorset;

    if (setName && this.#colorsets.has(setName)) {
      return this.#colorsets.get(setName)!;
    }

    const baseColorset = (COLORSETS as ColorSets)[setName || 'white'];
    const colorset: ColorSet = { ...baseColorset };

    // Get texture name from options or use the base colorset's texture source
    const textureName = typeof options === 'string'
      ? baseColorset.texture.source
      : options.texture ?? baseColorset.texture.source;

    // Get and load texture data
    colorset.texture = await this.#imageLoader(this.#getTexture(textureName || 'none'));

    // Apply material type if specified
    if (typeof options !== 'string' && options?.material) {
      colorset.texture.material = options.material;
    }

    // Cache for later use
    if (setName) {
      this.#colorsets.set(setName, colorset);
    }

    return colorset;
  }

  async makeColorSet(options: ColorSetOptions = {}): Promise<ColorSet> {
    if (options.name && this.#colorsets.has(options.name)) {
      return this.#colorsets.get(options.name)!;
    }

    const defaultSet = (COLORSETS as ColorSets).white;
    const colorset: ColorSet = {
      ...defaultSet,
      name:
        options.name?.toLowerCase() === 'white'
          ? Date.now().toString()
          : options.name ?? Date.now().toString(),
      texture: defaultSet.texture
    };

    // Get and load texture data
    const textureName = options.texture ?? defaultSet.texture.source ?? 'none';
    colorset.texture = await this.#imageLoader(this.#getTexture(textureName));

    if (options.material) {
      colorset.texture.material = options.material;
    }

    // Cache for later use
    this.#colorsets.set(colorset.name, colorset);

    return colorset;
  }
}
