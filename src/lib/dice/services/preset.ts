import { DICE } from '$lib/dice/constants/dice';

interface DiceConfig {
  name: string;
  scale: number;
  font: string;
  color: string;
  labels: string[];
  valueMap: Record<number, any>;
  values: number[];
  normals: any[];
  mass: number;
  inertia: number;
  geometry: any;
  display: string;
  system: string;
  type?: string;
  bumpMaps?: string[];
}

const DEFAULT_CONFIG: DiceConfig = {
  name: '',
  scale: 1,
  font: 'Arial',
  color: '',
  labels: [],
  valueMap: {},
  values: [],
  normals: [],
  mass: 300,
  inertia: 13,
  geometry: null,
  display: 'values',
  system: 'd20',
};

export class DicePreset {
  #shape: string;
  #type: string;
  #labels: any[] = [];
  #normals: any[] = [];
  #valueMap: Record<number, any> = [];
  #values: number[] = [];
  #font: string;
  #color: string;
  #mass: number;
  #inertia: number;
  #scale: number;
  #geometry: any;
  #display: string;
  #system: string;
  #bumpMaps?: string[];

  constructor(name: keyof typeof DICE) {
    if (!DICE[name]) {
      throw new Error('Dice type unavailable');
    }

    // Initialize private fields from DICE configuration
    const config = { ...DEFAULT_CONFIG, ...DICE[name] };
    this.#shape = config.type || name;
    this.#type = name;
    this.#font = config.font;
    this.#color = config.color;
    this.#mass = config.mass;
    this.#inertia = config.inertia;
    this.#scale = config.scale;
    this.#geometry = config.geometry;
    this.#display = config.display;
    this.#system = config.system;
    this.#bumpMaps = config.bumpMaps;

    // Initialize arrays
    this.setLabels(config.labels);
    this.setValues(config.values[0], config.values[1], config.values[2]);
    this.setValueMap(config.valueMap);

    if (this.#bumpMaps) {
      this.setBumpMaps(this.#bumpMaps);
    }
  }

  // Getters
  get shape() {
    return this.#shape;
  }

  get type() {
    return this.#type;
  }

  get labels() {
    return this.#labels;
  }

  get normals() {
    return this.#normals;
  }

  get valueMap() {
    return this.#valueMap;
  }

  get values() {
    return this.#values;
  }

  get font() {
    return this.#font;
  }

  get color() {
    return this.#color;
  }

  get mass() {
    return this.#mass;
  }

  get inertia() {
    return this.#inertia;
  }

  get scale() {
    return this.#scale;
  }

  get geometry() {
    return this.#geometry;
  }

  get display() {
    return this.#display;
  }

  get system() {
    return this.#system;
  }

  get bumpMaps() {
    return this.#bumpMaps;
  }

  setValues(min: number = 1, max: number = 20, step: number = 1): void {
    this.#values = Array.from(
      { length: Math.floor((max - min) / step) + 1 },
      (_, i) => min + i * step
    );
  }

  setValueMap(map: Record<number, any>): void {
    this.#valueMap = this.#values.reduce<Record<number, any>>((acc, value) => {
      if (map[value] != null) {
        acc[value] = map[value];
      }
      return acc;
    }, {});
  }

  registerFaces(faces: any[], type: 'labels' | 'bump' = 'labels'): void {
    const targetArray = type === 'labels' ? this.#labels : this.#normals;

    if (this.#shape === 'd4') {
      this.#registerD4Faces(faces);
      return;
    }

    this.#registerStandardFaces(faces, targetArray);
  }

  #registerD4Faces(faces: any[]): void {
    const [a, b, c, d] = faces;
    this.#labels = [
      [[], [0, 0, 0], [b, d, c], [a, c, d], [b, a, d], [a, b, c]],
      [[], [0, 0, 0], [b, c, d], [c, a, d], [b, d, a], [c, b, a]],
      [[], [0, 0, 0], [d, c, b], [c, d, a], [d, b, a], [c, a, b]],
      [[], [0, 0, 0], [d, b, c], [a, d, c], [d, a, b], [a, c, b]],
    ];
  }

  #registerStandardFaces(faces: any[], targetArray: any[]): void {
    targetArray.unshift('');
    if (!['d2', 'd10'].includes(this.#shape)) {
      targetArray.unshift('');
    }
    targetArray.push(...faces);
  }

  setLabels(labels: string[]): void {
    this.#loadTextures(labels, (faces, type) => this.registerFaces(faces, type), 'labels');
  }

  setBumpMaps(normals: string[]): void {
    this.#loadTextures(normals, (faces, type) => this.registerFaces(faces, type), 'bump');
  }

  async #loadTextures(
    textures: string[],
    onTexturesLoaded: (textures: any[], type: 'labels' | 'bump') => void,
    type: 'labels' | 'bump'
  ): Promise<void> {
    const TEXTURE_REGEX = /\.(png|jpe?g|gif|webp)$/i;

    const hasTextures = textures.some(
      (texture: string) => texture && TEXTURE_REGEX.test(texture)
    );

    if (!hasTextures) {
      onTexturesLoaded(textures, type);
      return;
    }

    try {
      const loadedTextures = await Promise.all(
        textures.map((texture: string) => this.#loadSingleTexture(texture, TEXTURE_REGEX))
      );

      onTexturesLoaded(loadedTextures, type);
    } catch (error) {
      console.error('Error loading textures:', error);
      throw error;
    }
  }

  async #loadSingleTexture(texture: string, textureRegex: RegExp): Promise<string | HTMLImageElement> {
    if (!texture || !textureRegex.test(texture)) {
      return texture;
    }

    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = texture;
    });
    return img;
  }
}
