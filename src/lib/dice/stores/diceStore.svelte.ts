import { appSettings } from '$lib/stores/characterStore';
import { get } from 'svelte/store';
import { DiceBox } from '$lib/dice/services/renderer';
import { THEMES } from '$lib/dice/constants/themes';
import type { DiceShape } from '$lib/dice/constants/dice';

export type DiceStatus = 'idle' | 'initializing' | 'ready' | 'rolling' | 'error';

/** Individual die result from a roll */
export interface DieResult {
  type: string;
  sides: number;
  id: number;
  value: number;
  label: string;
  reason: string;
}

/** Roll result from DiceBox.roll() */
export interface RollResult {
  notation: string;
  sets: Array<{
    num: number;
    type: string;
    sides: number;
    rolls: DieResult[];
    total: number;
  }>;
  modifier: number;
  total: number;
}

export interface DieConfig {
  shape: DiceShape;
  value?: number;
}

export interface RollOptions {
  dicePool: DieConfig[];
}

function getThemeConfig(themeId: string) {
  const theme = THEMES[themeId as keyof typeof THEMES];
  if (!theme) return {};

  return {
    theme_surface: themeId,
    theme_customColorset: theme.dice,
    theme_colorset: 'white' // valid default to satisfy types if needed
  };
}

/**
 * Creates the dice store for managing 3D dice state
 * Uses Svelte 5 runes for reactive state management
 */
function createDiceStore() {
  let diceBox: DiceBox | null = $state(null);
  let status: DiceStatus = $state('idle');
  let container: HTMLDivElement | null = $state(null);
  let lastResults: RollResult | null = $state(null);
  let error: string | null = $state(null);

  // Subscribe to theme changes
  appSettings.subscribe(settings => {
    if (diceBox && settings.diceTheme) {
      diceBox.updateConfig(getThemeConfig(settings.diceTheme));
    }
  });

  const isReady = $derived(status === 'ready');
  const isRolling = $derived(status === 'rolling');

  /**
   * Initialize the DiceBox with a container element
   */
  async function initialize(containerElement: HTMLDivElement): Promise<void> {
    if (diceBox || status === 'initializing') return;

    container = containerElement;
    status = 'initializing';
    error = null;

    try {
      const settings = get(appSettings);
      diceBox = new DiceBox(containerElement, {
        assetPath: '/assets/dice-box/',
        ...getThemeConfig(settings.diceTheme || 'default'),
        shadows: true,
      });

      await diceBox.initialize();
      status = 'ready';
    } catch (err) {
      console.error('Failed to initialize DiceBox:', err);
      error = err instanceof Error ? err.message : 'Unknown error';
      status = 'error';
    }
  }

  /**
   * Roll dice with the given notation string
   * @param notation - Dice notation like "2d6+3", "1d20@15"
   */
  async function roll(notation: string): Promise<RollResult> {
    if (!diceBox || status !== 'ready') {
      throw new Error('DiceBox is not initialized');
    }

    status = 'rolling';
    error = null;

    try {
      const results = await diceBox.roll(notation);
      lastResults = results;
      status = 'ready';
      return results;
    } catch (err) {
      console.error('Roll failed:', err);
      error = err instanceof Error ? err.message : 'Roll failed';
      status = 'ready';
      throw err;
    }
  }

  /**
   * Roll dice from a pool of die configurations
   */
  async function rollPool({ dicePool }: RollOptions): Promise<RollResult> {
    const shapes = dicePool.map(({ shape }) => `1${shape}`).join('+');
    const values = dicePool.map(({ value }) => value).filter(Boolean);
    const notation = values.length > 0
      ? `${shapes}@${values.join(',')}`
      : shapes;

    return roll(notation);
  }

  /**
   * Clear all dice from the scene
   */
  async function clear(): Promise<void> {
    if (!diceBox) return;

    try {
      await diceBox.clear();
      lastResults = null;
    } catch (err) {
      console.error('Clear failed:', err);
    }
  }

  /**
   * Dispose of the DiceBox and clean up resources
   */
  function dispose(): void {
    if (diceBox) {
      diceBox.clear();
      diceBox = null;
    }
    container = null;
    status = 'idle';
    lastResults = null;
    error = null;
  }

  return {
    // State (getters)
    get status() { return status; },
    get isReady() { return isReady; },
    get isRolling() { return isRolling; },
    get lastResults() { return lastResults; },
    get error() { return error; },
    get container() { return container; },

    // Actions
    initialize,
    roll,
    rollPool,
    clear,
    dispose,
  };
}

export const diceStore = createDiceStore();
