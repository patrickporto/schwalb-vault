<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { diceStore, type DiceStatus } from '$lib/dice/stores/diceStore.svelte';

  interface Props {
    /** Height of the dice container */
    height?: number;
    /** Called when a roll completes */
    onRollComplete?: (results: Array<{ type: string; value: number }>) => void;
    /** CSS class to apply to the container */
    class?: string;
  }

  let { height = 400, onRollComplete, class: className = '' }: Props = $props();

  let containerElement: HTMLDivElement;
  let mounted = $state(false);

  // Reactive getters from store
  const status = $derived(diceStore.status);
  const isRolling = $derived(diceStore.isRolling);
  const error = $derived(diceStore.error);

  onMount(async () => {
    mounted = true;
    if (containerElement) {
      await diceStore.initialize(containerElement);
    }
  });

  onDestroy(() => {
    diceStore.dispose();
  });

  /**
   * Roll dice with the given notation
   * @param notation - Dice notation like "2d6+3", "1d20"
   */
  export async function roll(notation: string) {
    const results = await diceStore.roll(notation);
    onRollComplete?.(results);
    return results;
  }

  /**
   * Clear all dice from the scene
   */
  export async function clear() {
    await diceStore.clear();
  }
</script>

<div
  bind:this={containerElement}
  class="dice-roller {className}"
  style:height="{height}px"
  role="img"
  aria-label="3D Dice Roller"
>
  {#if status === 'initializing'}
    <div class="dice-overlay">
      <div class="dice-loader">
        <span class="loader-spinner"></span>
        <span>Loading dice...</span>
      </div>
    </div>
  {:else if status === 'error'}
    <div class="dice-overlay dice-error">
      <span>Failed to load dice</span>
      {#if error}
        <small>{error}</small>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dice-roller {
    position: relative;
    width: 100%;
    border-radius: var(--radius-m, 8px);
    overflow: hidden;
    background: linear-gradient(135deg,
      hsl(220 15% 10%) 0%,
      hsl(220 20% 15%) 50%,
      hsl(220 15% 12%) 100%
    );
  }

  .dice-roller :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  .dice-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: hsla(220 20% 10% / 0.9);
    color: hsl(220 10% 90%);
    font-size: 0.875rem;
  }

  .dice-loader {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .loader-spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid hsl(220 10% 30%);
    border-top-color: hsl(220 60% 60%);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .dice-error {
    color: hsl(0 70% 70%);
  }

  .dice-error small {
    opacity: 0.7;
    font-size: 0.75rem;
  }
</style>
